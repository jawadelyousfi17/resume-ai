// Renders every template and saves a screenshot of the page to
// public/templates/<id>.png, which is what the gallery and the Customize
// panel show.
//
// The screenshots come from the real <ResumePreview>, captured off the
// per-template page — so a thumbnail can never show something the editor
// wouldn't produce. Re-run after changing a template or the renderer:
//
//   node scripts/shoot-templates.mjs            (against localhost:3000)
//   BASE=http://localhost:3001 node scripts/...
//
// Requires the dev or production server to be running.

import { mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";

import { TEMPLATES } from "../lib/templates.ts";

const BASE = process.env.BASE ?? "http://127.0.0.1:3000";
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "templates");

// 2x so the thumbnails stay sharp on retina screens.
const SCALE = 2;

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 1200, height: 1400 },
  deviceScaleFactor: SCALE,
});

await mkdir(OUT, { recursive: true });

let ok = 0;
const failed = [];

for (const template of TEMPLATES) {
  const url = `${BASE}/resume-templates/${template.id}`;
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 45_000 });

    const paper = page.locator("[data-template-page]");
    await paper.waitFor({ state: "visible", timeout: 15_000 });

    // The avatars come from DiceBear over the network; screenshotting before
    // they land produces a page with holes in it.
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

    const shot = await paper.screenshot();
    // Flat documents palettise well — a third of the size, no visible loss.
    await sharp(shot).png({ palette: true, quality: 90, effort: 9 }).toFile(join(OUT, `${template.id}.png`));
    console.log(`  ✓ ${template.id}`);
    ok++;
  } catch (err) {
    console.error(`  ✗ ${template.id}: ${err.message.split("\n")[0]}`);
    failed.push(template.id);
  }
}

await browser.close();

console.log(`\n${ok}/${TEMPLATES.length} captured`);
if (failed.length) {
  console.error(`failed: ${failed.join(", ")}`);
  process.exit(1);
}
