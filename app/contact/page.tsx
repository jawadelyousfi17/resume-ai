import type { Metadata } from "next";
import Link from "next/link";

import {
  Column,
  ContentPage,
  PageHeader,
} from "@/components/content/ContentShell";
import { panel } from "@/components/landing/ui";
import { MailIcon } from "@/components/ui/icons";
import { CONTACT } from "@/lib/site-contact";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact meniacv — email and phone",
  description: `Get in touch about meniacv: ${CONTACT.email}, or ${CONTACT.phone}. One person answers, usually within a day or two.`,
  alternates: { canonical: "/contact" },
};

// Two ways to reach a person, and no form pretending to be a third. The
// address and number live in lib/site-contact so the footer says the same.

function PhoneGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} aria-hidden="true">
      <path
        d="M5.4 2.2 6.8 5 5.5 6.3a8 8 0 0 0 4.2 4.2L11 9.2l2.8 1.4v2.2c0 .6-.5 1.1-1.1 1a11.5 11.5 0 0 1-10.5-10.5c0-.6.4-1.1 1-1.1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <ContentPage>
      <Column>
        <PageHeader
          title="Get in touch"
          intro="One person builds and answers for meniacv, so there's no queue and no ticket number — just a reply."
        />

        <div className="mt-10 grid max-w-[72ch] gap-4 sm:grid-cols-2">
          <a
            href={`mailto:${CONTACT.email}`}
            className={cn(panel, "block px-6 py-5 transition hover:shadow-md")}
          >
            <span className="flex items-center gap-2 text-[13px] font-bold tracking-[0.5px] text-ink-faint uppercase">
              <MailIcon className="h-4 w-4" />
              Email
            </span>
            <span className="mt-2 block text-[17px] font-extrabold break-all text-ink">
              {CONTACT.email}
            </span>
            <span className="mt-1 block text-[14px] text-ink-soft">
              {CONTACT.responseTime}.
            </span>
          </a>

          <a
            href={`tel:${CONTACT.phoneHref}`}
            className={cn(panel, "block px-6 py-5 transition hover:shadow-md")}
          >
            <span className="flex items-center gap-2 text-[13px] font-bold tracking-[0.5px] text-ink-faint uppercase">
              <PhoneGlyph className="h-4 w-4" />
              Phone
            </span>
            <span className="mt-2 block text-[17px] font-extrabold text-ink">
              {CONTACT.phone}
            </span>
            <span className="mt-1 block text-[14px] text-ink-soft">
              Morocco time, working hours.
            </span>
          </a>
        </div>

        <div className="mt-10 max-w-[72ch] space-y-10">
          <section>
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              Something broken, or an idea
            </h2>
            <p className="mt-4 text-[16px] leading-[1.75] text-ink-soft">
              The fastest route is inside the app: sign in, open the account
              menu and choose <strong className="text-ink">Send feedback</strong>
              . It comes through with the page you were on attached, which is
              usually the difference between a report that can be fixed and one
              that has to be guessed at.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              Your account and your data
            </h2>
            <p className="mt-4 text-[16px] leading-[1.75] text-ink-soft">
              To get a copy of what&rsquo;s stored about you, or to have the
              account and everything in it deleted, email from the address you
              signed up with and it will be handled by hand.{" "}
              <Link
                href="/privacy"
                className="font-bold text-brand underline underline-offset-4"
              >
                The privacy page
              </Link>{" "}
              says exactly what there is to delete.
            </p>
          </section>

          <section>
            <h2 className="text-[24px] leading-tight font-extrabold tracking-tight text-ink">
              Press and partnerships
            </h2>
            <p className="mt-4 text-[16px] leading-[1.75] text-ink-soft">
              Same address. There&rsquo;s no press office and no social media
              yet — when there is, it will be linked in the footer rather than
              announced here.
            </p>
          </section>
        </div>
      </Column>
    </ContentPage>
  );
}
