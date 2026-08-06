import "server-only";

// Which model answers, and on whose API.
//
// Every AI route used to construct its own `new Anthropic()` and hardcode
// `claude-sonnet-5`. They all come through here instead, so the provider is one
// environment variable rather than eight edits.
//
// DeepSeek is reached through its Anthropic-compatible endpoint, which means
// one SDK and one request shape for both. It is not a drop-in, though, and the
// two gaps below are handled here so callers don't have to know about them:
//
//   1. `output_config.format` (JSON schema) is *silently ignored* — the model
//      answers in prose and the caller's `JSON.parse` fails. Translated into a
//      forced tool call, which DeepSeek does honour, and translated back on the
//      way out so callers still just read a text block.
//   2. Forced `tool_choice` is rejected outright while thinking is on
//      ("Thinking mode does not support this tool_choice"), so the shim turns
//      thinking off for exactly those requests.
//
// A third gap can't be shimmed and is handled by the caller: DeepSeek reads no
// PDFs and no images. See `supportsDocuments` and its use in read-resume.ts.

import Anthropic from "@anthropic-ai/sdk";

export type ProviderId = "anthropic" | "deepseek";

/**
 * How much model the job is worth.
 *
 * "fast" is for the mechanical work — transcribing a page, where the depth
 * goes into reading rather than deliberating. "quality" is for the writing and
 * the judgement calls. The tiers only diverge on DeepSeek; Anthropic answers
 * both from one model, because the tier below Sonnet is a real drop in
 * transcription accuracy and nobody asked for a cheaper import.
 */
export type ModelTier = "fast" | "quality";

const DEEPSEEK_BASE_URL = "https://api.deepseek.com/anthropic";

const MODELS: Record<ProviderId, Record<ModelTier, string>> = {
  anthropic: {
    fast: "claude-sonnet-5",
    quality: "claude-sonnet-5",
  },
  deepseek: {
    fast: "deepseek-v4-flash",
    quality: "deepseek-v4-pro",
  },
};

/** The name to put in front of a user when a provider misbehaves. */
const LABELS: Record<ProviderId, string> = {
  anthropic: "Claude",
  deepseek: "DeepSeek",
};

/** Which provider the deployment is set to. Anthropic unless told otherwise —
 *  an unset variable shouldn't quietly move everyone's writing to another
 *  vendor. */
export function activeProvider(): ProviderId {
  return process.env.AI_PROVIDER?.trim().toLowerCase() === "deepseek"
    ? "deepseek"
    : "anthropic";
}

/** Whether a provider can be reached at all — i.e. whether its key is set. */
export function isConfigured(provider: ProviderId): boolean {
  return Boolean(keyFor(provider));
}

function keyFor(provider: ProviderId): string | undefined {
  const key =
    provider === "deepseek"
      ? process.env.DEEPSEEK_API_KEY
      : process.env.ANTHROPIC_API_KEY;
  return key?.trim() || undefined;
}

/** PDFs and images. Only Anthropic reads them; DeepSeek's models are text. */
export function supportsDocuments(provider: ProviderId): boolean {
  return provider === "anthropic";
}

export function providerLabel(provider: ProviderId): string {
  return LABELS[provider];
}

/** The message when a provider has no key. Names the variable to set, because
 *  "AI is not configured" on its own has sent people to the wrong file. */
export function notConfiguredMessage(provider: ProviderId): string {
  const variable =
    provider === "deepseek" ? "DEEPSEEK_API_KEY" : "ANTHROPIC_API_KEY";
  return `AI is not configured on this server. Set ${variable} and restart.`;
}

/* -------------------------------------------------------------------------- */
/* Clients                                                                    */
/* -------------------------------------------------------------------------- */

// One client per provider, built on first use: an unconfigured deployment
// should fail on the first AI request, not at import time.
const clients = new Map<ProviderId, Anthropic>();

function clientFor(provider: ProviderId): Anthropic {
  const existing = clients.get(provider);
  if (existing) return existing;

  const apiKey = keyFor(provider);
  if (!apiKey) throw new NotConfiguredError(provider);

  const client =
    provider === "deepseek"
      ? new Anthropic({ apiKey, baseURL: DEEPSEEK_BASE_URL })
      : new Anthropic({ apiKey });

  clients.set(provider, client);
  return client;
}

/** Thrown by `ai()` when the chosen provider has no key. Routes catch this and
 *  answer 503 rather than letting an SDK constructor error escape as a 500. */
export class NotConfiguredError extends Error {
  // Written out rather than declared as a constructor parameter property:
  // the repo's own scripts run under `node --experimental-strip-types`, which
  // refuses those.
  readonly provider: ProviderId;

  constructor(provider: ProviderId) {
    super(notConfiguredMessage(provider));
    this.name = "NotConfiguredError";
    this.provider = provider;
  }
}

