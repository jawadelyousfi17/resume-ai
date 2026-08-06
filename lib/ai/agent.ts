// The contract between the agent chat panel and `POST /api/ai/agent`.
//
// Kept free of server-only imports so both sides can read it — the route
// sends these definitions to the model, and the panel executes whatever comes
// back against the document. `lib/ai/tasks.ts` plays the same role for the
// one-shot writing tools.
//
// Every tool that touches the document addresses it with the same dotted keys
// the tailor and the translator already use — `<sectionId>.title`,
// `<sectionId>.<itemId>.highlights`, `personal.title`. There is one addressing
// scheme on this codebase and this is it; see `readField` in lib/ai/tailoring.

import type { ResumeData } from "@/lib/types";

/** What the agent can do. Named for the model's benefit, not ours. */
export type AgentToolName =
  | "set_field"
  | "set_skills"
  | "add_section"
  | "remove_section"
  | "move_section"
  | "add_entry"
  | "remove_entry"
  | "move_entry"
  | "list_templates"
  | "set_design";

/** One call the model made. */
export interface AgentToolCall {
  id: string;
  name: AgentToolName;
  input: Record<string, unknown>;
}

/** What executing one call produced. `summary` is what the chat shows the
 *  person; `detail` is what the model reads on its next turn. */
export interface AgentToolResult {
  id: string;
  /** True when the document changed — an edit worth offering an undo for. */
  edited: boolean;
  summary: string;
  detail: string;
  isError?: boolean;
}

/* -------------------------------------------------------------------------- */
/* Wire format                                                                */
/* -------------------------------------------------------------------------- */

/** One line of the newline-delimited JSON the route streams back.
 *
 *  Text arrives token by token so the reply types itself out. Tool calls
 *  arrive whole — a half-parsed JSON argument isn't something the panel could
 *  act on — and `done` carries the assistant's content blocks verbatim, which
 *  is what the next request replays. */
export type AgentEvent =
  | { type: "text"; text: string }
  | { type: "tool"; call: AgentToolCall }
  | { type: "done"; stop: string; content: AgentBlock[] }
  | { type: "error"; error: string };

/**
 * One content block, carried between the panel and the route untouched.
 *
 * Deliberately opaque. A turn that used tools has to be replayed exactly as it
 * came back — Claude signs its thinking blocks and rejects a thread where they
 * have been dropped or rewritten, and DeepSeek returns blocks of its own shape
 * through the same endpoint. The panel reads `text` and `tool_use` for display
 * and passes everything else through without looking at it.
 */
export interface AgentBlock {
  type: string;
  [field: string]: unknown;
}

export interface AgentMessage {
  role: "user" | "assistant";
  content: AgentBlock[];
}

export interface AgentRequest {
  /** The whole thread so far, oldest first, ending on the turn to answer. The
   *  server keeps nothing between requests. */
  messages: AgentMessage[];
  /** The document as it stands right now — re-read every turn, so the model
   *  sees the edits it just made rather than the page it started on. */
  data: ResumeData;
  /** A posting the person is targeting, when the Tailor tab has one. */
  jobDescription?: string;
}

/** Input caps, enforced on the server and mirrored in the composer. */
export const AGENT_LIMITS = {
  message: 2_000,
  jobDescription: 12_000,
  /** Serialized resume — a guard against a pathological document. */
  brief: 60_000,
  /** How many model turns one send may take before the loop gives up. A turn
   *  that only reads (list_templates) costs one of these, so this is not the
   *  same as an edit budget — it's a runaway guard. */
  steps: 12,
  /** How much of the thread travels back. Older turns are dropped rather than
   *  summarised: this is a side panel, not a long-running agent. */
  turns: 40,
} as const;

/* -------------------------------------------------------------------------- */
/* Tool definitions                                                           */
/* -------------------------------------------------------------------------- */

/** The shape the Messages API wants. Written out rather than derived so the
 *  descriptions — which are the whole game for tool selection — sit where
 *  they're read. */
export interface AgentToolDef {
  name: AgentToolName;
  description: string;
  /** JSON Schema. Always an object at the top level, which is what the
   *  Messages API requires of a tool. */
  input_schema: { type: "object"; [field: string]: unknown };
}

const SECTION_TYPES = [
  "summary",
  "experience",
  "projects",
  "volunteering",
  "education",
  "certifications",
  "awards",
  "skills",
  "languages",
  "interests",
] as const;

