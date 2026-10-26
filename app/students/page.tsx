import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

import { FaqAccordion, JsonLd } from "@/components/content/ContentShell";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { eyebrow, h2, sectionGap, shell } from "@/components/landing/ui";
import { CheckIcon } from "@/components/ui/icons";
import { getAuthUser } from "@/lib/auth";
import { PLANS } from "@/lib/plans";
import { prisma } from "@/lib/prisma";
import { HOME, breadcrumbList, faqPage } from "@/lib/seo/schema";
import { effectivePlan } from "@/lib/subscription";
import { studentEmailTestMode, studentPlan } from "@/lib/student-policy";
import { StudentClaimForm } from "./StudentClaimForm";

export const metadata: Metadata = {
  title: "Students — a free year of MeniaCV",
  description: "Verify your eligible student email and claim a free year of MeniaCV. No card required and no automatic renewal.",
  alternates: { canonical: "/students" },
};

const TRAIL = [HOME, { name: "Students", path: "/students" }];

export default async function StudentsPage() {
  const user = await getAuthUser();
  const [claim, subscription] = user ? await Promise.all([
    prisma.studentClaim.findUnique({ where: { userId: user.id } }),
    prisma.subscription.findUnique({ where: { userId: user.id } }),
  ]) : [null, null];
  const testingEmails = studentEmailTestMode();
  const plan = PLANS.find(p => p.id === studentPlan())!;
  const basic = PLANS.find(p => p.id === "basic")!;
  // Ultimate's list starts at "everything in Basic", so spell Basic's out too —
  // minus its resume count, which Ultimate's "unlimited" replaces.
  const templates = PLANS[0].features[1];
  const features = plan.id === "ultimate"
    ? [plan.features[0], templates, ...basic.features.slice(1), ...plan.features.slice(1)]
    : [...plan.features, templates];

  const faqs = [
    { question: "Which emails are eligible?", answer: "Addresses ending in .edu, plus approved school domains. Use your school address as issued, without a + alias." },
    { question: "What happens after 12 months?", answer: `${plan.title} ends and your account returns to the free plan. Nothing renews and nothing is charged. Your resumes stay saved.` },
    { question: "Do I need a card?", answer: "No. There's no payment step at all." },
    { question: "I already pay for a plan. Can I switch?", answer: "The offer is for free accounts. Contact us and we'll help with your current plan." },
    { question: "The code didn't arrive.", answer: "Check spam, then request a new one after a minute. Codes expire after 10 minutes and only the latest one works." },
  ];

  return (
    <div data-landing className="min-h-dvh bg-panel text-ink">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [faqPage(faqs), breadcrumbList(TRAIL)] }} />
      <SiteNav />
      <main>
        <section className={`${shell} pt-8 lg:pt-14`}>
          <div className="grid gap-5 md:grid-cols-2 lg:gap-6">
            <header className="rounded-[28px] bg-lp-blue/40 p-6 sm:p-10">
              <Image
                src="/images/students/student-next-chapter.png"
                alt=""
                width={1254}
                height={1254}
                sizes="(max-width: 767px) 176px, 240px"
                loading="eager"
                className="mb-6 h-44 w-44 object-contain lg:h-60 lg:w-60"
              />
              <span className={eyebrow}>{"// Students //"}</span>
              <h1 className="mt-5 max-w-[14ch] font-editorial text-[46px] leading-[1.03] font-normal tracking-[-0.035em] sm:text-[60px] lg:text-[72px]">
                One free year for students.
              </h1>
              <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-soft lg:text-[19px]">
                12 months of {plan.title} with your school email.
              </p>
              <dl className="mt-8 flex flex-wrap gap-2.5">
                {[["Price", <><s className="text-ink-soft">${plan.yearly * 12}</s> $0</>], ["Length", "12 months"], ["Card", "No card"], ["Renewal", "No renewal"]].map(([term, value]) => (
                  <div key={term as string} className="rounded-full bg-panel px-4 py-2 text-[14px]">
                    <dt className="sr-only">{term}</dt>
                    <dd className="font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            </header>
            <section id="claim" aria-label="Claim your free year" className="flex min-w-0 scroll-mt-24 flex-col rounded-[28px] bg-canvas p-6 sm:p-10">
              <div className="grid flex-1 place-items-center pb-8">
                <Image
                  src="/images/students/student-verification.png"
                  alt=""
                  width={1024}
                  height={1024}
                  sizes="(max-width: 767px) 160px, 240px"
                  loading="eager"
                  className="h-40 w-40 object-contain lg:h-60 lg:w-60"
                />
              </div>
              <StudentClaimForm
                testingEmails={testingEmails}
                signedIn={!!user}
                claimed={!!claim}
                claimEnds={claim?.expiresAt.toISOString()}
                blocked={effectivePlan(subscription) !== "free" || !!subscription?.subscriptionId}
                planName={plan.title}
              />
            </section>
          </div>
        </section>

        <section className={`${shell} ${sectionGap}`}>
          <div className="grid gap-8 border-t border-divider pt-10 md:grid-cols-[1fr_2fr] lg:gap-16 lg:pt-14">
            <h2 className={h2}>Everything in {plan.title}</h2>
            <div>
              <ul className="grid gap-x-8 gap-y-3.5 sm:grid-cols-2">
                {features.map(feature => (
                  <li key={feature} className="flex items-start gap-3 text-[15.5px]">
                    <CheckIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={`${shell} ${sectionGap}`}>
          <div className="mx-auto max-w-5xl">
            <h2 className={h2}>Questions</h2>
            <FaqAccordion entries={faqs} className="mt-8 md:mt-12" />
            <p className="mt-8 text-[15px] text-ink-soft">
              Something else? <Link href="/contact" className="font-semibold text-ink underline underline-offset-4">Contact us</Link>
            </p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
