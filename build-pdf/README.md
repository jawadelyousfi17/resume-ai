# build-pdf

The PDF renderer, split out so the app can live on Vercel.

A serverless function has neither the disk for Chromium nor the time to start
it, so the render moves to a box that can keep a browser warm. This service is
deliberately dumb about resumes: it is handed a URL and a page size, it prints
that page, it returns the file. What a resume _looks_ like stays in the app —
which is what keeps the PDF identical to the on-screen preview.

## How a download works

1. The browser posts the document to the app's `/api/compile`.
2. The app packs it into a signed token — the document itself, deflated and
   HMAC-signed, valid for a minute — and calls this service with
   `https://<app>/print/<token>`.
3. This service opens that URL in Chromium, waits for images and fonts, and
   prints it at the exact page size.
4. The app streams the file back to the browser.

The token carries the document because the app runs on serverless instances
that don't share memory: the instance that serves `/print/<token>` is rarely
the one that minted it.

## Running it

```sh
cd build-pdf
cp .env.example .env      # fill in RENDER_TOKEN and ALLOWED_ORIGINS
npm install               # also installs Chromium and its system libraries
npm start                 # reads .env, listens on :4000
```

`npm start` loads `.env` itself (`node --env-file-if-exists`), so there is no
dotenv dependency and nothing to load in a deploy that sets real environment
variables instead.

`npm install` runs `playwright install --with-deps chromium`, which needs root
on a fresh VPS (`sudo npx playwright install --with-deps chromium` if it
fails).

### Fonts

Chromium renders with the fonts the machine has. Latin is covered by the base
image; a resume written in Chinese, Japanese, Korean or Arabic needs those
families installed or the PDF comes out with boxes:

```sh
sudo apt-get install -y fonts-noto-core fonts-noto-cjk fonts-noto-color-emoji
```

## API

### `POST /pdf`

```
Authorization: Bearer <RENDER_TOKEN>
Content-Type: application/json

{ "url": "https://maniacv.com/print/<token>", "width": 794, "height": 1123,
  "filename": "resume.pdf" }
```

Answers with `application/pdf`, or JSON `{ error }` on `400` (bad request),
`401` (wrong token), `403` (origin not allowed) or `502` (the render failed).

### `GET /health`

`{ ok: true, browser: "up" }` once Chromium has started. Point your process
manager at it.

## Configuration

| Variable            | What it does                                                      |
| ------------------- | ----------------------------------------------------------------- |
| `PORT`              | Port to listen on. Default 4000.                                   |
| `RENDER_TOKEN`      | Shared secret. **Unset means every request is refused.**           |
| `ALLOWED_ORIGINS`   | Comma-separated origins it may open. **Empty means refuse all.**   |
| `RENDER_TIMEOUT_MS` | How long one render may take. Default 30000.                       |

Both refusals are deliberate: a renderer that will fetch any URL is a proxy
into whatever your VPS can reach, and a forgotten environment variable
shouldn't be what publishes one.

## The app's side

Set these on Vercel:

```
PDF_SERVICE_URL=https://pdf.your-vps.example
PDF_SERVICE_TOKEN=<the same RENDER_TOKEN>
PRINT_SECRET=<openssl rand -hex 32>
NEXT_PUBLIC_SITE_URL=https://maniacv.com
```

With `PDF_SERVICE_URL` and `PRINT_SECRET` set, `/api/compile` calls this
service. Without them it renders in-process, which is what local development
does — no service needed to work on the app.

## Deploying

Behind nginx or Caddy with TLS, run it under systemd:

```ini
# /etc/systemd/system/build-pdf.service
[Unit]
Description=maniacv PDF renderer
After=network.target

[Service]
WorkingDirectory=/srv/build-pdf
EnvironmentFile=/srv/build-pdf/.env
ExecStart=/usr/bin/node server.js
Restart=always
User=www-data

[Install]
WantedBy=multi-user.target
```

Or with the Dockerfile here, which already carries Chromium and the fonts:

```sh
docker build -t maniacv-pdf build-pdf
docker run -p 4000:4000 --env-file build-pdf/.env maniacv-pdf
```

One container is enough for a long time — a render is a second or two, and the
browser stays warm between them.
