"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  signInAction,
  signInWithProviderAction,
  signUpAction,
  type AuthFormState,
} from "@/app/auth/actions";
import { OAUTH_PROVIDERS } from "@/lib/auth-providers";
import { Input, Label } from "@/components/ui/fields";
import { Spinner } from "@/components/ui/spinner";
import { GoogleMark, LinkedInMark } from "./ProviderIcons";

type Mode = "signin" | "signup";

const MARKS = {
  google: GoogleMark,
  linkedin_oidc: LinkedInMark,
} as const;

const COPY = {
  signin: {
    heading: "Sign in",
    submit: "Sign in",
    swapPrompt: "New here?",
    swapAction: "Create an account",
  },
  signup: {
    heading: "Create your account",
    submit: "Create account",
    swapPrompt: "Already have an account?",
    swapAction: "Sign in",
  },
} satisfies Record<Mode, Record<string, string>>;

export function AuthCard({
  next,
  error,
  initialMode = "signin",
}: {
  /** Where to land after signing in, carried through from the proxy. */
  next: string;
  /** A message from a failed OAuth round trip, passed back as a query param. */
  error?: string;
  /** Which form to open on — `/login?mode=signup` arrives on sign-up. */
  initialMode?: Mode;
}) {
  const [mode, setMode] = useState<Mode>(initialMode);
  // The providers are the path most people take, so the email and password
  // fields stay folded away until someone asks for them.
  const [showCredentials, setShowCredentials] = useState(false);
  const copy = COPY[mode];

  const swapMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setShowCredentials(false);
  };

  return (
    // Centred rather than flush left: on /login a flex parent does that, but in
    // the full-screen dialog the card is the only thing in a full-width box.
    <div className="mx-auto w-full max-w-[380px]">
      <h1 className="text-center text-2xl font-extrabold tracking-tight text-ink">
        {copy.heading}
      </h1>

      {error && <Alert>{error}</Alert>}

      <div className="mt-7 space-y-2.5">
        {OAUTH_PROVIDERS.map((provider) => {
          const Mark = MARKS[provider.id];
          return (
            <form key={provider.id} action={signInWithProviderAction}>
              <input type="hidden" name="provider" value={provider.id} />
              <input type="hidden" name="next" value={next} />
              <ProviderButton label={provider.label} mark={Mark} />
            </form>
          );
        })}
      </div>

      {showCredentials ? (
        /* Remounts on switch so a stale error doesn't hang around. */
        <CredentialsForm key={mode} mode={mode} next={next} />
      ) : (
        <button
          type="button"
          onClick={() => setShowCredentials(true)}
          className="mt-2.5 w-full rounded-xl px-4 py-3 text-[15px] font-bold text-ink-soft transition hover:text-ink"
        >
          Use email and password
        </button>
      )}

      <p className="mt-7 text-center text-[14px] text-ink-soft">
        {copy.swapPrompt}{" "}
        <button
          type="button"
          onClick={swapMode}
          className="font-bold text-brand hover:underline"
        >
          {copy.swapAction}
        </button>
      </p>
    </div>
  );
}

/**
 * The provider button, and what it does while the round trip is in flight.
 *
 * Handing off to Google is a full page load — a second or two of nothing on a
 * slow connection — so the button says where it's going and stops taking
 * presses rather than looking ignored.
 */
function ProviderButton({
  label,
  mark: Mark,
}: {
  label: string;
  mark: (props: { className?: string }) => React.ReactElement;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-black/10 bg-white px-4 py-3 text-[15px] font-bold text-ink transition hover:bg-black/[0.03] disabled:cursor-wait disabled:opacity-70"
    >
      {pending ? (
        <>
          <Spinner className="text-ink-soft" />
          Taking you to {label}…
        </>
      ) : (
        <>
          <Mark className="h-[18px] w-[18px]" />
          Continue with {label}
        </>
      )}
    </button>
  );
}

function CredentialsForm({ mode, next }: { mode: Mode; next: string }) {
  const [state, action, pending] = useActionState<AuthFormState, FormData>(
    mode === "signin" ? signInAction : signUpAction,
    {},
  );

  return (
    <form action={action} className="mt-5 space-y-4">
      <input type="hidden" name="next" value={next} />

      <label className="block">
        <Label>Email</Label>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          // Revealed on request, so put the cursor where they meant to go.
          autoFocus
          required
        />
      </label>

      <label className="block">
        <Label>Password</Label>
        <Input
          name="password"
          type="password"
          autoComplete={mode === "signin" ? "current-password" : "new-password"}
          placeholder={mode === "signup" ? "At least 8 characters" : "••••••••"}
          required
        />
      </label>

      {state.error && <Alert>{state.error}</Alert>}
      {state.notice && <Alert tone="info">{state.notice}</Alert>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-navy px-4 py-3 text-[15px] font-bold text-white transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? (
          <span className="inline-flex items-center gap-2">
            <Spinner className="text-white/70" />
            One moment…
          </span>
        ) : (
          COPY[mode].submit
        )}
      </button>
    </form>
  );
}

function Alert({
  children,
  tone = "error",
}: {
  children: React.ReactNode;
  tone?: "error" | "info";
}) {
  return (
    <p
      role="status"
      className={
        tone === "error"
          ? "mt-4 rounded-xl bg-danger/10 px-4 py-3 text-[14px] font-semibold text-danger"
          : "mt-4 rounded-xl bg-brand-soft px-4 py-3 text-[14px] font-semibold text-brand"
      }
    >
      {children}
    </p>
  );
}
