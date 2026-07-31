// The structured data every page emits, built in one place so the graphs stay
// consistent and a page can't quietly describe itself differently from its
// neighbours.
//
// Nothing here reaches for `headers()`. `siteOrigin()` would, and that turns a
// prerendered page into a dynamic one — which is most of the content on this
// site. `configuredSiteUrl()` is the sync half: absolute URLs in production
// where NEXT_PUBLIC_SITE_URL is set, relative ones in local development, which
// is what these pages already emitted.

import { CHECKOUT_ENABLED, PLANS } from "@/lib/plans";
import { configuredSiteUrl } from "@/lib/site-url";
import type { FaqEntry } from "@/lib/content/guides";

/** A path as an absolute URL where the origin is known, unchanged where it
 *  isn't. Search engines resolve relative `item` values against the page, so
 *  the fallback is degraded rather than wrong. */
export function abs(path: string): string {
  const origin = configuredSiteUrl();
  return origin ? `${origin}${path}` : path;
}

/** One step of a breadcrumb trail. The same array renders the visible trail
 *  and the BreadcrumbList, so the two can't disagree — which is the thing
 *  Google penalises. */
export interface Crumb {
  name: string;
  path: string;
}

/** The trail every content page starts from. */
export const HOME: Crumb = { name: "Home", path: "/" };

export function breadcrumbList(trail: Crumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: trail.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: abs(crumb.path),
    })),
  };
}

export function faqPage(entries: FaqEntry[]) {
  return {
    "@type": "FAQPage",
    mainEntity: entries.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

/**
 * The product itself, with a price for each plan.
 *
 * Availability tracks CHECKOUT_ENABLED rather than being hardcoded to InStock.
 * There is no checkout yet, and telling Google the paid plans are purchasable
 * would put a Buy price in a rich result that nothing on the site can honour —
 * a structured-data violation and a bad first impression in equal measure. The
 * free plan is genuinely available, so it says so.
 */
export function softwareApplication() {
  return {
    "@type": "SoftwareApplication",
    name: "meniacv",
    url: abs("/"),
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Resume builder",
    operatingSystem: "Web",
    description:
      "Free online resume builder with live preview, AI writing help, ATS-ready templates and watermark-free PDF export.",
    offers: PLANS.map((plan) => ({
      "@type": "Offer",
      name: plan.title,
      price: plan.monthly,
      priceCurrency: "USD",
      availability:
        plan.monthly === 0 || CHECKOUT_ENABLED
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      url: abs("/pricing"),
      ...(plan.monthly > 0 && {
        // The headline figure is the month-to-month rate. Saying so explicitly
        // stops it being read as the price of the product outright, and gives
        // the yearly rate somewhere honest to live.
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: plan.monthly,
          priceCurrency: "USD",
          referenceQuantity: {
            "@type": "QuantitativeValue",
            value: 1,
            unitCode: "MON",
          },
        },
      }),
    })),
  };
}

/** The publisher every Article on the site points at. */
export const ORGANIZATION = {
  "@type": "Organization",
  name: "meniacv",
  url: abs("/"),
} as const;
