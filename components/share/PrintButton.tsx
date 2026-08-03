"use client";

// "Save as PDF" on a shared link, which is the browser's own print dialog.
//
// Not the /api/compile route the editor downloads through: that starts a
// headless browser per press and is behind a session for exactly that reason,
// and a public URL anyone can reload is not somewhere to put it. The print
// stylesheet on the page next door takes the chrome off and prints the paper
// at its real size, so what comes out is the document.

import { DownloadIcon } from "@/components/ui/icons";

export function PrintButton({ className }: { className?: string }) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      <DownloadIcon className="h-[18px] w-[18px]" />
      Save as PDF
    </button>
  );
}
