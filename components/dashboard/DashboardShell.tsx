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
import {
  BulbIcon,
  ChevronUpDownIcon,
  LogoutIcon,
  UserIcon,
} from "@/components/ui/icons";
import { LogoLockup } from "@/components/ui/logo";
import type { PlanId } from "@/lib/plans";

import { BottomNav, SidebarNav, type DashboardSection } from "./nav";

export type Account = {
  email: string;
  name: string | null;
  /** A provider photo, or the portrait minted when the account was created. */
  avatarUrl: string | null;
  /** What they're paying for, for the badge beside their name. */
  plan: PlanId;
} | null;

/** The bar across the top of a page: its name, a count, and the one action
 *  the page is for. The same shape as the editor's toolbar. */
export type PageHeader = {
  title: string;
  /** A number beside the title — how many resumes, letters, jobs. */
  count?: number;
  action?: React.ReactNode;
};

export function DashboardShell({
  account,
  active,
  header,
  children,
}: {
  account: Account;
  active: DashboardSection;
  header?: PageHeader;
  children: React.ReactNode;
}) {
  const auth = useAuthDialog();
  const [, startTransition] = useTransition();
  const signOut = () => startTransition(() => signOutAction());
  // Held here rather than in each menu: both of them open the same dialog,
  // and it has to outlive the menu that opened it.
  const [feedback, setFeedback] = useState(false);

  return (
    // White, not the cream `body` carries — the same surface the landing,
    // templates, examples and pricing pages moved to, so signing in doesn't
    // change what colour the product is. Full-bleed rather than on the centred
    // column, so a wide monitor doesn't show cream margins either side.
    <div className="min-h-dvh bg-panel">
      <div className="flex min-h-dvh w-full pb-16 md:pb-0">
        {/* Sidebar — a phone gets the same places along the bottom instead.
          Pinned to the viewport rather than stretched to the page: a flex
          child takes the container's height, so with a screenful of resumes
          below the fold the account row sat at the bottom of the *document*
          and you had to scroll past everything to reach it. `h-dvh` + sticky
          keeps `mt-auto` meaning the bottom of the screen, and the column
          scrolls on its own if it ever outgrows one. */}
        <aside className="scroll-slim sticky top-0 hidden h-dvh w-[248px] shrink-0 flex-col overflow-y-auto border-r border-divider bg-panel px-3 pb-4 md:flex">
          <SidebarNav
            active={active}
            top={
              <SidebarAccount
                account={account}
                onSignOut={signOut}
                onFeedback={() => setFeedback(true)}
                onAuth={auth.open}
              />
            }
          />

        </aside>

        <main className="flex min-w-0 flex-1 flex-col">
          {/* The editor's toolbar, for a page: title on the left, its action
              on the right, a hairline under it. On a phone the bottom bar
              already names the page, so it stays for screen readers only. */}
          {header && (
            <header className="sticky top-0 z-10 flex h-[72px] shrink-0 items-center gap-3 border-b border-divider bg-panel px-4 max-md:sr-only sm:px-10 lg:px-14">
              <h1 className="text-[22px] font-bold tracking-tight text-ink">
                {header.title}
              </h1>
              {header.count !== undefined && (
                <span className="rounded-full bg-canvas px-2.5 py-0.5 text-[13px] font-semibold text-ink-soft tabular-nums">
                  {header.count}
                </span>
              )}
              <span className="flex-1" />
              {header.action}
            </header>
          )}

          <div className="min-w-0 flex-1 px-4 py-5 sm:px-10 sm:py-8 lg:px-14">
          {/* The sidebar carries the wordmark on desktop; on a phone it rides
            above the page with the account beside it. */}
          <div className="mb-5 flex items-center justify-between md:hidden">
            <LogoLockup className="h-11" />
            <AccountMenu
              account={account}
              onSignOut={signOut}
              onFeedback={() => setFeedback(true)}
              onAuth={auth.open}
            />
          </div>

          {children}
          </div>
        </main>

        <BottomNav active={active} />

        <FeedbackDialog open={feedback} onOpenChange={setFeedback} />
      </div>
    </div>
  );
}

/** The account at the head of the sidebar: portrait, name and email, opening
 *  the account menu — or, for a guest, the way in. */
function SidebarAccount({
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
      <div className="flex w-full gap-1.5 px-1">
        <button
          type="button"
          onClick={() => onAuth("signin")}
          className="btn-fill h-10 flex-1 text-[14px] font-semibold transition"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => onAuth("signup")}
          className="btn-soft h-10 flex-1 text-[14px] font-semibold transition"
        >
          Sign up
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-[10px] px-2.5 py-2 text-left transition hover:bg-canvas aria-expanded:bg-canvas"
        >
          <AccountAvatar
            src={account.avatarUrl}
            name={account.name ?? account.email}
            className="h-9 w-9"
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-semibold text-ink">
              {account.name ?? "My account"}
            </span>
            <span className="block truncate text-[12px] text-ink-faint">
              {account.email}
            </span>
          </span>
          <ChevronUpDownIcon className="h-4 w-4 shrink-0 text-ink-faint" />
        </button>
      </DropdownMenuTrigger>
      <AccountItems
        align="start"
        onSignOut={onSignOut}
        onFeedback={onFeedback}
      />
    </DropdownMenu>
  );
}

/** The menu both account triggers open. */
function AccountItems({
  align,
  label,
  onSignOut,
  onFeedback,
}: {
  align: "start" | "end";
  label?: string;
  onSignOut: () => void;
  onFeedback: () => void;
}) {
  return (
    <DropdownMenuContent align={align} className="w-56">
      {label && (
        <DropdownMenuLabel className="truncate">{label}</DropdownMenuLabel>
      )}
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
      {/* Called straight from the row — the action redirects, so there's
          nothing here to wrap in a form. */}
      <DropdownMenuItem onSelect={onSignOut}>
        <LogoutIcon />
        Sign out
      </DropdownMenuItem>
    </DropdownMenuContent>
  );
}

/** The account, or the way in, in the phone's header row. */
function AccountMenu({
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
          className="btn-soft h-9 px-3.5 text-[14px] font-semibold"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => onAuth("signup")}
          className="h-9 btn-fill px-3.5 text-[14px] font-bold"
        >
          Sign up
        </button>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Account"
          className="flex shrink-0 items-center rounded-full"
        >
          <AccountAvatar
            src={account.avatarUrl}
            name={account.name ?? account.email}
            className="h-10 w-10"
          />
        </button>
      </DropdownMenuTrigger>
      <AccountItems
        align="end"
        label={account.name ?? account.email}
        onSignOut={onSignOut}
        onFeedback={onFeedback}
      />
    </DropdownMenu>
  );
}
