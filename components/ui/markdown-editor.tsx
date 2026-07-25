"use client";

// The one writing surface for every long-form field: summary, highlights,
// descriptions. What you see is what the resume gets — bold, italic and lists
// are formatted in place — but the value it stores and emits is Markdown, so
// the document stays plain text and diffable.

import { useEffect, useRef } from "react";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import { cn } from "@/lib/utils";
import { editorDocToMarkdown, markdownToHtml } from "@/lib/markdown";
import {
  BoldIcon,
  BulletListIcon,
  ItalicIcon,
  NumberListIcon,
} from "@/components/ui/icons";

/** Only the marks and nodes `lib/markdown` can round-trip are enabled — the
 *  editor can't produce formatting the PDF would silently drop. */
const BASE_EXTENSIONS = [
  StarterKit.configure({
    heading: false,
    blockquote: false,
    codeBlock: false,
    code: false,
    horizontalRule: false,
    strike: false,
    underline: false,
    link: false,
  }),
];

interface ToolProps {
  editor: Editor;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  label: string;
  active: boolean;
  onClick: () => void;
}

function Tool({ editor, icon: Icon, label, active, onClick }: ToolProps) {
  return (
    <button
      type="button"
      // Keep focus in the document so the command applies to the selection.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      title={label}
      disabled={!editor.isEditable}
      className={cn(
        "inline-flex h-7 w-7 items-center justify-center rounded-lg transition",
        active
          ? "bg-brand-soft text-brand"
          : "text-ink-faint hover:bg-black/5 hover:text-ink",
      )}
    >
      <Icon className="h-[17px] w-[17px]" />
    </button>
  );
}

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  minHeight = 120,
  className,
  editable = true,
  toolbar = true,
}: {
  /** Markdown source. */
  value: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
  minHeight?: number;
  className?: string;
  /** Locked while an AI suggestion is on screen — those aren't the user's
   *  words yet, so they can't be edited until they're kept. */
  editable?: boolean;
  toolbar?: boolean;
}) {
  // The editor instance outlives any single render, so it reads the current
  // handler rather than the one captured when it was created.
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  });

  const editor = useEditor(
    {
      extensions: [
        ...BASE_EXTENSIONS,
        Placeholder.configure({ placeholder: placeholder ?? "" }),
      ],
      content: markdownToHtml(value),
      // Tiptap renders to the DOM, so let the client mount it rather than
      // hydrating over server output.
      immediatelyRender: false,
      editorProps: {
        attributes: {
          class: "prose-resume outline-none",
          style: `min-height:${minHeight}px`,
        },
      },
      onUpdate: ({ editor }) =>
        onChangeRef.current(editorDocToMarkdown(editor.getJSON())),
    },
    [placeholder, minHeight],
  );

  useEffect(() => {
    editor?.setEditable(editable);
  }, [editor, editable]);

  // Adopt changes that came from somewhere else — an AI suggestion being
  // applied, or a different entry taking over the column. Comparing against
  // what the editor would emit keeps our own keystrokes from round-tripping
  // back in and resetting the cursor.
  useEffect(() => {
    if (!editor) return;
    if (value === editorDocToMarkdown(editor.getJSON())) return;
    editor.commands.setContent(markdownToHtml(value), { emitUpdate: false });
  }, [editor, value]);

  if (!editor) {
    // Same box, no content — the field doesn't jump when the editor mounts.
    return (
      <div
        className={cn(
          "rounded-xl bg-field px-4 py-3",
          className,
        )}
        style={{ minHeight: minHeight + 42 }}
      />
    );
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl bg-field ring-2 ring-transparent transition focus-within:ring-ink/80",
        className,
      )}
    >
      {toolbar && (
      <div className="flex items-center gap-0.5 border-b border-black/[0.06] px-2 py-1.5">
        <Tool
          editor={editor}
          icon={BoldIcon}
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        />
        <Tool
          editor={editor}
          icon={ItalicIcon}
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        />
        <span className="mx-1 h-4 w-px bg-black/10" />
        <Tool
          editor={editor}
          icon={BulletListIcon}
          label="Bulleted list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        />
        <Tool
          editor={editor}
          icon={NumberListIcon}
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        />
      </div>
      )}

      <EditorContent
        editor={editor}
        className="px-4 py-3 text-base leading-relaxed text-ink"
      />
    </div>
  );
}
