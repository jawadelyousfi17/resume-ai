import type { Metadata } from "next";

import { LegalArticle } from "@/components/content/LegalArticle";
import { PRIVACY } from "@/lib/content/legal";

export const metadata: Metadata = {
  title: PRIVACY.metaTitle,
  description: PRIVACY.metaDescription,
  alternates: { canonical: "/privacy" },
};

export default function Page() {
  return <LegalArticle page={PRIVACY} />;
}
