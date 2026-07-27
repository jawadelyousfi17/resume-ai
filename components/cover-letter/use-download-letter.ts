"use client";

// Builds the letter's PDF and hands it to the browser — the resume's
// `use-download-pdf` pointed at the letter route.

import { useState } from "react";
import { toast } from "@/components/ui/toast";

import { compileError, downloadBlob, slugify } from "@/lib/export";
import { useLetter } from "@/lib/letter-store";

export function useDownloadLetter() {
  const { name, data, format } = useLetter();
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    const toastId = toast.loading("Building your PDF…");
    try {
      const res = await fetch("/api/compile/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, format }),
      });
      if (!res.ok) {
        const { message, detail } = await compileError(res);
        toast.error(message, { id: toastId, description: detail });
        return;
      }
      downloadBlob(`${slugify(name)}.pdf`, await res.blob());
      toast.success("Downloaded your cover letter", { id: toastId });
    } catch (err) {
      toast.error("Couldn't build the PDF", {
        id: toastId,
        description:
          err instanceof Error ? err.message.slice(0, 160) : undefined,
      });
    } finally {
      setBusy(false);
    }
  };

  return { download, busy };
}
