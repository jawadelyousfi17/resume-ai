"use client";

// The resume as the sheets it will actually be printed on.
//
// This used to be one continuous strip with a dashed line drawn where the paper
// would run out. That told you a second page existed but not what it looked
// like: the export gives every sheet a margin at the foot, and every sheet
// after the first a margin at the head, and none of that was on screen. So the
// document is rendered once per sheet now and each one shows its own window of
// it, at the size and with the margins the PDF will have.
//
// The document itself is laid out exactly once — every sheet renders the same
// children and slides them under a clipping window — so nothing here can
// disagree with the renderer about how tall anything is.

import { useEffect, useMemo, useRef, useState } from "react";
import { DEFAULT_SETTINGS, PAGE_SIZES } from "@/lib/defaults";
import type { PageFormat } from "@/lib/types";

/** Millimetres to CSS pixels, at the 96dpi every browser assumes. */
const MM = 96 / 25.4;

/** A cut is nudged up by at most this much to clear a line of text. Past it
 *  the page would end conspicuously early, and a clipped line is the lesser
 *  of the two. */
const MAX_NUDGE = 140;

export function PreviewCanvas({
  format = "A4",
  guides = true,
  marginY = DEFAULT_SETTINGS.marginY,
  children,
}: {
  format?: PageFormat;
  /** The page count under the paper. On by default: it's what the editor
   *  needs. Off for the public view of a shared resume, where a reader has no
   *  export to be warned about. */
  guides?: boolean;
  /** The document's vertical margin, in millimetres. The export puts one under
   *  every page and over every page but the first, so it decides how much of
   *  the document each sheet holds. */
  marginY?: number;
  children: React.ReactNode;
}) {
  const { width: PAGE_W, height: PAGE_H } = PAGE_SIZES[format];
  const wrapRef = useRef<HTMLDivElement>(null);
  const docRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  /** Where the paper is cut, in document pixels. One entry per extra sheet. */
  const [cuts, setCuts] = useState<number[]>([]);

  const margin = marginY * MM;
  // What each sheet holds. The first pads its own head — which is what lets a
  // banded header bleed to the top edge — so it only loses its foot; the rest
  // lose both ends. Mirrors the `@page` block in app/print/[token].
  const firstFit = PAGE_H - margin;
  const restFit = PAGE_H - 2 * margin;

  useEffect(() => {
    const wrap = wrapRef.current;
    const doc = docRef.current;
    if (!wrap || !doc) return;

    const compute = () => {
      const available = wrap.clientWidth;
      setScale(Math.min(1, available / PAGE_W));
      // offsetHeight ignores the CSS transform, so it's the true height.
      setCuts(pageCuts(doc, doc.offsetHeight, firstFit, restFit));
    };

    const ro = new ResizeObserver(compute);
    ro.observe(wrap);
    ro.observe(doc);
    compute();
    return () => ro.disconnect();
    // `children` is in the deps because the cuts depend on what was laid out,
    // not only on how big the box around it is — a re-flow that leaves the
    // total height alone still moves the line the break lands on.
  }, [PAGE_W, firstFit, restFit, children]);

  /** For each sheet: how far into the document it starts, how tall its window
   *  is, and how far down the sheet that window sits. */
  const sheets = useMemo(() => {
    const stops = [0, ...cuts];
    return stops.map((start, i) => {
      const fit = i === 0 ? firstFit : restFit;
      // The window ends at the cut, not at the bottom of the page box. A cut
      // sits above the page's own foot whenever it had to come up to clear a
      // line, and a window that ran the full height would show the lines below
      // it — halved by the clip, and printed again at the top of the next
      // sheet. What's left under the cut is paper, which is what a page break
      // looks like.
      const next = cuts[i];
      return {
        start,
        top: i === 0 ? 0 : margin,
        height: next === undefined ? fit : Math.min(fit, next - start),
      };
    });
  }, [cuts, margin, firstFit, restFit]);

  return (
    <div ref={wrapRef} className="w-full">
      <div
        // Sized from a scale that only makes sense on screen. A page printing
        // this preview — /r/<slug> does — undoes it through these hooks; see
        // the print block there.
        data-preview-stage
        className="mx-auto flex flex-col items-center gap-5"
        style={{ width: PAGE_W * scale }}
      >
        {sheets.map((sheet, i) => (
          <div
            key={i}
            data-preview-page
            data-page-number={i + 1}
            className="resume-page relative shrink-0 overflow-hidden bg-white shadow-[var(--shadow-paper)]"
            style={{
              width: PAGE_W * scale,
              height: PAGE_H * scale,
              // Each sheet is its own page when this preview is printed.
              breakAfter: i === sheets.length - 1 ? undefined : "page",
            }}
          >
            <div
              data-preview-sheet
              style={{
                width: PAGE_W,
                height: PAGE_H,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              {/* The window: the band of the sheet this page's content may
                  occupy. Everything above and below it is the page margin, and
                  clipping here is what keeps the next page's first line out of
                  this page's foot. */}
              <div
                className="absolute inset-x-0 overflow-hidden"
                style={{ top: sheet.top, height: sheet.height }}
              >
                <div
                  // Only the first copy is measured; the rest are the same
                  // markup and would only ever agree with it.
                  ref={i === 0 ? docRef : undefined}
                  style={{
                    position: "absolute",
                    top: -sheet.start,
                    left: 0,
                    width: PAGE_W,
                  }}
                >
                  {children}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {guides && (
        <p className="mt-2.5 text-center text-[12px] font-semibold text-ink-faint">
          {sheets.length === 1 ? "1 page" : `${sheets.length} pages`}
        </p>
      )}
    </div>
  );
}

/**
 * Where to cut the document, in its own pixels.
 *
 * Walking down in fixed page-heights would slice through whatever happens to be
 * at that height — half a line of text, a bullet, a heading. The browser
 * doesn't do that when it paginates for print, so neither does this: every cut
 * is pulled up to clear anything it would have gone through.
 *
 * "Anything" means the leaves — a line of text, an image, a rule. Not their
 * containers: a sidebar runs the length of the document and a section is most
 * of a page, and a cut that refused to cross either would never land at all.
 */
function pageCuts(
  doc: HTMLElement,
  height: number,
  firstFit: number,
  restFit: number,
): number[] {
  const atoms = atomRects(doc);
  const cuts: number[] = [];
  let at = firstFit;

  // The +2 is rounding, not another page.
  while (at < height - 2 && cuts.length < 40) {
    const cut = clearOf(atoms, at);
    // A nudge that lands on or above the previous cut makes no progress and
    // would spin here forever; take the blunt cut instead.
    const safe = cut > (cuts.at(-1) ?? 0) + 1 ? cut : at;
    cuts.push(safe);
    at = safe + restFit;
  }
  return cuts;
}

/** The smallest thing at each position: text line boxes, images, and anything
 *  short enough to be a rule or a chip. Measured relative to the document. */
function atomRects(doc: HTMLElement): { top: number; bottom: number }[] {
  const origin = doc.getBoundingClientRect().top;
  const out: { top: number; bottom: number }[] = [];

  const push = (rect: DOMRect) => {
    if (rect.height <= 0 || rect.height > 400) return;
    out.push({ top: rect.top - origin, bottom: rect.bottom - origin });
  };

  const walker = document.createTreeWalker(doc, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.nodeValue?.trim()) continue;
    range.selectNodeContents(node);
    // One rect per line box, so a wrapped paragraph is a stack of lines a cut
    // can sit between rather than one block it must clear entirely.
    for (const rect of range.getClientRects()) push(rect as DOMRect);
  }
  for (const el of doc.querySelectorAll("img, svg, hr")) {
    push(el.getBoundingClientRect() as DOMRect);
  }
  return out;
}

/** `at`, moved up until nothing crosses it. */
function clearOf(
  atoms: { top: number; bottom: number }[],
  at: number,
): number {
  const floor = at - MAX_NUDGE;
  let cut = at;
  // Each nudge can uncover another straddler above it, so this settles rather
  // than resolving in one pass. The bound is the nudge limit, not the loop.
  for (let pass = 0; pass < 8; pass++) {
    let highest = cut;
    for (const a of atoms) {
      if (a.top < cut - 0.5 && a.bottom > cut + 0.5 && a.top < highest) {
        highest = a.top;
      }
    }
    if (highest === cut) break;
    if (highest <= floor) return at;
    cut = highest;
  }
  return cut;
}
