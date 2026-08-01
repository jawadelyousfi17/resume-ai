// Pure renderer for a cover letter. No interactivity, so the editor preview,
// the dashboard thumbnail and the printed PDF are all the same component — the
// same arrangement that keeps the resume's PDF honest.
//
// What the page looks like comes from the template descriptor in
// lib/letter-templates: this file knows how to draw every treatment a
// descriptor can ask for, and nothing about which template asks for what.
//
// Sizes are em-relative to the configured base font size, so the whole page
// scales with the Customize controls.

import { PAGE_SIZES } from "@/lib/defaults";
import { letterDate } from "@/lib/cover-letter";
import { letterTemplate, type LetterTemplate } from "@/lib/letter-templates";
import { fontStack } from "@/lib/fonts";
import { isRtl } from "@/lib/i18n";
import { isMarkdownEmpty } from "@/lib/markdown";
import { MarkdownView } from "@/components/ui/markdown-view";
import type { CoverLetterData, PageFormat } from "@/lib/types";

const INK = "#111827";
const MUTED = "#4b5563";
const BODY = "#374151";

/** The three inks a letter is set in, flipped when the page is printed dark. */
interface Inks {
  ink: string;
  muted: string;
  body: string;
  /** What reads on the accent — the accent is the paper on a dark template, so
   *  type painted in it there would vanish. */
  onAccent: string;
}

/** The width of the band `edge: "strip"` paints down the side, and the room
 *  the text has to give up for it. */
