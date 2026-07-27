"use client";

// Builds the PDF and hands it to the browser. Lives here rather than in a top
// bar because both bars — desktop and mobile — offer the same one action.

import { useState } from "react";
import { toast } from "sonner";

import { downloadBlob, slugify } from "@/lib/export";
import { useResume } from "@/lib/store";

export function useDownloadPdf() {
  const { name, data, format } = useResume();
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    const toastId = toast.loading("Building your PDF…");
    try {
      const res = await fetch("/api/compile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, format }),
      });
      if (!res.ok) {
        const info = await res.json().catch(() => ({}) as { error?: string });
        throw new Error(info.error || `Server error ${res.status}`);
      }
      downloadBlob(`${slugify(name)}.pdf`, await res.blob());
      toast.success("Downloaded resume.pdf", { id: toastId });
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
