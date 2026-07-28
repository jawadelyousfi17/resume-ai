"use client";

// Telling us how it's going: five faces, a box, a button.
//
// The rating is the whole answer for most people — one tap and they're done —
// and the box is there for whoever has more to say. Asked for in that order on
// purpose: a dialog that opens on an empty textarea gets closed.
//
// One dialog for both ways in: the account menu opens it cold, and the nudge
// opens it after something has gone right, passing its own heading and a way
// to say not now. See lib/feedback-nudge.

import { useState, useTransition } from "react";
import { usePathname } from "next/navigation";

import { sendFeedbackAction } from "@/app/actions/feedback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { promptFor, RATINGS } from "@/lib/feedback-ratings";
import { cn } from "@/lib/utils";

export function FeedbackDialog({
  open,
  onOpenChange,
  title = "How's it going?",
  intro = "One tap is a complete answer. The box is there if you want it.",
  /** Whatever the opener wants under the button — the nudge puts its "not
   *  now" and its checkbox there. */
  footer,
  /** Called after a message has actually been stored. */
  onSent,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  intro?: string;
  footer?: React.ReactNode;
  onSent?: () => void;
}) {
  const path = usePathname();
  const [rating, setRating] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [pending, startTransition] = useTransition();

  const close = (next: boolean) => {
    if (pending) return;
    onOpenChange(next);
    // Cleared on the way out, so reopening doesn't hand back the last answer.
    if (!next) {
      setRating(null);
      setMessage("");
    }
  };

  const send = () => {
    if (rating === null) return;
    startTransition(async () => {
      const result = await sendFeedbackAction({ rating, message, path });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      toast.success("Thank you — that's with us", {
        description: "Every one of these is read by a person.",
      });
      onSent?.();
      close(false);
    });
  };

  return (
    <Dialog open={open} onOpenChange={close}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogTitle className="text-[19px] leading-snug font-extrabold tracking-tight text-ink">
          {title}
        </DialogTitle>
        <DialogDescription className="text-[14px] leading-relaxed text-ink-soft">
          {intro}
        </DialogDescription>

        {/* A radio group in behaviour as well as in name: arrow keys move
            between the faces, and the whole row is one tab stop. */}
        <div
          role="radiogroup"
          aria-label="How it's going"
          className="flex justify-between gap-1"
        >
          {RATINGS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={rating === option.value}
              aria-label={option.label}
              onClick={() => setRating(option.value)}
              className={cn(
                "flex flex-1 flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 transition",
                rating === option.value
                  ? "bg-brand-soft"
                  : "hover:bg-black/[0.03]",
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "text-[26px] leading-none transition",
                  // The unchosen faces stand back rather than disappear: they
                  // still have to be readable to be choosable.
                  rating !== null && rating !== option.value
                    ? "opacity-40 grayscale"
                    : "opacity-100",
                )}
              >
                {option.emoji}
              </span>
              <span
                className={cn(
                  "text-[11.5px] font-bold",
                  rating === option.value ? "text-brand" : "text-ink-faint",
                )}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>

        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={promptFor(rating)}
          rows={3}
          maxLength={4000}
          className="min-h-24 text-[14.5px]"
        />

        <button
          type="button"
          onClick={send}
          disabled={pending || rating === null}
          className="h-12 w-full rounded-xl bg-navy text-[15px] font-bold text-white transition hover:opacity-90 disabled:opacity-45"
        >
          {pending ? (
            <span className="inline-flex items-center gap-2">
              <Spinner className="text-white/70" />
              Sending…
            </span>
          ) : (
            "Send"
          )}
        </button>

        {footer}
      </DialogContent>
    </Dialog>
  );
}
