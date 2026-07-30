# meniacv Extraction API

Turn a resume file into structured JSON. Send a PDF, an image or a text file;
get back the person's details, roles, education, projects, skills and
languages as fields your code can read.

- **Base URL** — `https://meniacv.com`
- **Endpoint** — `POST /api/v1/extract`
- **Auth** — an API key, sent as a bearer token
- **Content types accepted** — `multipart/form-data` or `application/json`

The reader is a language model. It transcribes rather than writes: nothing is
invented, and a detail the document doesn't state comes back as an empty
string rather than a guess.

---

## Authentication

Every request needs a key:

```
Authorization: Bearer YOUR_API_KEY
```

`X-Api-Key: YOUR_API_KEY` is accepted as well, for clients that make bearer
tokens awkward.

Keys are issued by us. **Call this API from your own server, not from a
browser** — there are no CORS headers, and a key shipped to a browser is a key
anyone can read and spend.

Without a valid key the endpoint answers `401`. On a deployment where no keys
are configured it answers `503` for everyone.

---

## Request

Two ways to send the file. They accept the same options and answer alike.

### 1. Multipart upload

```
POST /api/v1/extract
Authorization: Bearer YOUR_API_KEY
Content-Type: multipart/form-data
```

| Field      | Required | Description                                       |
| ---------- | -------- | ------------------------------------------------- |
| `file`     | yes      | The resume. See [accepted files](#accepted-files). |
| `format`   | no       | `fields` (default) or `editor`.                    |
| `language` | no       | Only used by `format=editor`. See [languages](#languages). |

### 2. JSON body

```
POST /api/v1/extract
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

| Field        | Required          | Description                                                        |
| ------------ | ----------------- | ------------------------------------------------------------------ |
| `file`       | yes\*             | The file as base64, or as a `data:` URL.                            |
| `media_type` | with `file`       | e.g. `application/pdf`. Omit it if `file` is a `data:` URL.         |
| `text`       | yes\*             | A resume you already have as a string. Use instead of `file`.       |
| `filename`   | no                | Echoed back in the response. Nothing is inferred from it.           |
| `format`     | no                | `fields` (default) or `editor`.                                     |
| `language`   | no                | Only used by `format=editor`.                                       |

\* Send either `file` or `text`. If both are present, `text` wins.

```json
{
  "file": "JVBERi0xLjQKJcfs...",
  "media_type": "application/pdf",
  "filename": "jane-okafor.pdf"
}
```

### Accepted files

| Type       | Media types                                             |
| ---------- | ------------------------------------------------------- |
| PDF        | `application/pdf`                                       |
| Image      | `image/png`, `image/jpeg`, `image/webp`, `image/gif`    |
| Plain text | `text/plain`, `text/markdown`                           |

Maximum **12 MB** per file. Word documents (`.doc`, `.docx`) are not supported
— export to PDF first. A scan or a phone photo of a printed resume is fine;
that is what the image types are for.

### Languages

`format=editor` fills in section headings, so it needs to know what language to
write them in. Pass one of: `en`, `es`, `fr`, `de`, `pt`, `it`, `nl`, `ru`,
`zh`, `ar`. Defaults to `en`. It does **not** translate the resume — the
person's own words come back as written.

---

## Response

`200 OK`, `Content-Type: application/json`.

```json
{
  "format": "fields",
  "file": {
    "name": "jane-okafor.pdf",
    "media_type": "application/pdf",
    "size_bytes": 84213
  },
  "resume": { "...": "see below" },
  "usage": { "input_tokens": 3750, "output_tokens": 268 }
}
```

- `file` — what you sent, echoed back, so a batch of concurrent calls can be
  matched up to their answers.
- `usage` — what the read cost in model tokens, if you meter your own usage.

### `resume`, with `format=fields` (default)

A flat transcription. Every key is always present; nothing is omitted.

```json
{
  "personal": {
    "fullName": "Jane Okafor",
    "title": "Backend Engineer",
    "email": "jane.okafor@example.com",
    "phone": "+44 7700 900123",
    "location": "London, UK",
    "links": [
      { "label": "LinkedIn", "url": "linkedin.com/in/janeokafor" },
      { "label": "GitHub", "url": "github.com/janeokafor" }
    ]
  },
  "summary": "Backend engineer with six years building payment systems in Go and Python.",
  "experience": [
    {
      "role": "Senior Backend Engineer",
      "company": "Monzo",
      "location": "London",
      "startDate": "2021-03",
      "endDate": "",
      "current": true,
      "highlights": [
        "Led the migration of the ledger service to Go, cutting p99 latency by 40%.",
        "Owned on-call for the payments platform."
      ]
    }
  ],
  "education": [
    {
      "degree": "BSc Computer Science",
      "school": "University of Manchester",
      "location": "",
      "startDate": "2015-01",
      "endDate": "2018-01",
      "description": ""
    }
  ],
  "projects": [
    { "name": "pgqueue", "link": "github.com/janeokafor/pgqueue", "description": "A job queue on Postgres." }
  ],
  "skills": [
    { "name": "Go", "level": 3 },
    { "name": "Python", "level": 0 }
  ],
  "languages": [
    { "name": "English", "level": 4 },
    { "name": "French", "level": 2 }
  ]
}
```

**Field notes**

- **Dates** are `YYYY-MM`. A year on its own becomes January of that year
  (`2018` → `2018-01`). A date the document doesn't give is `""`.
- **`current`** is `true` for a role written as Present / Current / Now, and
  its `endDate` is then `""`.
- **`highlights`** is one string per bullet, in the order they appear, in the
  person's own words.
- **`level`** is `0` unless the resume states a proficiency. For `skills`:
  1 beginner, 2 intermediate, 3 advanced, 4 expert. For `languages`: 1 basic,
  2 conversational, 3 fluent, 4 native.
- Arrays come back empty (`[]`) when the resume has no such section. Text
  fields come back empty (`""`) when it doesn't say.

### `resume`, with `format=editor`

The document shape meniacv's own editor opens: sections in reading order, a
generated `id` on everything, headings in the requested `language`, and bullet
lists as Markdown. Use it when you're handing the result straight to a meniacv
resume; use `fields` for everything else.

The response also carries a suggested `name` for the document.

```json
{
  "format": "editor",
  "file": { "name": "jane-okafor.pdf", "media_type": "application/pdf", "size_bytes": 84213 },
  "name": "Jane Okafor's Resume",
  "resume": {
    "personal": {
      "fullName": "Jane Okafor",
      "title": "Backend Engineer",
      "email": "jane.okafor@example.com",
      "phone": "+44 7700 900123",
      "location": "London, UK",
      "contactOrder": ["email", "phone", "location"],
      "links": [{ "id": "2075b120-…", "label": "LinkedIn", "url": "linkedin.com/in/janeokafor" }]
    },
    "sections": [
      { "id": "fd4cff9c-…", "type": "summary", "title": "Profile", "content": "Backend engineer with…" },
      {
        "id": "23618c52-…",
        "type": "experience",
        "title": "Experience",
        "items": [
          {
            "id": "548c395e-…",
            "role": "Senior Backend Engineer",
            "company": "Monzo",
            "location": "London",
            "startDate": "2021-03",
            "endDate": "",
            "current": true,
            "highlights": "- Led the migration of the ledger service to Go…\n- Owned on-call…"
          }
        ]
      }
    ],
    "settings": { "...": "template, colours, spacing, language" }
  }
}
```

Empty sections are dropped rather than sent through empty, so `sections` holds
only what the resume actually had.

---

## Errors

Every failure answers with the same envelope and a matching HTTP status:

```json
{ "error": { "code": "unsupported_media_type", "message": "Upload a PDF, an image, or a plain-text file. Word documents aren't supported yet — export to PDF first." } }
```

`message` is a sentence you can show a user as-is. `code` is what to branch on.

| Status | `code`                  | Means                                                            |
| ------ | ----------------------- | ---------------------------------------------------------------- |
| 400    | `invalid_request`       | Missing or malformed field — the message names it.                |
| 401    | `unauthorized`          | Key missing, malformed or not recognised.                         |
| 413    | `file_too_large`        | Over 12 MB.                                                       |
| 415    | `invalid_request`       | The request's own `Content-Type` isn't one of the two accepted.   |
| 415    | `unsupported_media_type`| The *file* isn't a PDF, an image or text — a `.docx`, typically.  |
| 422    | `refused`               | The reader declined the file.                                     |
| 422    | `empty_result`          | Nothing legible came out of it — a blank page, an unreadable scan. |
| 422    | `file_too_long`         | The resume is too long to read in one go.                         |
| 422    | `invalid_output`        | The read finished but couldn't be made sense of. Safe to retry.    |
| 429    | `rate_limited`          | Too many requests. See below.                                     |
| 429    | `upstream_rate_limited` | Our own model provider is throttling us. Retry shortly.           |
| 500    | `internal_error`        | Our fault. Safe to retry.                                         |
| 502    | `upstream_unreachable`  | The model service couldn't be reached. Safe to retry.             |
| 503    | `not_configured`        | The API isn't switched on for this deployment.                    |
| 503    | `upstream_auth`         | Our model credentials were rejected. Not retryable — tell us.     |

Retry `429`, `500`, `502` and `upstream_*` with a backoff. Don't retry `400`,
`401`, `413`, `415` or `422` — the same request will fail the same way.

---

## Rate limits

**20 requests per minute per key** by default. Every answer carries the count:

```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 1785451563     # epoch seconds; when the window turns over
```

A `429` adds `Retry-After`, in seconds. Ask us if you need a higher ceiling.

A single read takes a few seconds — up to 120 for a long, image-heavy PDF —
so allow a generous timeout and run a batch concurrently rather than waiting
on one long call.

---

## Examples

### curl

```bash
curl -X POST https://meniacv.com/api/v1/extract \
  -H "Authorization: Bearer $MENIACV_API_KEY" \
  -F file=@jane-okafor.pdf
```

### JavaScript / TypeScript (server-side)

```ts
const form = new FormData();
form.set("file", file); // a File or Blob

const res = await fetch("https://meniacv.com/api/v1/extract", {
  method: "POST",
  headers: { Authorization: `Bearer ${process.env.MENIACV_API_KEY}` },
  body: form,
});

const payload = await res.json();
if (!res.ok) throw new Error(payload.error.message);

console.log(payload.resume.personal.fullName);
```

### Python

```python
import os, requests

with open("jane-okafor.pdf", "rb") as f:
    res = requests.post(
        "https://meniacv.com/api/v1/extract",
        headers={"Authorization": f"Bearer {os.environ['MENIACV_API_KEY']}"},
        files={"file": ("jane-okafor.pdf", f, "application/pdf")},
        timeout=120,
    )

body = res.json()
if not res.ok:
    raise RuntimeError(body["error"]["message"])

print(body["resume"]["personal"]["fullName"])
```

### Base64, in JSON

```bash
curl -X POST https://meniacv.com/api/v1/extract \
  -H "Authorization: Bearer $MENIACV_API_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"file\":\"$(base64 -w0 jane-okafor.pdf)\",\"media_type\":\"application/pdf\"}"
```

---

## Handling the data

Files are read and answered in one request. The resume isn't stored, isn't
attached to any account, and isn't used for training. Nothing of the file is
kept beyond the ordinary server access log of the request itself.

---

## Running it yourself

Two environment variables, on the deployment serving this app:

| Variable                  | Required | Description                                                                                                        |
| ------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------ |
| `MENIACV_API_KEYS`        | yes      | Comma-separated keys allowed to call the endpoint. Unset means the endpoint is off (`503`). Prefix a key with a label and a colon — `myapp:mcv_live_…` — to name the caller in logs. |
| `MENIACV_API_RATE_LIMIT`  | no       | Requests per minute per key. Defaults to 20.                                                                       |

`ANTHROPIC_API_KEY` must be set too — it's what pays for the read.

Mint a key with `openssl rand -hex 24`. Rotate by listing the new key
alongside the old, moving callers over, then dropping the old one.

The rate limit is counted per server instance, in memory. Across several
instances the real ceiling is the limit times however many are warm; it's a
guard against a runaway loop, not a billing quota.
