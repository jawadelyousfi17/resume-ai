// A real A4 page, scaled down to fit the marketing layout.
//
// The dashboard's <ResumeThumb> measures its box with a ResizeObserver, which
// makes it a client component. Here the widths are known up front, so the scale
// is a CSS variable set per breakpoint and the whole thing stays on the server.

import type { ResumeData } from "@/lib/types";
import { PAGE_SIZES } from "@/lib/defaults";
import { ResumePreview } from "@/components/preview/ResumePreview";
import { cn } from "@/lib/utils";

const PAGE_W = PAGE_SIZES.A4.width; // 794px

// Each entry pairs a rendered width with width / 794, so the page lands exactly
// inside its frame at every breakpoint.
const SIZES = {
  hero: "w-[290px] [--paper:0.365] sm:w-[360px] sm:[--paper:0.453] lg:w-[430px] lg:[--paper:0.5416] xl:w-[470px] xl:[--paper:0.5919]",
  card: "w-[190px] [--paper:0.2393] sm:w-[230px] sm:[--paper:0.2897]",
} as const;

export function ResumePaper({
  data,
  size = "card",
  className,
}: {
  data: ResumeData;
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative aspect-[210/297] shrink-0 overflow-hidden rounded-xl bg-white",
        SIZES[size],
        className,
      )}
      aria-hidden="true"
    >
      <div
        className="resume-page absolute top-0 left-0 origin-top-left"
        style={{
          width: PAGE_W,
          transform: "scale(var(--paper))",
        }}
      >
        <ResumePreview data={data} />
      </div>
    </div>
  );
}
