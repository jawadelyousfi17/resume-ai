import type { Metadata } from "next";

import { Features } from "@/components/landing/Features";
import { Hero } from "@/components/landing/Hero";
import { Integrations } from "@/components/landing/Integrations";
import { Proof } from "@/components/landing/Proof";
import { SiteFooter } from "@/components/landing/SiteFooter";
import { SiteNav } from "@/components/landing/SiteNav";

export const metadata: Metadata = {
  title: "resumeai — One tool to write resumes that get you hired",
  description:
    "Draft, tailor and export your resume faster, with AI writing help, live preview and ATS-ready formatting.",
};

export default function LandingPage() {
  return (
    // Same shape as the rest of the app: one cream page with white panels
    // floating on it, so arriving here and arriving in the editor feel like the
    // same product.
    <div className="min-h-dvh bg-cream">
      <SiteNav />
      <Hero />
      <Features />
      <Integrations />
      <Proof />
      <SiteFooter />
    </div>
  );
}
