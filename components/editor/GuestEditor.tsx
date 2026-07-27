"use client";

// The editor for a signed-out visitor. Their resume lives in localStorage,
// which the server can't read, so it's subscribed to here rather than passed
// down from the page.

import { useEffect, useSyncExternalStore } from "react";
import {
  createGuestResume,
  guestResumeSnapshot,
  guestServerSnapshot,
  onGuestResumeChange,
} from "@/lib/guest";
import { Editor } from "./Editor";

export function GuestEditor({ mobile = false }: { mobile?: boolean }) {
  const resume = useSyncExternalStore(
    onGuestResumeChange,
    guestResumeSnapshot,
    guestServerSnapshot,
  );

  // Nothing stored yet — first visit, or they deleted it and came back. Start
  // one rather than showing an error; a guest at this URL wants to write.
  useEffect(() => {
    if (!resume) createGuestResume();
  }, [resume]);

  if (!resume) {
    return (
      <div className="flex h-dvh items-center justify-center text-ink-soft">
        Loading…
      </div>
    );
  }

  return <Editor resume={resume} guest mobile={mobile} />;
}
