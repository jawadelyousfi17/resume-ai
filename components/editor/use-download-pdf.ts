"use client";

// Builds the PDF and hands it to the browser. Lives here rather than in a top
// bar because both bars — desktop and mobile — offer the same one action. The
// build itself is `downloadResumePdf`, shared with the dashboard's card menu.

import { useState } from "react";

import { downloadResumePdf } from "@/lib/export";
import { useResume } from "@/lib/store";

export function useDownloadPdf() {
  const { name, data, format } = useResume();
  const [busy, setBusy] = useState(false);

  const download = async () => {
    setBusy(true);
    try {
      await downloadResumePdf({ name, data, format });
    } finally {
      setBusy(false);
    }
  };

  return { download, busy };
}
