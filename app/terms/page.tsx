import type { Metadata } from "next";

import { LegalArticle } from "@/components/content/LegalArticle";
import { TERMS } from "@/lib/content/legal";

export const metadata: Metadata = {
  title: TERMS.metaTitle,
  description: TERMS.metaDescription,
  alternates: { canonical: "/terms" },
};

export default function Page() {
  return <LegalArticle page={TERMS} />;
}
