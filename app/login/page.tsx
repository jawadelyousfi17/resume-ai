import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";

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
    <main className="flex min-h-dvh items-center justify-center px-6 py-12">
      <AuthCard
        next={first(params.next) ?? "/dashboard"}
        error={first(params.error)}
        initialMode={first(params.mode) === "signup" ? "signup" : "signin"}
      />
    </main>
  );
}

/** Query params arrive as `string | string[]`; take the first value. */
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
