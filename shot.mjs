import { chromium } from "playwright";

const [url, out, clickText] = process.argv.slice(2);
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.waitForTimeout(500);

// Slow the next navigation only, so the bar has time to appear.
const client = await page.context().newCDPSession(page);
await client.send("Network.enable");
await client.send("Network.emulateNetworkConditions", {
  offline: false,
  latency: 1200,
  downloadThroughput: 60_000,
  uploadThroughput: 60_000,
});

await page.getByRole("link", { name: clickText }).first().click();
await page.waitForTimeout(700);
await page.screenshot({ path: out, clip: { x: 0, y: 0, width: 1280, height: 120 } });
await browser.close();
