// Draws the illustration each guide carries, into public/images/guides/<slug>.png.
//
//   NANOBANANA_KEY=… node --experimental-strip-types scripts/generate-guide-art.mjs
//   … scripts/generate-guide-art.mjs resume-fonts resume-length   (just these)
//   … scripts/generate-guide-art.mjs --force resume-fonts         (redraw one)
//
// The pictures come from nano-banana-pro at 2K and are resampled to the same
// 1672×941 the role examples and the landing art already use, so a guide card
// and an example card are the same object at the same size.
//
// Why a prompt per guide rather than one prompt fed the guide's text: these
// have to look like one set. The subject line below is the only thing that
// changes between them — STYLE is what makes eleven separate generations read
// as the same illustrator, and it is not worth re-deriving per run.
//
// Guides without an entry in SUBJECTS are skipped and listed at the end. A
// guide with no picture is not an error anywhere — the card and the header
// both render without one (see lib/content/guide-art.ts).

import { mkdir, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

import { GUIDES } from "../lib/content/guides.ts";

const API = "https://api.nanobananaapi.ai/api/v1/nanobanana";
const KEY = process.env.NANOBANANA_KEY;
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "guides");

// What the rest of the site's art is: flat vector, one blue, everything else
// grey, and no writing on it — a picture with words in it reads as a screenshot
// of something we don't ship, and the model's idea of English is worse than
// nothing at 380px wide.
const STYLE = [
  "Flat vector illustration, minimal modern editorial style, drawn as clean geometry rather than sketched.",
  "Pure white background (#FFFFFF).",
  "Strictly limited palette: bright blue #2563EB as the only saturated colour, cool greys #E2E8F0 and #94A3B8 for everything secondary, one small cyan #22D3EE accent, thin dark navy #0F172A outlines of even weight.",
  "Composition: one clear centred subject on a rounded-rectangle card with a hairline outline and a very soft shadow, a pale grey blob and a small dotted grid floating behind it, wide even white margin on all four sides.",
  "Absolutely no text, no letters, no numbers, no logos: written lines are drawn as plain grey rounded bars of varying length.",
  "No photography, no 3D, no gradients, no texture, no people's faces.",
].join(" ");

