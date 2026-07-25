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

import type { Browser } from "playwright";
import { chromium } from "playwright";

import { PAGE_SIZES } from "./defaults";
import type { PageFormat } from "./types";

/** Chromium takes a second or so to start, which is too long to pay per
 *  download. One instance is kept warm and shared; pages are cheap. */
let browserPromise: Promise<Browser> | null = null;

function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = chromium.launch({ args: ["--font-render-hinting=none"] });
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
      err instanceof Error && /executable doesn't exist|ENOENT/i.test(err.message)
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
