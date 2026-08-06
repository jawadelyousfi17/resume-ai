import type { Metadata } from "next";

import { JsonLd } from "@/components/content/ContentShell";
import { Companies } from "@/components/landing/Companies";
import { Faq } from "@/components/landing/Faq";
import { FreePlan } from "@/components/landing/FreePlan";
import { Hero } from "@/components/landing/Hero";
import { Highlights } from "@/components/landing/Highlights";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing } from "@/components/landing/Pricing";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { Templates } from "@/components/landing/Templates";
import { Testimonials } from "@/components/landing/Testimonials";
import { LANDING_FAQS } from "@/lib/content/faq";
import { abs, faqPage, softwareApplication } from "@/lib/seo/schema";

export const metadata: Metadata = {
  // "CV" earns its place in the title: the domain is meniacv, and the UK,
  // Irish, Australian and European markets search for a CV rather than a
  // resume. Without the word here the site ranked for it only by accident.
  title: "meniacv — Free Resume & CV Builder, Job-Winning in Minutes",
  description:
    "Free online resume and CV builder. Your first document is free forever, with unlimited watermark-free PDF downloads, AI writing help and ATS-ready templates.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    // White, like /resume-templates and /resume-examples — the marketing pages
    // read as one surface, and the panels that need separating draw a ring
    // rather than floating on a tint.
    //
    // `overflow-x-clip`, not `overflow-x-hidden`: `hidden` makes this a scroll
    // container, and a sticky child sticks to its scroll container — which is
    // this box, which never scrolls — so the header quietly stopped sticking.
    // `clip` trims the same overflow without becoming one.
    <div className="flex min-h-dvh w-full flex-col overflow-x-clip bg-panel">
      {/* The product, its prices, and the questions actually rendered below.
          No BreadcrumbList — this is the root, and a one-item trail is noise. */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            softwareApplication(),
            faqPage(LANDING_FAQS),
            {
              "@type": "WebSite",
              name: "meniacv",
              url: abs("/"),
            },
          ],
        }}
      />

      <SiteNav />
      <main className="grow">
        <Hero />
        <Companies />
        <Highlights />
        <HowItWorks />
        <Templates />
        <FreePlan />
        <Pricing />
        <Testimonials />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}
