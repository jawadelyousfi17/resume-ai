# ResumeAI

A resume builder: edit on the left, live preview on the right, export to PDF
through LaTeX. Accounts are handled by Supabase Auth; resumes live in Postgres
behind Prisma.

## Getting started

```bash
npm install          # also runs `prisma generate`
cp .env.example .env # then fill it in — see below
npm run db:migrate   # create the tables
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). `/` is the marketing page,
`/dashboard` is the app, and everything under it needs a session.

## Configuration

Everything goes in `.env` — the Prisma CLI reads it through `prisma.config.ts`
and Next reads it directly, so there's one file to keep straight.

### Database

`DATABASE_URL` is the pooled connection string the app runs on. `DIRECT_URL` is
the same database without the pooler; Prisma Migrate needs it, because
migrations issue statements a transaction pooler won't pass through. With Neon
that's the same URL minus the `-pooler` in the host.

### Supabase Auth

Only auth comes from Supabase — the data lives in the Postgres above. From
**Project Settings → API**, copy the project URL and publishable key into
`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.

Then, in the Supabase dashboard:

1. **Authentication → Providers → Email** — turn *Confirm email* **off**, so a
   new account is signed in the moment it's created. (Leave it on and sign-up
   still works; the form just tells people to go and click the link first.)
2. **Authentication → Providers → Google** — enable it and paste in the client
   ID and secret from the Google Cloud console.
3. **Authentication → Providers → LinkedIn (OIDC)** — enable it and paste in the
   client ID and secret from LinkedIn. This is the `linkedin_oidc` provider; the
   older `linkedin` one is retired.
4. **Authentication → URL Configuration → Redirect URLs** — add
   `http://localhost:3000/auth/callback` and the same path on your deployed
   origin. Both providers also need Supabase's own callback
   (`https://<project>.supabase.co/auth/v1/callback`) registered on their side.

In production also set `NEXT_PUBLIC_SITE_URL` to the origin users actually
reach, so OAuth round trips come back to the right place.

## How auth fits together

- `proxy.ts` (Next 16's renamed Middleware) runs on every request. It refreshes
  the Supabase session — Server Components can't, their cookie store is
  read-only — and turns signed-out traffic away: a redirect to `/login` for
  pages, a 401 for `/api/*`.
- `lib/auth.ts` is the real gate. `requireUser()` validates the session with
  Supabase, mirrors the identity into the `users` table, and returns the row.
  Every page and Server Action that touches data starts there.
- `lib/resumes.ts` scopes every query by `userId`, so a guessed resume id reads
  as missing rather than as somebody else's document.
- `app/actions/resumes.ts` holds the mutations the editor and dashboard call.
  They're public endpoints in practice, so each one re-checks the user and
  validates its input.

Supabase owns `auth.users`; Prisma owns `public`. The link is the shared UUID,
written by `syncUser()` on sign-in rather than by a database trigger, so it
lives in the repo where you can find it.

## Deploying

`npm run build` runs `prisma generate` before `next build`. That looks
redundant next to the `postinstall` hook, but it isn't: the client is generated
into `generated/` (gitignored, and outside `node_modules`), so on a host like
Vercel that restores a dependency cache and skips the install step,
`postinstall` never fires and the build fails on `@/generated/prisma/client`.
Generating in `build` makes it unconditional. Don't remove it.

Set every variable from `.env.example` in the host's environment settings —
`.env` is gitignored and never ships. `NEXT_PUBLIC_SITE_URL` is the one that
bites: unset, OAuth sign-in bounces users to whatever host the request reports.

Migrations don't run at build time. Apply them against the production database
with `npm run db:deploy` (needs `DIRECT_URL`) as a release step.

One caveat on Vercel: PDF export launches a real Chromium through Playwright
(`lib/pdf.ts`), which the standard serverless runtime has no browser binary for.
Export needs a host that can run `npx playwright install --with-deps chromium`.

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run db:migrate` | Create and apply a migration (development) |
| `npm run db:deploy` | Apply existing migrations (production) |
| `npm run db:studio` | Prisma Studio |

## PDF export

Export points a headless Chromium at `/print/<token>`, which renders the same
component and stylesheet the editor previews with — one renderer, so the PDF
matches the screen. Install the browser on the server with
`npx playwright install --with-deps chromium`.

`PDF_ORIGIN` overrides where the renderer fetches pages from; it defaults to the
site origin, and wants the local server when the public URL goes through a proxy
or CDN.
