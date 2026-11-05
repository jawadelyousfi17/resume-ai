// The head of a browse page. Shared by /resume-templates and every
// /templates/{filter}, so a filtered view is recognisably the same page with
// one cut applied rather than a different design that happens to list
// templates.

import { IndexHero } from "@/components/content/Editorial";

export function TemplateBrowseHero({
  title,
  intro,
  secondary = { label: "See resume examples", href: "/resume-examples" },
}: {
  title: string;
  intro: string;
  secondary?: { label: string; href: string };
}) {
  return (
    <IndexHero
      label="Templates"
      title={title}
      intro={intro}
      primary={{ label: "Create my resume", href: "/dashboard" }}
      secondary={secondary}
      image="/images/template-hero-1-1.png"
    />
  );
}
