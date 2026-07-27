"use client";

// The file you just handed over, being read.
//
// A spinner says "wait"; this says "we're reading *that*" — the actual upload
// is on screen, in its own paper frame, with the same band of light the editor
// sweeps over a resume while the review runs. The file never leaves the
// browser to be shown: it's drawn straight from the File object.

import { useEffect, useState } from "react";

import { ScanSweep } from "@/components/ui/scan-sweep";

/** Roughly what fits in the frame at this type size — reading the whole of a
 *  long file only to clip it would be waste. */
const TEXT_CHARS = 2600;

/** The passes the model makes, in the order the answer comes back. Timed, not
 *  reported: the API returns one document at the end, so this is honest about
 *  what's happening without pretending to track it. */
const STEPS = [
  "Reading the page…",
  "Finding your experience…",
  "Picking up skills and education…",
  "Laying it out…",
];

function isTextFile(file: File) {
  return file.type.startsWith("text/") || /\.(txt|md)$/i.test(file.name);
}

export function ImportScan({ file }: { file: File }) {
  const [text, setText] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  // A PDF or an image is pointed at by object URL, created and revoked by the
  // same effect.
  //
  // It has to be this way round. Making the URL during the render and revoking
  // it in a cleanup looks tidier, but Strict Mode mounts effects twice in
  // development: the first cleanup revoked the link and the second mount had
  // nothing to re-create it with, so every PDF and image showed as blank
  // paper. Owning both ends here means the second mount just makes a new one.
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (isTextFile(file)) return;
    const objectUrl = URL.createObjectURL(file);
    // The URL is an external resource whose lifetime is this effect's, so it
    // can't be derived during the render.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  // Text has no viewer to hand it to, so it's read into the frame itself.
  useEffect(() => {
    if (!isTextFile(file)) return;
    let live = true;
    void file.text().then((t) => live && setText(t.slice(0, TEXT_CHARS)));
    return () => {
      live = false;
    };
  }, [file]);

  // One step per sweep of the light, holding on the last one until the import
  // lands — which is usually well before the list runs out.
  useEffect(() => {
    const id = setInterval(
      () => setStep((s) => Math.min(s + 1, STEPS.length - 1)),
      2600,
    );
    return () => clearInterval(id);
  }, []);

  // Every check falls back to the extension: a browser only fills in `type`
  // from what the OS knows, and .webp in particular arrives with it empty on
  // plenty of machines — which left the file showing as blank paper.
  const image =
    file.type.startsWith("image/") ||
    /\.(png|jpe?g|webp|gif|avif|bmp)$/i.test(file.name);
  const pdf = file.type === "application/pdf" || /\.pdf$/i.test(file.name);

  return (
    <div className="flex flex-col items-center">
      {/* A4 proportions, so a page dropped into it looks like the page it is.
          Big enough to recognise your own resume in — that's the whole point
          of showing it rather than a spinner. */}
      <div className="relative aspect-[210/297] w-[248px] overflow-hidden rounded-lg bg-white shadow-[var(--shadow-paper)] ring-1 ring-black/5 sm:w-[320px]">
        {/* Underneath everything: a blank page, so a viewer that draws nothing
            still leaves paper for the light to cross. */}
        <PagePlaceholder />

        {image && url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        )}

        {pdf && url && (
          // The browser's own PDF viewer, fitted to the frame with its chrome
          // hidden. It ignores the pointer, so none of it is interactive and
          // the page underneath can't be scrolled by accident.
          <iframe
            src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH&page=1`}
            title=""
            aria-hidden
            className="pointer-events-none absolute inset-0 h-full w-full border-0"
          />
        )}

        {text !== null && (
          <p
            aria-hidden
            className="absolute inset-0 h-full w-full overflow-hidden bg-white p-4 text-[6.5px] leading-[1.7] whitespace-pre-wrap text-ink-soft"
          >
            {text}
          </p>
        )}

        <ScanSweep />
      </div>

      <p
        aria-live="polite"
        className="mt-5 text-center text-[15px] font-bold text-ink"
      >
        {STEPS[step]}
      </p>
      <p className="mt-1 max-w-[280px] truncate text-center text-[13px] text-ink-soft">
        {file.name}
      </p>
    </div>
  );
}

/** The paper the upload is drawn on: ruled lines that show only where nothing
 *  else covers them — a .txt still loading, or a PDF on a browser with no
 *  viewer. The light sweeps over it just the same. */
function PagePlaceholder() {
  return (
    <div aria-hidden className="absolute inset-0 space-y-1.5 p-4">
      <div className="h-1.5 w-1/2 rounded-full bg-ink-faint/30" />
      <div className="h-1 w-2/3 rounded-full bg-ink-faint/20" />
      <div className="h-6" />
      {["92%", "78%", "85%", "60%", "88%", "70%", "80%"].map((w, i) => (
        <div
          key={i}
          className="h-1 rounded-full bg-ink-faint/20"
          style={{ width: w }}
        />
      ))}
    </div>
  );
}
