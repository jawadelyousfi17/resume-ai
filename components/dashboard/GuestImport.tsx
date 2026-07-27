"use client";

// Carries a resume built while signed out into the new account.
//
// The handover can only happen here: the resume is in localStorage, which the
// sign-in flow on the server never sees. This mounts on the dashboard once a
// session exists, hands the document to a Server Action, and only clears the
// local copy after the write is confirmed — a failed import leaves the work
// exactly where it was.

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { deleteGuestResume, readGuestResume } from "@/lib/guest";
import { importResumeAction } from "@/app/actions/resumes";

export function GuestImport() {
  const router = useRouter();
  // Strict Mode mounts effects twice in development; without this the same
  // resume would be imported two times.
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    const resume = readGuestResume();
    if (!resume) return;

    started.current = true;

    void (async () => {
      const result = await importResumeAction({
        name: resume.name,
        format: resume.format,
        data: resume.data,
      });

      if (!result.ok) {
        toast.error("Couldn't save your resume to your account", {
          description: `${result.error} It's still here in this browser.`,
        });
        // Left in localStorage on purpose, so the next visit tries again.
        started.current = false;
        return;
      }

      deleteGuestResume();
      toast.success("Saved to your account", {
        description: "The resume you started is now in your resumes.",
      });
      router.refresh();
    })();
  }, [router]);

  // Nothing to show: the toasts report both outcomes, and the imported resume
  // appears in the grid when the refresh lands.
  return null;
}