const STRIP_MM = 7;

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
        <p className="text-lg font-semibold text-ink-faint">
          Your cover letter
        </p>
        <p className="mt-2 max-w-xs text-sm text-ink-faint">
          Fill it in on the left — or let the assistant draft it from your
          resume and the job posting.
        </p>
      </div>
    );
  }

  const t = letterTemplate(s);
  const dark = t.page === "dark";
  const inks: Inks = dark
    ? {
        ink: "rgba(255,255,255,0.95)",
        muted: "rgba(255,255,255,0.62)",
        body: "rgba(255,255,255,0.82)",
        onAccent: "rgba(255,255,255,0.95)",
      }
    : { ink: INK, muted: MUTED, body: BODY, onAccent: "#fff" };

  const page: React.CSSProperties = {
    fontFamily: fontStack(s.fontFamily),
    fontSize: `${s.fontSize}pt`,
    lineHeight: s.lineHeight,
    color: inks.body,
    // A dark page is printed in the accent itself; a tinted one is washed in
    // the faintest amount of it.
    backgroundColor: dark
      ? s.accent
      : t.page === "tint"
        ? `${s.accent}0d`
        : undefined,
    minHeight,
    // The decorations are absolutely positioned against the sheet, and a wave
    // that ran off the edge of it would show up in the PDF as a stray shape.
    position: "relative",
    overflow: "hidden",
    // Right-to-left languages flip the whole page.
    direction: rtl ? "rtl" : undefined,
    textAlign: rtl ? "right" : undefined,
  };

  const contact = [data.sender.email, data.sender.phone, data.sender.location]
    .map((value) => value.trim())
    .filter(Boolean);

  const header = <Header data={data} t={t} inks={inks} contact={contact} />;

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
  const dateLine = s.showDate ? letterDate(data.date, s.language, now) : "";

  /** The gaps between the blocks of the letter, at the template's spacing. */
  const gap = (em: number) => `${(em * t.density).toFixed(2)}em`;

  const recipientBlock = toBlock.length > 0 && (
    <div style={{ color: inks.muted }} className="leading-snug">
      {toBlock.map((line, i) => (
        <p
          key={i}
          style={i === 0 ? { color: inks.ink, fontWeight: 600 } : undefined}
        >
          {line}
        </p>
      ))}
    </div>
  );

  const dateBlock = dateLine && (
    <p style={{ color: inks.muted, fontSize: "0.94em" }}>{dateLine}</p>
  );

  return (
    <div style={page} className="flex h-full flex-col">
      <Edge t={t} accent={s.accent} />

      {/* Everything the reader reads sits above the decorations, and clear of
          the band a strip paints down the side. */}
      <div
        className="relative flex min-h-0 flex-1 flex-col"
        style={
          t.edge === "strip"
            ? { paddingInlineStart: `${STRIP_MM + 4}mm` }
            : undefined
        }
      >
        {header}

        <div
          style={{ padding: bodyPad }}
          className="flex min-h-0 flex-1 flex-col"
        >
          {/* The date set across from the company reads as one block: who it's
              to on one side, when it was written on the other. */}
          {t.dateAlign === "right" && recipientBlock ? (
            <div className="flex items-start justify-between gap-6">
              {recipientBlock}
              {dateBlock}
            </div>
          ) : (
            <>
              {dateBlock}
              {recipientBlock && (
                <div style={{ marginTop: dateBlock ? gap(1.6) : 0 }}>
                  {recipientBlock}
                </div>
              )}
            </>
          )}

          {/* Above the greeting, which is where someone working through a stack
              of letters looks first. */}
          {subject && (
            <Subject
              t={t}
              inks={inks}
              accent={s.accent}
              marginTop={gap(1.6)}
              text={company ? `${subject} — ${company}` : subject}
            />
          )}

          {data.greeting.trim() && (
            <p style={{ marginTop: gap(1.5), ...greetingType(t, inks.ink) }}>
              {data.greeting.trim()}
            </p>
          )}

          {!isMarkdownEmpty(data.body) && (
            <div
              style={{
                marginTop: gap(1.1),
                textAlign: t.justify ? "justify" : undefined,
              }}
            >
              <MarkdownView
                md={data.body}
                blockSpacing={gap(0.95)}
                // An indent belongs to paragraphs, not to lists — which is why
                // it goes through the style the view puts on each block rather
                // than onto the wrapper above.
                style={t.indent ? { textIndent: "1.8em" } : undefined}
                listStyle={t.indent ? { textIndent: 0 } : undefined}
              />
            </div>
          )}

          <SignOff data={data} t={t} inks={inks} marginTop={gap(1.9)} />

          {/* A letterhead that signs off instead of announcing itself twice.
              Pushed to the foot of the page, clear of the bottom wave. */}
          {t.header === "footer" && contact.length > 0 && (
            <div
              style={{ marginTop: "auto", paddingTop: "2.4em" }}
              className="flex flex-col items-end"
            >
              {contact.map((value, i) => (
                <p key={i} style={{ color: inks.muted, fontSize: "0.9em" }}>
                  {value}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   The header
   --------------------------------------------------------------------------- */

/** The sender, in whichever treatment the template asks for. Returns null when
 *  there's nothing to put in it, which is what tells the body to take the top
 *  margin back. */
function Header({
  data,
  t,
  inks,
  contact,
}: {
  data: CoverLetterData;
  t: LetterTemplate;
  inks: Inks;
  contact: string[];
}) {
  const s = data.settings;
  const name = data.sender.fullName.trim();
  const title = data.sender.title.trim();
  if (!name && !title && !contact.length) return null;

  const sides = `${s.marginX}mm`;
  const top = `${s.marginY}mm`;
  const centred = t.align === "center";

  const dot = <span style={{ opacity: 0.45 }}> · </span>;
  const contactRow = contact.map((value, i) => (
    <span key={i}>
      {i > 0 && dot}
      {value}
    </span>
  ));
  const contactList = (color: string) =>
    contact.map((value, i) => (
      <p key={i} style={{ color, fontSize: "0.9em" }}>
        {value}
      </p>
    ));

  /** The contacts as the template sets them, for the layouts that put them
   *  under or beside the name rather than in a band. */
  const contactBlock = (color: string) => {
    if (!contact.length) return null;
    if (t.contacts === "inline") {
      return (
        <p style={{ marginTop: "0.5em", color, fontSize: "0.9em" }}>
          {contactRow}
        </p>
      );
    }
    if (t.contacts === "boxed") {
      return (
        <div
          style={{
            marginTop: "0.7em",
            display: "inline-block",
            backgroundColor: `${s.accent}12`,
            padding: "0.5em 0.9em",
            textAlign: centred ? "center" : undefined,
          }}
          className="leading-snug"
        >
          {contactList(color)}
        </div>
      );
    }
    if (t.contacts === "ruled") {
      return (
        <div style={{ marginTop: "0.6em" }} className="leading-snug">
          {contact.map((value, i) => (
            <p
              key={i}
              style={{
                color,
                fontSize: "0.9em",
                paddingTop: i ? "0.25em" : 0,
                marginTop: i ? "0.25em" : 0,
                borderTop: i ? "1px solid currentColor" : undefined,
                // The hairlines are separators, not type — they read at a
                // fraction of the weight the addresses do.
                borderTopColor: i ? `${s.accent}40` : undefined,
              }}
            >
              {value}
            </p>
          ))}
        </div>
      );
    }
    return (
      <div style={{ marginTop: "0.55em" }} className="leading-snug">
        {contactList(color)}
      </div>
    );
  };

  const titleType = (color: string): React.CSSProperties =>
    t.titleCaps
      ? {
          marginTop: "0.35em",
          color,
          fontSize: "0.86em",
          fontWeight: 600,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }
      : { marginTop: "0.15em", color, fontWeight: 600 };

  const mark = <Monogram t={t} name={name} accent={s.accent} inks={inks} />;
  // On a band painted in the accent the mark has to reverse, or it's a shape
  // the same colour as what's behind it.
  const markOnAccent = (
    <Monogram t={t} name={name} accent={s.accent} inks={inks} reversed />
  );

  // Painted edge to edge, so it sits outside the page margins.
  if (t.header === "banner") {
    return (
      <div
        style={{
          backgroundColor: s.accent,
          color: inks.onAccent,
          padding: `${Math.max(s.marginY * 0.8, 10)}mm ${sides}`,
          textAlign: centred ? "center" : undefined,
        }}
      >
        <div
          className={`flex items-center gap-4 ${centred ? "justify-center" : ""}`}
        >
          {markOnAccent}
          <div>
            {name && <p style={nameType(t, inks.onAccent, centred)}>{name}</p>}
            {title && (
              <p style={{ ...titleType(inks.onAccent), opacity: 0.88 }}>
                {title}
              </p>
            )}
          </div>
        </div>
        {contact.length > 0 && (
          <p style={{ marginTop: "0.5em", fontSize: "0.9em", opacity: 0.85 }}>
            {contactRow}
          </p>
        )}
      </div>
    );
  }

  // The name reversed out of a solid panel, contacts in a tinted one beside
  // it. Both run to the edge of the sheet, so the two halves read as one
  // printed letterhead rather than as a header sitting on a page.
  if (t.header === "block") {
    return (
      <div className="flex items-stretch">
        <div
          style={{
            backgroundColor: s.accent,
            color: inks.onAccent,
            padding: `${Math.max(s.marginY * 0.7, 9)}mm ${sides}`,
            flex: "0 0 54%",
          }}
        >
          <div className="flex items-center gap-4">
            {markOnAccent}
            <div>
              {name && <p style={nameType(t, inks.onAccent, false)}>{name}</p>}
              {title && (
                <p
                  style={{
                    marginTop: "0.5em",
                    fontSize: "0.92em",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    opacity: 0.85,
                  }}
                >
                  {title}
                </p>
              )}
            </div>
          </div>
        </div>
        <div
          style={{
            backgroundColor: `${s.accent}14`,
            padding: `${Math.max(s.marginY * 0.7, 9)}mm ${Math.max(s.marginX * 0.6, 8)}mm`,
            flex: 1,
          }}
          className="flex flex-col justify-center leading-relaxed"
        >
          {contactList(inks.muted)}
        </div>
      </div>
    );
  }

  // One quiet line, for someone whose details are already on the resume behind
  // this letter.
  if (t.header === "minimal") {
    return (
      <div
        style={{
          padding: `${top} ${sides} 0`,
          textAlign: centred ? "center" : undefined,
        }}
      >
        <div
          className={`flex items-center gap-3 ${centred ? "justify-center" : ""}`}
        >
          {mark}
          <p style={{ color: inks.ink, fontWeight: 600 }}>
            {name}
            {title && (
              <span style={{ color: inks.muted, fontWeight: 400 }}>
                {" "}
                — {title}
              </span>
            )}
          </p>
        </div>
        {contact.length > 0 &&
          (t.contacts === "inline" ? (
            <p
              style={{ marginTop: "0.2em", color: inks.muted, fontSize: "0.9em" }}
            >
              {contactRow}
            </p>
          ) : (
            contactBlock(inks.muted)
          ))}
        <Rule t={t} accent={s.accent} />
      </div>
    );
  }

  // Name and title against one side, contacts against the other.
  if (t.header === "split") {
    return (
      <div style={{ padding: `${top} ${sides} 0` }}>
        <div className="flex items-end justify-between gap-8">
          <div className="flex items-center gap-4">
            {mark}
            <div>
              {name && <p style={nameType(t, inks.ink, false)}>{name}</p>}
              {title && <p style={titleType(inks.muted)}>{title}</p>}
            </div>
          </div>
          {contact.length > 0 && (
            <div className="shrink-0 text-end leading-snug">
              {t.contacts === "inline" ? (
                <p style={{ color: inks.muted, fontSize: "0.9em" }}>
                  {contactRow}
                </p>
              ) : (
                contactList(inks.muted)
              )}
            </div>
          )}
        </div>
        <Rule t={t} accent={s.accent} />
      </div>
    );
  }

  // The block inside a ruled box, drawn in the accent.
  if (t.header === "boxed") {
    return (
      <div style={{ padding: `${top} ${sides} 0` }}>
        <div
          style={{
            border: `1px solid ${s.accent}66`,
            padding: "1.1em 1.4em",
            textAlign: centred ? "center" : undefined,
          }}
        >
          <div
            className={`flex items-center gap-4 ${centred ? "justify-center" : ""}`}
          >
            {mark}
            <div>
              {name && <p style={nameType(t, inks.ink, centred)}>{name}</p>}
              {title && <p style={titleType(s.accent)}>{title}</p>}
            </div>
          </div>
          {contactBlock(inks.muted)}
        </div>
        <Rule t={t} accent={s.accent} />
      </div>
    );
  }

  // `footer` prints the name here and the contacts at the foot of the page;
  // `stacked` prints all of it here. Otherwise they're the same block.
  const showContacts = t.header !== "footer" && contact.length > 0;

  return (
    <div
      style={{
        padding: `${top} ${sides} 0`,
        textAlign: centred ? "center" : undefined,
      }}
    >
      <div
        className={`flex items-center gap-4 ${centred ? "justify-center" : ""}`}
      >
        {mark}
        <div>
          {name && <p style={nameType(t, inks.ink, centred)}>{name}</p>}
          {title && <p style={titleType(s.accent)}>{title}</p>}
        </div>
      </div>
      {showContacts && contactBlock(inks.muted)}
      <Rule t={t} accent={s.accent} />
    </div>
  );
}

/** Initials, for the templates that carry a mark. Two letters at most: three
 *  is a middle name somebody didn't want printed. */
function Monogram({
  t,
  name,
  accent,
  inks,
  reversed = false,
}: {
  t: LetterTemplate;
  name: string;
  accent: string;
  inks: Inks;
  /** Drawn on a band already painted in the accent. */
  reversed?: boolean;
}) {
  if (t.monogram === "none" || !name) return null;

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
  if (!initials) return null;

  // Set on the page rather than in a shape — the letters do the work.
  if (t.monogram === "plain") {
    return (
      <span
        style={{
          color: reversed ? inks.onAccent : accent,
          fontSize: "1.5em",
          fontWeight: 700,
          letterSpacing: "0.06em",
          opacity: reversed ? 0.85 : undefined,
        }}
      >
        {initials}
      </span>
    );
  }

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flex: "0 0 auto",
        width: "2.6em",
        height: "2.6em",
        backgroundColor: reversed ? inks.onAccent : accent,
        color: reversed ? accent : inks.onAccent,
        borderRadius: t.monogram === "circle" ? "50%" : 2,
        fontSize: "1em",
        fontWeight: 700,
        letterSpacing: "0.04em",
      }}
    >
      {initials}
    </span>
  );
}

/** How the name is set. Tracked capitals carry a trailing letter-space, which
 *  throws a centred line off by half of it — hence the negative end margin. */
function nameType(
  t: LetterTemplate,
  color: string,
  centred: boolean,
): React.CSSProperties {
  if (t.nameStyle === "display") {
    return {
      color,
      fontSize: "2.7em",
      fontWeight: 800,
      lineHeight: 0.98,
      letterSpacing: "-0.03em",
      textTransform: "uppercase",
    };
  }
  if (t.nameStyle === "tracked") {
    return {
      color,
      fontSize: "1.45em",
      fontWeight: 500,
      lineHeight: 1.3,
      letterSpacing: "0.3em",
      textTransform: "uppercase",
      marginInlineEnd: centred ? "-0.3em" : undefined,
    };
  }
  return {
    color,
    fontSize: "1.7em",
    fontWeight: 700,
    lineHeight: 1.15,
    letterSpacing: "-0.01em",
  };
}

/** The line under the header block. */
function Rule({ t, accent }: { t: LetterTemplate; accent: string }) {
  if (t.rule === "none") return null;
  const weight = t.rule === "thick" ? 3 : t.rule === "accent" ? 2 : 1;
  return (
    <div
      style={{
        marginTop: "0.9em",
        borderTop: `${weight}px solid ${
          t.rule === "hairline" ? "currentColor" : accent
        }`,
        opacity: t.rule === "hairline" ? 0.28 : 0.85,
      }}
    />
  );
}

/* ---------------------------------------------------------------------------
   Body pieces
   --------------------------------------------------------------------------- */

/** The greeting — the first line anyone actually reads. */
function greetingType(t: LetterTemplate, ink: string): React.CSSProperties {
  if (t.greeting === "display") {
    return { color: ink, fontSize: "1.35em", fontWeight: 700, lineHeight: 1.25 };
  }
  if (t.greeting === "bold") return { color: ink, fontWeight: 700 };
  return { color: ink };
}

function Subject({
  t,
  inks,
  accent,
  text,
  marginTop,
}: {
  t: LetterTemplate;
  inks: Inks;
  accent: string;
  text: string;
  marginTop: string;
}) {
  if (t.subject === "caps") {
    return (
      <p
        style={{
          marginTop,
          color: inks.ink,
          fontSize: "0.86em",
          fontWeight: 700,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        {text}
      </p>
    );
  }

  if (t.subject === "chip") {
    // On a dark page the accent is the paper, so the chip inverts rather than
    // printing the role in a colour that isn't there.
    const onDark = t.page === "dark";
    return (
      <div style={{ marginTop }}>
        <span
          style={{
            display: "inline-block",
            backgroundColor: onDark ? inks.ink : accent,
            color: onDark ? accent : "#fff",
            padding: "0.3em 0.85em",
            borderRadius: 3,
            fontSize: "0.84em",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {text}
        </span>
      </div>
    );
  }

  return (
    <p style={{ marginTop, color: inks.ink, fontWeight: 700 }}>{text}</p>
  );
}

function SignOff({
  data,
  t,
  inks,
  marginTop,
}: {
  data: CoverLetterData;
  t: LetterTemplate;
  inks: Inks;
  marginTop: string;
}) {
  const closing = data.closing.trim();
  const signature = data.signature.trim();
  if (!closing && !signature && !data.signatureImage) return null;

  const bar = t.signOffBar;

  return (
    <div style={{ marginTop: bar ? "auto" : marginTop, paddingTop: bar ? "2.4em" : 0 }}>
      {bar && (
        <div
          style={{
            marginBottom: "1.4em",
            borderTop: `3px solid ${inks.ink}`,
            opacity: 0.9,
          }}
        />
      )}

      {closing && <p style={{ color: inks.ink }}>{closing}</p>}

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

      {signature && (
        // Without a drawn signature the gap stands in for one, the way it
        // does on a letter waiting to be signed by hand.
        <p
          style={
            bar
              ? {
                  ...nameType(t, inks.ink, false),
                  marginTop: data.signatureImage ? "0.2em" : "0.9em",
                  fontSize: "1.9em",
                }
              : t.signature === "script"
                ? {
                    // Standing in for the hand that would have signed it.
                    marginTop: data.signatureImage ? "0.3em" : "1.6em",
                    color: inks.ink,
                    fontFamily: "'Snell Roundhand', 'Apple Chancery', cursive",
                    fontSize: "1.75em",
                    fontStyle: "italic",
                    lineHeight: 1.2,
                  }
                : {
                    marginTop: data.signatureImage ? "0.3em" : "2.2em",
                    color: inks.ink,
                    fontWeight: 600,
                  }
          }
        >
          {signature}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   Edge decoration

   Drawn against the sheet, behind everything and outside the text block. None
   of it carries meaning, so none of it needs to survive a copy-paste out of
   the PDF — which is exactly why it's drawn rather than typed.
   --------------------------------------------------------------------------- */

function Edge({ t, accent }: { t: LetterTemplate; accent: string }) {
  if (t.edge === "none") return null;

  const base: React.CSSProperties = {
    position: "absolute",
    pointerEvents: "none",
  };

  if (t.edge === "rule") {
    return (
      <div
        style={{
          ...base,
          top: "13mm",
          bottom: "13mm",
          insetInlineStart: "9mm",
          width: 1,
          backgroundColor: accent,
          opacity: 0.45,
        }}
      />
    );
  }

  if (t.edge === "strip") {
    return (
      <div
        style={{
          ...base,
          top: 0,
          bottom: 0,
          insetInlineStart: 0,
          width: `${STRIP_MM}mm`,
          backgroundColor: accent,
        }}
      />
    );
  }

  if (t.edge === "frame") {
    return (
      <div
        style={{
          ...base,
          inset: "8mm",
          border: `1px solid ${accent}`,
          opacity: 0.5,
        }}
      />
    );
  }

  if (t.edge === "double-frame") {
    return (
      <>
        <div
          style={{
            ...base,
            inset: "7mm",
            border: `2px solid ${accent}`,
            opacity: 0.55,
          }}
        />
        <div
          style={{
            ...base,
            inset: "9.5mm",
            border: `1px solid ${accent}`,
            opacity: 0.4,
          }}
        />
      </>
    );
  }

  if (t.edge === "band-top" || t.edge === "band-both") {
    return (
      <>
        <div
          style={{
            ...base,
            top: 0,
            insetInline: 0,
            height: "5mm",
            backgroundColor: accent,
          }}
        />
        {t.edge === "band-both" && (
          <div
            style={{
              ...base,
              bottom: 0,
              insetInline: 0,
              height: "5mm",
              backgroundColor: accent,
            }}
          />
        )}
      </>
    );
  }

  if (t.edge === "diagonal") {
    return (
      <div
        style={{
          ...base,
          top: 0,
          insetInlineEnd: 0,
          width: "42mm",
          height: "42mm",
          backgroundColor: accent,
          // Cut from the corner inward, so the hypotenuse falls across it.
          clipPath: "polygon(100% 0, 100% 100%, 0 0)",
        }}
      />
    );
  }

  if (t.edge === "dots") {
    return (
      <div
        style={{
          ...base,
          top: "16mm",
          bottom: "16mm",
          insetInlineStart: "8mm",
          width: "3mm",
          backgroundImage: `radial-gradient(${accent} 42%, transparent 44%)`,
          backgroundSize: "3mm 8mm",
          opacity: 0.65,
        }}
      />
    );
  }

  // A wash behind the top of the sheet, under whatever header sits on it.
  if (t.edge === "wash") {
    return (
      <div
        style={{
          ...base,
          top: 0,
          insetInline: 0,
          height: "78mm",
          backgroundColor: `${accent}12`,
        }}
      />
    );
  }

  if (t.edge === "notch") {
    const arm = { width: "16mm", height: "16mm", borderColor: accent };
    return (
      <>
        <div
          style={{
            ...base,
            ...arm,
            top: "9mm",
            insetInlineStart: "9mm",
            borderTop: `2px solid ${accent}`,
            borderInlineStart: `2px solid ${accent}`,
          }}
        />
        <div
          style={{
            ...base,
            ...arm,
            bottom: "9mm",
            insetInlineEnd: "9mm",
            borderBottom: `2px solid ${accent}`,
            borderInlineEnd: `2px solid ${accent}`,
          }}
        />
      </>
    );
  }

  if (t.edge === "corner") {
    return (
      <>
        <div
          style={{
            ...base,
            top: 0,
            insetInlineEnd: 0,
            width: "26mm",
            height: "26mm",
            backgroundColor: accent,
          }}
        />
        <div
          style={{
            ...base,
            bottom: 0,
            insetInlineStart: 0,
            width: "34mm",
            height: "14mm",
            backgroundColor: accent,
            opacity: 0.35,
          }}
        />
      </>
    );
  }

  // Two layered curves, top-right and bottom-left, so the shape never crosses
  // the corner the header or the footer contacts are set in.
  return (
    <>
      <svg
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        style={{ ...base, top: 0, insetInlineEnd: 0, width: "64%", height: "13%" }}
        aria-hidden="true"
      >
        <path
          d="M0,0 H400 V120 C330,120 300,52 200,40 C120,30 50,26 0,44 Z"
          fill={accent}
          opacity="0.45"
        />
        <path
          d="M60,0 H400 V86 C340,86 300,26 200,14 C140,7 100,4 60,10 Z"
          fill={accent}
        />
      </svg>
      <svg
        viewBox="0 0 400 120"
        preserveAspectRatio="none"
        style={{
          ...base,
          bottom: 0,
          insetInlineStart: 0,
          width: "56%",
          height: "11%",
        }}
        aria-hidden="true"
      >
        <path
          d="M0,120 V30 C60,14 130,54 220,72 C300,88 350,96 400,92 V120 Z"
          fill={accent}
          opacity="0.45"
        />
        <path
          d="M0,120 V64 C70,50 140,88 230,102 C290,111 340,114 380,113 V120 Z"
          fill={accent}
        />
      </svg>
    </>
  );
}
