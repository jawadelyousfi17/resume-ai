// The agent chat behind the AI tab. One model turn per request.
//
// The loop itself lives in the browser, because that is where the document is:
// the model asks for an edit, `lib/ai/agent-apply` makes it against the store,
// and the panel posts the results back here for the next turn. This route is
// stateless — every request carries the whole thread — which also means a
// closed tab costs nothing to clean up.
//
// Answers newline-delimited JSON rather than SSE: the panel is the only
// consumer, it reads the body with a reader either way, and NDJSON is one
// `JSON.parse` per line instead of an event-stream parser.

import Anthropic from "@anthropic-ai/sdk";
import { requireFeature } from "@/lib/subscription";
import {
  activeProvider,
  ai,
  NotConfiguredError,
  notConfiguredMessage,
} from "@/lib/ai/provider";
import {
  AGENT_LIMITS,
  AGENT_TOOLS,
  type AgentBlock,
  type AgentEvent,
  type AgentRequest,
  type AgentToolName,
} from "@/lib/ai/agent";
import { AgentPromptError, buildAgentPrompt } from "@/lib/ai/agent-prompt";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  let body: AgentRequest;
  try {
    body = (await req.json()) as AgentRequest;
  } catch {
    return jsonError("Invalid request body", 400);
  }

  // Spends money on every call, so the session and the plan are checked here
  // rather than trusted from the panel. The agent is the writing tool, so it
  // sits behind the same gate the writing cards do.
  const denied = await requireFeature("ai");
  if (denied) return denied;

  if (!body?.data || !Array.isArray(body.data.sections) || !body.data.personal) {
    return jsonError("Missing resume data", 400);
  }
  if (!Array.isArray(body.messages) || !body.messages.length) {
    return jsonError("Nothing to answer", 400);
  }
  if (body.messages.length > AGENT_LIMITS.turns) {
    return jsonError(
      "This conversation is too long — start a new one.",
      400,
    );
  }
  if ((body.jobDescription?.length ?? 0) > AGENT_LIMITS.jobDescription) {
    return jsonError("That job description is too long", 400);
  }

  const messages = readMessages(body.messages);
  if (!messages) return jsonError("Malformed conversation", 400);

  let prompt;
  try {
    prompt = buildAgentPrompt(body.data, body.jobDescription);
  } catch (err) {
    if (err instanceof AgentPromptError) return jsonError(err.message, 400);
    throw err;
  }

  let handle;
  try {
    handle = ai();
  } catch (err) {
    return jsonError(
      err instanceof NotConfiguredError
        ? err.message
        : notConfiguredMessage(activeProvider()),
      503,
    );
  }

  const stream = handle.stream(
    {
      model: handle.model,
      max_tokens: 8000,
      system: prompt.system,
      // The outline goes in the last user turn rather than the system prompt:
      // it changes on every request, and a system prompt that changes is a
      // cache miss on every request too.
      messages: withContext(messages, prompt.context),
      tools: AGENT_TOOLS,
      // Never forced. The agent answers questions as often as it edits, and
      // DeepSeek rejects a forced choice outright while thinking is on.
      tool_choice: { type: "auto" },
    },
    { signal: req.signal },
  );

  // Pull the first event before answering: authentication, rate-limit and
  // model errors all surface here, while a real status code can still be sent.
  const events = stream[Symbol.asyncIterator]();
  let first: IteratorResult<Anthropic.MessageStreamEvent>;
  try {
    first = await events.next();
  } catch (err) {
    return apiError(err);
  }

  const encoder = new TextEncoder();
  const body$ = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (event: AgentEvent) =>
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));

      // Only text is streamed. A tool call's arguments arrive as partial JSON
      // that can't be executed halfway, and thinking blocks are the model's
      // own business — they're replayed on the next turn but never shown.
      const push = (event: Anthropic.MessageStreamEvent) => {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          send({ type: "text", text: event.delta.text });
        }
      };

      try {
        if (!first.done) push(first.value);
        for (let next = await events.next(); !next.done; next = await events.next()) {
          push(next.value);
        }

        const final = await stream.finalMessage();
        for (const block of final.content) {
          if (block.type === "tool_use" && isToolName(block.name)) {
            send({
              type: "tool",
              call: {
                id: block.id,
                name: block.name,
                input: (block.input ?? {}) as Record<string, unknown>,
              },
            });
          }
        }

        send({
          type: "done",
          stop: final.stop_reason ?? "end_turn",
          // Verbatim, signatures and all — this is what the next request
          // replays, and an edited thinking block is a rejected thread.
          content: final.content as unknown as AgentBlock[],
        });
        controller.close();
      } catch (err) {
        // Past the first event the response has begun, so the only honest
        // signal left is an error line the panel can render in place.
        send({
          type: "error",
          error: err instanceof Error ? err.message : "The assistant failed",
        });
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    status: 200,
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}

const TOOL_NAMES = new Set<string>(AGENT_TOOLS.map((tool) => tool.name));
const isToolName = (name: string): name is AgentToolName => TOOL_NAMES.has(name);

/**
 * Checks the thread is the shape the SDK will accept before spending anything.
 *
 * The blocks themselves are passed through untouched — they came from the
 * model, and rewriting them is what breaks a signed thinking block. All this
 * looks at is the envelope.
 */
function readMessages(
  messages: AgentRequest["messages"],
): Anthropic.MessageParam[] | null {
  const out: Anthropic.MessageParam[] = [];
  for (const message of messages) {
    if (message?.role !== "user" && message?.role !== "assistant") return null;
    if (!Array.isArray(message.content) || !message.content.length) return null;
    if (message.content.some((block) => typeof block?.type !== "string")) {
      return null;
    }
    out.push(message as unknown as Anthropic.MessageParam);
  }
  // A thread has to end on a user turn — either something typed, or the
  // results of the tools the last assistant turn asked for.
  return out.at(-1)?.role === "user" ? out : null;
}

/** Puts the current outline in front of the last user turn. */
function withContext(
  messages: Anthropic.MessageParam[],
  context: string,
): Anthropic.MessageParam[] {
  const last = messages.at(-1)!;
  const content = Array.isArray(last.content) ? last.content : [];
  return [
    ...messages.slice(0, -1),
    {
      ...last,
      content: [
        ...content,
        { type: "text" as const, text: context },
      ] as Anthropic.ContentBlockParam[],
    },
  ];
}

function apiError(err: unknown) {
  if (err instanceof Anthropic.AuthenticationError) {
    return jsonError("The server's AI credentials were rejected.", 503);
  }
  if (err instanceof Anthropic.RateLimitError) {
    return jsonError("Rate limited by the API — try again shortly.", 429);
  }
  if (err instanceof Anthropic.APIConnectionError) {
    return jsonError("Couldn't reach the AI service.", 502);
  }
  if (err instanceof Anthropic.APIError) {
    return jsonError(err.message, err.status ?? 500);
  }
  return jsonError(
    err instanceof Error ? err.message : "The assistant failed",
    500,
  );
}

function jsonError(error: string, status: number) {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