export interface AIOptions {
  tier?: ModelTier;
  /**
   * Force a provider, ignoring `AI_PROVIDER`.
   *
   * For the one case where the active provider can't do the job: reading an
   * uploaded PDF. The caller establishes that and asks for Anthropic by name.
   */
  provider?: ProviderId;
}

export interface AIHandle {
  provider: ProviderId;
  label: string;
  model: string;
  client: Anthropic;
  /**
   * Send one non-streaming request, with the provider's quirks papered over.
   *
   * Callers write the Anthropic request they'd write anyway — including
   * `output_config.format` — and read the answer out of a text block. On
   * DeepSeek the schema travels as a forced tool and the answer is put back
   * into a text block before it's returned.
   */
  create(
    params: Anthropic.MessageCreateParamsNonStreaming,
    options?: { signal?: AbortSignal },
  ): Promise<Anthropic.Message>;
  /** Send one streaming request. No shimming: nothing that streams asks for a
   *  JSON schema, and a tool-shaped answer can't be streamed as text anyway. */
  stream(
    params: Anthropic.MessageStreamParams,
    options?: { signal?: AbortSignal },
  ): ReturnType<Anthropic["messages"]["stream"]>;
}

/**
 * The entry point every AI route uses.
 *
 * Throws `NotConfiguredError` when the provider has no key — the one error
 * worth distinguishing, because it's the deployment's fault rather than the
 * request's.
 */
export function ai(options: AIOptions = {}): AIHandle {
  const provider = options.provider ?? activeProvider();
  const client = clientFor(provider);
  const model = MODELS[provider][options.tier ?? "quality"];

  return {
    provider,
    label: LABELS[provider],
    model,
    client,

    create: async (params, opts) => {
      const request = { ...params, model };
      if (provider !== "deepseek") {
        return client.messages.create(request, opts);
      }
      const { params: shimmed, toolName } = asForcedTool(request);
      const message = await client.messages.create(shimmed, opts);
      return toolName ? asTextAnswer(message, toolName) : message;
    },

    stream: (params, opts) =>
      client.messages.stream({ ...params, model }, opts),
  };
}

/* -------------------------------------------------------------------------- */
/* The DeepSeek structured-output shim                                        */
/* -------------------------------------------------------------------------- */

/** The tool a schema travels as. Named for the model's benefit — it reads this
 *  and nothing else about why it's being asked for a tool call. */
const EMIT_TOOL = "emit_result";

/**
 * Rewrites a request that wants JSON into one that forces a tool call.
 *
 * Returns the tool's name when it did so, and nothing when the request had no
 * schema and can go as it is.
 */
function asForcedTool(params: Anthropic.MessageCreateParamsNonStreaming): {
  params: Anthropic.MessageCreateParamsNonStreaming;
  toolName?: string;
} {
  const format = params.output_config?.format;
  if (format?.type !== "json_schema" || !format.schema) {
    return { params };
  }

  // `output_config` also carries `effort`, which DeepSeek ignores harmlessly —
  // but `format` has to go, or the schema is sent twice in two dialects.
  const rest = { ...params };
  delete rest.output_config;

  return {
    toolName: EMIT_TOOL,
    params: {
      ...rest,
      // Forced tool use is rejected outright while thinking is on. Turning it
      // off is also what makes this the fast path, which is what a mechanical
      // transcription wants anyway.
      thinking: { type: "disabled" },
      tool_choice: { type: "tool", name: EMIT_TOOL },
      tools: [
        {
          name: EMIT_TOOL,
          description:
            "Return the result. Every field you were asked for goes in this call.",
          input_schema: format.schema as Anthropic.Tool.InputSchema,
        },
      ],
    },
  };
}

/**
 * Puts a forced tool call back where the caller expects to find its JSON.
 *
 * The caller asked for a schema and reads a text block; it should not have to
 * learn that one provider answered with a tool call instead. The tool's input
 * is re-serialized into a text block, so `JSON.parse` on the other side sees
 * exactly what Anthropic would have given it.
 */
function asTextAnswer(
  message: Anthropic.Message,
  toolName: string,
): Anthropic.Message {
  const call = message.content.find(
    (block): block is Anthropic.ToolUseBlock =>
      block.type === "tool_use" && block.name === toolName,
  );
  if (!call) return message;

  return {
    ...message,
    content: [{ type: "text", text: JSON.stringify(call.input), citations: null }],
    // A forced call ends the turn with `tool_use`; the caller is looking for a
    // finished answer, and `max_tokens` still has to survive so a truncated
    // read is reported as "too long" rather than as broken JSON.
    stop_reason: message.stop_reason === "max_tokens" ? "max_tokens" : "end_turn",
  };
}
