// Per-template copy for the detail pages.
//
// Thirty-two pages that shared one sample document and one line of descriptor
// text were, to a search engine, the same page thirty-two times. The sample
// person now rotates (lib/content/sample-people.ts) and this supplies the rest:
// who each template suits, what it does to a parser, how it behaves at two
// pages, and which one to use instead.
//
// Written per template rather than generated from the descriptor — a sentence
// assembled from flags reads as assembled, which is the problem it was meant to
// solve. `instead` names a real template id; there's a test-free guarantee of
// that in getTemplateNote, which throws in development if it drifts.

import type { TemplateId } from "@/lib/types";

export interface TemplateNote {
  /** Who should pick this, and why. */
  suits: string;
  /** What it does to applicant tracking system parsing. */
  parsing: string;
  /** How it behaves when the content runs to two pages. */
  twoPages: string;
  /** When to use something else, naming it. */
  instead: string;
}

export const TEMPLATE_NOTES: Record<TemplateId, TemplateNote> = {
  ledger: {
    suits:
      "The default recommendation, and the one to take if you would rather stop choosing and start writing. Centred serif headings on a soft grey bar read as formal without tipping into stiffness, which makes it unusually broad: it is at home in a law firm, a hospital and a mid-size software company without adjustment.",
    parsing:
      "As safe as anything here. One column, standard headings, real text, conventional dates — the tinted bar behind each heading is a background fill and contributes nothing a parser has to interpret.",
    twoPages:
      "Holds together well. The banded headings give a second page enough structure that it reads as a continuation rather than an overflow, which is the failure mode of plainer layouts.",
    instead:
      "Take Chronicle if you want the same formality with a hairline rule instead of a filled bar, or Meridian for the sans-serif equivalent.",
  },
  meridian: {
    suits:
      "The sans-serif counterpart to Ledger, and the safest modern-looking choice on the site. Technology, product, operations and anywhere else a serif face would read as older than the work. Nothing about it is fashionable, which is why it will still look current in three years.",
    parsing:
      "Single column with a full-width rule under each heading. Parses cleanly; the rules are borders rather than characters, so nothing extra ends up in the extracted text.",
    twoPages:
      "Comfortable. The rules carry enough weight to keep sections separated across a page break without the document starting to look busy.",
    instead:
      "Ledger if the field expects a serif, or Compact if you are two lines over and would rather tighten than cut.",
  },
  chronicle: {
    suits:
      "Serif type with a hairline rule under each heading — the closest thing here to a traditional typeset resume. Suits academia, publishing, law and anywhere the reader's taste was formed by paper rather than by screens.",
    parsing:
      "Single column, conventional headings, no decoration to trip a parser. One of the most reliable layouts on the site.",
    twoPages:
      "Its natural length, if anything. This is the template that looks most deliberate at two pages, which is why academic and clinical CVs suit it.",
    instead:
      "Ledger for a little more visual weight on the headings, or Oxford for something slightly more compressed.",
  },
  bergen: {
    suits:
      "A quieter Chronicle: the same serif structure with more air between sections. Good when your history is short enough that the page would otherwise look sparse, because the spacing does the work that extra content would.",
    parsing:
      "Nothing here interferes with extraction. Single column, real text, standard headings.",
    twoPages:
      "Runs long. The generous spacing that helps a one-page resume look considered will push a borderline document onto a second page you did not need.",
    instead:
      "Compact if you are fighting for space, or Chronicle for the same look at standard density.",
  },
  atlas: {
    suits:
      "A tinted left rail carrying contact details, skills and languages, with a photo at the top. Suits European applications, where a photo is conventional and a sidebar is a familiar shape, and roles where the skills list is genuinely part of the pitch.",
    parsing:
      "This is a two-column layout, which is the one design decision with real consequences. Export the PDF, copy the text out, and check your job history reads in order before you send it through a portal.",
    twoPages:
      "The rail runs the full height of both pages and can leave a lot of tinted empty space on the second. Worth checking rather than assuming.",
    instead:
      "Toronto for the same idea in sans-serif, or Ledger if the application is going through an automated pipeline you cannot test.",
  },
  compass: {
    suits:
      "Sans-serif, single column, with a photo on the right of the header and banded section headings. A good middle path when the convention where you are applying includes a photo but a sidebar feels like too much structure.",
    parsing:
      "Single column throughout — the photo sits inside the header rather than creating a second column, so extraction stays linear. Just make sure nothing but the image is inside the image.",
    twoPages:
      "Fine. The header only appears once, so the second page is a plain single column and behaves like Meridian.",
    instead:
      "Meridian if you would rather not include a photo, or Copenhagen for a photo with a banded header instead of banded headings.",
  },
  verdant: {
    suits:
      "A narrow coloured strip down the page edge, a photo on the right, and otherwise a clean single column. The strip is the only decorative element and it reads as a brand mark rather than as ornament — useful when you want a page that is recognisably designed without being unconventional.",
    parsing:
      "The edge strip is decoration, not a column, so the text still extracts in one order. Safer than it looks.",
    twoPages:
      "The strip repeats down both pages and ties them together, which is one of the few cases where a decorative element earns its place at length.",
    instead:
      "Meridian if you want the same structure with nothing decorative at all, or Compass to move the emphasis back to the header.",
  },
  onyx: {
    suits:
      "A dark left rail with the photo and contact details reversed out of it. The most assertive layout here that is still conservative in its typography — serif body text against a dark column. Suits senior roles in design-adjacent fields where the page is expected to have a point of view.",
    parsing:
      "Two columns and a dark fill: the two things most likely to cause trouble. The text is real either way, but this is a template to test before trusting.",
    twoPages:
      "The dark rail on a second page is a lot of ink, and it prints poorly on an office laser printer. Worth considering if anyone might print it.",
    instead:
      "Dublin for the same dark rail with plainer headings, or Atlas for a tinted rail that prints without complaint.",
  },
  portrait: {
    suits:
      "A tinted band across the whole header with the photo on the left, then a conventional single column beneath. The band gives the top of the page real presence while everything below it stays completely ordinary — a good combination when you want to be remembered without being a risk.",
    parsing:
      "Single column below the header, so extraction is linear. The band is a background fill.",
    twoPages:
      "The header band only prints once. The second page is plain and unremarkable, which is the correct behaviour.",
    instead:
      "Copenhagen for the same banded header in sans-serif, or Compass if you want the photo without the band.",
  },
  compact: {
    suits:
      "Everything tightened — smaller leading, closer sections, less space around headings. This is the template for the person with ten years of relevant history who refuses to go to two pages, and it buys roughly a third more content on the same sheet.",
    parsing:
      "Density has no effect on a parser. Single column, standard headings, entirely safe.",
    twoPages:
      "If you are on this template and still running to two pages, the problem is the content rather than the layout. Cut the weakest 20% before reaching for a second sheet.",
    instead:
      "Meridian once you are comfortably inside one page, or Minimal if the page now feels airless.",
  },
  oxford: {
    suits:
      "Serif, ruled headings, slightly tighter than Chronicle. The traditional academic look with a little more content per page — suits research, teaching and clinical roles where the publication or certification list is long and cannot be cut.",
    parsing:
      "Single column, real text, conventional structure. No concerns.",
    twoPages:
      "Designed for it. This is one of the templates that reads correctly as a multi-page CV rather than as a one-pager that spilled.",
    instead:
      "Chronicle for a little more air, or Compact if you need to go further still.",
  },
  ashford: {
    suits:
      "A restrained serif with ruled headings and a slightly wider measure than Chronicle, so paragraphs of prose sit more comfortably. Useful if your summary or your role descriptions run to real sentences rather than fragments.",
    parsing:
      "Single column and standard throughout. Safe.",
    twoPages:
      "Holds up. The wider measure means fewer lines per paragraph, which tends to make a two-page document shorter than it looks in other templates.",
    instead:
      "Chronicle if most of your content is bulleted rather than written out, or Editorial for a more pronounced version of the same idea.",
  },
  classic: {
    suits:
      "Exactly what the name says: sans-serif, ruled headings, no opinions. The template to choose when the resume is going somewhere you know nothing about and you want the page to make no argument of its own.",
    parsing:
      "The safest thing on the site along with Ledger and Meridian. Nothing here can be misread.",
    twoPages:
      "Neutral at any length. It neither helps nor hurts a second page.",
    instead:
      "Modern for the same layout with a banded header, or Ledger if a serif suits the field better.",
  },
  modern: {
    suits:
      "A tinted header band over an otherwise plain sans-serif column. The band is the whole design — it gives the top of the page a colour anchor and then gets out of the way. Suits technology and startup applications where a completely unstyled page can read as low effort.",
    parsing:
      "Single column beneath the header. The band is a fill and parses as nothing.",
    twoPages:
      "The band appears once. The second page reads as Classic, which is fine.",
    instead:
      "Classic if you would rather have no colour at all, or Madrid for a stronger header treatment.",
  },
  minimal: {
    suits:
      "The most open layout here — plain headings with no rule or band, and considerably more space between sections than anything else. It suits short, strong histories: three roles with real results on them, where the space reads as confidence rather than as a gap.",
    parsing:
      "Plain headings are still standard headings, so extraction is clean. No decoration at all to interfere.",
    twoPages:
      "Runs very long. At this density a two-page resume is usually a one-page resume that has been spaced out, which is worth catching before you send it.",
    instead:
      "Meridian once you have enough content that the space stops working, or Compact if you have far too much.",
  },
  sidebar: {
    suits:
      "A tinted rail with no photo, carrying skills, tools and languages while the main column holds the narrative. Suits technical roles where the tool list is long enough to be genuinely useful and would otherwise eat a third of the main column.",
    parsing:
      "Two columns, so worth the copy-paste check. The good news is that this template's rail holds only lists — if a parse does interleave, you lose a skills list rather than your job history.",
    twoPages:
      "The rail continues and can look empty on the second page once the skills have run out. Consider whether the content justifies the length.",
    instead:
      "Amsterdam for the same rail with ruled headings, or Meridian to fold the skills back into one column.",
  },
  editorial: {
    suits:
      "Serif, wide measure, generous leading — closer to a magazine page than to a form. It suits writing-led roles, where the resume itself is a small sample of how you handle language, and it rewards prose over bullet fragments.",
    parsing:
      "Single column and completely conventional underneath the typography. Safe.",
    twoPages:
      "Handles length gracefully, which is the point of the extra leading. This is a template that looks better at two pages than at one.",
    instead:
      "Ashford for a tighter version of the same idea, or Chronicle if the field is more conservative than the writing suggests.",
  },
  amsterdam: {
    suits:
      "A tinted rail with ruled headings, no photo. The most businesslike of the two-column layouts — it reads as a structured document rather than as a designed one, which makes it usable in fields where a sidebar would normally be a step too far.",
    parsing:
      "Two columns. Run the copy-paste check before sending it through an automated pipeline.",
    twoPages:
      "The rail carries down the second page and the ruled headings keep it structured. Better at length than most sidebar templates.",
    instead:
      "Sidebar for plainer headings, or Meridian to remove the column risk entirely.",
  },
  berlin: {
    suits:
      "A ruled divider between the columns and short underline stubs beneath each heading. The detailing is precise and slightly technical — it suits engineering and architecture, where a page that looks drawn rather than typed reads as appropriate.",
    parsing:
      "A ruled column split is still a column split. Test it before trusting it to a portal.",
    twoPages:
      "The rule between the columns runs the full height and gives a second page a clear structure. It holds up better than the tinted rails do.",
    instead:
      "New York for the same divided layout with conventional headings, or Singapore for the underline detailing without the second column.",
  },
  chicago: {
    suits:
      "The only dark page here — every colour inverted, with a photo on the left. It is a deliberate statement and it works in exactly one situation: a creative or brand role where you are confident the reader will see it as intent rather than as a mistake.",
    parsing:
      "The text is real and it extracts, but a dark page is the second thing after a sidebar that can cause trouble, and it is excluded from the ATS-safe collection for that reason. Do not send this through a portal you cannot test.",
    twoPages:
      "Two dark pages is a great deal of ink and it will not print acceptably on an office printer. Treat this as a one-page, screen-only document.",
    instead:
      "Onyx if you want the dark treatment confined to a rail, or Madrid for a strong look on a light page.",
  },
  copenhagen: {
    suits:
      "A banded header with the photo on the left, then plain headings below. Scandinavian in the literal sense — restrained, evenly spaced, nothing raised above anything else. Suits European applications where a photo is expected and the rest should stay quiet.",
    parsing:
      "Single column under the header, so extraction is linear and reliable.",
    twoPages:
      "The plain headings give less structure than most, so a second page can read as undifferentiated. Consider Meridian if you are running long.",
    instead:
      "Portrait for the serif equivalent, or Compass if you want the photo without a header band.",
  },
  dublin: {
    suits:
      "A dark rail with plain headings and a photo — the quietest of the dark-sidebar templates. Suits senior roles where you want the page to carry some weight but not to look like a portfolio cover.",
    parsing:
      "Two columns plus a dark fill on one of them. The most worth testing of any layout here alongside Onyx.",
    twoPages:
      "The rail repeats and prints heavily. Same caution as Onyx: fine on screen, expensive on paper.",
    instead:
      "Onyx for banded headings in the same shape, or Toronto for a light rail that prints cleanly.",
  },
  helsinki: {
    suits:
      "Headings set between a rule above and a rule below — the classic ATS-era look, executed properly. It is slightly severe, which suits engineering, manufacturing and public sector applications where formality is read as competence.",
    parsing:
      "Single column with the most conventional heading treatment on the site. If a parser can read anything, it can read this.",
    twoPages:
      "The double rules make sections unmistakable across a break, which makes this one of the better choices for a genuinely long history.",
    instead:
      "Meridian if the double rules feel heavy, or Classic for something more neutral still.",
  },
  madrid: {
    suits:
      "Headings reversed out of small solid chips, with a banded header and a photo. The most graphic template on a light page — it suits marketing, brand and client-facing roles where the resume is expected to demonstrate some visual confidence.",
    parsing:
      "The chips are backgrounds behind real text, not images, so headings still extract. Single column beneath the header.",
    twoPages:
      "The chips give strong section markers on a second page. It handles length better than its styling suggests.",
    instead:
      "Modern for the same header band with plain headings, or Chicago if you want to go considerably further.",
  },
  newyork: {
    suits:
      "A ruled column divider with a photo on the left and conventional ruled headings. Businesslike rather than designed — it is the two-column layout that a conservative reader is least likely to object to.",
    parsing:
      "Two columns. Worth the ten-second check before a portal application.",
    twoPages:
      "The divider and the ruled headings between them keep a second page organised. Among the better sidebar templates at length.",
    instead:
      "Berlin for more precise detailing, or Helsinki to drop to a single column without losing the formality.",
  },
  rome: {
    suits:
      "Serif with plain headings, a photo on the right and slightly open spacing. It reads as a personal letter more than as a form, which suits roles where the relationship matters — client-facing consulting, education, hospitality management.",
    parsing:
      "Single column, real text. The photo sits in the header rather than forming a second column.",
    twoPages:
      "The plain headings offer little structure at length. Better kept to one page than pushed to two.",
    instead:
      "Chronicle if you want ruled headings for a longer document, or Compass for the sans-serif version of the same shape.",
  },
  santiago: {
    suits:
      "Serif with banded headings, similar in weight to Ledger but with the headings ranged left rather than centred. A small difference that changes the feel considerably — it reads as less ceremonial and more current.",
    parsing:
      "Single column, banded headings, nothing decorative. Entirely safe.",
    twoPages:
      "The bands hold a second page together well, the same way Ledger's do.",
    instead:
      "Ledger if you prefer the headings centred, or Chronicle for rules instead of bands.",
  },
  singapore: {
    suits:
      "Short underline stubs beneath each heading and noticeably open spacing. Precise without being cold, and the most contemporary-feeling of the single-column sans templates. Suits product, design-adjacent and consulting roles.",
    parsing:
      "Single column throughout, and the stubs are borders rather than characters. Clean.",
    twoPages:
      "The open spacing runs long. Check whether a second page is content or air before committing to it.",
    instead:
      "Meridian at standard density, or Berlin if you want the same detailing with a sidebar.",
  },
  sydney: {
    suits:
      "A dark rail with a photo and plain headings, lighter in feel than Onyx or Dublin because the main column is set in sans-serif. The most approachable of the dark-sidebar layouts.",
    parsing:
      "Two columns and a dark fill. Test it before sending it anywhere automated.",
    twoPages:
      "As with the other dark rails: heavy on a second page and expensive to print.",
    instead:
      "Toronto for the same layout with a light rail, or Meridian to drop the column entirely.",
  },
  tokyo: {
    suits:
      "A ruled column divider, a banded header and a photo on the left. Structured and slightly formal — it suits roles in large organisations where the resume passes through several hands and needs to look institutional.",
    parsing:
      "Two columns beneath a banded header. Run the check.",
    twoPages:
      "The divider carries the structure down the page and the header does not repeat, so the second page stays clean.",
    instead:
      "Vienna for the same shape with a lighter header, or New York without the band.",
  },
  toronto: {
    suits:
      "A tinted rail with a photo and plain headings — the light-page equivalent of Sydney. It gets the density benefit of a sidebar without the printing cost of a dark one, which makes it the sidebar template to default to.",
    parsing:
      "Two columns, so worth checking, but nothing else about it is unusual.",
    twoPages:
      "The tinted rail is far less visually heavy than a dark one at length, and prints without complaint.",
    instead:
      "Atlas for the serif version, or Sydney if you specifically want the dark treatment.",
  },
  vienna: {
    suits:
      "A ruled divider, a banded header and plain headings — the most understated of the divided-column templates. It suits applications where you want the organisation a sidebar gives you without the page announcing that it has been designed.",
    parsing:
      "Two columns. The usual ten-second check applies.",
    twoPages:
      "The divider holds, but the plain headings give less structure than Tokyo's. Adequate rather than good at length.",
    instead:
      "Tokyo for stronger heading treatment, or Amsterdam for a tinted rail instead of a rule.",
  },
};

/** The note for a template. Every template has one — the Record type makes
 *  adding a template without adding copy a compile error, which is the point. */
export const getTemplateNote = (id: TemplateId): TemplateNote =>
  TEMPLATE_NOTES[id];
