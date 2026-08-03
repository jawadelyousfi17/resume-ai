"use client";

// Making a resume public, and taking it back.
//
// One dialog for both places a resume can be shared from — the dashboard card
// and the editor's top bar — so the promise made about the link is written
// once. It owns the link's state while it's open and tells its caller on the
// way out, since the dashboard and the editor each hold the resume differently.

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/fields";
import { Spinner } from "@/components/ui/spinner";
import {
  CheckIcon,
  CopyIcon,
  ExternalLinkIcon,
  LinkIcon,
} from "@/components/ui/icons";
import { toast } from "@/components/ui/toast";
import {
  shareResumeAction,
  unshareResumeAction,
} from "@/app/actions/resumes";
import { formatRelative } from "@/lib/relative-time";
import type { ShareLink } from "@/lib/types";

/** The resume a share dialog is about — as much of one as it needs. */
export interface Shareable {
  id: string;
  name: string;
  share?: ShareLink | null;
}

export function ShareDialog({
  resume,
  onClose,
  onChange,
}: {
  /** The resume being shared, or null when the dialog is closed. */
  resume: Shareable | null;
  onClose: () => void;
  /** The link as it now stands, for whoever is holding this resume. */
  onChange?: (share: ShareLink | null) => void;
}) {
  if (!resume) return null;
  // Keyed on the resume so the panel starts from that resume's link each time
  // it opens, rather than an effect syncing state to a prop.
  return (
    <SharePanel
      key={resume.id}
      resume={resume}
      onClose={onClose}
      onChange={onChange}
    />
  );
}

function SharePanel({
  resume,
  onClose,
  onChange,
}: {
  resume: Shareable;
  onClose: () => void;
  onChange?: (share: ShareLink | null) => void;
}) {
  const [share, setShare] = useState<ShareLink | null>(resume.share ?? null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);

  // Built from wherever the app is actually being used, so a link copied on a
  // preview deployment points at that deployment rather than at production.
  const url = share
    ? `${typeof window === "undefined" ? "" : window.location.origin}/r/${share.slug}`
    : "";

  const settle = (next: ShareLink | null) => {
    setShare(next);
    setCopied(false);
    onChange?.(next);
  };

  const create = async () => {
    setBusy(true);
    const result = await shareResumeAction(resume.id);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    settle(result.share);
    // Straight to the clipboard: a link is made in order to be pasted, and
    // the copy button is still there for the second time.
    void copy(`${window.location.origin}/r/${result.share.slug}`);
  };

  const stop = async () => {
    setBusy(true);
    const result = await unshareResumeAction(resume.id);
    setBusy(false);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    settle(null);
    toast.success("Link turned off", {
      description: "Anyone who had it now sees a page that no longer exists.",
    });
  };

  const copy = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      toast.success("Link copied");
    } catch {
      // Clipboard access can be refused — an insecure origin, or a browser
      // that only allows it straight off a gesture. The field is right there
      // and already selectable, so say so rather than failing silently.
      toast.error("Couldn't copy the link", {
        description: "Select it in the box and copy it by hand.",
      });
    }
  };

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[480px] p-7 sm:max-w-[480px]">
        <DialogTitle className="flex items-center gap-2 text-[21px] font-extrabold tracking-tight text-ink">
          <LinkIcon className="h-5 w-5 text-brand" />
          Share &ldquo;{resume.name}&rdquo;
        </DialogTitle>

        {share ? (
          <>
            <DialogDescription className="text-[14.5px] leading-relaxed text-ink-soft">
              Anyone with this link can read this resume — no account needed.
              Search engines are told not to index it, and the page always shows
              the latest version, so an edit reaches everyone who has the link.
            </DialogDescription>

            <div className="flex gap-2">
              <Input
                readOnly
                value={url}
                aria-label="Public link"
                onFocus={(e) => e.currentTarget.select()}
                className="flex-1 text-[13.5px]"
              />
              <button
                type="button"
                onClick={() => void copy(url)}
                className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-navy px-4 text-[14.5px] font-bold text-white transition hover:bg-navy/90"
              >
                {copied ? (
                  <CheckIcon className="h-[18px] w-[18px]" />
                ) : (
                  <CopyIcon className="h-[18px] w-[18px]" />
                )}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-3">
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-[14px] font-bold text-ink-soft transition hover:text-ink"
              >
                <ExternalLinkIcon className="h-4 w-4" />
                Open the public page
              </a>
              <span className="text-[13px] text-ink-faint">
                shared {formatRelative(share.sharedAt)}
              </span>
            </div>

            <div className="flex items-center justify-end gap-1 border-t border-black/5 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2.5 text-[14.5px] font-bold text-ink-soft transition hover:text-ink"
              >
                Done
              </button>
              <button
                type="button"
                onClick={() => void stop()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[14.5px] font-bold text-danger transition hover:bg-danger/10 disabled:opacity-50"
              >
                {busy && <Spinner className="h-4 w-4" />}
                Stop sharing
              </button>
            </div>
          </>
        ) : (
          <>
            <DialogDescription className="text-[14.5px] leading-relaxed text-ink-soft">
              Turn this resume into a page you can send to anyone — a recruiter,
              a hiring manager, a friend reading it over. The link is a random
              one nobody can guess, it isn&rsquo;t indexed by search engines,
              and you can turn it off here whenever you like.
            </DialogDescription>

            <div className="flex items-center justify-end gap-1">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2.5 text-[14.5px] font-bold text-ink-soft transition hover:text-ink"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void create()}
                disabled={busy}
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2.5 text-[14.5px] font-bold text-white transition hover:bg-navy/90 disabled:opacity-50"
              >
                {busy ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <LinkIcon className="h-[18px] w-[18px]" />
                )}
                {busy ? "Creating…" : "Create link"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
