// The small Markdown subset the editor writes and the renderers read.
//
// Long-form fields (summary, highlights, descriptions) are stored as Markdown
// so one visual editor can back all of them. Only what a resume actually needs
// is supported — paragraphs, bullet and numbered lists, bold and italic — and
// both renderers here (HTML for the editor, React for the preview — which is
// also what the PDF is printed from) work from the same parse, so they can't
// drift apart.
//
// Nested emphasis (**bold with *italic* inside**) is out of scope: the inner
// run is left as literal text rather than silently dropped.

export interface MdSpan {
  text: string;
  bold?: boolean;
  italic?: boolean;
}

export type MdBlock =
  | { type: "paragraph"; spans: MdSpan[] }
  | { type: "list"; ordered: boolean; items: MdSpan[][] };

const BULLET_LINE = /^\s{0,3}[-*+]\s+(.*)$/;
const ORDERED_LINE = /^\s{0,3}\d+[.)]\s+(.*)$/;

/** `**a**`, `__a__`, `*a*`, `_a_` — skipping any marker the user escaped. */
const EMPHASIS = /(?<!\\)\*\*(.+?)(?<!\\)\*\*|(?<!\\)__(.+?)(?<!\\)__|(?<!\\)\*(.+?)(?<!\\)\*|(?<!\\)_(.+?)(?<!\\)_/g;

const unescape = (s: string) => s.replace(/\\([*_\\])/g, "$1");

/** Escapes the characters `parseInline` would otherwise read as emphasis. */
export const escapeMarkdown = (s: string) => s.replace(/([*_\\])/g, "\\$1");

function parseInline(text: string): MdSpan[] {
  const spans: MdSpan[] = [];
  let last = 0;

  EMPHASIS.lastIndex = 0;
  for (let m = EMPHASIS.exec(text); m; m = EMPHASIS.exec(text)) {
    if (m.index > last) spans.push({ text: unescape(text.slice(last, m.index)) });

    const bold = m[1] ?? m[2];
    const italic = m[3] ?? m[4];
    if (bold !== undefined) spans.push({ text: unescape(bold), bold: true });
    else if (italic !== undefined) spans.push({ text: unescape(italic), italic: true });

    last = EMPHASIS.lastIndex;
  }
  if (last < text.length) spans.push({ text: unescape(text.slice(last)) });

  return spans.filter((s) => s.text.length > 0);
}

export function parseMarkdown(md: string): MdBlock[] {
  const blocks: MdBlock[] = [];
  // Paragraph lines waiting to be flushed; a blank line or a list ends the run.
  let para: string[] = [];

  const flushParagraph = () => {
    if (!para.length) return;
    const spans = parseInline(para.join("\n"));
    if (spans.length) blocks.push({ type: "paragraph", spans });
    para = [];
  };

  for (const line of (md ?? "").split("\n")) {
    const bullet = BULLET_LINE.exec(line);
    const ordered = bullet ? null : ORDERED_LINE.exec(line);

    if (bullet || ordered) {
      flushParagraph();
      const isOrdered = ordered !== null;
      const spans = parseInline((bullet?.[1] ?? ordered?.[1] ?? "").trim());
      const open = blocks.at(-1);
      // Consecutive markers of the same kind extend the list above them.
      if (open?.type === "list" && open.ordered === isOrdered) open.items.push(spans);
      else blocks.push({ type: "list", ordered: isOrdered, items: [spans] });
      continue;
    }

    if (!line.trim()) flushParagraph();
    else para.push(line);
  }
  flushParagraph();

  return blocks;
}

/** True when the document has nothing that would render. */
export function isMarkdownEmpty(md: string): boolean {
  return parseMarkdown(md).length === 0;
}

// ---------------------------------------------------------------- renderers

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function spansToHtml(spans: MdSpan[]): string {
  return spans
    .map((s) => {
      let html = escapeHtml(s.text).replace(/\n/g, "<br>");
      if (s.bold) html = `<strong>${html}</strong>`;
      if (s.italic) html = `<em>${html}</em>`;
      return html;
    })
    .join("");
}

/** HTML for the editor to load. Every tag is generated here and all text is
 *  escaped, so there is nothing for the editor to sanitize. */
export function markdownToHtml(md: string): string {
  const html = parseMarkdown(md)
    .map((block) => {
      if (block.type === "paragraph") return `<p>${spansToHtml(block.spans)}</p>`;
      const tag = block.ordered ? "ol" : "ul";
      const items = block.items
        .map((item) => `<li><p>${spansToHtml(item)}</p></li>`)
        .join("");
      return `<${tag}>${items}</${tag}>`;
    })
    .join("");
  return html || "<p></p>";
}

/** Flattens to one line — for the collapsed row summaries and the overview. */
export function markdownToText(md: string): string {
  return parseMarkdown(md)
    .flatMap((block) =>
      block.type === "paragraph"
        ? [block.spans.map((s) => s.text).join("")]
        : block.items.map((item) => item.map((s) => s.text).join("")),
    )
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}


// ------------------------------------------------- editor document → source

/** The shape of a ProseMirror/Tiptap node, typed structurally so this module
 *  stays free of an editor dependency. */
export interface EditorNode {
  type?: string;
  text?: string;
  content?: EditorNode[];
  marks?: { type: string }[];
}

function nodeToInline(nodes: EditorNode[] | undefined): string {
  return (nodes ?? [])
    .map((node) => {
      if (node.type === "hardBreak") return "\n";
      if (node.type !== "text" || !node.text) return "";
      const marks = new Set((node.marks ?? []).map((m) => m.type));
      let text = escapeMarkdown(node.text);
      if (marks.has("italic")) text = `*${text}*`;
      if (marks.has("bold")) text = `**${text}**`;
      return text;
    })
    .join("");
}

/** Serializes the editor's document back to the Markdown we persist. */
export function editorDocToMarkdown(doc: EditorNode): string {
  const blocks: string[] = [];

  for (const node of doc.content ?? []) {
    if (node.type === "bulletList" || node.type === "orderedList") {
      const ordered = node.type === "orderedList";
      const items = (node.content ?? []).map((li, i) => {
        // A list item wraps one or more paragraphs; join them onto one line so
        // the item survives a round trip through `parseMarkdown`.
        const text = (li.content ?? [])
          .map((child) => nodeToInline(child.content))
          .join(" ")
          .replace(/\n/g, " ")
          .trim();
        return `${ordered ? `${i + 1}.` : "-"} ${text}`;
      });
      if (items.length) blocks.push(items.join("\n"));
      continue;
    }

    const text = nodeToInline(node.content);
    if (text.trim()) blocks.push(text);
  }

  return blocks.join("\n\n");
}
