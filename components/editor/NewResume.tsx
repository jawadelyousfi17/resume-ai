"use client";

// The editor, open on a resume that doesn't exist yet.
//
// Everything the first save needs is already in the browser — a blank document
// wearing the template that was just chosen — so there is nothing to wait for.
// This renders the editor immediately and writes the row underneath it; when
// the id comes back the URL quietly becomes the real one and the store starts
// saving to it.

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { startResumeAction } from "@/app/actions/resumes";
import { createEmptyResume } from "@/lib/defaults";
import { takePendingResume } from "@/lib/pending-resume";
import type { Resume } from "@/lib/types";

import { Editor } from "./Editor";

export function NewResume({ mobile = false }: { mobile?: boolean }) {
  // Taken once, on the way in: the hand-off is consumed by opening the editor.
  // Landing here without one — a bookmarked URL, a refresh — is a blank resume
  // with the default template, which is what "new resume" means anyway.
  const [resume] = useState<Resume>(() => {
    const pending = takePendingResume();
    const draft = createEmptyResume();
    return pending ? { ...draft, ...pending } : draft;
  });

  const [id, setId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let live = true;
    void (async () => {
      const result = await startResumeAction({
        format: resume.format,
        data: resume.data,
      });
      if (!live) return;

      if (!result.ok) {
        toast.error(result.error, {
          description: "Your changes aren't being saved yet.",
        });
        return;
      }

      setId(result.id);
      // history, not the router: a real navigation would remount the editor
      // and take whatever has been typed with it. This only fixes the address,
      // so a refresh or a shared link lands on the stored resume.
      window.history.replaceState(null, "", `/resume/${result.id}`);
      // The dashboard's list is a page behind now.
      router.refresh();
    })();
    return () => {
      live = false;
    };
  }, [resume, router]);

  // `savingTo` is null until the insert answers, which is the store's signal
  // to hold edits rather than write them nowhere.
  return <Editor resume={resume} mobile={mobile} savingTo={id} />;
}
