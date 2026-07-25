// TEMPORARY: compiles every template to PDF into .pdfs/ so the output can be
// eyeballed. Delete.
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

import { generateLatex } from "@/lib/latex";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { SAMPLE_RESUME } from "@/components/landing/sample-resume";

export const runtime = "nodejs";
export const maxDuration = 600;

function run(input: string, outdir: string): Promise<string | null> {
  return new Promise((resolve) => {
    const proc = spawn(
      process.env.TECTONIC_BIN || "tectonic",
      [input, "--outdir", outdir, "--chatter", "minimal", "--keep-logs"],
      {
        env: {
          ...process.env,
          PATH: [process.env.PATH ?? "", join(homedir(), ".local/bin")].join(":"),
        },
      },
    );
    let err = "";
    proc.stderr.on("data", (c) => (err += c.toString()));
    proc.on("error", (e) => resolve(e.message));
    proc.on("close", (code) =>
      resolve(
        code === 0
          ? null
          : err.split("\n").filter((l) => /error/i.test(l)).slice(0, 3).join(" // ") ||
              `exit ${code}`,
      ),
    );
  });
}

export async function GET(req: Request) {
  const only = new URL(req.url).searchParams.get("id");
  const dir = join(process.cwd(), ".pdfs");
  await mkdir(dir, { recursive: true });

  const list = only ? TEMPLATES.filter((t) => t.id === only) : TEMPLATES;
  const results: { id: string; error: string | null }[] = [];

  for (const template of list) {
    const t = getTemplate(template.id);
    const data = {
      ...SAMPLE_RESUME,
      settings: {
        ...SAMPLE_RESUME.settings,
        template: template.id,
        fontFamily: t.presets.fontFamily,
        headingStyle: t.presets.headingStyle,
        accent: t.accent ?? SAMPLE_RESUME.settings.accent,
      },
    };
    const tex = join(dir, `${template.id}.tex`);
    await writeFile(tex, generateLatex({ name: template.id, data }));
    results.push({ id: template.id, error: await run(tex, dir) });
  }

  return Response.json({
    ok: results.filter((r) => !r.error).length,
    total: results.length,
    failures: results.filter((r) => r.error),
  });
}
