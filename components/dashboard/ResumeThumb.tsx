"use client";

// A cropped, scaled A4 preview used as a card thumbnail on the dashboard.

import { useEffect, useRef, useState } from "react";
import { PAGE_SIZES } from "@/lib/defaults";

// Thumbnails are always drawn at A4 width; the card scales them down anyway.
const PAGE_W = PAGE_SIZES.A4.width;
import { ResumePreview } from "@/components/preview/ResumePreview";
import type { ResumeData } from "@/lib/types";

export function ResumeThumb({ data }: { data: ResumeData }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.25);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setScale(el.clientWidth / PAGE_W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="relative aspect-[210/297] w-full overflow-hidden rounded-lg bg-white"
    >
      <div
        className="resume-page absolute left-0 top-0"
        style={{
          width: PAGE_W,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <ResumePreview data={data} />
      </div>
    </div>
  );
}