const KEY_DESC =
  "The field's key, copied exactly from the <resume> outline. One of: " +
  "`personal.title`, `personal.location`, `<sectionId>.title`, " +
  "`<sectionId>.content` (the summary paragraph), " +
  "`<sectionId>.<itemId>.role` / `.location` / `.highlights` (timeline entries), " +
  "`<sectionId>.<itemId>.degree` / `.location` / `.description` (credentials), " +
  "or `<sectionId>.<itemId>.name` (one skill, language or interest).";

export const AGENT_TOOLS: AgentToolDef[] = [
  {
    name: "set_field",
    description:
      "Rewrite one field of the resume, replacing it whole. This is the workhorse: " +
      "call it whenever the person asks you to write, improve, shorten, sharpen or " +
      "reword anything already on the page — a summary, the bullets under a role, a " +
      "job title, an education description. Read the current value from the <resume> " +
      "outline first and keep every fact it states. " +
      "`content`, `highlights` and `description` hold Markdown; everything else is a " +
      "single plain line. Do not use this to add or delete entries — use add_entry / " +
      "remove_entry for that.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["key", "value"],
      properties: {
        key: { type: "string", description: KEY_DESC },
        value: {
          type: "string",
          description:
            "The complete new value. Not a diff and not a fragment — whatever " +
            "you send replaces what was there.",
        },
      },
    },
  },
  {
    name: "set_skills",
    description:
      "Replace every entry in a skills, languages or interests section at once. " +
      "Call this when the person asks you to add, remove, reorder or rethink their " +
      "skills as a group — it is far better than a string of set_field calls. " +
      "Send the full list you want the section to end up with, including the entries " +
      "that are staying. Proficiency levels already set are kept for names that " +
      "survive; you cannot set a level yourself, because that is the person's own claim.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["section_id", "names"],
      properties: {
        section_id: {
          type: "string",
          description:
            "Id of a skills, languages or interests section from the outline.",
        },
        names: {
          type: "array",
          items: { type: "string" },
          description:
            "The complete list, strongest evidence first. Each a short noun " +
            "phrase, named the way the field names it.",
        },
      },
    },
  },
  {
    name: "add_section",
    description:
      "Add a new, empty section to the resume. Use it when the person asks for a " +
      "kind of section they don't have — projects, certifications, languages. The " +
      "section lands in the conventional reading order and comes with one blank " +
      "entry, which you should then fill in with set_field, or delete with " +
      "remove_entry if you are not adding content yet.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["type"],
      properties: {
        type: { type: "string", enum: SECTION_TYPES as unknown as string[] },
        title: {
          type: "string",
          description:
            "Heading to print. Omit for the conventional name in the resume's " +
            "own language.",
        },
      },
    },
  },
  {
    name: "remove_section",
    description:
      "Delete a whole section and everything in it. Destructive and not something " +
      "to do on your own initiative — only when the person has asked for that " +
      "section to go.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["section_id"],
      properties: { section_id: { type: "string" } },
    },
  },
  {
    name: "move_section",
    description:
      "Move a section to a different place in the document. Use it when the person " +
      "asks for a different order, or when a section that carries the application " +
      "is buried below one that doesn't.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["section_id", "position"],
      properties: {
        section_id: { type: "string" },
        position: {
          type: "integer",
          description:
            "Zero-based index among the sections, counted after the section is " +
            "lifted out. 0 puts it at the top of the page.",
        },
      },
    },
  },
  {
    name: "add_entry",
    description:
      "Add one entry to a section — a job, a project, a degree, a certificate, a " +
      "single skill. Fill in only the fields the person has actually given you; " +
      "never invent an employer, a school, a date or an achievement to fill a gap. " +
      "The new entry goes at the end of the section; use move_entry to place it.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["section_id"],
      properties: {
        section_id: { type: "string" },
        role: {
          type: "string",
          description: "Timeline sections: the job or project title.",
        },
        company: {
          type: "string",
          description: "Timeline sections: the employer or client.",
        },
        degree: {
          type: "string",
          description: "Credential sections: the qualification.",
        },
        school: {
          type: "string",
          description: "Credential sections: who awarded it.",
        },
        name: {
          type: "string",
          description: "Skills, languages and interests: the entry itself.",
        },
        location: { type: "string" },
        start_date: {
          type: "string",
          description: "Format `YYYY-MM`, e.g. \"2021-05\". Omit if unknown.",
        },
        end_date: {
          type: "string",
          description: "Format `YYYY-MM`. Omit if this is current.",
        },
        current: {
          type: "boolean",
          description: "Timeline sections: the person still holds this role.",
        },
        text: {
          type: "string",
          description:
            "Markdown body — the bullet list for a timeline entry, the " +
            "description for a credential.",
        },
      },
    },
  },
  {
    name: "remove_entry",
    description:
      "Delete one entry from a section. Destructive — only when asked, or to clear " +
      "the blank entry that add_section leaves behind.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["section_id", "item_id"],
      properties: {
        section_id: { type: "string" },
        item_id: { type: "string" },
      },
    },
  },
  {
    name: "move_entry",
    description:
      "Reorder one entry within its section. Worth doing unprompted for a timeline " +
      "that isn't in reverse-chronological order, which is what every reader expects.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["section_id", "item_id", "position"],
      properties: {
        section_id: { type: "string" },
        item_id: { type: "string" },
        position: {
          type: "integer",
          description:
            "Zero-based index within the section, counted after the entry is " +
            "lifted out.",
        },
      },
    },
  },
  {
    name: "list_templates",
    description:
      "Look up the templates available in one category, with their ids. Call this " +
      "before set_design whenever you intend to change the template — the ids are " +
      "not guessable and a wrong one is rejected. Skip it when you are only " +
      "changing colour, type or spacing.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["category"],
      properties: {
        category: {
          type: "string",
          enum: [
            "ats",
            "classic",
            "modern",
            "minimal",
            "photo",
            "two-column",
            "compact",
          ],
          description:
            "\"ats\" is the single-column, light-page, parser-safe set — reach " +
            "for it whenever the person mentions applicant tracking systems.",
        },
      },
    },
  },
  {
    name: "set_design",
    description:
      "Change how the resume looks. Send only the properties you mean to change; " +
      "everything you leave out stays as it is. Changing the template resets the " +
      "look to that template's own choices, so set the template in the same call " +
      "as any colour or type you want to keep.",
    input_schema: {
      type: "object",
      additionalProperties: false,
      properties: {
        template: {
          type: "string",
          description: "A template id from list_templates.",
        },
        accent: {
          type: "string",
          description: "Accent colour as a hex string, e.g. \"#2563eb\".",
        },
        page_color: { type: "string", description: "The paper, as hex." },
        text_color: { type: "string", description: "Body copy, as hex." },
        heading_color: {
          type: "string",
          description: "Headings, entry titles and the name, as hex.",
        },
        font_family: {
          type: "string",
          description:
            "A font id: sans, serif, mono, inter, source-sans, roboto, " +
            "source-serif, lora, merriweather, eb-garamond, jetbrains-mono, " +
            "open-sans, lato, montserrat, work-sans, nunito-sans, dm-sans, " +
            "ibm-plex-sans, playfair-display, libre-baskerville, pt-serif, " +
            "crimson-pro, bitter, cormorant-garamond, ibm-plex-mono, " +
            "roboto-mono, source-code-pro.",
        },
        font_size: {
          type: "number",
          description: "Body size in points, 8 to 14. The default is 10.5.",
        },
        line_height: {
          type: "number",
          description: "Unitless, 1.0 to 2.0. The default is 1.35.",
        },
        margin_x: {
          type: "number",
          description: "Left and right page margin in millimetres, 5 to 40.",
        },
        margin_y: {
          type: "number",
          description: "Top and bottom page margin in millimetres, 5 to 40.",
        },
        heading_style: {
          type: "string",
          enum: ["underline", "plain", "uppercase"],
        },
        date_format: {
          type: "string",
          enum: ["short", "long", "numeric", "iso"],
          description:
            "\"May 2021\", \"September 2021\", \"05/2021\" or \"2021-05\".",
        },
        icon_style: {
          type: "string",
          enum: ["solid", "line", "rounded", "classic", "none"],
          description: "The hand the contact marks are drawn in.",
        },
        tag_style: {
          type: "string",
          enum: [
            "auto",
            "columns-1",
            "columns-2",
            "columns-3",
            "columns-4",
            "dots",
            "bars",
            "inline",
          ],
          description:
            "How skills, languages and interests are laid out. \"dots\" and " +
            "\"bars\" draw the proficiency levels; only use them if levels are set.",
        },
      },
    },
  },
];
