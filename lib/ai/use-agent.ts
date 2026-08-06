"use client";

// The agent loop, which lives here rather than on the server because the
// document does. One send runs: post the thread → stream the reply → execute
// whatever tools it asked for against the store → post the results → repeat,
// until a turn comes back with no tool calls.
//
// `use-generation.ts` is the same idea for the one-shot writing tools: one
// request, one answer. This one keeps going.

import { useCallback, useEffect, useRef, useState } from "react";
import { useResume } from "@/lib/store";
import type { ResumeData } from "@/lib/types";
import {
  AGENT_LIMITS,
  type AgentBlock,
  type AgentEvent,
  type AgentMessage,
  type AgentToolCall,
  type AgentToolResult,
} from "./agent";
import { runToolCall } from "./agent-apply";

/** One exchange as the panel draws it. */
export interface ChatEntry {
  id: string;
  role: "user" | "assistant";
  text: string;
  /** What this turn did to the document, in the order it did it. */
  edits: AgentToolResult[];
  /** The document as it stood before this turn — what Undo restores. Only on
   *  assistant turns that changed something. */
  before?: ResumeData;
  /** True while this turn is still being written. */
  pending?: boolean;
  error?: string;
}

const newId = () => crypto.randomUUID();

export function useAgent(jobDescription?: string) {
  const { data, replace } = useResume();
  const [chat, setChat] = useState<ChatEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const controller = useRef<AbortController | null>(null);

  // The thread as the model sees it: raw content blocks, replayed verbatim.
  // Kept in a ref rather than state because the loop below reads it between
  // awaits, where a state value would be a render behind.
  const thread = useRef<AgentMessage[]>([]);

  // The live document, for the same reason — `data` from the closure is stale
  // the moment a tool edits it. Synced in an effect rather than assigned
  // during render, which React reserves for values it can tear.
  const latest = useRef(data);
  useEffect(() => {
    latest.current = data;
  }, [data]);

  useEffect(() => () => controller.current?.abort(), []);

  const send = useCallback(
    async (message: string) => {
      const text = message.trim();
      if (!text || busy) return;

      controller.current?.abort();
      const ctrl = new AbortController();
      controller.current = ctrl;
      setBusy(true);

      // The snapshot Undo restores. Taken once for the whole send, not per
      // tool call: "improve my summary and drop the hobbies" is one thing the
      // person asked for and should come undone in one click.
      const before = structuredClone(latest.current);

      // The document the loop works on. Owned here rather than read back from
      // the store between calls, so a turn that makes three edits sees all
      // three — the store's copy is only current after React re-renders.
      let working = structuredClone(before);
      const apply = (mutator: (draft: ResumeData) => void) => mutator(working);

      thread.current.push({ role: "user", content: [{ type: "text", text }] });
      const turnId = newId();
      setChat((prev) => [
        ...prev,
        { id: newId(), role: "user", text, edits: [] },
        { id: turnId, role: "assistant", text: "", edits: [], pending: true },
      ]);

      const patch = (change: Partial<ChatEntry>) =>
        setChat((prev) =>
          prev.map((entry) => (entry.id === turnId ? { ...entry, ...change } : entry)),
        );

      // Declared outside the try so the catch can see it: a turn stopped
      // halfway may already have changed the document, and that is exactly
      // when Undo is wanted most.
      let edited = false;

      try {
        for (let step = 0; step < AGENT_LIMITS.steps; step++) {
          const calls: AgentToolCall[] = [];
          let assistant: AgentBlock[] = [];
          let reply = "";

          const res = await fetch("/api/ai/agent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: thread.current.slice(-AGENT_LIMITS.turns),
              data: working,
              jobDescription,
            }),
            signal: ctrl.signal,
          });

          if (!res.ok || !res.body) {
            const info = (await res.json().catch(() => ({}))) as { error?: string };
            throw new Error(info.error || `Server error ${res.status}`);
          }

          for await (const event of ndjson(res.body, ctrl.signal)) {
            if (event.type === "text") {
              reply += event.text;
              patch({ text: reply });
            } else if (event.type === "tool") {
              calls.push(event.call);
            } else if (event.type === "done") {
              assistant = event.content;
            } else if (event.type === "error") {
              throw new Error(event.error);
            }
          }

          if (assistant.length) {
            thread.current.push({ role: "assistant", content: assistant });
          }

          // No tools asked for: the model has said its piece and the loop ends.
          if (!calls.length) break;

          const results = calls.map((call) => runToolCall(call, apply));

          // Pushed to the store once per turn rather than once per call: the
          // preview repaints and the save debounces a single time, and a
          // half-applied turn never reaches the page.
          if (results.some((result) => result.edited)) {
            edited = true;
            replace(working);
            working = structuredClone(working);
          }

          setChat((prev) =>
            prev.map((entry) =>
              entry.id === turnId
                ? { ...entry, edits: [...entry.edits, ...results] }
                : entry,
            ),
          );

          // Every call gets a result in one user turn — splitting them teaches
          // the model to stop batching, and a missing one is a broken thread.
          thread.current.push({
            role: "user",
            content: results.map((result) => ({
              type: "tool_result",
              tool_use_id: result.id,
              content: result.detail,
              ...(result.isError ? { is_error: true } : {}),
            })),
          });
        }

        patch({ pending: false, before: edited ? before : undefined });
      } catch (err) {
        // A cancel is a user action, not a failure — whatever streamed in
        // stays, the document keeps any edit that already landed, and Undo is
        // still there to take it back.
        if (ctrl.signal.aborted) {
          patch({ pending: false, before: edited ? before : undefined });
        } else {
          patch({
            pending: false,
            before: edited ? before : undefined,
            error: err instanceof Error ? err.message : "The assistant failed",
          });
        }
      } finally {
        setBusy(false);
      }
    },
    [busy, jobDescription, replace],
  );

  /** Puts the document back as it was before one turn, and says so in place of
   *  the edit list — the reply stays, because it is still a true account of
   *  what was done. */
  const undo = useCallback(
    (id: string) => {
      const entry = chat.find((e) => e.id === id);
      if (!entry?.before) return;
      replace(entry.before);
      setChat((prev) =>
        prev.map((e) => (e.id === id ? { ...e, before: undefined, edits: [] } : e)),
      );
    },
    [chat, replace],
  );

  const stop = useCallback(() => controller.current?.abort(), []);

  const reset = useCallback(() => {
    controller.current?.abort();
    thread.current = [];
    setChat([]);
    setBusy(false);
  }, []);

  return { chat, busy, send, stop, undo, reset };
}

/** Reads the route's newline-delimited JSON, one event at a time. */
async function* ndjson(
  body: ReadableStream<Uint8Array>,
  signal: AbortSignal,
): AsyncGenerator<AgentEvent> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // The last piece is whatever arrived after the final newline — an
      // incomplete line, held back until the rest of it turns up.
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (line.trim()) yield JSON.parse(line) as AgentEvent;
      }
    }
    if (buffer.trim()) yield JSON.parse(buffer) as AgentEvent;
  } finally {
    if (signal.aborted) await reader.cancel().catch(() => {});
    reader.releaseLock();
  }
}
