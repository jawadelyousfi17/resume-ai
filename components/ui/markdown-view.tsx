// Read-only rendering of a Markdown field, used by the live preview. Shares
// `parseMarkdown` with the editor and the LaTeX writer so all three agree on
// what a given source means.

import { parseMarkdown, type MdSpan } from "@/lib/markdown";

function spans(list: MdSpan[]) {
  return list.map((span, i) => {
    // Newlines inside a span are the editor's hard breaks.
    const text = span.text.split("\n").flatMap((line, li) =>
      li === 0 ? [line] : [<br key={li} />, line],
    );
    if (span.bold) return <strong key={i}>{text}</strong>;
    if (span.italic) return <em key={i}>{text}</em>;
    return <span key={i}>{text}</span>;
  });
}

export function MarkdownView({
  md,
  style,
  listStyle,
}: {
  md: string;
  /** Applied to paragraphs and lists alike — font size, colour, and so on. */
  style?: React.CSSProperties;
  /** Extra style for list blocks only. */
  listStyle?: React.CSSProperties;
}) {
  const blocks = parseMarkdown(md);
  if (!blocks.length) return null;

  return (
    <>
      {blocks.map((block, i) => {
        // Blocks after the first need a little air; the first sits flush so it
        // keeps whatever spacing the surrounding entry gave it.
        const spacing = i === 0 ? undefined : "0.35em";

        if (block.type === "paragraph") {
          return (
            <p key={i} style={{ ...style, marginTop: spacing }}>
              {spans(block.spans)}
            </p>
          );
        }

        const List = block.ordered ? "ol" : "ul";
        return (
          <List
            key={i}
            style={{
              ...style,
              ...listStyle,
              marginTop: spacing ?? "0.25em",
              paddingLeft: "1.1em",
              listStyleType: block.ordered ? "decimal" : "disc",
            }}
            className="space-y-0.5 marker:text-[#9ca3af]"
          >
            {block.items.map((item, j) => (
              <li key={j}>{spans(item)}</li>
            ))}
          </List>
        );
      })}
    </>
  );
}
