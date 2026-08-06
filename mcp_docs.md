# meniacv MCP Server

The same resume tools as the [extraction API](./api_docs.md), spoken over the
[Model Context Protocol](https://modelcontextprotocol.io) so an agent can
discover and call them without anyone writing an integration first.

- **Endpoint** — `https://meniacv.com/api/mcp`
- **Transport** — Streamable HTTP, stateless (no session id, no SSE stream)
- **Auth** — an API key, sent as a bearer token
- **Tools** — `extract_resume`, `review_resume`

---

## Connecting

### Claude Code

```sh
claude mcp add --transport http meniacv https://meniacv.com/api/mcp \
  --header "Authorization: Bearer YOUR_API_KEY"
```

### Claude Desktop / any client with a JSON config

```json
{
  "mcpServers": {
    "meniacv": {
      "type": "http",
      "url": "https://meniacv.com/api/mcp",
      "headers": { "Authorization": "Bearer YOUR_API_KEY" }
    }
  }
}
```

### The TypeScript SDK

```ts
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const transport = new StreamableHTTPClientTransport(
  new URL("https://meniacv.com/api/mcp"),
  { requestInit: { headers: { authorization: `Bearer ${process.env.MENIACV_API_KEY}` } } },
);

const client = new Client({ name: "my-app", version: "1.0.0" });
await client.connect(transport);
```

`X-Api-Key: YOUR_API_KEY` is accepted as well, for clients that make bearer
tokens awkward.

Keys are issued by us. **Connect from your own server, not from a browser** —
there are no CORS headers, and a key shipped to a browser is a key anyone can
read and spend.

---

## Tools

### `extract_resume`

Reads a resume file and returns its contents as structured JSON. It transcribes
rather than writes: nothing is invented, and a detail the document doesn't state
comes back as an empty string rather than a guess.

| Argument     | Required | Description                                                                 |
| ------------ | -------- | --------------------------------------------------------------------------- |
| `file`       | one of   | The resume, base64-encoded. A `data:` URL works too and carries its own type. |
| `text`       | one of   | The resume as a plain string, instead of `file`.                             |
| `media_type` | with `file` | e.g. `application/pdf`, `image/png`. Not needed with a `data:` URL.       |
| `format`     | no       | `fields` (default) or `editor`. See below.                                   |
| `language`   | no       | Only used by `format: "editor"`; e.g. `en`, `fr`.                            |
| `filename`   | no       | Echoed back, so batched calls can be told apart.                             |

**Accepted files** — PDF, PNG, JPEG, WebP, plain text and Markdown, up to 12MB.

**`format`** — `fields` is the flat transcription and the default. `editor` is
the document meniacv's own editor opens, ids and section headings included, and
is what `review_resume` takes. Ask for `editor` when the two calls are going to
be chained.

Answers with a JSON body carrying `format`, `file`, `resume`, `usage`, and —
for `format: "editor"` — a suggested `name`.

### `review_resume`

Scores a resume and reports what's wrong with it.

| Argument | Required | Description                                                          |
| -------- | -------- | -------------------------------------------------------------------- |
| `resume` | yes      | The document `extract_resume` returns under `resume` with `format: "editor"`. |

Answers with:

- `overall` — a mark out of 100
- `verdict` — one line on where the resume stands
- `scores` — a mark and a note per category: impact, clarity, completeness, language, ats
- `issues` — proofreading findings, each quoting the exact text at fault (`quote`), the suggested replacement (`fix`), the field it lives in (`key`) and where that is on the page (`where`)
- `advice` — prioritised suggestions, each a `title` and a `detail`

Every finding quotes text that is genuinely in the field it names — anything
the reviewer imagined is dropped before it reaches you.

---

## Chaining the two

The intended path from a file to a report:

```ts
const extracted = await client.callTool({
  name: "extract_resume",
  arguments: { file: base64Pdf, media_type: "application/pdf", format: "editor" },
});
const { resume } = JSON.parse(extracted.content[0].text);

const reviewed = await client.callTool({
  name: "review_resume",
  arguments: { resume },
});
const report = JSON.parse(reviewed.content[0].text);
```

---

## Errors

Two kinds, and they arrive differently.

**Something wrong with the call** — a missing key, too many requests, a
malformed JSON-RPC envelope — comes back as an HTTP error carrying a JSON-RPC
error object:

| Status | Code     | Meaning                                                  |
| ------ | -------- | -------------------------------------------------------- |
| 401    | `-32001` | No key, or a key that isn't recognised.                   |
| 429    | `-32002` | Rate limited. `Retry-After` says how long to wait.        |
| 405    | `-32000` | `GET` or `DELETE`. This server is stateless and POST-only.|
| 503    | `-32000` | No keys configured on this deployment.                    |

**Something wrong with the resume** — an unreadable file, a document too short
to judge — is a successful tool call whose result has `isError: true` and one
line of text saying what happened. This is deliberate: it is something the
model should read and act on ("that PDF was a scanned photo of a whiteboard"),
not a transport fault it never sees.

---

## Rate limits

Counted per client IP, not per key, so a key used across several of your own
servers isn't throttled as if it were one caller. The default is 20 requests a
minute; every answer carries `X-RateLimit-Limit`, `X-RateLimit-Remaining` and
`X-RateLimit-Reset` so you can pace without waiting to be refused.

---

## Notes for the curious

The server is stateless — it issues no session id and opens no SSE stream. Each
POST is answered with a single JSON body. Both tools return a finished
document, so there is nothing worth streaming, and a stream is one more thing to
keep alive across a serverless freeze.
