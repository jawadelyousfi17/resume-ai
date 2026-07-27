"use client";

// A cropped, scaled page used as a card thumbnail — the same trick
// ResumeThumb plays, against the letter renderer.

import { useEffect, useRef, useState } from "react";
import { PAGE_SIZES } from "@/lib/defaults";
import { CoverLetterPreview } from "./CoverLetterPreview";
import type { CoverLetterData } from "@/lib/types";

const PAGE_W = PAGE_SIZES.A4.width;

export function LetterThumb({ data }: { data: CoverLetterData }) {
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
        className="resume-page absolute top-0 left-0"
        style={{
          width: PAGE_W,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <CoverLetterPreview data={data} />
      </div>
    </div>
  );
}
