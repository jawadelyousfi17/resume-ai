import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/AuthCard";
import { Wordmark } from "@/components/landing/marks";

export const metadata: Metadata = {
  title: "Sign in — meniacv",
  // App routes shouldn't compete with the marketing pages for the brand query.
  // `follow` so the links out of here still pass value; robots.txt no longer
  // blocks the path, because a page Google can't fetch is a page it can't see
  // this tag on — and a blocked URL can still be indexed, bare, from links.
  robots: { index: false, follow: true },
};

export default async function LoginPage(props: PageProps<"/login">) {
  const params = await props.searchParams;

  return (
    // One column and nothing else: the logo, the form, two links. The landing
    // page's palette (`data-landing`, app/globals.css), since signing in is
    // the step between the two.
    <main
      data-landing
      className="flex min-h-dvh flex-col bg-panel px-6 py-6 sm:px-10"
    >
      <Link href="/" aria-label="meniacv home" className="self-start">
        <Wordmark className="h-9" />
      </Link>

      <div className="flex flex-1 items-center justify-center py-12">
        <AuthCard
          next={first(params.next) ?? "/dashboard"}
          error={first(params.error)}
          initialMode={first(params.mode) === "signup" ? "signup" : "signin"}
        />
      </div>

      <nav className="flex justify-center gap-5 text-[12.5px] text-ink-faint">
        <Link href="/terms" className="transition hover:text-ink">
          Terms
        </Link>
        <Link href="/privacy" className="transition hover:text-ink">
          Privacy
        </Link>
      </nav>
    </main>
  );
}

/** Query params arrive as `string | string[]`; take the first value. */
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
