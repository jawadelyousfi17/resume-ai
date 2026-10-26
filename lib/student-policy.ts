import { createHmac } from "node:crypto";

export function studentEmailTestMode() {
  return process.env.STUDENT_ALLOW_ALL_EMAILS === "true";
}

export function normalizeStudentEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(email)) return null;
  const [local, domain] = email.split("@");
  if (local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..") || domain.includes("..")) return null;
  if (!/^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(domain)) return null;
  if (studentEmailTestMode()) return email;
  if (local.includes("+")) return null;
  const allowed = (process.env.STUDENT_EMAIL_DOMAINS ?? "").split(",").map(d => d.trim().toLowerCase()).filter(Boolean);
  return /^(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+edu$/.test(domain) || allowed.includes(domain) ? email : null;
}

export function studentCodeHash(userId: string, email: string, code: string) {
  const secret = process.env.RESEND_API_KEY;
  if (!secret) throw new Error("Resend is not configured");
  return createHmac("sha256", secret).update(`${userId}:${email}:${code}`).digest("hex");
}

export function studentYearEnd(now: Date) {
  const end = new Date(now);
  end.setUTCFullYear(end.getUTCFullYear() + 1);
  // February 29 expires on February 28 in a non-leap year.
  if (end.getUTCMonth() !== now.getUTCMonth()) end.setUTCDate(0);
  return end;
}

export function studentPlan(): "basic" | "ultimate" {
  return process.env.STUDENT_PLAN === "basic" ? "basic" : "ultimate";
}
