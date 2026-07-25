import type { Metadata } from "next";

import { Faq } from "@/components/landing/Faq";
import { FreePlan } from "@/components/landing/FreePlan";
import { Hero } from "@/components/landing/Hero";
import { Highlights } from "@/components/landing/Highlights";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";
import { Templates } from "@/components/landing/Templates";
import { Testimonials } from "@/components/landing/Testimonials";

export const metadata: Metadata = {
  title: "resumeai — Build a job-winning resume for free",
  description:
    "Free online resume builder. Your first resume is free forever, with unlimited watermark-free PDF downloads, AI writing help and ATS-ready templates.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    // Same cream page and floating white panels as the rest of the app, so
    // arriving here and arriving in the editor feel like one product.
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-cream">
      <SiteNav />
      <main className="grow">
        <Hero />
        <Highlights />
        <HowItWorks />
        <Templates />
        <FreePlan />
        <Testimonials />
        <Faq />
      </main>
      <SiteFooter />
    </div>
  );
}
