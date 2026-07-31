import type { Metadata } from "next";

import { LegalArticle } from "@/components/content/LegalArticle";
import { REFUND } from "@/lib/content/legal";

export const metadata: Metadata = {
  title: REFUND.metaTitle,
  description: REFUND.metaDescription,
  alternates: { canonical: "/refund-policy" },
};

export default function Page() {
  return <LegalArticle page={REFUND} />;
}
