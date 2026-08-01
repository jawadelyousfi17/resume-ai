import type { Metadata } from "next";
import Link from "next/link";

import {
  Breadcrumbs,
  FaqAccordion,
  JsonLd,
} from "@/components/content/ContentShell";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { PlanComparison } from "@/components/landing/PlanComparison";
import { PlanGrid } from "@/components/landing/Pricing";
import { btnPrimary } from "@/components/landing/ui";
import {
  HOME,
  breadcrumbList,
  faqPage,
  softwareApplication,
} from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Pricing — meniacv",
  description:
    "One resume free forever, with unlimited watermark-free PDFs. Basic from $3/month for AI writing and three resumes; Ultimate from $5/month for unlimited resumes, cover letters and translation.",
  alternates: { canonical: "/pricing" },
};

const FAQS = [
  {
    question: "Is the free plan really free?",
    answer:
      "Yes. One resume, all templates, full layout control and unlimited watermark-free PDF downloads, with no card and no trial period. It doesn't expire and it doesn't upgrade itself.",
  },
  {
    question: "What's the difference between monthly and yearly?",
    answer:
      "Only the price. Paid yearly, Basic works out at $3 a month and Ultimate at $5 a month; paid month to month they're $9 and $17. The features are identical either way.",
  },
  {
    question: "What happens to my resumes if I stop paying?",
    answer:
      "Nothing is deleted. You keep editing and downloading one resume on the free plan, and the rest stay in your account, ready to unlock again if you come back.",
  },
  {
    question: "Do I need an account to start?",
    answer:
      "No. You can build a resume, preview it and download the PDF without signing in — it's kept in your browser. Signing in later brings that resume with you.",
  },
  {
    question: "Can I cancel any time?",
    answer:
      "Yes, from your account, and you keep the paid features until the period you've already paid for runs out.",
  },
];

const TRAIL = [HOME, { name: "Pricing", path: "/pricing" }];

export default function PricingPage() {
  return (
    // White, like the rest of the marketing pages: the plan cards bring all
    // the colour this page needs, and a tint behind them was one surface too
    // many.
    //
    // Composed directly rather than through <ContentPage> because the written
    // pages sit in a 760px reading column and three plan cards need the full
    // width. The gutters match the nav's, so the page lines up with it.
    <div className="min-h-dvh bg-panel">
      <SiteNav />

      <main className="px-5 pt-6 sm:px-8 lg:px-10">
        <div className="mx-auto w-full max-w-site">
          {/* The plans themselves belong on the page that lists them, which is
              this one — the landing page carries the same graph because it also
              shows the cards. */}
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@graph": [
                softwareApplication(),
                faqPage(FAQS),
                breadcrumbList(TRAIL),
              ],
            }}
          />

          <Breadcrumbs trail={TRAIL} />

          {/* The heading runs the full width; only the prose is held to a
              readable measure. */}
          <header className="mt-6 text-center">
            <h1 className="mx-auto mt-5 max-w-[18ch] text-[34px] leading-[1.08] font-extrabold tracking-tight text-ink sm:text-[44px] lg:text-[52px]">
              One resume free, forever
            </h1>
            <p className="mx-auto mt-5 max-w-[58ch] text-[17px] leading-relaxed text-ink-soft lg:text-[19px]">
              No card to start and no watermark on the way out. Pay only when
              you want the AI writing tools, or when one resume stops being
              enough.
            </p>
          </header>

          <PlanGrid className="mt-12 lg:mt-14" />

          <p className="mt-8 text-center text-[13.5px] text-ink-soft">
            Prices in USD. Cancel any time — your resumes stay downloadable on
            the free plan.
          </p>

          <PlanComparison className="mt-16 lg:mt-20" />

          {/* The landing page's accordion, not the grid of cards the written
              pages use — these answers are long and only one is read at a time. */}
          <section className="mt-16 lg:mt-20">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-[26px] leading-tight font-extrabold tracking-tight text-ink sm:text-[32px]">
                Questions about billing
              </h2>
              <FaqAccordion entries={FAQS} />
            </div>
          </section>

          {/* Closing action. */}
          <section className="mt-16 text-center lg:mt-20">
            <h2 className="text-[26px] leading-tight font-extrabold tracking-tight text-ink sm:text-[32px]">
              Start with the free plan
            </h2>
            <p className="mx-auto mt-3 max-w-[46ch] text-[15.5px] leading-relaxed text-ink-soft">
              Build a resume first, decide about paying later. Nothing here asks
              for a card.
            </p>
            <Link href="/dashboard" className={`${btnPrimary} mt-7`}>
              Get started for free ✨
            </Link>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
