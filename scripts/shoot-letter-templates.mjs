// Renders every cover letter design and saves a screenshot of the page to
// public/letter-templates/<id>.png, which is what the gallery and the letter
// editor's template picker show.
//
// The screenshots come from the real <CoverLetterPreview>, captured off the
// per-template page — so a thumbnail can never show something the editor
// wouldn't produce. Re-run after changing a design or the renderer:
//
//   node --experimental-strip-types scripts/shoot-letter-templates.mjs
//   BASE=http://localhost:3001 node --experimental-strip-types scripts/...
//
// Requires the dev or production server to be running. The resume equivalent
// is scripts/shoot-templates.mjs; the two are deliberately the same script
// pointed at different routes.

import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

import { LETTER_TEMPLATES } from "../lib/letter-templates.ts";

const BASE = process.env.BASE ?? "http://127.0.0.1:3000";
const OUT = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "letter-templates",
);

// 2x so the thumbnails stay sharp on retina screens.
const SCALE = 2;

const browser = await chromium.launch({
  // Set when the bundled Chromium needs a locally-resolved one.
  executablePath: process.env.CHROME || undefined,
});
const page = await browser.newPage({
  viewport: { width: 1200, height: 1400 },
  deviceScaleFactor: SCALE,
});

await mkdir(OUT, { recursive: true });

let ok = 0;
const failed = [];

for (const template of LETTER_TEMPLATES) {
  const url = `${BASE}/cover-letter/templates/${template.id}`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });

    const paper = page.locator("[data-letter-page]");
    await paper.waitFor({ state: "visible", timeout: 15_000 });

    await page.evaluate(async () => {
      await document.fonts.ready;
    });

    const shot = await paper.screenshot();
    // Flat documents palettise well — a third of the size, no visible loss.
    await sharp(shot)
      .png({ palette: true, quality: 90, effort: 9 })
      .toFile(join(OUT, `${template.id}.png`));
    console.log(`  ✓ ${template.id}`);
    ok++;
  } catch (err) {
    console.error(`  ✗ ${template.id}: ${err.message.split("\n")[0]}`);
    failed.push(template.id);
  }
}

await browser.close();

console.log(`\n${ok}/${LETTER_TEMPLATES.length} captured`);
if (failed.length) {
  console.error(`failed: ${failed.join(", ")}`);
  process.exit(1);
}