/** The one line that differs between them. */
const SUBJECTS = {
  "how-to-write-a-resume":
    "A single upright sheet of paper being assembled: three stacked section blocks of grey bars snapping into place on the page, one block still floating a little above its slot, a blue guide line showing where it lands.",
  "ats-friendly-resume":
    "A sheet of paper passing downward through a wide horizontal scanner bar, a blue reading beam across the page, and the text lines emerging below the beam as a neat column of small blue and grey tokens.",
  "resume-bullet-points":
    "Two short stacked line-items side by side: the left one a grey bar with a plain grey dot, the right one the same bar redrawn in blue with a blue dot, a small blue upward arrow between them, and a tiny cyan tick beside the right one.",
  "resume-summary-examples":
    "The top third of a resume page enlarged: a short three-line paragraph block highlighted in a pale blue field with a blue left rule, the rest of the page below it faded to light grey bars.",
  "resume-format":
    "Three small pages side by side at slightly different heights: a single-column page, a two-column page with a grey rail, and a page with a dark blue header band, the middle one lifted and outlined in blue as the chosen one.",
  "resume-fonts":
    "A type specimen without letters: five horizontal bars of the same length in five different weights and heights, from hairline grey to heavy blue, stacked on a card with a small blue size-slider along one edge.",
  "resume-length":
    "One page standing beside two overlapping pages, a slim vertical measuring rule with tick marks between them, the single page outlined in blue and the second page of the pair drawn as a faint grey outline.",
  "career-change-resume":
    "Two routes on a card: a grey dotted path that stops, and a blue path that curves across and continues past it to a small blue destination dot, with a few grey skill chips carried along the blue path.",
  "resume-skills":
    "A grid of small rounded skill chips, four of them blue and the rest grey, each with a short bar meter underneath at a different fill level, one chip lifted slightly off the card.",
  "cover-letter-basics":
    "A letter sheet lifted half out of an open envelope, the sheet showing a short greeting bar, three grey paragraph blocks and a blue signature squiggle, the envelope drawn as a flat grey outline.",
  "ai-resume-builder":
    "A resume page with a small four-point blue sparkle at its top corner and one grey line being redrawn in blue, a narrow suggestion panel floating beside it holding three short chips.",
  "ats-resume-keywords":
    "A job posting sheet on the left with half a dozen small blue tokens lifting off it and settling into matching empty slots on a resume page to the right.",
  "ats-resume-checklist":
    "A clipboard card with five rows: three with cyan ticks in blue circles, one with an empty grey checkbox, one being ticked, and a short blue progress bar along the bottom.",
  "resume-mistakes":
    "A resume page with three small round blue markers pinned to three of its lines, one line struck through in grey, and a tiny grey line lifted away from the page.",
  "translate-your-resume":
    "Two page cards either side of a flat circle drawn as a grey latitude grid, a blue arc arrow crossing between them, one page carrying a small portrait square the other does not.",
  "chronological-resume-format":
    "A vertical timeline down the middle of a page: four nodes descending in size order, the top node a filled blue circle, each with a short date bar to its left and two grey bars to its right.",
  "functional-resume-format":
    "A page whose content is grouped into three labelled skill clusters of grey bars, a faint grey timeline running behind them, and a small blue caution diamond at one corner.",
  "linkedin-to-resume":
    "A profile card on the left — wide banner strip, round grey avatar, two bars — and a blue arrow to a resume page on the right whose blocks are still snapping into place.",
  "chatgpt-resume":
    "A stack of two chat bubbles, the upper grey and the lower blue with a small sparkle, feeding one line onto a resume page beside them where a small blue pen trims it shorter.",
  "cv-vs-resume":
    "Two pages side by side separated by a thin vertical rule: a short two-block page outlined in blue, and a long many-block page running past the bottom edge of the card.",
  "what-is-a-resume":
    "One page centred with five clearly separated section blocks, the topmost in blue and the rest grey, and a soft circular magnifier resting over the top block.",
  "what-to-put-on-a-resume":
    "A page in the middle with blue blocks arriving into it from one side and grey blocks lifting away from it to a small discard stack on the other.",
  "what-a-good-resume-looks-like":
    "A page tilted very slightly, faint blue alignment guides running across and down it, a blue circular tick badge at its lower corner.",
  "hard-skills-vs-soft-skills":
    "Two columns on one card: on the left a stack of solid blue chips, on the right the same number of grey chips each paired with a short supporting bar underneath.",
  "technical-skills-resume":
    "A panel of small rounded skill chips, each with a tiny pip beside it, and three horizontal depth meters below filled to different blue lengths.",
  "skills-section":
    "A resume page with one block highlighted in a pale blue field and a small blue double-headed arrow beside it showing that block moving up or down the page.",
  "high-school-resume":
    "A single short page under a plain grey rounded shield mark, three stacked blocks of grey bars, the first bar of each in blue.",
  "college-student-resume":
    "A page with a flat graduation cap mark above it, one coursework block of grey bars, and two small project cards overlapping its lower half.",
  "resume-with-no-experience":
    "A nearly empty page with three blue blocks being filled in from a small side stack of alternative grey blocks waiting beside it.",
  "add-resume-to-linkedin":
    "A profile card with three upload slots down one side, the middle slot blue with an upward arrow entering it and a small page icon above.",
  "linkedin-on-resume":
    "The header block of a resume enlarged: a name bar, two grey contact bars, and a small blue link chip sitting on the third line.",
  "harvard-resume-format":
    "A formal single-column page with a centred header block and generous margins drawn as thin blue guide lines down both sides.",
  "jakes-resume-template":
    "A compact one-page layout: a centred header, a dense two-column lower half of short grey bars, and a small blue angle-bracket mark in one corner.",
  "latex-resume":
    "A page ruled with a precise faint grey baseline grid, framed by a pair of large blue braces, one line of the page set noticeably crisper than the rest.",
  "federal-resume":
    "A fan of five stacked pages, the front one showing many short grey bars, with a small grey-blue rosette seal at its lower corner.",
  "acting-resume":
    "An empty grey portrait frame clipped above a one-page list whose rows are grouped into three sections, no face drawn, a small blue clip at the top edge.",
  "references-on-resume":
    "A resume page with a smaller card behind it holding three contact rows, joined by a small blue paperclip mark at the corner.",
  "certifications-on-resume":
    "Three rounded badge shapes in a row with short ribbon tails, the middle one blue and the others grey, a small date bar beneath each.",
  "education-on-resume":
    "A page with one block outlined in blue, a small flat graduation cap mark beside it and a short date-range bar under it.",
  "photo-on-resume":
    "A page whose header carries an empty grey portrait square, a small blue toggle beside it, and a faint duplicate page behind without the square.",
  "resume-action-verbs":
    "Five stacked bars each beginning with a heavy blue leading segment, and two grey bars below whose leading segments are crossed out with a thin blue line.",
  "resume-objective":
    "The top of a page: a three-line blue-tinted block in front, an older shorter grey block faded behind it, and a small blue swap arrow between the two.",
  "resume-writing-services":
    "A page passing between two abstract desk cards, a grey price tag shape hanging at one side and a small blue tick at the other.",
  "resume-website":
    "A browser window card with a rounded toolbar of three grey dots, a resume page laid out inside it, a small blue cursor arrow, and a phone-shaped card behind.",
};

