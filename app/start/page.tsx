import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getAuthUser, requireUser } from "@/lib/auth";
import { importResume } from "@/lib/resumes";
import { seedFromExample, seedFromTemplate } from "@/lib/start";
import { quotaDenial } from "@/lib/subscription";

// Where "Start from this example" and "Use this template" land.
//
// It renders nothing: it writes the resume the button promised and opens it.
// The whole flow is one navigation, including the sign-in — a signed-out
// visitor goes to /login carrying this URL as `next`, so the resume is waiting
// for them on the other side of it rather than an empty dashboard and the
// memory of which example they liked.
//
// Nothing links here with a prefetch (see `prefetch={false}` on every button
// that points at it), so the row is written on a real press and not on a
// hover. loading.tsx holds the screen while it happens.

export const metadata: Metadata = {
  // A URL whose only job is to redirect, and which writes a row when it's
  // fetched. Nothing to index, and nothing to follow either.
  robots: { index: false, follow: false },
};

export default async function StartPage(props: PageProps<"/start">) {
  const params = await props.searchParams;
  const example = first(params.example);
  const template = first(params.template);
  const accent = first(params.accent);

  // With an example, `template` and `accent` are what its switcher was showing
  // when the button was pressed — the resume opens looking like the one that
  // was on screen. On its own, `template` is the whole choice.
  const wanted = example
    ? {
        seed: seedFromExample(example, { template, accent }),
        // Everything that shaped the seed has to survive the sign-in, or they
        // come back to a resume they didn't choose.
        query: new URLSearchParams({
          example,
          ...(template ? { template } : {}),
          ...(accent ? { accent } : {}),
        }),
      }
    : template
      ? {
          seed: seedFromTemplate(template),
          query: new URLSearchParams({ template }),
        }
      : null;

  // A hand-typed slug, or a template that has since been retired. The gallery
  // it came from is a better answer than an error page.
  if (!wanted?.seed) {
    redirect(template ? "/resume-templates" : "/resume-examples");
  }

  const here = `/start?${wanted.query}`;
  if (!(await getAuthUser())) {
    redirect(`/login?next=${encodeURIComponent(here)}`);
  }

  const user = await requireUser();

  // Asked before the row is written, so a full plan is a trip to the upgrade
  // card rather than a resume that exists and can't be opened. The dashboard
  // puts up the same card the "New resume" button would have.
  const denied = await quotaDenial(user.id, "resumes");
  if (denied) redirect("/dashboard?full=resumes");

  const resume = await importResume(user.id, {
    name: wanted.seed.name,
    format: "A4",
    data: wanted.seed.data,
  });

  // No `?setup=`: the template was chosen by the press, and an example arrives
  // written — there is nothing the guided build would have to ask.
  redirect(`/resume/${resume.id}`);
}

/** Query params arrive as `string | string[]`; take the first value. */
function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
