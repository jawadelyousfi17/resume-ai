"use client";

// The furniture around everything you do while signed in: the sidebar on a
// desktop, the same places along the bottom on a phone, and the account menu.
//
// Extracted from <Dashboard> when the job tracker arrived — two pages wearing
// slightly different navigation is how a product starts to feel like two
// products.

import Link from "next/link";
import { useTransition } from "react";

import { signOutAction } from "@/app/auth/actions";
import { useAuthDialog } from "@/components/auth/AuthDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutIcon, UserIcon } from "@/components/ui/icons";
import { LogoLockup } from "@/components/ui/logo";

import {
  BottomNav,
  NAV_FOOTER,
  SidebarNav,
  type DashboardSection,
} from "./nav";

export type Account = { email: string; name: string | null } | null;

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

  return (
    <div className="flex min-h-dvh pb-16 md:pb-0">
      {/* Sidebar — a phone gets the same places along the bottom instead. */}
      <aside className="hidden w-60 shrink-0 flex-col border-r border-black/5 px-4 py-6 md:flex">
        <SidebarNav active={active} />

        <div className="mt-auto space-y-1 pt-6">
          {NAV_FOOTER.map((item) => {
            const Icon = item.icon;
            const className =
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] font-semibold text-ink-soft transition hover:text-ink";

            return item.href ? (
              <Link key={item.label} href={item.href} className={className}>
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </Link>
            ) : (
              <button key={item.label} type="button" className={className}>
                <Icon className="h-[18px] w-[18px]" />
                {item.label}
              </button>
            );
          })}

          {account ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="mt-2 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left transition hover:bg-black/[0.03]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-ink-soft">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold text-ink">
                      {account.name ?? "My account"}
                    </span>
                    <span className="block truncate text-[12px] text-ink-soft">
                      {account.email}
                    </span>
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
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
            onAuth={auth.open}
          />
        </div>

        {children}
      </main>

      <BottomNav active={active} />
    </div>
  );
}

/** Account, or the way in, in the phone header. */
function MobileAccount({
  account,
  onSignOut,
  onAuth,
}: {
  account: Account;
  onSignOut: () => void;
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
        <button
          type="button"
          aria-label="Account"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink-soft shadow-sm"
        >
          <UserIcon className="h-5 w-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="truncate">
          {account.name ?? account.email}
        </DropdownMenuLabel>
        {NAV_FOOTER.map((item) => {
          const Icon = item.icon;
          return (
            <DropdownMenuItem key={item.label} asChild={!!item.href}>
              {item.href ? (
                <Link href={item.href}>
                  <Icon />
                  {item.label}
                </Link>
              ) : (
                <>
                  <Icon />
                  {item.label}
                </>
              )}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuItem onSelect={onSignOut}>
          <LogoutIcon />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
