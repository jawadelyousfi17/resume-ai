import type { Metadata } from "next";

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

export const metadata: Metadata = {
  title: "meniacv — Build a job-winning resume for free",
  description:
    "Free online resume builder. Your first resume is free forever, with unlimited watermark-free PDF downloads, AI writing help and ATS-ready templates.",
  alternates: { canonical: "/" },
};

export default function LandingPage() {
  return (
    // Same cream page and floating white panels as the rest of the app, so
    // arriving here and arriving in the editor feel like one product.
    //
    // `overflow-x-clip`, not `overflow-x-hidden`: `hidden` makes this a scroll
    // container, and a sticky child sticks to its scroll container — which is
    // this box, which never scrolls — so the header quietly stopped sticking.
    // `clip` trims the same overflow without becoming one.
    <div className="flex min-h-dvh w-full flex-col overflow-x-clip bg-cream">
      <SiteNav />
      <main className="grow">
        <Hero />
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
