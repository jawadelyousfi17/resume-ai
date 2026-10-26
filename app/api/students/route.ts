import { getAuthUser, requireUser } from "@/lib/auth";
import { sendStudentCode, StudentError, verifyStudentCode } from "@/lib/students";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const reply = (body: object, status = 200) => Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (request.headers.get("origin") !== new URL(request.url).origin) return reply({ error: "Invalid request origin." }, 403);
  if (!(await getAuthUser())) return reply({ error: "Sign in before claiming your free year." }, 401);
  let body;
  try { body = await request.json(); } catch { return reply({ error: "Invalid request." }, 400); }
  if (!body || typeof body !== "object") return reply({ error: "Invalid request." }, 400);
  try {
    const user = await requireUser();
    if (body.action === "send" && typeof body.email === "string") {
      await sendStudentCode(user.id, body.email);
      return reply({ sent: true });
    }
    if (body.action === "verify" && typeof body.code === "string") return reply(await verifyStudentCode(user.id, body.code.trim()));
    return reply({ error: "Invalid request." }, 400);
  } catch (error) {
    if (error instanceof StudentError) return reply({ error: error.message }, error.status);
    console.error("Student verification failed", error instanceof Error ? error.name : "Unknown error");
    return reply({ error: "We couldn't complete your request. Please try again." }, 500);
  }
}