/** The picture at the top of /guides, which is one image rather than one per
 *  guide — square, because the page crops it to a circle-ish shape the way
 *  /resume-examples crops its own hero. */
const HERO = {
  file: join(OUT, "..", "guides-hero.png"),
  size: 1254,
  aspectRatio: "1:1",
  subject:
    "A short shelf of upright reference cards seen face-on, each a rounded page showing a few grey bars, the middle two blue, with a small blue bookmark ribbon over one of them and a soft grey blob behind the row.",
};

if (!KEY) {
  console.error("NANOBANANA_KEY is not set — nothing to authenticate with.");
  process.exit(1);
}

const force = process.argv.includes("--force");
const asked = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));

await mkdir(OUT, { recursive: true });
const drawn = new Set(
  (await readdir(OUT)).filter((f) => f.endsWith(".png")).map((f) => f.slice(0, -4)),
);
const heroDrawn = (await readdir(join(OUT, ".."))).includes("guides-hero.png");

// `hero` is the one picture that isn't a guide's: the page's own.
const known = [...GUIDES.map((g) => g.slug), "hero"];
const unknown = asked.filter((slug) => !known.includes(slug));
if (unknown.length) {
  console.error(`no such guide: ${unknown.join(", ")}`);
  process.exit(1);
}

/** One picture to draw: where it goes, how big, and what of. */
const job = (slug) =>
  slug === "hero"
    ? { slug, file: HERO.file, size: [HERO.size, HERO.size], aspectRatio: HERO.aspectRatio, subject: HERO.subject }
    : { slug, file: join(OUT, `${slug}.png`), size: [1672, 941], aspectRatio: "16:9", subject: SUBJECTS[slug] };

const wanted = asked.length ? asked : known;
const queue = wanted
  .filter((slug) => slug === "hero" || SUBJECTS[slug])
  .filter((slug) => force || !(slug === "hero" ? heroDrawn : drawn.has(slug)))
  .map(job);

const skipped = wanted.filter((slug) => slug !== "hero" && !SUBJECTS[slug]);

if (!queue.length) {
  console.log("nothing to draw — every requested guide already has art (--force to redraw)");
}

/** POST the prompt, then poll until the picture exists. One task at a time
 *  per guide; the generation itself takes about a minute. */
async function draw({ subject, aspectRatio }) {
  const submit = await fetch(`${API}/generate-pro`, {
    method: "POST",
    headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      prompt: `${STYLE} Subject: ${subject}`,
      resolution: "2K",
      aspectRatio,
    }),
  });
  const created = await submit.json();
  if (created.code !== 200 || !created.data?.taskId) {
    throw new Error(`submit failed: ${created.msg ?? created.message ?? submit.status}`);
  }

  const taskId = created.data.taskId;
  // Roughly four minutes of patience: a 2K page has taken about sixty seconds
  // every time, and a task that has gone quiet for four is a task that failed
  // without saying so.
  for (let attempt = 0; attempt < 48; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const res = await fetch(`${API}/record-info?taskId=${taskId}`, {
      headers: { Authorization: `Bearer ${KEY}` },
    });
    const { data } = await res.json();

    if (data?.successFlag === 1) return data.response.resultImageUrl;
    if (data?.successFlag === 2 || data?.successFlag === 3) {
      throw new Error(data.errorMessage || `generation failed (flag ${data.successFlag})`);
    }
  }
  throw new Error("timed out waiting for the image");
}

/** Down to the size every other illustration on the site is stored at. The
 *  API returns a JPEG; the site's art is PNG, and these are flat enough to
 *  palettise without a visible loss. */
async function save({ file, size: [width, height] }, url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`download failed: ${res.status}`);

  await sharp(Buffer.from(await res.arrayBuffer()))
    .resize(width, height, { fit: "cover", position: "centre" })
    .png({ palette: true, quality: 90, effort: 9 })
    .toFile(file);
}

let ok = 0;
const failed = [];

// Three at a time: the API is happy to take them in parallel, and drawing ten
// one after another is ten minutes of waiting for a script nobody watches.
const lane = async () => {
  for (let next = queue.shift(); next; next = queue.shift()) {
    try {
      await save(next, await draw(next));
      console.log(`  ✓ ${next.slug}`);
      ok++;
    } catch (err) {
      console.error(`  ✗ ${next.slug}: ${err.message}`);
      failed.push(next.slug);
    }
  }
};

const total = queue.length;
await Promise.all([lane(), lane(), lane()]);

console.log(`\n${ok}/${total} drawn`);
if (skipped.length) {
  console.log(`no subject written yet: ${skipped.join(", ")}`);
}
if (failed.length) {
  console.error(`failed: ${failed.join(", ")}`);
  process.exit(1);
}
