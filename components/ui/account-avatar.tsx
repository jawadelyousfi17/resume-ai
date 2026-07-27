// The signed-in person's portrait, wherever the account appears.
//
// A plain <img> rather than next/image, for the same reason the landing page's
// avatars are: these are remote SVGs, and putting them through the optimiser
// means turning on `dangerouslyAllowSVG`.

import { UserIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function AccountAvatar({
  src,
  name,
  className,
}: {
  /** Null for a guest, or an account minted before avatars existed and not
   *  yet backfilled — either way the glyph stands in. */
  src: string | null;
  name?: string | null;
  className?: string;
}) {
  const base = "shrink-0 overflow-hidden rounded-full bg-white object-cover";

  if (!src) {
    return (
      <span
        className={cn(base, "flex items-center justify-center text-ink-soft", className)}
      >
        <UserIcon className="h-1/2 w-1/2" />
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name ? `${name}'s avatar` : ""}
      aria-hidden={name ? undefined : true}
      loading="lazy"
      decoding="async"
      className={cn(base, className)}
    />
  );
}
