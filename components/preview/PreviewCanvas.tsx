"use client";

// Renders children on a white A4 "page" that scales down to fit the available
// width, keeping the true A4 aspect ratio. Height tracks real content height.

import { useEffect, useRef, useState } from "react";

// A4 at 96dpi.
export const PAGE_W = 794;
export const PAGE_H = 1123;

export function PreviewCanvas({ children }: { children: React.ReactNode }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(PAGE_H);

  useEffect(() => {
    const wrap = wrapRef.current;
    const page = pageRef.current;
    if (!wrap || !page) return;

    const compute = () => {
      const available = wrap.clientWidth;
      const s = Math.min(1, available / PAGE_W);
      setScale(s);
      // offsetHeight is unaffected by the CSS transform, so it's the true height.
      setHeight(page.offsetHeight * s);
    };

    const ro = new ResizeObserver(compute);
    ro.observe(wrap);
    ro.observe(page);
    compute();
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="w-full">
      <div style={{ height }} className="mx-auto">
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
      </div>
    </div>
  );
}
