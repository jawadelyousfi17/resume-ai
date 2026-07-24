// Compiles a LaTeX document to PDF using Tectonic, invoked from the editor's
// Download action. Runs on the Node.js runtime because it shells out to the
// `tectonic` binary and touches the filesystem.

import { spawn } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export const runtime = "nodejs";
export const maxDuration = 60;

const TECTONIC_BIN = process.env.TECTONIC_BIN || "tectonic";

export async function POST(req: Request) {
  let tex: unknown;
  try {
    ({ tex } = await req.json());
  } catch {
    return jsonError("Invalid request body", 400);
  }

  if (typeof tex !== "string" || !tex.trim()) {
    return jsonError("Missing LaTeX source", 400);
  }

  const dir = await mkdtemp(join(tmpdir(), "resumeai-"));
  try {
    const input = join(dir, "resume.tex");
    await writeFile(input, tex, "utf8");
    await runTectonic(input, dir);
    const pdf = await readFile(join(dir, "resume.pdf"));

    return new Response(new Uint8Array(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return jsonError(
      err instanceof Error ? err.message : "Compilation failed",
      500,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

function runTectonic(input: string, outdir: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const proc = spawn(
      TECTONIC_BIN,
      [input, "--outdir", outdir, "--chatter", "minimal", "--keep-logs"],
      {
        // Ensure Homebrew/local install locations are on PATH for the server.
        env: {
          ...process.env,
          PATH: `${process.env.PATH ?? ""}:/opt/homebrew/bin:/usr/local/bin`,
        },
      },
    );

    let stderr = "";
    proc.stderr.on("data", (chunk) => (stderr += chunk.toString()));
    proc.on("error", (e) =>
      reject(
        e instanceof Error && "code" in e && e.code === "ENOENT"
          ? new Error("Tectonic is not installed on the server.")
          : e,
      ),
    );
    proc.on("close", (code) => {
      if (code === 0) return resolve();
      // Surface the most relevant TeX error line if we can find one.
      const line = stderr
        .split("\n")
        .find((l) => /error/i.test(l))
        ?.trim();
      reject(new Error(line || `Tectonic exited with code ${code}`));
    });
  });
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
