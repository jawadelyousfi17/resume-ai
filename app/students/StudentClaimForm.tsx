"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { btnPrimary } from "@/components/landing/ui";
import { CheckIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

const STEPS = ["Sign in", "Verify email", "Activated"];
const title = "font-editorial text-[30px] leading-tight font-normal tracking-[-0.025em] text-ink";
const field = "w-full rounded-xl border border-divider bg-panel px-4 py-3 text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:opacity-60";

function Steps({ current }: { current: number }) {
  return (
    <ol className="mb-7 flex items-center gap-2 text-[13px] font-medium">
      {STEPS.map((step, i) => (
        <li key={step} aria-current={i === current ? "step" : undefined} className={cn("flex items-center gap-2", i > current && "text-ink-soft")}>
          {i > 0 && <span aria-hidden className={cn("h-px w-4 sm:w-6", i <= current ? "bg-ink" : "bg-divider")} />}
          <span className={cn("grid h-6 w-6 place-items-center rounded-full text-[12px] tabular-nums", i < current || current === STEPS.length - 1 ? "bg-brand text-white" : i === current ? "bg-ink text-white" : "bg-panel ring-1 ring-divider")}>
            {i < current || current === STEPS.length - 1 ? <CheckIcon className="h-3.5 w-3.5" /> : i + 1}
          </span>
          <span className={cn(i !== current && "max-sm:sr-only")}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

function Panel({ step, heading, children }: { step?: number; heading: string; children: ReactNode }) {
  return <div className="space-y-5">{step !== undefined && <Steps current={step} />}<h2 className={title}>{heading}</h2>{children}</div>;
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });

export function StudentClaimForm({ signedIn, claimed, claimEnds, blocked, planName, testingEmails = false }: { testingEmails?: boolean; signedIn: boolean; claimed: boolean; claimEnds?: string; blocked: boolean; planName: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [activeUntil, setActiveUntil] = useState("");
  const [notice, setNotice] = useState("");
  const codeInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (sent) codeInput.current?.focus();
  }, [sent]);

  async function submit(action: "send" | "verify") {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const response = await fetch("/api/students", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, email, code }) });
      const result = await response.json();
      if (!response.ok) {
        if (response.status === 401) { router.push("/login?next=%2Fstudents"); return; }
        throw new Error(result.error || "Something went wrong. Please try again.");
      }
      if (action === "send") { setNotice(sent ? "New code sent." : ""); setSent(true); setCode(""); }
      else { setActiveUntil(result.expiresAt); router.refresh(); }
    } catch (err) { setError(err instanceof Error ? err.message : "Couldn't connect. Please try again."); }
    finally { setBusy(false); }
  }

  const ends = activeUntil || claimEnds;
  if (activeUntil || claimed) return <div role="status"><Panel step={2} heading={activeUntil ? `${planName} is active` : "Offer already claimed"}>
    {ends && <p className="text-ink-soft">Until {formatDate(ends)}</p>}
    <Link href="/dashboard" className={`${btnPrimary} w-full`}>Open dashboard</Link>
  </Panel></div>;
  if (blocked) return <Panel heading="You already have a plan">
    <p className="text-ink-soft">This offer is for free accounts.</p>
    <Link href="/contact" className={`${btnPrimary} w-full`}>Contact us</Link>
  </Panel>;
  if (!signedIn) return <Panel step={0} heading="Claim your free year">
    {testingEmails && <p className="text-sm text-ink-soft">Testing: any email address is accepted.</p>}
    <Link href="/login?next=%2Fstudents" className={`${btnPrimary} w-full`}>Sign in to claim</Link>
  </Panel>;
  return <form onSubmit={(event: FormEvent) => { event.preventDefault(); void submit(sent ? "verify" : "send"); }}>
    <Panel step={1} heading={sent ? "Enter your code" : "Verify your school email"}>
      {sent && <p className="text-ink-soft leading-relaxed">Sent to <span className="font-semibold text-ink">{email}</span></p>}
      {!sent ? <div className="space-y-2">
        <label htmlFor="student-email" className="block text-sm font-semibold text-ink">{testingEmails ? "Email address" : "School email"}</label>
        <input id="student-email" type="email" autoComplete="email" required maxLength={254} value={email} onChange={e => setEmail(e.target.value)} disabled={busy} placeholder={testingEmails ? "you@example.com" : "you@university.edu"} aria-describedby="email-help" className={field}/>
        <p id="email-help" className="text-sm text-ink-soft">{testingEmails ? "Testing: any email address is accepted." : ".edu or approved school domain, no + alias"}</p>
      </div> : <div className="space-y-2">
        <label htmlFor="student-code" className="block text-sm font-semibold text-ink">8-digit code</label>
        <input ref={codeInput} id="student-code" type="text" inputMode="numeric" autoComplete="one-time-code" required pattern="[0-9]{8}" maxLength={8} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ""))} disabled={busy} placeholder="••••••••" className={`${field} text-center font-mono text-2xl tracking-[0.4em] tabular-nums`}/>
        <p className="text-sm text-ink-soft">Expires in 10 minutes</p>
      </div>}
      {notice && <p role="status" className="text-sm text-ink-soft">{notice}</p>}
      {error && <p role="alert" className="rounded-xl bg-panel px-4 py-3 text-sm text-ink ring-1 ring-divider">{error}</p>}
      <button type="submit" disabled={busy || (sent && code.length !== 8)} className={`${btnPrimary} w-full disabled:cursor-not-allowed disabled:opacity-60`}>{busy ? "Please wait…" : sent ? "Verify & activate" : "Send code"}</button>
      {sent && <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm"><button type="button" disabled={busy} onClick={() => void submit("send")} className="underline underline-offset-4 disabled:opacity-60">Resend code</button><button type="button" disabled={busy} onClick={() => { setSent(false); setCode(""); setError(""); setNotice(""); }} className="underline underline-offset-4 disabled:opacity-60">Change email</button></div>}
    </Panel>
  </form>;
}
