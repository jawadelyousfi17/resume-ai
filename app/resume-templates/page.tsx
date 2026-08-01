import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  Breadcrumbs,
  Column,
  ContentCta,
  ContentPage,
  FaqAccordion,
  JsonLd,
  PageHeader,
  measure,
} from "@/components/content/ContentShell";
import { TemplateGallery } from "@/components/content/TemplateGallery";
import {
  btnCompact,
  btnPrimary,
  btnQuiet,
  panelFlat,
} from "@/components/landing/ui";
import { TEMPLATE_COLLECTIONS } from "@/lib/content/template-collections";
import { HOME, abs, breadcrumbList, faqPage } from "@/lib/seo/schema";
import { TEMPLATES, templatesIn } from "@/lib/templates";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Resume & CV Templates — Free, ATS-Ready Layouts | meniacv",
  description:
    "Professional resume and CV templates you can edit and export as a real PDF — serif and sans, single and two-column, with or without a photo. Every one is ATS-readable.",
  alternates: { canonical: "/resume-templates" },
};

const FAQS = [
  {
    question: "Are these templates ATS-friendly?",
    answer:
      "Yes. Every template exports to a real-text, conventionally-headed PDF, which is what applicant tracking systems parse. The two-column layouts are the ones to check — copy the text out of the exported PDF and confirm it reads in a sensible order.",
  },
  {
    question: "Can I change a template after I've written my resume?",
    answer:
      "At any time. The template is a rendering choice, not a container — switching it re-renders the same content, and your writing is untouched.",
  },
  {
    question: "Can I change the fonts and colours?",
    answer:
      "Yes. Accent colour, font family, base size, line height and margins are all controls under Customize, and the live preview and the PDF follow them together.",
  },
  {
    question: "Do the templates work in other languages?",
    answer:
      "All of them render in ten languages, including right-to-left Arabic, which flips the whole document. PDF export for non-Latin scripts needs a matching font installed on the server.",
  },
];

const TRAIL = [HOME, { name: "Resume templates", path: "/resume-templates" }];

export default function ResumeTemplatesPage() {
  return (
    <ContentPage surface="white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "ItemList",
              name: "meniacv resume templates",
              itemListElement: TEMPLATES.map((template, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: `${template.name} resume template`,
                description: template.description,
                url: abs(`/resume-templates/${template.id}`),
              })),
            },
            faqPage(FAQS),
            breadcrumbList(TRAIL),
          ],
        }}
      />

      <Column>
        <Breadcrumbs trail={TRAIL} />
        {/* The hero: what the page is on the left, what it looks like on the
            right. One column on a phone, where the artwork follows the words
            rather than pushing them off the screen. */}
        <div className="grid items-center gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
          <div>
            <PageHeader
              title="Resume &amp; CV templates"
              intro="Every one is a live render rather than a mock-up, shown with the kind of history it was designed for — a nurse's page and an engineer's page put different pressure on a layout. Pick one now and change your mind later: switching template re-renders what you've written rather than starting it over."
            />

            {/* For the visitor who already knows what they want: the gallery
                is right below for everyone else, and every card in it starts
                the same resume with that template applied. */}
            <div className="mt-6 flex flex-nowrap gap-3 sm:mt-8 sm:flex-wrap">
              <Link
                href="/dashboard"
                className={cn(btnPrimary, btnCompact)}
              >
                Create my resume
              </Link>
              <Link
                href="/resume-examples"
                className={cn(btnQuiet, btnCompact)}
              >
                See resume examples
              </Link>
            </div>
          </div>

          {/* Decorative, so no alt text: it says the same thing as the
              thirty-two real renders below it. Sized against its own file so
              the space is held before it loads, and `priority` because it's
              the largest thing above the fold — left to lazy-load it arrives
              after the reader. */}
          <Image
            src="/images/template-hero-1-1.png"
            alt=""
            width={1254}
            height={1254}
            priority
            sizes="(min-width: 1024px) 330px, 60vw"
            // The artwork's ground is a shade off white, so against the page
            // it would read as a faint slab with four visible edges.
            // Multiplying sinks most of it and the mask dissolves the rest at
            // the borders — the pages float on the page rather than sitting
            // in a box.
            // Cropped to the middle 80% of its own height: the square left a
            // band of empty ground above and below the pages, which made the
            // artwork stand taller than the words beside it. Done here rather
            // than in the file, so the source stays the square it was drawn as.
            className="mx-auto aspect-[1254/1003] w-full max-w-[330px] max-lg:hidden object-cover object-center mix-blend-multiply [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent),linear-gradient(to_bottom,transparent,#000_10%,#000_90%,transparent)]"
          />
        </div>

        <TemplateGallery />

        {/* The filter buttons above are client state and can't be linked to or
            crawled. These are the same cuts as real pages, each with its own
            copy about when that style is the right call. */}
        <section className="mt-14">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Browse by style
          </h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {TEMPLATE_COLLECTIONS.map((collection) => (
              <Link
                key={collection.slug}
                href={`/${collection.slug}`}
                className={cn(panelFlat, "px-5 py-4 transition hover:ring-ink/15")}
              >
                <span className="block text-[15px] font-extrabold text-ink">
                  {collection.title}
                </span>
                <span className="mt-1 block text-[13px] font-semibold text-ink-faint">
                  {templatesIn(collection.category).length} templates
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Choosing between them
          </h2>
          <p
            className={`mt-4 text-[16px] leading-[1.75] text-ink-soft ${measure}`}
          >
            Template choice is the smallest decision on this page. No layout
            rescues weak bullet points, and no recruiter has ever hired someone
            for their margins. If you are undecided, take Ledger and spend the
            time you saved on{" "}
            <Link
              href="/guides/resume-bullet-points"
              className="font-bold text-brand underline underline-offset-4"
            >
              rewriting your bullet points
            </Link>
            .
          </p>
          <p
            className={`mt-4 text-[16px] leading-[1.75] text-ink-soft ${measure}`}
          >
            The one layout decision with real consequences is column count. A
            sidebar can confuse an applicant tracking system if the text
            extracts out of order — the{" "}
            <Link
              href="/guides/ats-friendly-resume"
              className="font-bold text-brand underline underline-offset-4"
            >
              ATS guide
            </Link>{" "}
            covers how to check yours in about ten seconds.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
            Common questions
          </h2>
          <FaqAccordion entries={FAQS} />
        </section>

        <ContentCta
          flat
          heading="Try a template"
          body="Open the editor, write one entry, and switch between them to see the difference."
        />
      </Column>
    </ContentPage>
  );
}
