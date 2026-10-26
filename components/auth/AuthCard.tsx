"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  signInAction,
  signInWithProviderAction,
  signUpAction,
  type AuthFormState,
} from "@/app/auth/actions";
import {
  CREDENTIALS_ENABLED,
  OAUTH_PROVIDERS,
  SIGN_IN_DISABLED,
} from "@/lib/auth-providers";
import { cn } from "@/lib/utils";
import { Input, Label } from "@/components/ui/fields";
import { Spinner } from "@/components/ui/spinner";
import { GoogleMark } from "./ProviderIcons";

type Mode = "signin" | "signup";

const MARKS = {
  google: GoogleMark,
} as const;

const COPY = {
  signin: {
    heading: "Welcome back",
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
    <div className="mx-auto w-full max-w-[360px]">
      <h1 className="text-center font-editorial text-[38px] leading-[1.08] font-normal tracking-[-0.025em] text-ink">
        {copy.heading}
      </h1>

      {error && <Alert>{error}</Alert>}

      <div className="mt-8 space-y-2.5">
        {OAUTH_PROVIDERS.map((provider) => {
          const Mark = MARKS[provider.id];

          // Switched off: the button stays where it was, greyed out and
          // labelled, so nobody wonders whether their account went with it.
          if (!provider.enabled) {
            return (
              <ClosedButton key={provider.id}>
                <Mark className="h-[18px] w-[18px] opacity-60" />
                Continue with {provider.label}
              </ClosedButton>
            );
          }

          return (
            <form key={provider.id} action={signInWithProviderAction}>
              <input type="hidden" name="provider" value={provider.id} />
              <input type="hidden" name="next" value={next} />
              <ProviderButton label={provider.label} mark={Mark} />
            </form>
          );
        })}
      </div>

      {/* Email and password, once it's open. Until then there's nothing to
          draw: a greyed "soon" row is one more thing to read on a card whose
          only job is the button above it. */}
      {!CREDENTIALS_ENABLED ? null : showCredentials ? (
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


      <p className="mt-6 text-center text-[14px] text-ink-soft">
        {copy.swapPrompt}{" "}
        <button
          type="button"
          onClick={swapMode}
          className="border-b border-ink pb-px font-semibold text-ink transition hover:border-transparent"
        >
          {copy.swapAction}
        </button>
      </p>
    </div>
  );
}

/**
 * A way in that isn't open yet.
 *
 * Shaped like the button it stands in for, so the card keeps its rhythm, but
 * inert and marked: greyed, "Soon" beside the label, and the reason on hover
 * for anyone who goes looking for one.
 */
function ClosedButton({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled
      title={SIGN_IN_DISABLED}
      className={cn(
        "flex w-full cursor-not-allowed items-center justify-center gap-2.5 rounded-full border border-divider bg-white/60 px-4 py-3 text-[15px] font-bold text-ink-faint",
        className,
      )}
    >
      {children}
      <span className="rounded-full bg-black/[0.06] px-2 py-0.5 text-[11px] font-bold tracking-wide uppercase">
        Soon
      </span>
    </button>
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
      className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full bg-white px-4 text-[15px] font-semibold text-ink ring-1 ring-ink transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
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
        className="w-full btn-fill px-4 py-3 text-[15px] font-bold transition disabled:opacity-60"
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
