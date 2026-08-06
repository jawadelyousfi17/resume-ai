import { sectionGap, shell } from "./ui";

// Alphabetical, so nobody has to defend the running order. The files are
// 180×60 with the glyph already inset, which is what keeps the row evenly
// spaced without per-logo padding: each one brings its own margin.
const COMPANIES = [
  "amazon",
  "anthropic",
  "forbes",
  "google",
  "hubspot",
  "microsoft",
  "openai",
  "paypal",
];

const LABELS: Record<string, string> = {
  hubspot: "HubSpot",
  openai: "OpenAI",
  paypal: "PayPal",
};

/** Title-case the file's stem, minding the ones with an inner capital. */
function label(slug: string) {
  return LABELS[slug] ?? slug[0].toUpperCase() + slug.slice(1);
}

/**
 * The logo wall under the hero — the social proof the hero's "trusted by
 * 100k+" line only asserts.
 *
 * Flattened to one ink, and deliberately: the set is a mix of brand-coloured
 * marks (Google, Microsoft, PayPal) and marks that are black by brand (OpenAI,
 * Anthropic), so in colour the row reads as half of it shouting and half of it
 * not. `grayscale` alone doesn't fix that — it maps each brand colour to its
 * own luminance, which left Google and Microsoft a pale grey beside a nearly
 * black Amazon. `brightness-0` takes every painted pixel to black and leaves
 * the alpha alone, so the row is one weight and the opacity sets it.
 */
export function Companies() {
  return (
    <section className={`${shell} ${sectionGap}`}>
      {/* A paragraph, not a heading: this is a caption for the row beneath it,
          and slotting an h2 between the hero and the first real section would
          put a rung in the outline that leads nowhere. */}
      <p className="text-center text-[15px] font-bold tracking-tight text-ink-soft lg:text-[17px]">
        Helping users land jobs at 1,000+ companies such as
      </p>

      <div className="mx-auto mt-8 grid max-w-5xl grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-4 lg:mt-10 lg:max-w-none lg:grid-cols-8 lg:gap-x-8">
        {COMPANIES.map((slug) => (
          // The company names are the content here — "such as" promises a
          // list — so these carry their names rather than going decorative.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={slug}
            src={`/images/companies/${slug}.svg`}
            alt={label(slug)}
            width={180}
            height={60}
            // Below the fold on a phone, above it on a desktop; either way
            // eight small SVGs are cheap enough not to gate the hero on.
            loading="lazy"
            decoding="async"
            className="mx-auto w-full max-w-[150px] opacity-55 brightness-0 lg:max-w-full"
          />
        ))}
      </div>
    </section>
  );
}
