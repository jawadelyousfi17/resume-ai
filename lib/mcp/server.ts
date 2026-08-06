import "server-only";

// The MCP server itself.
//
// Built fresh for every request rather than kept as a module singleton. This
// app is deployed serverlessly, where one instance handles many callers and
// may be frozen between them: a long-lived server object would hold one
// caller's transport open for the next caller to inherit. A server is cheap —
// registering two tools — and a per-request one is a caller-shaped lifetime
// rather than an instance-shaped one.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

import { registerTools } from "./tools";

/** How the server introduces itself in the initialize handshake. */
export const SERVER_INFO = {
  name: "meniacv",
  title: "meniacv",
  version: "1.0.0",
} as const;

/** What a client is told the server is for, once connected. Clients show this
 *  to the model alongside the tool list. */
const INSTRUCTIONS = `Tools for reading and judging resumes.

Start from a file: \`extract_resume\` turns a PDF, an image or plain text into
structured JSON. Ask for \`format: "editor"\` when the result is going on to
\`review_resume\`, which needs that shape — \`fields\`, the default, is the
flatter transcription to read or store.

\`review_resume\` scores a document out of 100, marks each category, quotes the
exact text behind every proofreading finding, and returns prioritised advice.

Both tools transcribe and judge; neither invents. A detail the document doesn't
state comes back empty rather than guessed at.`;

export function meniacvMcpServer(): McpServer {
  const server = new McpServer(SERVER_INFO, { instructions: INSTRUCTIONS });
  registerTools(server);
  return server;
}
