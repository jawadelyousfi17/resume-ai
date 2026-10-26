import "server-only";
import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { prisma } from "./prisma";
import { Prisma } from "@/generated/prisma/client";
import { effectivePlan } from "./subscription";
import { normalizeStudentEmail, studentEmailTestMode, studentCodeHash, studentPlan, studentYearEnd } from "./student-policy";

export class StudentError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
const hashEmail = (email: string) => createHash("sha256").update(email).digest("hex");

async function transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try { return await prisma.$transaction(fn, { isolationLevel: "Serializable" }); }
    catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034" && attempt < 3) continue;
      throw error;
    }
  }
}

async function eligible(tx: Prisma.TransactionClient, userId: string, email: string) {
  if (await tx.studentClaim.findFirst({ where: { OR: [{ userId }, { emailHash: hashEmail(email) }] } })) {
    throw new StudentError("This account or student email has already claimed the offer.", 409);
  }
  const subscription = await tx.subscription.findUnique({ where: { userId } });
  if (effectivePlan(subscription) !== "free" || subscription?.subscriptionId) {
    throw new StudentError("This offer is for free accounts without a billing subscription. Contact support if you need help with your current plan.", 409);
  }
}

export async function sendStudentCode(userId: string, input: string) {
  const email = normalizeStudentEmail(input);
  if (!email) throw new StudentError(studentEmailTestMode() ? "Enter a valid email address." : "Use an eligible school email without a + alias. We accept .edu addresses and approved school domains.");
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new StudentError("Student verification is temporarily unavailable. Please try again later.", 503);
  const code = String(randomInt(10000000, 100000000));
  const codeHash = studentCodeHash(userId, email, code);
  const now = new Date();
  await transaction(async tx => {
    await eligible(tx, userId, email);
    for (const key of [`user:${userId}`, `email:${hashEmail(email)}`]) {
      const limit = await tx.studentEmailLimit.findUnique({ where: { key } });
      const sameDay = limit && now.getTime() - limit.windowStart.getTime() < 86400000;
      if (limit && (now.getTime() - limit.lastSentAt.getTime() < 60000 || (sameDay && limit.count >= 5))) {
        throw new StudentError("Please wait before requesting another code. You can request up to five codes per day.", 429);
      }
      const data = { windowStart: sameDay ? limit.windowStart : now, lastSentAt: now, count: sameDay ? limit.count + 1 : 1 };
      await tx.studentEmailLimit.upsert({ where: { key }, create: { key, ...data }, update: data });
    }
    const data = { email, codeHash, expiresAt: new Date(now.getTime() + 600000), attempts: 0 };
    await tx.studentVerification.upsert({ where: { userId }, create: { userId, ...data }, update: data });
  });
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json", "Idempotency-Key": `student-${userId}-${codeHash}` },
      body: JSON.stringify({ from, to: [email], subject: "Your MeniaCV student verification code", text: `Your verification code is ${code}.\n\nEnter it on the MeniaCV Students page to claim your free year. It expires in 10 minutes. If you didn't request this code, ignore this email.` }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error("Email delivery failed");
  } catch {
    await prisma.studentVerification.deleteMany({ where: { userId, codeHash } });
    throw new StudentError("We couldn't send your code. Please wait a minute and try again.", 502);
  }
}

export async function verifyStudentCode(userId: string, code: string) {
  if (!/^\d{8}$/.test(code)) throw new StudentError("Enter the eight-digit code from your email.");
  const result = await transaction(async tx => {
    const verification = await tx.studentVerification.findUnique({ where: { userId } });
    if (!verification || verification.expiresAt.getTime() <= Date.now() || verification.attempts >= 5) {
      return { error: "This code has expired or reached its attempt limit. Request a new code." };
    }
    const actual = studentCodeHash(userId, verification.email, code);
    if (!timingSafeEqual(Buffer.from(actual, "hex"), Buffer.from(verification.codeHash, "hex"))) {
      await tx.studentVerification.update({ where: { userId }, data: { attempts: { increment: 1 } } });
      return { error: "That code isn't correct. Check your email and try again." };
    }
    await eligible(tx, userId, verification.email);
    const expiresAt = studentYearEnd(new Date());
    await tx.studentClaim.create({ data: { userId, emailHash: hashEmail(verification.email), expiresAt } });
    const data = { plan: studentPlan(), status: "active" as const, cycle: "yearly" as const, currentPeriodEnd: expiresAt, cancelAtPeriodEnd: true };
    await tx.subscription.upsert({ where: { userId }, create: { userId, ...data }, update: data });
    await tx.studentVerification.delete({ where: { userId } });
    return { expiresAt: expiresAt.toISOString() };
  });
  if (result.error) throw new StudentError(result.error);
  return result;
}
