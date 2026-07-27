"use client";

// Renders children on a white page that scales down to fit the available
// width, keeping the paper's true aspect ratio. Height tracks real content.
//
// It also shows where the paper runs out. The preview is one continuous sheet,
// but the PDF is cut every page-height — so a resume that spills onto a second
// page used to look fine right up until it was downloaded. A dashed line at
// each cut, and a count under the page, mean you know before you export.

import { useEffect, useRef, useState } from "react";
import { PAGE_SIZES } from "@/lib/defaults";
import type { PageFormat } from "@/lib/types";

export function PreviewCanvas({
  format = "A4",
  children,
}: {
  format?: PageFormat;
  children: React.ReactNode;
}) {
  const { width: PAGE_W, height: PAGE_H } = PAGE_SIZES[format];
  const wrapRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  /** The document's real height, in page pixels — before any scaling. */
  const [content, setContent] = useState(PAGE_H);

  useEffect(() => {
    const wrap = wrapRef.current;
    const page = pageRef.current;
    if (!wrap || !page) return;

    const compute = () => {
      const available = wrap.clientWidth;
      setScale(Math.min(1, available / PAGE_W));
      // offsetHeight is unaffected by the CSS transform, so it's the true height.
      setContent(page.offsetHeight);
    };

    const ro = new ResizeObserver(compute);
    ro.observe(wrap);
    ro.observe(page);
    compute();
    return () => ro.disconnect();
  }, [PAGE_W, PAGE_H]);

  // A couple of pixels over is rounding, not a second page.
  const pages = Math.max(1, Math.ceil((content - 2) / PAGE_H));
  const breaks = Array.from({ length: pages - 1 }, (_, i) => i + 1);

  return (
    <div ref={wrapRef} className="w-full">
      <div
        style={{ height: content * scale, width: PAGE_W * scale }}
        className="relative mx-auto"
      >
        <div
          ref={pageRef}
          className="resume-page bg-white shadow-[var(--shadow-paper)]"
          style={{
            width: PAGE_W,
            minHeight: PAGE_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>

        {/* Drawn outside the scaled page, so the label stays legible however
            far the paper has been shrunk to fit. */}
        {breaks.map((n) => (
          <div
            key={n}
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 flex items-center gap-2"
            style={{ top: n * PAGE_H * scale }}
          >
            <span className="h-0 flex-1 border-t border-dashed border-danger/50" />
            <span className="rounded bg-danger px-1.5 py-0.5 text-[10px] font-bold tracking-wide text-white">
              Page {n + 1}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-2.5 text-center text-[12px] font-semibold text-ink-faint">
        {pages === 1 ? "1 page" : `${pages} pages`}
      </p>
    </div>
  );
}
