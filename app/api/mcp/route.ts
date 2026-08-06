// The MCP server, over Streamable HTTP.
//
// Same audience and same door key as `POST /api/v1/extract`: a partner's
// program, holding a key from `MENIACV_API_KEYS`. What's different is who is
// driving — an agent that discovers the tools rather than a developer who read
// api_docs.md — so the descriptions in lib/mcp/tools.ts are the documentation
// for this surface, and they are written for a model to read.
//
// Stateless: no session id is issued, and each request builds its own server
// and transport (see lib/mcp/server). `enableJsonResponse` answers a POST with
// one JSON body instead of opening an SSE stream — every tool here returns a
// finished document, so there is nothing to stream and a stream is one thing
// to keep alive across a serverless freeze.

import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";

import { authenticate, isEnabled } from "@/lib/api/keys";
import { clientIp, rateLimit, rateLimitHeaders } from "@/lib/api/rate-limit";
import { meniacvMcpServer } from "@/lib/mcp/server";

export const runtime = "nodejs";
// Reading a PDF is a model call on a whole document; the extractor is allowed
// the same two minutes it gets on the REST route.
export const maxDuration = 120;

export async function POST(req: Request) {
  if (!isEnabled()) {
    return rpcError(
      -32000,
      "The MCP server is not enabled on this server.",
      503,
    );
  }

  const caller = authenticate(req.headers);
  if (!caller) {
    // The spec wants a challenge on 401 so a client knows what to present.
    return rpcError(
      -32001,
      "Send a valid API key as `Authorization: Bearer <key>`.",
      401,
      {
        "WWW-Authenticate": 'Bearer realm="meniacv"',
      },
    );
  }

  // Counted per address, not per key — a key used from several of your own
  // servers shouldn't throttle itself, and one machine in a loop should.
  const limit = rateLimit(clientIp(req.headers));
  if (!limit.ok) {
    return rpcError(
      -32002,
      `Too many requests — ${limit.limit} per minute from one address.`,
      429,
      { ...rateLimitHeaders(limit), "Retry-After": String(limit.retryAfter) },
    );
  }

  const server = meniacvMcpServer();
  const transport = new WebStandardStreamableHTTPServerTransport({
    // Undefined is what puts the transport in stateless mode.
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  try {
    await server.connect(transport);
    const response = await transport.handleRequest(req);
    return withHeaders(response, rateLimitHeaders(limit));
  } catch (err) {
    // The caller's label goes in the log line — never their key.
    console.error(`[api/mcp] ${caller.label}:`, err);
    return rpcError(-32603, "Internal server error.", 500);
  }
}

/**
 * A client opening the standalone stream, or ending a session.
 *
 * Neither applies to a stateless, response-only server: there are no
 * server-initiated messages to listen for and no session to delete. The spec's
 * answer for both is 405, which is also what tells a client not to try again.
 */
export async function GET() {
  return rpcError(-32000, "This server does not offer an SSE stream.", 405, {
    Allow: "POST",
  });
}

export async function DELETE() {
  return rpcError(
    -32000,
    "This server is stateless; there is no session to end.",
    405,
    {
      Allow: "POST",
    },
  );
}

/** Copies a transport's answer, adding headers of our own. Rebuilt rather than
 *  mutated because a `Response`'s headers are immutable once it exists. */
function withHeaders(response: Response, extra: Record<string, string>) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(extra)) headers.set(name, value);
  headers.set("Cache-Control", "no-store");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

/** A failure before the transport is reached, in the shape a JSON-RPC client
 *  expects. `id: null` is what the spec asks for when the request couldn't be
 *  read far enough to have one. */
function rpcError(
  code: number,
  message: string,
  status: number,
  headers: Record<string, string> = {},
) {
  return Response.json(
    { jsonrpc: "2.0", error: { code, message }, id: null },
    { status, headers: { "Cache-Control": "no-store", ...headers } },
  );
}
