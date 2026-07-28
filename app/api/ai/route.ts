// The writing assistant, backed by Claude Sonnet 5. Streams plain text back to
// the editor so suggestions appear as they're written. Runs on the Node.js
// runtime because it holds the API key and the Anthropic SDK.

import Anthropic from "@anthropic-ai/sdk";
import { requireFeature } from "@/lib/subscription";
import { buildPrompt, PromptError } from "@/lib/ai/prompt";
import { AI_TASKS, LIMITS, TASK_GATE, type AIRequest } from "@/lib/ai/tasks";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODEL = "claude-sonnet-5";

let client: Anthropic | null = null;

/** Constructed on first use: an unconfigured deployment should fail on the
 *  first AI request, not at import time. */
function getClient(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

export async function POST(req: Request) {
  let body: AIRequest;
  try {
    body = (await req.json()) as AIRequest;
  } catch {
    return jsonError("Invalid request body", 400);
  }

  if (!body?.task || !(body.task in AI_TASKS)) {
    return jsonError("Unknown task", 400);
  }

  // This route spends money on every call, so it checks the session and the
  // plan itself rather than trusting the proxy or the panel to have done it.
  const denied = await requireFeature(TASK_GATE[body.task]);
  if (denied) return denied;

  if (!body.data || !Array.isArray(body.data.sections) || !body.data.personal) {
    return jsonError("Missing resume data", 400);
  }
  if ((body.jobDescription?.length ?? 0) > LIMITS.jobDescription) {
    return jsonError("That job description is too long", 400);
  }

  let prompt;
  try {
    prompt = buildPrompt(body);
  } catch (err) {
    if (err instanceof PromptError) return jsonError(err.message, 400);
    throw err;
  }

  let anthropic: Anthropic;
  try {
    anthropic = getClient();
  } catch {
    return jsonError(
      "AI is not configured on this server. Set ANTHROPIC_API_KEY and restart.",
      503,
    );
  }

  const stream = anthropic.messages.stream(
    {
      model: MODEL,
      max_tokens: prompt.maxTokens,
      // Adaptive thinking with a low effort keeps short rewrites responsive;
      // the review asks for more deliberation.
      thinking: { type: "adaptive" },
      output_config: { effort: prompt.effort },
      system: prompt.system,
      messages: [{ role: "user", content: prompt.user }],
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
      const push = (event: Anthropic.MessageStreamEvent) => {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          controller.enqueue(encoder.encode(event.delta.text));
        }
      };

      try {
        if (!first.done) push(first.value);
        for (
          let next = await events.next();
          !next.done;
          next = await events.next()
        ) {
          push(next.value);
        }
        controller.close();
      } catch (err) {
        // Past this point the response has begun, so the only honest signal
        // left is to break the stream — the client reports the failure.
        controller.error(err);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body$, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
      // Suggestions arrive token by token; don't let a proxy hold them back.
      "X-Accel-Buffering": "no",
    },
  });
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
