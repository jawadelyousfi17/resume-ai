import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { FaqAccordion, JsonLd } from "@/components/content/ContentShell";
import { SiteNav } from "@/components/landing/SiteNav";
import { PlanComparison } from "@/components/landing/PlanComparison";
import { PlanGrid } from "@/components/landing/Pricing";
import { ArrowRight, h2, shell } from "@/components/landing/ui";
import { HOME, breadcrumbList, faqPage, softwareApplication } from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Pricing — meniacv",
  description:
    "One resume free forever, with unlimited watermark-free PDFs. Basic from $3/month for AI writing and three resumes; Ultimate from $5/month for unlimited resumes, cover letters and translation.",
  alternates: { canonical: "/pricing" },
};

const FAQS = [
  {
    question: "How does yearly billing work?",
    answer: "The monthly rate shown is billed as one annual payment. Monthly billing is charged each month. Features are the same for both billing periods.",
  },
  {
    question: "Can I cancel any time?",
    answer: "Yes, from your account. You keep your paid features until the end of the period you've paid for.",
  },
  {
    question: "What happens when my plan ends?",
    answer: "You return to the free plan and can edit and download one resume. Your other documents stay saved in your account.",
  },
];

export default function PricingPage() {
  return (
    <div data-landing className="flex min-h-dvh flex-col bg-panel text-ink">
      <SiteNav />
      <main className={`${shell} grow pt-10 pb-14 lg:pt-16 lg:pb-20`}>
        <JsonLd data={{
          "@context": "https://schema.org",
          "@graph": [softwareApplication(), faqPage(FAQS), breadcrumbList([HOME, { name: "Pricing", path: "/pricing" }])],
        }} />

        <header className="text-center">
          <h1 className="font-editorial text-[46px] leading-[1.05] font-normal tracking-[-0.035em] sm:text-[58px] lg:text-[64px]">
            A plan for your job search.
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-ink-soft">
            Start free. Upgrade for AI tools and more resumes.
          </p>
        </header>

        <PlanGrid editorial concise className="mt-9 lg:mt-11" />
        <p className="mt-6 text-center text-sm text-ink-soft">Prices in USD. Cancel any time.</p>

        <Link href="/students" className="mt-10 flex items-center gap-4 rounded-2xl bg-lp-mint/25 px-5 py-4 transition hover:bg-lp-mint/40 sm:gap-6 sm:px-7">
          <Image src="/images/students/student-verification.png" alt="" width={1024} height={1024} sizes="64px" className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16" />
          <div className="min-w-0 flex-1">
            <h2 className="font-editorial text-2xl leading-tight tracking-[-0.025em]">Free year for students</h2>
            <p className="mt-1 text-sm text-ink-soft">Verify your email to claim.</p>
          </div>
          <ArrowRight aria-hidden="true" className="h-5 w-5 shrink-0" />
        </Link>

        <details className="group mt-10 border-y border-divider">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-6 text-lg font-medium [&::-webkit-details-marker]:hidden">
            Compare all features
            <ArrowRight aria-hidden="true" className="h-5 w-5 rotate-90 transition-transform group-open:-rotate-90" />
          </summary>
          <PlanComparison className="pb-8" />
        </details>

        <section className="mx-auto mt-14 max-w-4xl lg:mt-20">
          <h2 className={h2}>Billing questions</h2>
          <FaqAccordion entries={FAQS} className="mt-5" />
          <Link href="/contact" className="mt-6 inline-block text-sm text-ink-soft underline underline-offset-4 hover:text-ink">Need help choosing? Contact us.</Link>
        </section>
      </main>
      <footer className={`${shell} flex flex-wrap gap-5 border-t border-divider py-6 text-sm text-ink-soft`}>
        <Link href="/" className="hover:text-ink">MeniaCV</Link>
        <Link href="/terms" className="hover:text-ink">Terms</Link>
        <Link href="/privacy" className="hover:text-ink">Privacy</Link>
      </footer>
    </div>
  );
}
