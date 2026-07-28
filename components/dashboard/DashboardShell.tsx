"use client";

// The furniture around everything you do while signed in: the sidebar on a
// desktop, the same places along the bottom on a phone, and the account menu.
//
// Extracted from <Dashboard> when the job tracker arrived — two pages wearing
// slightly different navigation is how a product starts to feel like two
// products.

import Link from "next/link";
import { useState, useTransition } from "react";

import { signOutAction } from "@/app/auth/actions";
import { useAuthDialog } from "@/components/auth/AuthDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog";
import { AccountAvatar } from "@/components/ui/account-avatar";
import { PlanBadge } from "@/components/ui/plan-badge";
import { BulbIcon, LogoutIcon, UserIcon } from "@/components/ui/icons";
import { LogoLockup } from "@/components/ui/logo";
import type { PlanId } from "@/lib/plans";

import {
  BottomNav,
  SidebarNav,
  type DashboardSection,
} from "./nav";

export type Account = {
  email: string;
  name: string | null;
  /** A provider photo, or the portrait minted when the account was created. */
  avatarUrl: string | null;
  /** What they're paying for, for the badge beside their name. */
  plan: PlanId;
} | null;

export function DashboardShell({
  account,
  active,
  children,
}: {
  account: Account;
  active: DashboardSection;
  children: React.ReactNode;
}) {
  const auth = useAuthDialog();
  const [, startTransition] = useTransition();
  const signOut = () => startTransition(() => signOutAction());
  // Held here rather than in each menu: both of them open the same dialog,
  // and it has to outlive the menu that opened it.
  const [feedback, setFeedback] = useState(false);

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-app pb-16 md:pb-0">
      {/* Sidebar — a phone gets the same places along the bottom instead.
          Pinned to the viewport rather than stretched to the page: a flex
          child takes the container's height, so with a screenful of resumes
          below the fold the account row sat at the bottom of the *document*
          and you had to scroll past everything to reach it. `h-dvh` + sticky
          keeps `mt-auto` meaning the bottom of the screen, and the column
          scrolls on its own if it ever outgrows one. */}
      <aside className="scroll-slim sticky top-0 hidden h-dvh w-60 shrink-0 flex-col overflow-y-auto border-r border-black/5 px-4 py-6 md:flex">
        <SidebarNav active={active} />

        <div className="mt-auto space-y-1 pt-6">
          {account ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-black/[0.03]"
                >
                  <AccountAvatar
                    src={account.avatarUrl}
                    name={account.name ?? account.email}
                    className="h-8 w-8"
                  />
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[14px] font-semibold text-ink">
                        {account.name ?? "My account"}
                      </span>
                      <PlanBadge plan={account.plan} />
                    </span>
                    <span className="block truncate text-[12px] text-ink-soft">
                      {account.email}
                    </span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <UserIcon />
                    Account and plan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setFeedback(true)}>
                  <BulbIcon />
                  Send feedback
                </DropdownMenuItem>
                {/* Called straight from the row — the action redirects, so
                    there's nothing here to wrap in a form. */}
                <DropdownMenuItem onSelect={signOut}>
                  <LogoutIcon />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="mt-2 rounded-xl bg-white p-3 shadow-sm">
              <p className="text-[12.5px] leading-relaxed text-ink-soft">
                You&rsquo;re working as a guest. Sign in to keep this and build
                more.
              </p>
              <button
                type="button"
                onClick={() => auth.open("signin")}
                className="mt-2.5 flex w-full items-center justify-center rounded-lg bg-navy px-3 py-2 text-[14px] font-bold text-white transition hover:bg-navy/90"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => auth.open("signup")}
                className="mt-1.5 flex w-full items-center justify-center rounded-lg px-3 py-2 text-[14px] font-bold text-ink-soft transition hover:text-ink"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-10 sm:py-8 lg:px-14">
        {/* The sidebar carries the wordmark on desktop; on a phone it rides
            above the page with the account beside it. */}
        <div className="mb-5 flex items-center justify-between md:hidden">
          <LogoLockup className="h-11" />
          <MobileAccount
            account={account}
            onSignOut={signOut}
            onFeedback={() => setFeedback(true)}
            onAuth={auth.open}
          />
        </div>

        {children}
      </main>

      <BottomNav active={active} />

      <FeedbackDialog open={feedback} onOpenChange={setFeedback} />
    </div>
  );
}

/** Account, or the way in, in the phone header. */
function MobileAccount({
  account,
  onSignOut,
  onFeedback,
  onAuth,
}: {
  account: Account;
  onSignOut: () => void;
  onFeedback: () => void;
  onAuth: (view: "signin" | "signup") => void;
}) {
  if (!account) {
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onAuth("signin")}
          className="h-9 rounded-lg px-3 text-[14px] font-bold text-ink-soft"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => onAuth("signup")}
          className="h-9 rounded-lg bg-navy px-3.5 text-[14px] font-bold text-white"
        >
          Sign up
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {/* The badge rides beside the portrait rather than on it: at this size
            a pill across the corner would cover half a face. */}
        <button
          type="button"
          aria-label="Account"
          className="flex shrink-0 items-center gap-2 rounded-full"
        >
          <PlanBadge plan={account.plan} />
          <AccountAvatar
            src={account.avatarUrl}
            name={account.name ?? account.email}
            className="h-10 w-10"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          {account.name ?? account.email}
        </DropdownMenuLabel>
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <UserIcon />
            Account and plan
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onFeedback}>
          <BulbIcon />
          Send feedback
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={onSignOut}>
          <LogoutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
