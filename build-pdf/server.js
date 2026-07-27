// The PDF renderer, on its own.
//
// The app can't run this on Vercel: a serverless function has no room for a
// browser and no time to start one. So the render moves to a box that can keep
// Chromium warm, and the app calls it over HTTP.
//
// It stays deliberately dumb about resumes. It is handed a URL and a page size,
// it prints that page, it returns the file. Everything about what a resume
// looks like stays in the app, which is what keeps the PDF identical to the
// preview — there is still only one renderer of the document itself.

import express from "express";
import { chromium } from "playwright";

const PORT = Number(process.env.PORT ?? 4000);
const RENDER_TOKEN = process.env.RENDER_TOKEN?.trim();
const RENDER_TIMEOUT_MS = Number(process.env.RENDER_TIMEOUT_MS ?? 30_000);

/** Origins this renderer will open. Anything else is refused — without this the
 *  service is an open proxy that will fetch whatever it's told to, including
 *  addresses only this machine can reach. */
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

/** A4 at 96dpi, which is what the app lays a page out in. */
const DEFAULT_SIZE = { width: 794, height: 1123 };

/* -------------------------------------------------------------------------- */
/* The browser                                                                */
/* -------------------------------------------------------------------------- */

// Chromium takes a second or so to start, which is too long to pay per
// download. One instance is kept warm and shared; pages are cheap.
let browserPromise = null;

function getBrowser() {
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

/* -------------------------------------------------------------------------- */
/* The service                                                                */
/* -------------------------------------------------------------------------- */

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "4mb" }));

app.get("/health", async (_req, res) => {
  try {
    const browser = await getBrowser();
    res.json({ ok: true, browser: browser.isConnected() ? "up" : "down" });
  } catch (err) {
    res.status(503).json({ ok: false, error: String(err) });
  }
});

app.post("/pdf", async (req, res) => {
  if (!authorised(req)) {
    return res.status(401).json({ error: "Not authorised" });
  }

  const { url, width, height, filename } = req.body ?? {};

  let target;
  try {
    target = new URL(String(url));
  } catch {
    return res.status(400).json({ error: "A url is required" });
  }
  if (!allowed(target)) {
    return res.status(403).json({ error: "That origin isn't allowed here" });
  }

  const size = {
    width: Math.round(Number(width) || DEFAULT_SIZE.width),
    height: Math.round(Number(height) || DEFAULT_SIZE.height),
  };
  if (size.width < 200 || size.width > 4000 || size.height < 200 || size.height > 6000) {
    return res.status(400).json({ error: "That page size isn't sensible" });
  }

  try {
    const pdf = await render(target.toString(), size);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${safeName(filename)}"`,
    );
    res.setHeader("Cache-Control", "no-store");
    res.send(pdf);
  } catch (err) {
    console.error("[pdf]", err);
    res.status(502).json({
      error: err instanceof Error ? err.message : "Couldn't render the PDF",
    });
  }
});

/** One render: a fresh context, the page, the file. */
async function render(url, size) {
  const browser = await getBrowser();
  const context = await browser.newContext({
    viewport: size,
    // Print media would let a stylesheet hide things; the preview has no print
    // rules and should render exactly as it does on screen.
    colorScheme: "light",
  });

  try {
    const page = await context.newPage();
    page.setDefaultTimeout(RENDER_TIMEOUT_MS);

    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: RENDER_TIMEOUT_MS,
    });
    if (!response || !response.ok()) {
      throw new Error(
        `The page answered ${response ? response.status() : "nothing"}.`,
      );
    }

    // Avatars come from an external service and web fonts load asynchronously;
    // printing before either lands leaves holes in the page. Same wait the app
    // does when it renders locally.
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
      width: `${size.width}px`,
      height: `${size.height}px`,
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

function authorised(req) {
  // A service with no token set is refused outright rather than left open —
  // forgetting the variable shouldn't quietly publish a renderer.
  if (!RENDER_TOKEN) return false;
  const header = req.get("authorization") ?? "";
  return header === `Bearer ${RENDER_TOKEN}`;
}

function allowed(url) {
  if (url.protocol !== "https:" && url.protocol !== "http:") return false;
  if (ALLOWED_ORIGINS.length === 0) return false;
  return ALLOWED_ORIGINS.includes(url.origin);
}

/** Whatever the caller asked to call the file, reduced to something safe. */
function safeName(name) {
  const cleaned = String(name ?? "document.pdf")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .slice(0, 80);
  return cleaned.endsWith(".pdf") ? cleaned : `${cleaned}.pdf`;
}

const server = app.listen(PORT, () => {
  console.log(`[pdf] listening on :${PORT}`);
  if (!RENDER_TOKEN) {
    console.warn("[pdf] RENDER_TOKEN is not set — every request will be refused.");
  }
  if (ALLOWED_ORIGINS.length === 0) {
    console.warn("[pdf] ALLOWED_ORIGINS is empty — every request will be refused.");
  }
});

/** Finish what's in flight, then close the browser, on the way down. */
for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => {
    server.close(async () => {
      const browser = await browserPromise?.catch(() => null);
      await browser?.close().catch(() => {});
      process.exit(0);
    });
  });
}
