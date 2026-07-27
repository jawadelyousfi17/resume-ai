// Pure renderer for a cover letter. No interactivity, so the editor preview,
// the dashboard thumbnail and the printed PDF are all the same component — the
// same arrangement that keeps the resume's PDF honest.
//
// Sizes are em-relative to the configured base font size, so the whole page
// scales with the Customize controls.

import { PAGE_SIZES } from "@/lib/defaults";
import { letterDate } from "@/lib/cover-letter";
import { fontStack } from "@/lib/fonts";
import { isRtl } from "@/lib/i18n";
import { isMarkdownEmpty } from "@/lib/markdown";
import { MarkdownView } from "@/components/ui/markdown-view";
import type { CoverLetterData, PageFormat } from "@/lib/types";

const INK = "#111827";
const MUTED = "#4b5563";
const BODY = "#374151";

export function CoverLetterPreview({
  data,
  format = "A4",
  /** Passed in at print time so the PDF carries the same date the preview
   *  showed a second earlier, rather than re-resolving "today". */
  now,
}: {
  data: CoverLetterData;
  format?: PageFormat;
  now?: Date;
}) {
  const s = data.settings;
  const minHeight = PAGE_SIZES[format].height;
  const rtl = isRtl(s.language);

  const empty =
    !data.sender.fullName.trim() &&
    !data.recipient.company.trim() &&
    isMarkdownEmpty(data.body);

  if (empty) {
    return (
      <div
        style={{ minHeight }}
        className="flex h-full flex-col items-center justify-center px-16 text-center"
      >
        <p className="text-lg font-semibold text-ink-faint">Your cover letter</p>
        <p className="mt-2 max-w-xs text-sm text-ink-faint">
          Fill it in on the left — or let the assistant draft it from your
          resume and the job posting.
        </p>
      </div>
    );
  }

  const page: React.CSSProperties = {
    fontFamily: fontStack(s.fontFamily),
    fontSize: `${s.fontSize}pt`,
    lineHeight: s.lineHeight,
    color: BODY,
    minHeight,
    // Right-to-left languages flip the whole page.
    direction: rtl ? "rtl" : undefined,
    textAlign: rtl ? "right" : undefined,
  };

  const contact = [data.sender.email, data.sender.phone, data.sender.location]
    .map((value) => value.trim())
    .filter(Boolean);

  const header = <Header data={data} contact={contact} />;

  // The header owns the page's top margin when there is one, so the letter
  // body only needs the sides and the bottom.
  const bodyPad = header
    ? `1.8em ${s.marginX}mm ${s.marginY}mm`
    : `${s.marginY}mm ${s.marginX}mm`;

  const toBlock = [
    data.recipient.name,
    data.recipient.role,
    data.recipient.company,
    ...data.recipient.address.split("\n"),
  ]
    .map((value) => value.trim())
    .filter(Boolean);

  const subject = data.role.trim();
  const company = data.recipient.company.trim();

  return (
    <div style={page} className="flex h-full flex-col">
      {header}

      <div style={{ padding: bodyPad }} className="flex min-h-0 flex-1 flex-col">
        {s.showDate && (
          <p style={{ color: MUTED, fontSize: "0.94em" }}>
            {letterDate(data.date, s.language, now)}
          </p>
        )}

        {toBlock.length > 0 && (
          <div
            style={{ marginTop: s.showDate ? "1.6em" : 0, color: MUTED }}
            className="leading-snug"
          >
            {toBlock.map((line, i) => (
              <p
                key={i}
                style={i === 0 ? { color: INK, fontWeight: 600 } : undefined}
              >
                {line}
              </p>
            ))}
          </div>
        )}

        {/* Above the greeting, which is where someone working through a stack
            of letters looks first. */}
        {subject && (
          <p style={{ marginTop: "1.6em", color: INK, fontWeight: 700 }}>
            {subject}
            {company ? ` — ${company}` : ""}
          </p>
        )}

        {data.greeting.trim() && (
          <p style={{ marginTop: "1.5em", color: INK }}>
            {data.greeting.trim()}
          </p>
        )}

        {!isMarkdownEmpty(data.body) && (
          <div style={{ marginTop: "1.1em" }}>
            <MarkdownView md={data.body} blockSpacing="0.95em" />
          </div>
        )}

        {(data.closing.trim() ||
          data.signature.trim() ||
          data.signatureImage) && (
          <div style={{ marginTop: "1.9em" }}>
            {data.closing.trim() && (
              <p style={{ color: INK }}>{data.closing.trim()}</p>
            )}

            {data.signatureImage && (
              // Sized in em so it scales with the letter's type rather than
              // sitting at a fixed pixel height on a page that doesn't.
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={data.signatureImage}
                alt=""
                style={{
                  display: "block",
                  marginTop: "0.9em",
                  height: "3.4em",
                  maxWidth: "62%",
                  objectFit: "contain",
                  objectPosition: "left bottom",
                }}
              />
            )}

            {data.signature.trim() && (
              // Without a drawn signature the gap stands in for one, the way it
              // does on a letter waiting to be signed by hand.
              <p
                style={{
                  marginTop: data.signatureImage ? "0.3em" : "2.2em",
                  color: INK,
                  fontWeight: 600,
                }}
              >
                {data.signature.trim()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** The sender, in one of three treatments. Returns null when there's nothing
 *  to put in it, which is what tells the body to take the top margin back. */
function Header({
  data,
  contact,
}: {
  data: CoverLetterData;
  contact: string[];
}) {
  const s = data.settings;
  const name = data.sender.fullName.trim();
  const title = data.sender.title.trim();
  if (!name && !title && !contact.length) return null;

  const sides = `${s.marginX}mm`;
  const dot = <span style={{ opacity: 0.45 }}> · </span>;
  const contactLine = contact.map((value, i) => (
    <span key={i}>
      {i > 0 && dot}
      {value}
    </span>
  ));

  // Painted edge to edge, so it sits outside the page margins.
  if (s.headerStyle === "banner") {
    return (
      <div
        style={{
          backgroundColor: s.accent,
          color: "#fff",
          padding: `${Math.max(s.marginY * 0.8, 10)}mm ${sides}`,
        }}
      >
        {name && (
          <p style={{ fontSize: "1.7em", fontWeight: 700, lineHeight: 1.15 }}>
            {name}
          </p>
        )}
        {title && (
          <p style={{ marginTop: "0.15em", opacity: 0.88 }}>{title}</p>
        )}
        {contact.length > 0 && (
          <p style={{ marginTop: "0.5em", fontSize: "0.9em", opacity: 0.85 }}>
            {contactLine}
          </p>
        )}
      </div>
    );
  }

  // One quiet line, for someone whose details are already on the resume behind
  // this letter.
  if (s.headerStyle === "minimal") {
    return (
      <div style={{ padding: `${s.marginY}mm ${sides} 0` }}>
        <p style={{ color: INK, fontWeight: 600 }}>
          {name}
          {title && (
            <span style={{ color: MUTED, fontWeight: 400 }}> — {title}</span>
          )}
        </p>
        {contact.length > 0 && (
          <p style={{ marginTop: "0.2em", color: MUTED, fontSize: "0.9em" }}>
            {contactLine}
          </p>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: `${s.marginY}mm ${sides} 0` }}>
      {name && (
        <p
          style={{
            fontSize: "1.7em",
            fontWeight: 700,
            lineHeight: 1.15,
            color: INK,
            letterSpacing: "-0.01em",
          }}
        >
          {name}
        </p>
      )}
      {title && (
        <p style={{ marginTop: "0.15em", color: s.accent, fontWeight: 600 }}>
          {title}
        </p>
      )}
      {contact.length > 0 && (
        <p style={{ marginTop: "0.5em", color: MUTED, fontSize: "0.9em" }}>
          {contactLine}
        </p>
      )}
      <div
        style={{
          marginTop: "0.9em",
          borderTop: `2px solid ${s.accent}`,
          opacity: 0.85,
        }}
      />
    </div>
  );
}
