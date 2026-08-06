// Reviews a resume and answers with a scored report. Like translation this
// returns a document rather than a stream — there is nothing worth watching
// being written, and half a score is no use to anybody.
//
// The review itself lives in lib/ai/review-run, which the MCP server's
// `review_resume` tool calls too. What's left here is the part that is about
// HTTP and about this app's own users: the plan gate, the body, and turning a
// `ReviewError` into a status code.

import { ReviewError, runReview } from "@/lib/ai/review-run";
import { requireFeature } from "@/lib/subscription";
import type { ResumeData } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function POST(req: Request) {
  // Every call here spends money, so the route checks the session and the
  // plan itself.
  const denied = await requireFeature("review");
  if (denied) return denied;

  let body: { data?: ResumeData };
  try {
    body = (await req.json()) as { data?: ResumeData };
  } catch {
    return jsonError("Invalid request body", 400);
  }

  if (!body.data) return jsonError("Missing resume data", 400);

  try {
    const report = await runReview(body.data, req.signal);
    return Response.json(report, { headers: { "Cache-Control": "no-store" } });
  } catch (err) {
    if (err instanceof ReviewError) return jsonError(err.message, err.status);
    return jsonError(
      err instanceof Error ? err.message : "The review failed",
      500,
    );
  }
}

function jsonError(error: string, status: number) {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );
}
