// The head of a browse page: what the page is on the left, what it looks like
// on the right. Shared by /resume-templates and every /templates/{filter},
// so a filtered view is recognisably the same page with one cut applied
// rather than a different design that happens to list templates.

import Image from "next/image";
import Link from "next/link";

import { PageHeader } from "@/components/content/ContentShell";
import { btnCompact, btnPrimary, btnQuiet } from "@/components/landing/ui";
import { cn } from "@/lib/utils";

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
    // One column on a phone, where the artwork follows the words rather than
    // pushing them off the screen.
    <div className="grid items-center gap-6 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
      <div>
        <PageHeader title={title} intro={intro} />

        {/* For the visitor who already knows what they want: the gallery is
            right below for everyone else, and every card in it starts the same
            resume with that template applied. */}
        <div className="mt-6 flex flex-nowrap gap-3 sm:mt-8 sm:flex-wrap">
          <Link href="/dashboard" className={cn(btnPrimary, btnCompact)}>
            Create my resume
          </Link>
          <Link href={secondary.href} className={cn(btnQuiet, btnCompact)}>
            {secondary.label}
          </Link>
        </div>
      </div>

      {/* Decorative, so no alt text: it says the same thing as the real
          renders below it. Sized against its own file so the space is held
          before it loads, and `priority` because it's the largest thing above
          the fold — left to lazy-load it arrives after the reader. */}
      <Image
        src="/images/template-hero-1-1.png"
        alt=""
        width={1254}
        height={1254}
        priority
        sizes="(min-width: 1024px) 330px, 60vw"
        // The artwork's ground is a shade off white, so against the page it
        // would read as a faint slab with four visible edges. Multiplying
        // sinks most of it and the mask dissolves the rest at the borders —
        // the pages float on the page rather than sitting in a box.
        // Cropped to the middle 80% of its own height: the square left a band
        // of empty ground above and below the pages, which made the artwork
        // stand taller than the words beside it. Done here rather than in the
        // file, so the source stays the square it was drawn as.
        className="mx-auto aspect-[1254/1003] w-full max-w-[330px] max-lg:hidden object-cover object-center mix-blend-multiply [mask-composite:intersect] [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent),linear-gradient(to_bottom,transparent,#000_10%,#000_90%,transparent)]"
      />
    </div>
  );
}
