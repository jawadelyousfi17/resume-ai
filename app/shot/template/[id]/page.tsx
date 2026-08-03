import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sampleForTemplate } from "@/components/landing/sample-resume";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { PAGE_SIZES } from "@/lib/defaults";
import { TEMPLATES } from "@/lib/templates";

// The rig scripts/shoot-templates.mjs points at: one template rendered at page
// width and nothing else on the screen. It used to capture this off the
// per-template detail page, which is gone — the gallery carries the demand and
// a page per template only split it — so the render it needs lives here
// instead, with no chrome to crop around.
//
// The screenshots still come from the real <ResumePreview>, which is the point:
// a thumbnail can never show something the editor wouldn't produce.

export const metadata: Metadata = {
  // Scaffolding, not a page. Out of the sitemap and out of the index.
  robots: { index: false, follow: false },
};

// No generateStaticParams: this is tooling, rendered on demand when the
// screenshot script asks for it. Prerendering every template would put a few
// hundred pages nobody visits into every build.

export default async function TemplateShotPage(
  props: PageProps<"/shot/template/[id]">,
) {
  const { id } = await props.params;
  const template = TEMPLATES.find((t) => t.id === id);
  if (!template) notFound();

  return (
    <div
      data-template-page
      className="resume-page overflow-hidden bg-white"
      style={{ width: PAGE_SIZES.A4.width }}
    >
      <ResumePreview data={sampleForTemplate(template.id)} />
    </div>
  );
}
