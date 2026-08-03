import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PrintButton } from "@/components/share/PrintButton";
import { SharedResumeView } from "@/components/share/SharedResumeView";
import { btnCompact, btnPrimary, btnQuiet } from "@/components/landing/ui";
import { LogoLockup } from "@/components/ui/logo";
import { getSharedResume } from "@/lib/share";

// A resume behind a public link.
//
// Reached by anyone holding the URL, signed in or not — which is the whole
// point of it, and why the slug is a random token rather than the resume's id
// (see lib/share.ts). Nothing here can act on the document: it renders, it
// prints, and the only button that goes anywhere goes to the sign-up.
//
// Dynamic because the owner is in charge of it. Revoking a link, or fixing a
// typo, has to be true on the next press — a cached copy of a resume someone
// has withdrawn is the one outcome this page must not have.
export const dynamic = "force-dynamic";

export async function generateMetadata(
  props: PageProps<"/r/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const shared = await getSharedResume(slug);
  if (!shared) return { title: "Resume not found", robots: { index: false } };

  const { fullName, title } = shared.data.personal;
  const heading = fullName.trim() || shared.name;
  const description = title.trim()
    ? `${heading} — ${title.trim()}`
    : `The resume of ${heading}.`;

  return {
    title: `${heading} — Resume`,
    description,
    // Never indexed, and deliberately not blocked in robots.txt either: a
    // disallowed URL can still be listed bare from an inbound link, and it's
    // this tag — which a crawler has to fetch the page to read — that keeps
    // somebody's resume out of a search result. Whoever they sent it to can
    // still open it; that's the only audience a shared link has.
    robots: { index: false, follow: false },
    // Still worth describing properly: the link gets pasted into email and
    // chat, and those unfurl it whatever robots.txt says.
    openGraph: { title: `${heading} — Resume`, description, type: "profile" },
  };
}

export default async function SharedResumePage(props: PageProps<"/r/[slug]">) {
  const { slug } = await props.params;
  const shared = await getSharedResume(slug);

  // Unknown, or shared and then withdrawn. Both read as missing — a revoked
  // link should look like it never existed rather than confirm it did.
  if (!shared) notFound();

  return (
    <div className="flex min-h-dvh flex-col bg-cream">
      {/* Printing gives back the document on its own: the chrome comes off,
          and the canvas next door — which sizes itself to the window — is
          returned to the paper's real dimensions. */}
      <style>{`
        @media print {
          @page { margin: 0; }
          [data-share-chrome] { display: none !important; }
          [data-share-stage] { padding: 0 !important; }
          [data-preview-stage] { width: auto !important; height: auto !important; }
          [data-preview-page] {
            transform: none !important;
            box-shadow: none !important;
          }
          h2 { break-after: avoid; }
          li { break-inside: avoid; }
        }
      `}</style>

      <header
        data-share-chrome
        className="sticky top-0 z-10 border-b border-black/5 bg-cream/85 backdrop-blur-sm"
      >
        <div className="mx-auto flex w-full max-w-site items-center gap-3 px-5 py-3 sm:px-8">
          <Link href="/" aria-label="meniacv" className="shrink-0">
            <LogoLockup className="h-10" />
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <PrintButton
              className={`${btnQuiet} ${btnCompact} h-11 px-4 text-[14.5px]`}
            />
            <Link
              href="/dashboard"
              className={`${btnPrimary} ${btnCompact} h-11 px-4 text-[14.5px]`}
            >
              Build yours free
            </Link>
          </div>
        </div>
      </header>

      <main
        data-share-stage
        className="mx-auto w-full max-w-[860px] flex-1 px-4 py-6 sm:px-8 sm:py-10"
      >
        <SharedResumeView data={shared.data} format={shared.format} />
      </main>

      <footer
        data-share-chrome
        className="border-t border-black/5 px-5 py-6 text-center text-[13.5px] text-ink-soft"
      >
        Made with{" "}
        <Link href="/" className="font-bold text-ink hover:text-brand">
          meniacv
        </Link>{" "}
        — write and share a resume like this one,{" "}
        <Link href="/dashboard" className="font-bold text-ink hover:text-brand">
          free
        </Link>
        .
      </footer>
    </div>
  );
}
