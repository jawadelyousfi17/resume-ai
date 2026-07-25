import type { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Sign in — maniacv",
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
