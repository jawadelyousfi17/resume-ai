import type { Metadata } from "next";

import { LegalArticle } from "@/components/content/LegalArticle";
import { ABOUT } from "@/lib/content/legal";

export const metadata: Metadata = {
  title: ABOUT.metaTitle,
  description: ABOUT.metaDescription,
  alternates: { canonical: "/about" },
};

export default function Page() {
  return <LegalArticle page={ABOUT} />;
}
