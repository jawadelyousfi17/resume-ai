import "server-only";

// Printing the resume with a headless browser.
//
// The PDF is produced by pointing Chromium at /print/<token>, which renders the
// same <ResumePreview> and the same stylesheet the editor shows. That is the
// whole point: there is one renderer, so what you see is what you get. The
// previous approach generated LaTeX alongside the React component, and the two
// drifted — every template needed building twice, and the second one was
// always a little wrong.
//
// The text stays real text: Chromium embeds fonts and glyphs, so the output is
// selectable, searchable, and parses in an applicant tracking system.

// Type-only, so nothing is loaded to typecheck this. The module itself is
// pulled in when a render actually happens here — see `getBrowser`. A
// deployment that renders elsewhere (Vercel calling build-pdf/) then never
// touches Playwright, which is a large package to initialise inside a
// serverless function that has no browser to drive anyway.
import type { Browser } from "playwright";

import { PAGE_SIZES } from "./defaults";
import type { PageFormat } from "./types";

/** Chromium takes a second or so to start, which is too long to pay per
 *  download. One instance is kept warm and shared; pages are cheap. */
let browserPromise: Promise<Browser> | null = null;

function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = import(/* webpackIgnore: true */ "playwright").then(
      ({ chromium }) =>
        chromium.launch({ args: ["--font-render-hinting=none"] }),
    );
    // A crashed browser must not poison every later request.
    browserPromise.then(
      (browser) =>
        browser.on("disconnected", () => {
          browserPromise = null;
        }),
      () => {
        browserPromise = null;
      },
    );
  }
  return browserPromise;
}

export class PdfError extends Error {}

/** The renderer on its own box — see build-pdf/. Unset means render here. */
export const pdfServiceUrl = () =>
  process.env.PDF_SERVICE_URL?.trim().replace(/\/$/, "") || undefined;

/**
 * Asks the standalone renderer for the page at `origin/print/<token>`.
 *
 * The service never sees the document: it is given a URL on this app and the
 * page size, and it prints what it finds. Everything about what a resume looks
 * like stays here.
 */
export async function renderViaService(
  service: string,
  origin: string,
  token: string,
  format: PageFormat,
  filename: string,
): Promise<Buffer> {
  const { width, height } = PAGE_SIZES[format];

  // `PDF_ORIGIN` is the address the renderer should use, which is not always
  // the address a visitor uses: in development that's the machine's own IP on
  // the network rather than localhost, which means nothing to another box. It
  // wins over NEXT_PUBLIC_SITE_URL, being the more specific of the two — which
  // is worth a word in the log if a deployment still carries a developer's.
  const base = process.env.PDF_ORIGIN?.trim().replace(/\/$/, "") || origin;

  if (
    process.env.NODE_ENV === "production" &&
    process.env.PDF_ORIGIN &&
    base !== origin
  ) {
    console.warn(
      `[pdf] PDF_ORIGIN (${base}) is overriding the site origin (${origin}). ` +
        "Unset it in production unless the renderer really should fetch that address.",
    );
  }

  // A renderer on another machine can't reach your laptop. Worth saying so
  // plainly — the alternative is a Playwright stack trace about a refused
  // connection to localhost.
  if (/^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:|\/|$)/i.test(base)) {
    throw new PdfError(
      "The PDF service is remote but this app is only reachable at " +
        `${base}. Point PDF_ORIGIN (or NEXT_PUBLIC_SITE_URL) at an address ` +
        "the service can reach, or clear PDF_SERVICE_URL to render locally.",
    );
  }

  let res: Response;
  try {
    res = await fetch(`${service}/pdf`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(process.env.PDF_SERVICE_TOKEN
          ? { Authorization: `Bearer ${process.env.PDF_SERVICE_TOKEN}` }
          : {}),
      },
      body: JSON.stringify({
        url: `${base}/print/${token}`,
        width,
        height,
        filename,
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    throw new PdfError("The PDF service didn't answer.");
  }

  if (!res.ok) {
    const info = (await res.json().catch(() => ({}))) as { error?: string };
    throw new PdfError(info.error || `The PDF service answered ${res.status}.`);
  }

  return Buffer.from(await res.arrayBuffer());
}

/**
 * Renders `/print/<token>` to a PDF.
 *
 * `origin` is this server's own address — the browser fetches the page over
 * HTTP the same way a visitor would, which is what gets it the compiled CSS.
 * Behind a proxy or CDN that round trip is wasteful and can even fail, so
 * `PDF_ORIGIN` can point the renderer straight at the local server.
 */
export async function renderResumePdf(
  origin: string,
  token: string,
  format: PageFormat,
): Promise<Buffer> {
  let browser: Browser;
  try {
    browser = await getBrowser();
  } catch (err) {
    throw new PdfError(
      err instanceof Error &&
        /executable doesn't exist|ENOENT/i.test(err.message)
        ? "The PDF renderer isn't installed on this server. Run `npx playwright install --with-deps chromium`."
        : "Couldn't start the PDF renderer.",
    );
  }

  const base = process.env.PDF_ORIGIN?.trim().replace(/\/$/, "") || origin;
  const { width, height } = PAGE_SIZES[format];
  const context = await browser.newContext({
    viewport: { width, height },
    // Print media would let a stylesheet hide things; the preview has no print
    // rules and should render exactly as it does on screen.
    colorScheme: "light",
  });

  try {
    const page = await context.newPage();
    const response = await page.goto(`${base}/print/${token}`, {
      waitUntil: "networkidle",
      timeout: 30_000,
    });

    if (!response?.ok()) {
      throw new PdfError("The resume couldn't be prepared for printing.");
    }

    // Avatars come from an external service, and web fonts load asynchronously;
    // printing before either lands leaves holes in the page.
    await page.evaluate(async () => {
      await Promise.all(
        [...document.images]
          .filter((img) => !img.complete)
          .map(
            (img) =>
              new Promise((resolve) => {
                img.addEventListener("load", resolve, { once: true });
                img.addEventListener("error", resolve, { once: true });
              }),
          ),
      );
      await document.fonts.ready;
    });

    return await page.pdf({
      width: `${width}px`,
      height: `${height}px`,
      printBackground: true,
      margin: { top: "0", right: "0", bottom: "0", left: "0" },
      // The document carries its own margins; a scale of 1 keeps the PDF
      // dimensionally identical to the preview.
      scale: 1,
    });
  } finally {
    await context.close();
  }
}
