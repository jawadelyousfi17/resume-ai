// Per-template copy for the detail pages.
//
// Pages that share one sample document and one line of descriptor text are, to
// a search engine, the same page over and over — and there are now a couple of
// hundred of them, which makes it worse rather than better. The sample
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

  // The gallery set. Same four questions, answered from each layout's own
  // descriptor — a two-column page gets the two-column parsing warning, a dark
  // page gets the printing one, and `instead` points at the nearest neighbour.

  sable: {
    suits:
      "Warm two-column work — design, hospitality, anything where warm browns read as considered rather than corporate. The banded headings give a short history more structure than it would otherwise have.",
    parsing:
      "Two columns, so give the extracted text a ten-second check. The heading bands are background fills and add nothing to it.",
    twoPages:
      "The rail empties out on a second page while the history keeps going, which looks unbalanced. Better kept to one.",
    instead:
      "Halcyon for the same shape in a cooler colour, or Atlas if you want a serif face with it.",
  },
  cobalt: {
    suits:
      "Technology, consulting and finance — anywhere a strong blue reads as competent rather than decorative. The right-hand rule keeps skills visible without a filled sidebar.",
    parsing:
      "Two columns divided by a rule rather than a fill, which most parsers handle without complaint. Still worth the check.",
    twoPages:
      "Good. The blue heading rules carry across a page break and the divider does not.",
    instead:
      "Meridian for the single-column version, or Ultramarine for the same idea with the contacts gridded.",
  },
  azure: {
    suits:
      "Healthcare, education and public sector work — the pale blue wash is about as gentle as a coloured header gets, and it suits fields where a strong accent would look out of place.",
    parsing:
      "Two columns. The header wash is a fill and the headings are plain text, so nothing extra reaches the parser.",
    twoPages:
      "Holds up. The centred header does not repeat, so the second page reads as a continuation.",
    instead:
      "Glacier for a roomier version of the same page, or Frost if you would rather the colour ran down the side.",
  },
  vantage: {
    suits:
      "Senior roles where the name should land first. The oversized masthead and the reversed role chips make the job titles the second thing read, which is usually the right order.",
    parsing:
      "Two columns, and the role chips are styled text rather than images — the titles extract normally. Check the column order anyway.",
    twoPages:
      "The chips give a second page enough rhythm to stay readable. One of the better long-history choices here.",
    instead:
      "Toronto for the same chip treatment on a tinted rail, or Ridge if the oversized name is too much.",
  },
  halcyon: {
    suits:
      "Anyone who wants a photo and a sidebar without the page turning corporate. The teal is soft enough for care work, teaching and non-profits.",
    parsing:
      "Two columns with a tinted rail. Worth checking, but there is nothing unusual in it.",
    twoPages:
      "The rail runs out before the history does. Fine at a page and a half, awkward at two.",
    instead:
      "Frost for a cooler version, or Toronto if you want the rail on the other side.",
  },
  hazel: {
    suits:
      "A photo-led page for people-facing work — recruitment, sales, client services. The extra leading keeps it from feeling crowded next to the photograph.",
    parsing:
      "Two columns split by a hairline. Clean otherwise.",
    twoPages:
      "The loose leading pushes content onto a second page quickly. Tighten it in Customize before you cut anything.",
    instead:
      "Praline for the same warmth with rated skills, or Alder for a tighter version.",
  },
  ridge: {
    suits:
      "Engineering, operations, anywhere a plain page with one good rule is the whole brief. The right-hand column keeps skills out of the way of the history.",
    parsing:
      "Two columns, divided by a rule rather than a fill. Straightforward.",
    twoPages:
      "Comfortable. Nothing about it changes at length.",
    instead:
      "Lattice for a lighter version of the same layout, or Meridian to lose the second column entirely.",
  },
  aspen: {
    suits:
      "The one to take when the application is going through an applicant tracking system and you would rather not think about it again. Centred name, one column, no decoration.",
    parsing:
      "As safe as it gets. Single column, conventional headings, real text throughout.",
    twoPages:
      "Fine, though plain — the hairlines give a second page less structure than banded headings would.",
    instead:
      "Helsinki if you want the same safety with more visual weight, or Halyard for three columns of skills.",
  },
  aurum: {
    suits:
      "Law, private banking, luxury retail — fields where old gold and a serif face read as established. Quiet enough that it never tips into ornament.",
    parsing:
      "Two columns. The gold is colour on text, which parsers ignore.",
    twoPages:
      "Handles length well; the serif face is what makes the difference.",
    instead:
      "Brocade for the same colour with the rail on the right, or Ledger for the single-column equivalent.",
  },
  beacon: {
    suits:
      "Marketing, product and startup roles where a page that looks designed is an advantage. The blue heading labels are the whole idea.",
    parsing:
      "Single column, which is the safe part. The labels are background fills behind real text, so they extract normally.",
    twoPages:
      "The labels carry a second page well — they are the strongest section markers here short of a band.",
    instead:
      "Madrid for the same treatment in a bolder colour, or Cinder for a grey version.",
  },
  blush: {
    suits:
      "Short histories that would look thin on a denser page. The loose leading and the warm rule fill space honestly rather than padding it.",
    parsing:
      "Two columns. Nothing else worth flagging.",
    twoPages:
      "Not its strength — at this leading a second page is mostly air. Tighten the spacing or pick something denser.",
    instead:
      "Bloom for a similar feel with a photo, or Chiffon if you want the same warmth with more structure.",
  },
  folio: {
    suits:
      "The plainest serif page here, and the one to take into academia, law or medicine when the reader's taste was formed by paper.",
    parsing:
      "Single column, hairline rules, no decoration. Among the safest layouts on the site.",
    twoPages:
      "Its natural length. This is a template that looks more deliberate at two pages than at one.",
    instead:
      "Chronicle for slightly more weight on the headings, or Cornice for considerably more space.",
  },
  quarry: {
    suits:
      "Technical and industrial work — the wide letter-spacing and grey headings read as specification rather than design. Tight enough for a long history.",
    parsing:
      "Two columns with the shorter sections on the right. Check the order once.",
    twoPages:
      "Good. It was set tight for exactly this.",
    instead:
      "Graphite for four columns of skills, or Lattice for a lighter treatment.",
  },
  cygnus: {
    suits:
      "Anyone who wants a photo and a strong header without a sidebar. The dated left column makes a varied history easy to follow.",
    parsing:
      "Single column, which is the good news. The dates sit in their own column but remain ordinary text.",
    twoPages:
      "Strong. The date column is what keeps a long history legible past the first page.",
    instead:
      "Skipper for the same idea in a lighter navy, or Anthracite without the round photo.",
  },
  terrace: {
    suits:
      "Long, orderly careers — the banded headings and the dated column together make a page that can be read by skimming the left edge.",
    parsing:
      "Single column, with bands that are fills rather than characters. Very safe.",
    twoPages:
      "One of the best here at length. The structure does not depend on the header.",
    instead:
      "Marble for a cooler version, or Portico if you want the photo in a band.",
  },
  colonnade: {
    suits:
      "Formal applications — government, institutions, older firms. The rules above and below each heading are the most conventional treatment available.",
    parsing:
      "Two columns, otherwise textbook. The double rules are borders.",
    twoPages:
      "Excellent. The ruled headings are the strongest continuation markers on the site.",
    instead:
      "Cairn for the single-column version, or Helsinki for the same rules with a blue accent.",
  },
  garnet: {
    suits:
      "Anywhere a deep red reads as confident rather than aggressive — creative direction, hospitality, front-of-house roles.",
    parsing:
      "Two columns under a solid band. The band is a fill; the name inside it is real text.",
    twoPages:
      "The band does not repeat and the rail runs dry, so the second page is noticeably plainer.",
    instead:
      "Mulberry for a darker take, or Vermillion if you want the red without a sidebar.",
  },
  cove: {
    suits:
      "A dark rail without a dark page — the density benefit of a sidebar with a navy header tying it together. Broadly safe across industries.",
    parsing:
      "Two columns, one of them filled. Worth the check; the text itself is ordinary.",
    twoPages:
      "The rail empties and the header does not repeat. Best at one page.",
    instead:
      "Pilot for the same rail with the name above both columns, or Nimbus for a lighter rail.",
  },
  vellum: {
    suits:
      "Publishing, education, the arts — serif type with a photograph, which is a combination most templates avoid and this one handles.",
    parsing:
      "Two columns divided by a hairline. Clean.",
    twoPages:
      "Comfortable; the serif face carries length better than the sans equivalents.",
    instead:
      "Chalk for a paler version, or Atlas for the same idea with a tinted rail.",
  },
  cerulean: {
    suits:
      "Corporate applications that want colour without a sidebar. The solid band is assertive; everything under it is conventional.",
    parsing:
      "Single column with a filled header. Safe.",
    twoPages:
      "Good, though the second page loses the band and with it most of the personality.",
    instead:
      "Bulwark for a denser version, or Meridian if the band is more than you want.",
  },
  fathom: {
    suits:
      "Long technical careers. The full-height navy rail holds a lot of short-form detail while the dated column keeps the history in order.",
    parsing:
      "Two columns with a filled rail — the layout most worth checking against a parser before you send it.",
    twoPages:
      "The date column holds up but the rail does not. Consider a lighter template if you are certain of two pages.",
    instead:
      "Gunmetal for a softer rail colour, or Basalt for a near-black one.",
  },
  anvil: {
    suits:
      "Roles where the page will be skimmed in seconds — recruitment, agency work, high-volume hiring. The solid heading labels are impossible to miss.",
    parsing:
      "Two columns and reversed heading labels. The labels are fills behind real text, so they extract; the columns are the thing to check.",
    twoPages:
      "The labels carry length well. One of the more robust sidebar templates at two pages.",
    instead:
      "Cadet for the same labels on a dark rail, or Cinder for a quieter grey version.",
  },
  pewter: {
    suits:
      "General-purpose applications with a photograph. Grey bands and a dated column make it legible without committing to a colour.",
    parsing:
      "Single column. The bands are fills. Very little to go wrong.",
    twoPages:
      "Strong — the banded headings are what makes the difference on the second page.",
    instead:
      "Portrait for the serif equivalent, or Millstone without the photo.",
  },
  lattice: {
    suits:
      "A quiet default with a second column. Suits people who want skills visible near the top without the page announcing a design decision.",
    parsing:
      "Two columns, ruled rather than filled. Ordinary otherwise.",
    twoPages:
      "Adequate. The hairline headings give less structure at length than a band would.",
    instead:
      "Stipple for a lighter version, or Ridge for capitalised headings.",
  },
  marble: {
    suits:
      "Cool, orderly and photographic — the banded headings and the dated column suit a history with a lot of short roles in it.",
    parsing:
      "Single column with background fills behind the headings. Safe.",
    twoPages:
      "Good. Set slightly tight, so it holds more than it looks like it should.",
    instead:
      "Terrace for a warmer version, or Pewter if you want the photo on the other side.",
  },
  sienna: {
    suits:
      "Writing, editorial and design work — the italic serif name in burnt orange is the most distinctive header here that still belongs on a resume.",
    parsing:
      "Single column with the contacts gridded beside the name. Nothing unusual reaches the parser.",
    twoPages:
      "Comfortable. The serif face and the hairline headings both carry length.",
    instead:
      "Terrazzo for the same colour with labels in the margin, or Chronicle if the italic is too much.",
  },
  strand: {
    suits:
      "People who want a second column and nothing else. A tracked, centred name over a hairline split is close to the minimum a two-column page can be.",
    parsing:
      "Two columns, ruled. Straightforward otherwise.",
    twoPages:
      "Adequate. Plain headings give a second page less to hold onto.",
    instead:
      "Plumbline for the same shape with a rule under the header, or Sterling for a tighter version.",
  },
  lagoon: {
    suits:
      "Care work, education and non-profits — teal reads as approachable where navy reads as corporate, and the dated column keeps a varied history clear.",
    parsing:
      "Two columns with a filled rail. Check the extracted order before sending.",
    twoPages:
      "The date column holds; the rail does not. Best at one page.",
    instead:
      "Verbena for a greener version, or Dublin for the serif equivalent.",
  },
  linen: {
    suits:
      "Short histories and career changers. The space between sections is doing the work that extra content would do on a denser page.",
    parsing:
      "Single column, plain headings, centred name. Very safe.",
    twoPages:
      "Weak — at this leading a second page is mostly white. Tighten it or pick something denser.",
    instead:
      "Cotton for even more room, or Aspen for a ruled version at normal density.",
  },
  regatta: {
    suits:
      "Corporate applications with a photograph — the blue band gives it enough presence that the photo does not have to carry the page.",
    parsing:
      "Two columns under a filled band. Both are worth a check; neither adds text.",
    twoPages:
      "The band does not repeat, so the second page is plainer than the first.",
    instead:
      "Kingfisher for a brighter blue, or Spinnaker for a softer one.",
  },
  slate: {
    suits:
      "A neutral photographic page. The grey wash commits to nothing, which is exactly right when you do not know the house style.",
    parsing:
      "Two columns divided by a rule. Ordinary.",
    twoPages:
      "Fine. Nothing about it depends on the header.",
    instead:
      "Pumice for the photo on the other side, or Boulder without one.",
  },
  frost: {
    suits:
      "Healthcare, administration and public sector work. Pale blue is the least risky colour on the site and this template uses it twice.",
    parsing:
      "Two columns with a tinted rail. Worth the check.",
    twoPages:
      "The rail runs out before the history does. Keep it to a page if you can.",
    instead:
      "Halcyon for a warmer version, or Azure if you want the colour only in the header.",
  },
  cameo: {
    suits:
      "Traditional fields that still want a second column — law, accountancy, academia. A centred serif name between rules is as conventional as this gets.",
    parsing:
      "Two columns. The rules are borders, not characters.",
    twoPages:
      "Very good. The serif face and the ruled header both suit length.",
    instead:
      "Registry for the same idea without the rules, or Colonnade for a sans version.",
  },
  codex: {
    suits:
      "Academic and clinical CVs, and anywhere a page should read like a book rather than a form. The wide margin is the whole design.",
    parsing:
      "Single column. The margin labels are ordinary text in their own column.",
    twoPages:
      "Its natural length. Few templates here look better at two pages than at one; this is one of them.",
    instead:
      "Marginalia for a tighter version, or Meadow for the sans equivalent.",
  },
  citrine: {
    suits:
      "Long histories that have to come in on one page. The tightest leading here paired with a gold rule so it does not read as cramped.",
    parsing:
      "Single column, inline dates, coloured rules. All safe.",
    twoPages:
      "It exists to avoid a second page, but it holds one perfectly well if you need it.",
    instead:
      "Compact for the same density in blue, or Girder if you need to go tighter still.",
  },
  keystone: {
    suits:
      "Institutional applications — universities, hospitals, professional bodies. The boxed serif name reads as a letterhead, which is the intent.",
    parsing:
      "Two columns with a ruled box around the name. The box is a border and the name inside it is real text.",
    twoPages:
      "Good, though the box does not repeat and the second page is much plainer.",
    instead:
      "Bastion for a dark rail instead of a tinted one, or Sandstone for a warmer box.",
  },
  alder: {
    suits:
      "A photographic page set slightly tight — useful when you want a photo and still have a lot of history to fit.",
    parsing:
      "Two columns split by a hairline. Nothing else to flag.",
    twoPages:
      "Handles it well; it was set tight for the purpose.",
    instead:
      "Hazel for a roomier version, or Platinum without the capitals.",
  },
  meadow: {
    suits:
      "Early-career pages and career changes. Headings set out in the margin give a thin history the appearance of structure it has not earned yet, in the good sense.",
    parsing:
      "Single column. The margin headings extract in order.",
    twoPages:
      "Poor value at length — this is the loosest page here and a second one will be mostly air.",
    instead:
      "Signal for the same layout at normal spacing, or Parchment for a warmer version.",
  },
  papyrus: {
    suits:
      "Traditional serif fields with a lot to say — the ruled headings and tight leading together hold more than most serif pages manage.",
    parsing:
      "Single column with rules above and below each heading. Textbook.",
    twoPages:
      "Excellent. The double rules are the strongest continuation markers available.",
    instead:
      "Quill for a lighter version, or Santiago for a centred one.",
  },
  admiral: {
    suits:
      "Senior roles in traditional industries. The combination of a serif face and a navy rail is unusual and reads as more formal than either alone.",
    parsing:
      "Two columns with a filled rail. Check the extracted order.",
    twoPages:
      "The rail runs dry. Better at one page, and it was set tight to help you get there.",
    instead:
      "Dublin for a green rail, or Regent for a charcoal one.",
  },
  almanac: {
    suits:
      "Formal serif applications with a lot of short-form competencies. The three columns keep a long skills list from taking a third of the page.",
    parsing:
      "Single column overall — the three columns are within the skills section only. Safe.",
    twoPages:
      "Very good. Centred headings hold a second page together well.",
    instead:
      "Santiago for banded headings, or Quill for a denser version.",
  },
  opal: {
    suits:
      "A photographic page with the details out of the way on the right. The centred name keeps it from looking front-heavy.",
    parsing:
      "Two columns with the shorter sections on the right. Check the order once.",
    twoPages:
      "Fine, though slightly loose — expect a second page sooner than you would with Alder.",
    instead:
      "Crosshatch for a square photo, or Harlequin for rated skills.",
  },
  girder: {
    suits:
      "The densest page here. For a fifteen-year history that genuinely will not cut down and still has to fit on one sheet.",
    parsing:
      "Single column, inline dates, three columns of skills. All conventional.",
    twoPages:
      "It exists to prevent one. If you are already at two, you have room to move to something more comfortable.",
    instead:
      "Compact if you want a colour with it, or Bedrock for slightly more air.",
  },
  sapphire: {
    suits:
      "Corporate applications that need to be compact but not severe. Skills on a single line save more space than any other setting here.",
    parsing:
      "Single column. The inline skills extract as one comma-separated run, which parsers handle.",
    twoPages:
      "Good. Set tight enough that a second page usually is not necessary.",
    instead:
      "Ensign for a formal serif-adjacent version, or Bergen if you want a serif face.",
  },
  ashen: {
    suits:
      "When you want a sidebar and a photograph and nothing else to be noticed. Grey commits to nothing.",
    parsing:
      "Two columns with a tinted rail. Ordinary otherwise.",
    twoPages:
      "The rail empties out. Fine at a page and a half.",
    instead:
      "Dovetail for a round photo, or Sepia for a warmer rail.",
  },
  quill: {
    suits:
      "Academic and professional CVs with a long competency list. Serif type and three columns is an unusual pairing and it works.",
    parsing:
      "Single column, ruled headings. Very safe.",
    twoPages:
      "Comfortable. Set slightly tight, so it takes a long history before you get there.",
    instead:
      "Almanac for a centred version, or Papyrus for heavier rules.",
  },
  brocade: {
    suits:
      "Luxury retail, private client work, the arts. Old gold on a serif face with the details out of the way on the right.",
    parsing:
      "Two columns with the shorter sections on the right. Check it once.",
    twoPages:
      "Good — the serif face does the work.",
    instead:
      "Aurum for the rail on the other side, or Bullion for gold on navy.",
  },
  cairn: {
    suits:
      "Applications that will be read by a machine first and a person second. Ruled headings, three skill columns, tight leading, no colour.",
    parsing:
      "Single column and about as parser-proof as anything on the site.",
    twoPages:
      "Very good. The double rules carry the structure across the break.",
    instead:
      "Helsinki for the same rules in blue, or Chancery for centred headings.",
  },
  verbena: {
    suits:
      "Environmental, wellness and non-profit work, where a green rail reads as deliberate rather than decorative.",
    parsing:
      "Two columns with a filled rail. The usual check applies.",
    twoPages:
      "The rail runs out before the history does. One page suits it better.",
    instead:
      "Lagoon for a teal version, or Dublin for a darker green with a serif face.",
  },
  argent: {
    suits:
      "Professional services — the gridded contacts and the heavy rule under the name give it the look of a letterhead without the ornament.",
    parsing:
      "Two columns. The rule is a border; the gridded contacts are ordinary text.",
    twoPages:
      "Good. The serif face carries the length and the header does not need to repeat.",
    instead:
      "Palazzo for a larger name, or Crest for the title set alongside it.",
  },
  rosewood: {
    suits:
      "Design, beauty and events work. Dusty pink under a serif name is warm without reading as unserious.",
    parsing:
      "Two columns with the shorter sections on the right, under a tinted band. Both are fills.",
    twoPages:
      "The band does not repeat, so the second page loses most of the colour.",
    instead:
      "Camellia for the colour down the side instead, or Chevron for a grey version.",
  },
  obsidian: {
    suits:
      "Creative and technical portfolios where the resume is part of the work. A near-black page is a statement, and it should be a deliberate one.",
    parsing:
      "The text is real and extracts normally, but a dark page is the other thing that makes reviewers nervous. Send a light template if the posting mentions an applicant tracking system.",
    twoPages:
      "Prints heavily at any length. At two pages, consider whether the reader will actually print it.",
    instead:
      "Chicago for a dark page with a serif face, or Domino if you want the contrast without printing the whole sheet.",
  },
  sandstone: {
    suits:
      "Architecture, interiors and craft work — a boxed serif name on sand reads as considered material choice rather than decoration.",
    parsing:
      "Two columns with a ruled box around the name. Both fine; check the column order.",
    twoPages:
      "The box does not repeat. Adequate, not strong.",
    instead:
      "Keystone for a cooler version, or Heirloom for the colour down the side.",
  },
  quartz: {
    suits:
      "Pages that need to be recognisable across a desk. The edge strip is purely visual and does the whole job on its own.",
    parsing:
      "Single column, but the edge strip is decoration a strict reviewer may flag. The text itself is unaffected.",
    twoPages:
      "Loose, so a second page comes sooner than you would expect. The strip does carry across it.",
    instead:
      "Coral for a warmer strip, or Cotton for the same spacing without one.",
  },
  bedrock: {
    suits:
      "Straightforward applications with a lot of history. Inline dates and tight leading, and nothing else to think about.",
    parsing:
      "Single column, conventional headings, inline dates. Among the safest here.",
    twoPages:
      "Good. Dense enough that you may not need the second page at all.",
    instead:
      "Girder if you need to go tighter, or Broadsheet for a little more air.",
  },
  apricot: {
    suits:
      "Client-facing work in warmer industries — hospitality, wellness, retail. The peach band is friendly without being childish.",
    parsing:
      "Two columns under a tinted band. Ordinary otherwise.",
    twoPages:
      "The band does not repeat and the rail empties. One page suits it.",
    instead:
      "Blush for a serif version, or Terracotta for something bolder.",
  },
  mulberry: {
    suits:
      "Creative direction, publishing, the arts. Deep plum is rare enough to be memorable and dark enough to stay professional.",
    parsing:
      "Two columns under a solid band. Both are fills; the text is unaffected.",
    twoPages:
      "Plainer on the second page once the band is gone.",
    instead:
      "Garnet for a red version, or Amethyst if you want the colour without a sidebar.",
  },
  ivory: {
    suits:
      "A warm neutral page for people who find grey cold and colour risky. The hairline is the only structure it has, and it is enough.",
    parsing:
      "Two columns, ruled. Nothing else to check.",
    twoPages:
      "Adequate. Loose enough that a long history will need the second page.",
    instead:
      "Quire for a cooler version, or Sterling for a tighter one.",
  },
  cirrus: {
    suits:
      "Varied histories with a lot of short roles. The dated column makes the sequence obvious and the three skill columns keep the list from sprawling.",
    parsing:
      "Single column. The date column is ordinary text.",
    twoPages:
      "Strong — the dated left column is what carries a long history.",
    instead:
      "Signal for a tighter version, or Halyard if you would rather the dates sat on the right.",
  },
  basalt: {
    suits:
      "Technical work with a long history and a photograph. The near-black rail holds a lot of short detail and the dated column orders the rest.",
    parsing:
      "Two columns with a filled rail. Check the extracted order before sending.",
    twoPages:
      "The date column holds up better than the rail does.",
    instead:
      "Gunmetal for a softer rail, or Monolith for a heavier one.",
  },
  camel: {
    suits:
      "Warm, orderly and traditional — the sand band and dated column suit long careers in established industries.",
    parsing:
      "Two columns under a tinted band. Both fills.",
    twoPages:
      "Good. The date column does the work once the band is gone.",
    instead:
      "Portico for a grey version, or Terrace if you want banded headings with it.",
  },
  bracken: {
    suits:
      "Environmental, agricultural and outdoor work. Olive is unusual on a resume and reads as considered rather than accidental.",
    parsing:
      "Two columns under a solid band. Ordinary text throughout.",
    twoPages:
      "The band does not repeat. Best at one page.",
    instead:
      "Sagebrush for the colour down the side, or Verbena for a lighter green.",
  },
  flint: {
    suits:
      "Businesslike photographic pages with a lot to fit. Banded headings and inline dates together save more room than either alone.",
    parsing:
      "Single column with background fills behind the headings. Very safe.",
    twoPages:
      "Strong. The bands carry the structure across the break.",
    instead:
      "Pewter for a rounder photo, or Lintel for a header band instead.",
  },
  bastion: {
    suits:
      "Formal applications that still want a sidebar — a boxed serif name above a navy rail is the most institutional combination here.",
    parsing:
      "Two columns with a filled rail and a ruled box. Worth checking the order.",
    twoPages:
      "The box and the rail both stop after page one. Adequate.",
    instead:
      "Keystone for a tinted rail, or Admiral if you want the name inside the rail.",
  },
  tawny: {
    suits:
      "Warm two-column pages with the photograph on the right — useful when the left edge is where you want the reader to start reading, not looking.",
    parsing:
      "Two columns with the shorter sections on the right, under a tinted band.",
    twoPages:
      "The rail empties. Fine at a page and a half.",
    instead:
      "Sepia for the photo on the left, or Boulder without one.",
  },
  periwinkle: {
    suits:
      "Junior and mid-level roles where the page should read as approachable. Light blue and a round photo is a friendly combination.",
    parsing:
      "Two columns split by a hairline. Ordinary.",
    twoPages:
      "Slightly loose, so expect the second page sooner. It holds up once you are there.",
    instead:
      "Spinnaker for a stronger blue, or Frost for a tinted rail.",
  },
  cadet: {
    suits:
      "Pages that will be skimmed fast. A navy rail with reversed heading labels gives every section a hard edge.",
    parsing:
      "Two columns with a filled rail and reversed labels. The labels extract; the columns are the thing to check.",
    twoPages:
      "The labels hold the second page together better than most sidebar templates manage.",
    instead:
      "Anvil for a tinted rail, or Nautilus for rated skills instead of labels.",
  },
  aurora: {
    suits:
      "Roomy, modern and photographic without a sidebar. Centred headings over a wide page suit a moderate history that should not look padded.",
    parsing:
      "Single column with three columns inside the skills section. Safe.",
    twoPages:
      "Loose, so a long history will run over. It reads well once it does.",
    instead:
      "Halyard for a tighter version, or Cotton for even more space.",
  },
  ensign: {
    suits:
      "Compact formal applications. The ruled headings and single-line skills together produce a short, serious page.",
    parsing:
      "Single column. The inline skills extract as one run.",
    twoPages:
      "Good, though it was set tight to avoid needing it.",
    instead:
      "Sapphire for a lighter blue, or Cairn if you want three skill columns instead.",
  },
  graphite: {
    suits:
      "Technical and operational roles with a long tools list. Four columns of skills is the most this renderer will do, and it is the point of this template.",
    parsing:
      "Single column with a four-column skills block. Parsers read it as one list.",
    twoPages:
      "Good. Set tight and built to hold a lot.",
    instead:
      "Compact for the same four columns with a blue accent, or Quarry for a two-column layout.",
  },
  chalk: {
    suits:
      "Fashion, photography and the arts. A pale serif name over a round photo is closer to a portfolio cover than a form, which is the intent.",
    parsing:
      "Two columns. The pale accent is colour on text only.",
    twoPages:
      "Comfortable, if a little quiet on the second page.",
    instead:
      "Alabaster without the photo, or Vellum for more contrast.",
  },
  nautilus: {
    suits:
      "Sidebar pages where the skills need rating rather than listing. Dots read as a judgement, so use them where you can defend one.",
    parsing:
      "Two columns with a filled rail. The dot meters are drawn, not text — the skill names still extract, but the ratings do not.",
    twoPages:
      "The rail runs out. Set tight, so one page is usually achievable.",
    instead:
      "Corvette for the same idea with a dated column, or Harbor for meter bars instead of dots.",
  },
  truffle: {
    suits:
      "Warmer alternatives to black — hospitality, food, craft. Dark brown reads softer than charcoal and is considerably rarer.",
    parsing:
      "Two columns under a solid band. Ordinary text throughout.",
    twoPages:
      "The band does not repeat and the page flattens out.",
    instead:
      "Domino for a black band, or Cocoa if you want the brown down the side as well.",
  },
  starboard: {
    suits:
      "Two-column pages where the history should start at the left edge and the details sit out of the way on the right.",
    parsing:
      "Two columns with a filled rail on the right. Check the extracted order — right-hand rails sometimes come out first.",
    twoPages:
      "The rail empties before the history does.",
    instead:
      "Sydney for the same shape with meter bars, or Belfry for banded headings.",
  },
  cornice: {
    suits:
      "Senior applications in traditional fields. A widely letterspaced serif name with a lot of room under it reads as seniority rather than decoration.",
    parsing:
      "Two columns. The letter-spacing is a style, not inserted characters, so the name extracts intact.",
    twoPages:
      "Loose, so a long history will run over — and it reads well when it does.",
    instead:
      "Alabaster for an even quieter version, or Cameo for something tighter.",
  },
  dovetail: {
    suits:
      "A soft grey sidebar with a photo, for applications where you want structure without any colour decision at all.",
    parsing:
      "Two columns with a tinted rail. Ordinary otherwise.",
    twoPages:
      "The rail empties out. Best at one page.",
    instead:
      "Ashen for a square photo, or Rosetta if you want some warmth in the rail.",
  },
  coral: {
    suits:
      "Creative work that still has to look organised. The edge strip and the dated column are doing two different jobs and neither gets in the way.",
    parsing:
      "Single column, but the edge strip is decoration some reviewers dislike. The text is unaffected.",
    twoPages:
      "Good — the date column carries it and the strip runs the full length.",
    instead:
      "Quartz for a neutral strip, or Cirrus for the same dated column without one.",
  },
  lumen: {
    suits:
      "Photographic pages with a varied history. The dated column is what separates it from every other round-photo template here.",
    parsing:
      "Two columns split by a hairline, with dates in their own column. All ordinary text.",
    twoPages:
      "Strong. The dated column does the work the rail cannot.",
    instead:
      "Periwinkle for more colour, or Signal without the photo.",
  },
  praline: {
    suits:
      "Warm client-facing work where rated skills make sense — beauty, hospitality, personal training. The dots are a judgement, so be ready to defend them.",
    parsing:
      "Two columns. The dot meters are drawn, so the ratings do not extract; the skill names do.",
    twoPages:
      "Loose. Expect a second page from a moderate history.",
    instead:
      "Harlequin for the same dots on a plainer page, or Apricot for a listed version.",
  },
  marigold: {
    suits:
      "Deliberately bold applications — creative agencies, events, anywhere being remembered matters more than blending in.",
    parsing:
      "Two columns under a solid yellow band. The band is a fill; check the columns.",
    twoPages:
      "The band does not repeat, and the second page is a different template entirely in feel.",
    instead:
      "Hornet for the yellow down the edge instead, or Vienna for a green equivalent.",
  },
  topaz: {
    suits:
      "Traditional serif applications with a photo and a long, dated history. The ruled headings hold it all together.",
    parsing:
      "Single column with rules above and below each heading. Very safe.",
    twoPages:
      "Excellent — the ruled headings and the date column both carry across the break.",
    instead:
      "Rome for numbered headings instead, or Chiffon for a lighter version.",
  },
  sovereign: {
    suits:
      "Everyone who wants the organisation of a dark sidebar and would rather not send a photograph. There are good reasons not to, and this is the template for them.",
    parsing:
      "Two columns with a filled rail. Check the extracted order.",
    twoPages:
      "The rail runs out before the history does.",
    instead:
      "Onyx if you change your mind about the photo, or Sydney for the rail on the right.",
  },
  parchment: {
    suits:
      "Warm, document-like pages — grant applications, academic posts, anywhere a resume should read as a paper rather than a pitch.",
    parsing:
      "Single column with the section labels in their own column. Ordinary text.",
    twoPages:
      "Good. The margin labels are what make a second page navigable.",
    instead:
      "Meadow for more space, or Marginalia for a serif face and less of it.",
  },
  harbor: {
    suits:
      "Sidebar pages where the skills want a visual weighting. Meter bars read as more confident than dots and take a similar amount of room.",
    parsing:
      "Two columns with a filled rail. The bars are drawn — the skill names extract, the levels do not.",
    twoPages:
      "The rail empties out. One page suits it best.",
    instead:
      "Sydney for the rail on the right, or Nautilus for dots instead of bars.",
  },
  portico: {
    suits:
      "Steady, conventional applications with a photograph and a long history. The dated column is the reason to pick it over the other grey-band templates.",
    parsing:
      "Two columns under a tinted band, dates in their own column. All fine.",
    twoPages:
      "One of the better sidebar templates at length, because the date column keeps working after the rail stops.",
    instead:
      "Camel for a warmer band, or Skipper for a navy one.",
  },
  rampart: {
    suits:
      "Conventional applications with a long tools or certifications list. The boxed name and four skill columns are both about fitting more in.",
    parsing:
      "Single column with a ruled box around the name. The box is a border.",
    twoPages:
      "Good, though the box does not repeat.",
    instead:
      "Gridiron for a ruled second column, or Graphite without the box.",
  },
  filigree: {
    suits:
      "Private client work and the professions — a gold serif name with matching hairlines, and nothing else going on.",
    parsing:
      "Single column with coloured rules under the headings. Safe.",
    twoPages:
      "Comfortable; the rules carry the structure over.",
    instead:
      "Aurum for a two-column version, or Meridian for the sans equivalent in blue.",
  },
  aquamarine: {
    suits:
      "Applications that want colour used structurally rather than decoratively. The keyline and the rules are the same blue doing two jobs.",
    parsing:
      "Two columns with a ruled box around the name. Both are borders.",
    twoPages:
      "Adequate. The keyline does not repeat and the page loses some of its shape.",
    instead:
      "Cobalt without the box, or Cerulean for a solid band instead.",
  },
  pumice: {
    suits:
      "A grey photographic page for applications where the house style is unknown. Deliberately without an opinion.",
    parsing:
      "Two columns under a tinted band. Ordinary.",
    twoPages:
      "Slightly loose; a long history will run over comfortably enough.",
    instead:
      "Slate for the photo on the other side, or Dovetail for a tinted rail.",
  },
  kingfisher: {
    suits:
      "Bright, modern applications with a photograph — product, marketing, agency work. The blue is strong without being corporate navy.",
    parsing:
      "Two columns under a solid band. Ordinary text throughout.",
    twoPages:
      "The band does not repeat. Best at one page.",
    instead:
      "Cascade for a dated column with it, or Regatta for a deeper blue.",
  },
  glacier: {
    suits:
      "Roomy, cool and inoffensive. Good for moderate histories that would look cramped on a denser page and thin on a plainer one.",
    parsing:
      "Two columns under a tinted band. Nothing unusual.",
    twoPages:
      "Loose — a second page arrives sooner than on most two-column templates here.",
    instead:
      "Azure for a tighter version, or Frost for the colour down the side.",
  },
  cocoa: {
    suits:
      "Warm sidebar pages with rated skills. Brown reads as approachable where navy reads as corporate, and the meters give the rail something to do.",
    parsing:
      "Two columns with a filled rail and drawn meter bars. Skill names extract; levels do not.",
    twoPages:
      "The rail runs out and the band does not repeat.",
    instead:
      "Sepia for a lighter brown, or Harbor for the navy equivalent.",
  },
  pebble: {
    suits:
      "Unremarkable in the best sense — a photograph, one tight column and three columns of skills. Suits most applications and stands out in none.",
    parsing:
      "Single column. Very safe.",
    twoPages:
      "Good. Dense enough that many histories will not need it.",
    instead:
      "Bedrock without the photo, or Pewter for banded headings.",
  },
  vesper: {
    suits:
      "Formal serif applications with a second column. Darker and more severe than Cameo, which suits some fields and not others.",
    parsing:
      "Two columns between rules. Both are borders.",
    twoPages:
      "Very good. The serif face and the ruled header both suit length.",
    instead:
      "Registry for something softer, or Vellum if you want a photo with it.",
  },
  pilot: {
    suits:
      "The simplest dark-rail page here — the name spans both columns, so the rail carries detail rather than identity.",
    parsing:
      "Two columns with a filled rail. Check the extracted order.",
    twoPages:
      "The rail empties. Adequate.",
    instead:
      "Cove for a header band with it, or Sovereign if you would rather not include a photo.",
  },
  obelisk: {
    suits:
      "Quiet serif applications with the details out of the way on the right. Grey and roomy, which suits senior rather than junior histories.",
    parsing:
      "Two columns with the shorter sections on the right. Check the order once.",
    twoPages:
      "Comfortable, and the extra spacing means you will get there.",
    instead:
      "Brocade for gold instead of grey, or Cornice for a centred version.",
  },
  monolith: {
    suits:
      "Bold, photographic pages for creative and technical work. The black rail and the oversized name are a single idea, twice.",
    parsing:
      "Two columns with a filled rail. Worth checking; the rail is the darkest here.",
    twoPages:
      "Heavy to print at length, and the rail stops after the first page.",
    instead:
      "Vantage for the same oversized name without a filled rail, or Basalt for something less absolute.",
  },
  astra: {
    suits:
      "Conventional applications with a photo and a lot of skills. The ruled headings do most of the structural work.",
    parsing:
      "Single column with rules above and below each heading. Textbook.",
    twoPages:
      "Strong — the double rules are the best continuation markers available.",
    instead:
      "Helsinki for a brighter blue, or Crosshatch if you want a second column.",
  },
  saffron: {
    suits:
      "Applications with a long tools list that still want some warmth. Gold rules and four skill columns, set slightly tight.",
    parsing:
      "Single column with a four-column skills block. Parsers read it as one list.",
    twoPages:
      "Good. The coloured rules carry the structure across.",
    instead:
      "Citrine for a denser version, or Rampart if you would rather box the name.",
  },
  cypress: {
    suits:
      "Applications where the job title matters as much as the name — consultants, contractors, anyone whose title is the pitch.",
    parsing:
      "Two columns split by a hairline. The inline title extracts alongside the name.",
    twoPages:
      "Fine, if a little plain past the first page.",
    instead:
      "Crest for the serif version, or Chronicle without the second column.",
  },
  standard: {
    suits:
      "The default when nothing about the application suggests otherwise. Centred, gridded contacts, one column, three columns of skills.",
    parsing:
      "Single column with icons that are decorative — the contact text beside them extracts normally. Very safe.",
    twoPages:
      "Fine. Plain, but nothing about it fails at length.",
    instead:
      "Aspen for a plainer version, or Halyard for a little more air.",
  },
  regent: {
    suits:
      "Senior serif applications with a photograph. Charcoal is less committal than navy and the dated column suits a long career.",
    parsing:
      "Two columns with a filled rail. Check the extracted order.",
    twoPages:
      "The date column holds; the rail does not.",
    instead:
      "Admiral for a navy rail, or Onyx for the same idea with banded headings.",
  },
  cotton: {
    suits:
      "The thinnest histories on the site — first jobs, career changes, returns to work. The spacing is doing honest work here.",
    parsing:
      "Single column, plain headings. As safe as anything.",
    twoPages:
      "Avoid. At this leading a second page is almost entirely white space.",
    instead:
      "Linen for slightly less air, or Minimal if you want the same idea with the existing set.",
  },
  heirloom: {
    suits:
      "Traditional fields that still want a photograph — private education, family firms, the professions abroad where photos are expected.",
    parsing:
      "Two columns with a tinted rail. Ordinary otherwise.",
    twoPages:
      "The rail empties. Comfortable enough at a page and a half.",
    instead:
      "Sandpiper for a rounder photo, or Atlas for a modern equivalent.",
  },
  cobble: {
    suits:
      "Tight photographic pages. A small square photo takes far less room than a round one at the same scale, which is the entire reason to pick this.",
    parsing:
      "Single column. Very safe.",
    twoPages:
      "Good — it was set tight for the purpose.",
    instead:
      "Junction for a dated column with it, or Pebble for the photo on the right.",
  },
  hornet: {
    suits:
      "Graphic and high-contrast work where the page is part of the portfolio. Not for conservative industries, and it does not pretend otherwise.",
    parsing:
      "Two columns and an edge strip. The strip is decoration a strict reviewer may object to; the text is unaffected.",
    twoPages:
      "The strip runs the full length, which helps, but the rail does not.",
    instead:
      "Marigold for the yellow in a band instead, or Quartz for a neutral strip.",
  },
  stipple: {
    suits:
      "Undemanding two-column pages. Plain headings, a rule on the right, and nothing that needs explaining.",
    parsing:
      "Two columns with the shorter sections on the right. Check it once.",
    twoPages:
      "Adequate. Plain headings give a second page little to hold onto.",
    instead:
      "Lattice for capitalised headings, or Sterling for a tighter version.",
  },
  seafoam: {
    suits:
      "Wellness, care and design work. A soft teal band with a square photo is friendly without tipping into pastel.",
    parsing:
      "Two columns under a solid band. Ordinary.",
    twoPages:
      "The band does not repeat and the page flattens.",
    instead:
      "Verbena for the colour down the side, or Halcyon for a tinted rail.",
  },
  bluebell: {
    suits:
      "Formal applications that want colour — a blue serif name with matching rules is more approachable than black and just as conventional.",
    parsing:
      "Two columns with coloured rules under the headings. All safe.",
    twoPages:
      "Very good. The rules carry across and the serif face suits the length.",
    instead:
      "Meridian for the sans version, or Juniper for green instead of blue.",
  },
  domino: {
    suits:
      "High-contrast pages with no colour at all. A solid black band and metered skills, for applications where restraint and boldness both matter.",
    parsing:
      "Two columns under a solid band, with drawn meter bars. Skill names extract; levels do not.",
    twoPages:
      "The band does not repeat and the meters take room a second page rarely justifies.",
    instead:
      "Truffle for a warmer band, or Inkwell if you would rather box the name.",
  },
  registry: {
    suits:
      "The safest serif two-column page here. Broad enough for law, education, healthcare and the public sector without adjustment.",
    parsing:
      "Two columns, conventional headings. Straightforward.",
    twoPages:
      "Very good. Roomy, and the serif face carries it.",
    instead:
      "Cameo for ruled headings, or Ledger for the single-column equivalent.",
  },
  anthracite: {
    suits:
      "Photographic pages with a long dated history and no sidebar. Slate is softer than black and reads as neutral rather than severe.",
    parsing:
      "Single column with a filled band and dates in their own column. Safe.",
    twoPages:
      "Strong. The date column keeps working after the band is gone.",
    instead:
      "Cygnus for a deeper navy, or Skipper for something lighter.",
  },
  syntax: {
    suits:
      "Technical roles where the skills list is the substance. The meter bars in a tinted rail read as a self-assessment, so be prepared to justify them.",
    parsing:
      "Two columns with drawn meter bars. Skill names extract; levels do not.",
    twoPages:
      "Set tight, so one page is usually achievable. The rail empties if it is not.",
    instead:
      "Berlin for the same bars with a hairline split, or Harbor for a dark rail.",
  },
  cinder: {
    suits:
      "Structured pages without a colour decision. Grey heading labels give every section a hard edge and commit to nothing.",
    parsing:
      "Two columns with reversed heading labels. The labels are fills behind real text.",
    twoPages:
      "The labels carry a second page well. One of the stronger two-column choices at length.",
    instead:
      "Anvil for a tinted rail with it, or Placard for full-width labels.",
  },
  fjord: {
    suits:
      "Long technical histories with a photograph. The tightest of the dark-rail templates, which is what makes it usable at length.",
    parsing:
      "Two columns with a filled rail. Check the extracted order.",
    twoPages:
      "Better than most sidebar templates here, because it was set tight enough to often avoid one.",
    instead:
      "Gunmetal for more air, or Basalt for a darker rail.",
  },
  tidewater: {
    suits:
      "Sidebar pages that need strong section markers in the main column too. The banded headings are what the rail cannot do.",
    parsing:
      "Two columns with a filled rail and background fills behind the headings. All ordinary text.",
    twoPages:
      "The bands hold the second page together after the rail stops. A good long-history sidebar choice.",
    instead:
      "Belfry for the rail on the right, or Onyx for a serif version.",
  },
  bulwark: {
    suits:
      "Corporate applications with a lot of content. A navy band, gridded contacts and tight leading — presence at the top, density everywhere else.",
    parsing:
      "Single column under a filled band. Safe.",
    twoPages:
      "Good, though the band does not repeat.",
    instead:
      "Vanguard for a centred name, or Cerulean for a lighter blue.",
  },
  inkwell: {
    suits:
      "Graphic applications that stay monochrome. The reversed name box and the meter bars are the only two decisions it makes.",
    parsing:
      "Single column with a filled name box and drawn meters. The name extracts; the meter levels do not.",
    twoPages:
      "The date column carries it; the box does not repeat.",
    instead:
      "Vitrine if you want a rail with it, or Domino for a band instead of a box.",
  },
  silverpoint: {
    suits:
      "Monochrome photographic pages. A square photo and a hairline split, with no colour anywhere.",
    parsing:
      "Two columns split by a hairline. Ordinary.",
    twoPages:
      "Fine, if quiet.",
    instead:
      "Tintype for a tighter version, or Crosshatch for the photo on the right.",
  },
  rosetta: {
    suits:
      "Warm sidebar pages without a strong colour. Dusty rose is softer than grey and less committal than it looks.",
    parsing:
      "Two columns with a tinted rail. Nothing unusual.",
    twoPages:
      "The rail empties out. Best at one page.",
    instead:
      "Shell for a paler rail, or Camellia for a serif version.",
  },
  cerise: {
    suits:
      "Creative and front-of-house work in industries where pink reads as brand rather than accident. The reversed heading labels keep it organised.",
    parsing:
      "Two columns with reversed heading labels. The labels are fills behind real text.",
    twoPages:
      "The labels carry the structure across; the colour does most of the rest.",
    instead:
      "Peony for a softer version, or Flamingo if you want the pink down the edge.",
  },
  nimbus: {
    suits:
      "The most rounded-off page here — a navy header over a grey rail, which is a combination that suits almost any office.",
    parsing:
      "Two columns under a filled band. Check the order once.",
    twoPages:
      "The band does not repeat and the rail empties.",
    instead:
      "Cove for a dark rail instead, or Insignia for a tighter version.",
  },
  sterling: {
    suits:
      "A safe default with a second column. Capitalised headings, a hairline split, and no other decisions to make.",
    parsing:
      "Two columns, ruled. Straightforward.",
    twoPages:
      "Adequate. Nothing about it fails, and nothing about it helps.",
    instead:
      "Quire for a greyer version, or Sidebar for a tinted rail from the original set.",
  },
  mariner: {
    suits:
      "Dark-rail pages with a compact history. Inline dates save a line per role, which adds up across a long list.",
    parsing:
      "Two columns with a filled rail and inline dates. Check the extracted order.",
    twoPages:
      "The rail empties. The inline dates help you avoid needing a second page at all.",
    instead:
      "Fjord for a tighter version, or Lighthouse if you want the skills metered.",
  },
  junction: {
    suits:
      "Photographic pages with a varied history and no sidebar. The dated column does what a rail would, without the parsing question.",
    parsing:
      "Single column with dates in their own column. Very safe.",
    twoPages:
      "Strong. The date column is the most reliable structure at length.",
    instead:
      "Cobble for a tighter version, or Signal without the photo.",
  },
  chancery: {
    suits:
      "Formal, dense applications — institutions, government, professional bodies. Centred ruled headings over a tight body.",
    parsing:
      "Single column with rules above and below each heading. Textbook.",
    twoPages:
      "Excellent, and dense enough that you may not need it.",
    instead:
      "Cairn for left-aligned headings, or Santiago for a serif version.",
  },
  pillar: {
    suits:
      "Spare, graphic pages that still want a second column. The black edge strip is the only decoration and it carries the whole page.",
    parsing:
      "Two columns and an edge strip. The strip is decoration; the text is unaffected.",
    twoPages:
      "The strip runs the full length, which is more than most decorative elements manage.",
    instead:
      "Quartz for a centred version without the split, or Flamingo for a coloured strip.",
  },
  tintype: {
    suits:
      "Photographic pages set tight. Near-black and square-cropped, which reads as more deliberate than the round-photo templates.",
    parsing:
      "Two columns split by a hairline. Ordinary.",
    twoPages:
      "Good — it was set tight for it.",
    instead:
      "Silverpoint for more air, or Salon for a serif version.",
  },
  gunmetal: {
    suits:
      "Long histories with a photograph. The slate rail is softer than navy and the dated column is what makes it work at length.",
    parsing:
      "Two columns with a filled rail. Check the extracted order.",
    twoPages:
      "Better than most dark-rail templates, because the date column keeps working after the rail stops.",
    instead:
      "Basalt for a darker rail, or Corvette if you want the skills rated.",
  },
  palazzo: {
    suits:
      "Senior serif applications with a lot to say. A display name, gridded contacts and enough room that it never looks crowded.",
    parsing:
      "Two columns with a rule under the header. All ordinary text.",
    twoPages:
      "Very good. This is a template that expects two pages.",
    instead:
      "Argent for a smaller name, or Cornice for considerably more space.",
  },
  amethyst: {
    suits:
      "Applications that want an unusual colour used conservatively. Purple rules on an otherwise plain page is about as far as this can be taken safely.",
    parsing:
      "Single column with coloured rules. Safe.",
    twoPages:
      "Good, and set tight enough that you may not need it.",
    instead:
      "Mulberry for the colour in a band instead, or Meridian for the blue equivalent.",
  },
  charcoal: {
    suits:
      "Pages that will be skimmed. Reversed heading labels, a square photo and rated skills — every section is marked twice over.",
    parsing:
      "Single column with reversed labels and drawn dot meters. The labels and skill names extract; the ratings do not.",
    twoPages:
      "Strong. The labels and the date column both carry across.",
    instead:
      "Placard for full-width labels without the rating, or Cinder for a lighter grey.",
  },
  salon: {
    suits:
      "Editorial, fashion and photographic work. An italic serif name beside a square photo is the closest thing here to a magazine masthead.",
    parsing:
      "Two columns split by a hairline. The italic is a style, not an image.",
    twoPages:
      "Comfortable; the serif face carries it.",
    instead:
      "Chalk for a paler version, or Tintype for a sans equivalent.",
  },
  lintel: {
    suits:
      "Dense photographic pages. A grey band, a small square photo and tight leading, for a long history that still wants a face on it.",
    parsing:
      "Single column under a filled band. Safe.",
    twoPages:
      "Good — it was set tight to help you avoid one.",
    instead:
      "Cobble without the band, or Flint for banded headings instead.",
  },
  belfry: {
    suits:
      "Right-hand sidebar pages that need strong section markers on the left. The banded headings do the work the rail cannot.",
    parsing:
      "Two columns with a filled rail on the right. Check the extracted order — right-hand rails sometimes come out first.",
    twoPages:
      "The bands hold the second page together after the rail stops.",
    instead:
      "Tidewater for the rail on the left, or Starboard for plainer headings.",
  },
  quire: {
    suits:
      "Neutral two-column pages. Grey, plain and deliberately without character, which is occasionally exactly the brief.",
    parsing:
      "Two columns, ruled. Straightforward.",
    twoPages:
      "Adequate. Plain headings give a second page little structure.",
    instead:
      "Sterling for a tighter version, or Ivory for something warmer.",
  },
  chiffon: {
    suits:
      "Warm serif pages with a photograph. Cream and gold, centred, and rather softer than the other serif two-column templates.",
    parsing:
      "Two columns under a ruled header. All ordinary text.",
    twoPages:
      "Comfortable. The serif face and the centred header both help.",
    instead:
      "Bloom for more space, or Arcadia for a display serif.",
  },
  camellia: {
    suits:
      "Soft, symmetrical serif pages for design, beauty and events work. About as far from corporate as the site goes.",
    parsing:
      "Two columns with a tinted rail. Ordinary otherwise.",
    twoPages:
      "The rail empties out. Best at one page.",
    instead:
      "Peony for rated skills with it, or Rosewood for the colour in a band.",
  },
  vanguard: {
    suits:
      "Dense corporate applications that want a strong header. A centred name reversed out of navy, then everything tight underneath.",
    parsing:
      "Single column under a filled band. Safe.",
    twoPages:
      "Good, though the second page loses the band.",
    instead:
      "Bulwark for a left-aligned name, or Ensign for a lighter version.",
  },
  bullion: {
    suits:
      "Formal serif applications with real presence — a serif name reversed out of navy, with the details ruled off to the right.",
    parsing:
      "Two columns under a filled band, with the shorter sections on the right. Worth a check.",
    twoPages:
      "The band does not repeat, but the serif face carries the rest.",
    instead:
      "Brocade for gold on white, or Vanguard for the sans equivalent.",
  },
  tarmac: {
    suits:
      "Plain applications with a varied history. A heavy name, a rule, and every date in its own column.",
    parsing:
      "Two columns with dates in their own column. All ordinary text.",
    twoPages:
      "Strong. The date column is what carries it.",
    instead:
      "Concourse for plainer headings, or Signal without the second column.",
  },
  corvette: {
    suits:
      "Dark-rail pages with rated skills and a long dated history. The most structured of the navy sidebar templates.",
    parsing:
      "Two columns with a filled rail and drawn dot meters. Skill names extract; ratings do not.",
    twoPages:
      "The date column holds after the rail runs out.",
    instead:
      "Nautilus without the dated column, or Harbor for meter bars instead of dots.",
  },
  peony: {
    suits:
      "Decorative serif pages for beauty, events and design. Pink, rated skills and a square photo — it is not trying to be neutral.",
    parsing:
      "Two columns with a tinted rail and drawn dot meters. Skill names extract; ratings do not.",
    twoPages:
      "The rail empties. Best kept to one page.",
    instead:
      "Camellia for a listed version, or Ballet for banded headings.",
  },
  placard: {
    suits:
      "Fast-read applications — agency work, high-volume hiring. Full-width heading blocks are the loudest section markers here.",
    parsing:
      "Single column with reversed heading labels. The labels are fills behind real text.",
    twoPages:
      "Very good. The blocks carry a second page better than almost anything else.",
    instead:
      "Charcoal for rated skills with it, or Madrid for a coloured version.",
  },
  boulder: {
    suits:
      "Neutral two-column pages with the details on the right. A grey band, gridded contacts, and no other decisions.",
    parsing:
      "Two columns with the shorter sections on the right, under a tinted band.",
    twoPages:
      "The band does not repeat and the rail empties.",
    instead:
      "Slate for a photo with it, or Tawny for a warmer band.",
  },
  chevron: {
    suits:
      "Traditional serif applications with a second column. Centred, grey-banded and about as symmetrical as this renderer gets.",
    parsing:
      "Two columns under a tinted band. Ordinary.",
    twoPages:
      "Comfortable; the serif face does the work.",
    instead:
      "Registry without the band, or Bellini for a warmer one.",
  },
  skipper: {
    suits:
      "Tidy photographic pages with a long dated history and no sidebar to run out.",
    parsing:
      "Single column with a filled band and dates in their own column. Safe.",
    twoPages:
      "Strong. The date column keeps working after the band is gone.",
    instead:
      "Cygnus for a deeper navy, or Cascade for a brighter one.",
  },
  foundry: {
    suits:
      "Plain applications with gridded contacts. Nothing distinctive about it, which makes it hard to get wrong.",
    parsing:
      "Single column, plain headings. Very safe.",
    twoPages:
      "Fine, if unremarkable.",
    instead:
      "Broadsheet for a tighter version, or Standard for a centred name.",
  },
  spinnaker: {
    suits:
      "Modern applications with a photograph. The blue-tinted header is lighter than a solid band and suits offices that are not quite corporate.",
    parsing:
      "Two columns under a tinted band. Ordinary otherwise.",
    twoPages:
      "The band does not repeat. Adequate.",
    instead:
      "Kingfisher for a solid band, or Periwinkle for something softer.",
  },
  bulletin: {
    suits:
      "Contractors and consultants with a long client list. The inline title and the tight leading are both about fitting more in.",
    parsing:
      "Single column with the title beside the name. Very safe.",
    twoPages:
      "Good. Dense enough that many histories will not need it.",
    instead:
      "Cypress for a second column, or Bedrock if the inline title is not useful.",
  },
  signal: {
    suits:
      "Varied histories with a lot of short roles. One clean column with every date stepped out to the left, and nothing else.",
    parsing:
      "Single column with dates in their own column. Among the safest layouts here.",
    twoPages:
      "Strong. The date column is the most reliable structure at length.",
    instead:
      "Cirrus for three columns of skills, or Singapore for numbered sections.",
  },
  ballet: {
    suits:
      "Soft, decorative serif pages. The blush rail and the banded headings together suit design, beauty and events work.",
    parsing:
      "Two columns with a tinted rail and background fills behind the headings. All ordinary text.",
    twoPages:
      "The bands hold the second page after the rail runs out.",
    instead:
      "Peony for rated skills, or Camellia for plainer headings.",
  },
  concourse: {
    suits:
      "Wide, flat pages that need to be taken in quickly. A heavy name, a rule, and the shorter sections ruled off alongside.",
    parsing:
      "Two columns, ruled. Straightforward.",
    twoPages:
      "Fine, though the plain headings give a second page little shape.",
    instead:
      "Tarmac for a dated column with it, or Ridge for a tighter version.",
  },
  harlequin: {
    suits:
      "Two-column pages where the skills want rating. Dots read as a judgement, so use them where you can back one up.",
    parsing:
      "Two columns with drawn dot meters. Skill names extract; ratings do not.",
    twoPages:
      "The dots take room a second page rarely justifies.",
    instead:
      "Praline for a warmer version, or Strand for a listed one.",
  },
  terracotta: {
    suits:
      "Earthy, bold applications — craft, food, interiors. A clay header with reversed heading labels and metered skills.",
    parsing:
      "Single column with reversed labels and drawn meter bars. Labels and skill names extract; levels do not.",
    twoPages:
      "The labels carry it well. One of the stronger single-column choices at length.",
    instead:
      "Sienna for something quieter, or Madrid for a brighter equivalent.",
  },
  marquee: {
    suits:
      "Creative applications with real presence. A display serif on cream against a near-black rail is the most theatrical page here.",
    parsing:
      "Two columns with a filled rail on the right. Check the extracted order.",
    twoPages:
      "Heavy to print, and the rail stops after the first page.",
    instead:
      "Monolith for a sans version, or Arcadia for the same serif without the rail.",
  },
  windward: {
    suits:
      "Dark-rail pages that need to stay short. Skills on a single line save more room than any other setting available.",
    parsing:
      "Two columns with a filled rail. The inline skills extract as one run.",
    twoPages:
      "The rail empties, but the inline skills help you avoid needing a second page.",
    instead:
      "Fjord for a listed version, or Sovereign if you would rather not include a photo.",
  },
  milestone: {
    suits:
      "Plain, structured applications. Centred name, grey banded headings, three columns of skills — safe almost anywhere.",
    parsing:
      "Single column with background fills behind the headings. Very safe.",
    twoPages:
      "Strong. The bands are what carry the structure across.",
    instead:
      "Ballast for a denser version, or Pewter if you want a photograph.",
  },
  beaufort: {
    suits:
      "Compact applications with a lot of sections. Labels in the left margin let you keep the body text tight without losing the reader.",
    parsing:
      "Single column with the section labels in their own column. Ordinary text.",
    twoPages:
      "Good — the margin labels do the navigating.",
    instead:
      "Signal for a plainer version, or Parchment for more room.",
  },
  platinum: {
    suits:
      "Even, unhurried photographic pages. Grey, letterspaced and without any strong opinion.",
    parsing:
      "Two columns split by a hairline. Ordinary.",
    twoPages:
      "Fine. Nothing about it changes at length.",
    instead:
      "Alder for a tighter version, or Dovetail for a tinted rail.",
  },
  flamingo: {
    suits:
      "Graphic pages in industries where pink is a brand decision. The boxed name and the edge strip are a matched pair.",
    parsing:
      "Single column with a ruled box and an edge strip. The strip is decoration; the text is unaffected.",
    twoPages:
      "The strip runs the full length. The box does not repeat.",
    instead:
      "Cerise for the colour used structurally instead, or Quartz for a neutral strip.",
  },
  ballast: {
    suits:
      "Dense pages that still need clear sections. Grey bands and tight leading, with three columns of skills to keep the list short.",
    parsing:
      "Single column with background fills behind the headings. Safe.",
    twoPages:
      "Very good, and dense enough that many histories will not need it.",
    instead:
      "Milestone for more air, or Girder if you need to go tighter still.",
  },
  longitude: {
    suits:
      "Corporate applications with the details ruled off to one side. The navy band gives it presence the columns alone would not.",
    parsing:
      "Two columns with the shorter sections on the right, under a filled band.",
    twoPages:
      "The band does not repeat. Adequate.",
    instead:
      "Bulwark without the second column, or Ultramarine for a brighter blue.",
  },
  broadsheet: {
    suits:
      "Plain, wide applications with a lot of history. Gridded contacts, plain headings, and nothing that draws attention.",
    parsing:
      "Single column. Among the safest layouts here.",
    twoPages:
      "Good. Set slightly tight, so it holds more than it looks like it should.",
    instead:
      "Foundry for a little more air, or Bedrock for ruled headings.",
  },
  marginalia: {
    suits:
      "Academic and research pages with a lot of sections. A serif face with labels in the margin, set tight enough to stay on one sheet.",
    parsing:
      "Single column with the section labels in their own column. Safe.",
    twoPages:
      "Very good — this is a layout that improves at length.",
    instead:
      "Codex for considerably more space, or Beaufort for the sans equivalent.",
  },
  alabaster: {
    suits:
      "Senior serif applications where the page should feel unhurried. The loosest serif template here, and it suits a short, strong history.",
    parsing:
      "Two columns split by a hairline. All ordinary text.",
    twoPages:
      "At this spacing a second page arrives quickly and is mostly air. Tighten it first.",
    instead:
      "Cornice for slightly less space, or Registry for a normal density.",
  },
  cascade: {
    suits:
      "Energetic modern applications with a photograph and a varied history — product, marketing, agency work.",
    parsing:
      "Single column with a filled band and dates in their own column. Safe.",
    twoPages:
      "Strong. The date column keeps working after the band is gone.",
    instead:
      "Kingfisher for a second column, or Skipper for a deeper navy.",
  },
  vermillion: {
    suits:
      "Bold applications that stay single-column. Red rules and a red display name, with the title set alongside it.",
    parsing:
      "Single column with coloured rules. Safe.",
    twoPages:
      "Good — the rules carry the structure across.",
    instead:
      "Garnet for the red in a band instead, or Citrine for a warmer accent.",
  },
  sagebrush: {
    suits:
      "Serif pages with a right-hand rail. Khaki is unusual enough to be memorable and muted enough to stay professional.",
    parsing:
      "Two columns with a tinted rail on the right. Check the extracted order.",
    twoPages:
      "The rail empties out before the history does.",
    instead:
      "Bracken for the colour in a band, or Heirloom for a warmer rail on the left.",
  },
  crosshatch: {
    suits:
      "Even-handed technical pages. A square photo top right with the education and skills ruled off beneath it.",
    parsing:
      "Two columns with the shorter sections on the right. Check the order once.",
    twoPages:
      "Fine, if slightly loose.",
    instead:
      "Silverpoint for the photo on the left, or Opal for a centred name.",
  },
  juniper: {
    suits:
      "Formal serif applications with one clear colour idea. Deep green rules read as considered where blue reads as default.",
    parsing:
      "Single column with coloured rules under the headings. Very safe.",
    twoPages:
      "Good, and set tight enough that you may not need it.",
    instead:
      "Bluebell for the blue equivalent, or Filigree for gold.",
  },
  regalia: {
    suits:
      "Applications that want a red accent without a red page. The tinted header keeps it civil and the dated column keeps it legible.",
    parsing:
      "Single column with dates in their own column. Safe.",
    twoPages:
      "Strong. The date column carries it once the header is gone.",
    instead:
      "Vermillion for stronger colour, or Skipper for navy instead of red.",
  },
  fernwood: {
    suits:
      "Creative and environmental work where a dark page is a deliberate choice. Deep green prints softer than black and is considerably rarer.",
    parsing:
      "The text is real and extracts normally, but a dark page is what makes reviewers nervous. Send a light template if the posting mentions an applicant tracking system.",
    twoPages:
      "Prints heavily at any length. Think about whether the reader will print it at all.",
    instead:
      "Obsidian for a near-black version, or Verbena for the same colour on a light page.",
  },
  millstone: {
    suits:
      "Plain, sturdy applications with a long dated history. Grey bands and a date column, and nothing that will ever look fashionable.",
    parsing:
      "Single column with background fills behind the headings. Very safe.",
    twoPages:
      "Strong — the bands and the date column both carry across.",
    instead:
      "Milestone for a centred name, or Terrace if you want a photograph.",
  },
  sepia: {
    suits:
      "Warm sidebar pages with a square photo. Softer than grey, and less of a commitment than a coloured rail.",
    parsing:
      "Two columns with a tinted rail. Ordinary otherwise.",
    twoPages:
      "The rail empties out. Best at one page.",
    instead:
      "Ashen for a cooler rail, or Heirloom for a serif version.",
  },
  crest: {
    suits:
      "Serif applications where the title carries as much weight as the name — consultants, specialists, anyone whose role is the pitch.",
    parsing:
      "Two columns with a rule under the header. The inline title extracts alongside the name.",
    twoPages:
      "Comfortable; the serif face carries it.",
    instead:
      "Cypress for the sans version, or Argent if the title is less important.",
  },
  shell: {
    suits:
      "The palest coloured template here. Suits applications where you want warmth in the page and no colour anyone could object to.",
    parsing:
      "Two columns with a tinted rail. Nothing unusual.",
    twoPages:
      "The rail runs out before the history does.",
    instead:
      "Rosetta for a stronger rail, or Ashen if you would rather it were grey.",
  },
  insignia: {
    suits:
      "Official-looking applications with a photograph and a lot of content. Navy and compact, without a filled rail to run dry.",
    parsing:
      "Two columns under a tinted band. Check the order once.",
    twoPages:
      "Good — it was set tight to help you avoid one.",
    instead:
      "Nimbus for a tinted rail with it, or Lintel for a grey band.",
  },
  lighthouse: {
    suits:
      "Dark-rail pages that need to carry references and rated skills as well as contacts. The most content the rail here will hold.",
    parsing:
      "Two columns with a filled rail and drawn meter bars. Skill names extract; levels do not.",
    twoPages:
      "The rail empties. The inline dates help you stay on one page.",
    instead:
      "Harbor for a plainer version, or Mariner for listed skills.",
  },
  bloom: {
    suits:
      "Short serif histories that need room to breathe — first roles, returns to work, career changes into softer industries.",
    parsing:
      "Single column, plain headings, centred name. Very safe.",
    twoPages:
      "Loose enough that a second page will be mostly white. Tighten it first.",
    instead:
      "Chiffon for a second column, or Bellini for something tighter.",
  },
  atelier: {
    suits:
      "Design and studio work with a long competency list. Centred serif headings and three columns, which is an unusual pairing that works.",
    parsing:
      "Single column with a three-column skills block. Safe.",
    twoPages:
      "Comfortable, and the centred headings hold it together.",
    instead:
      "Almanac for a darker version, or Quill for a denser one.",
  },
  bellini: {
    suits:
      "Warm formal applications. A centred serif name over a sand contact strip, which is about as unthreatening as a page can be.",
    parsing:
      "Single column under a tinted strip. Safe.",
    twoPages:
      "Fine, though the strip does not repeat.",
    instead:
      "Chevron for a second column, or Santiago for banded headings.",
  },
  playbill: {
    suits:
      "Arts, media and education. A blue display serif over a tinted rail, which reads as institutional in a good way.",
    parsing:
      "Two columns with a tinted rail. Ordinary otherwise.",
    twoPages:
      "The rail empties out. Best at one page.",
    instead:
      "Sandpiper for a warmer rail, or Arcadia if you would rather have a hairline.",
  },
  arcadia: {
    suits:
      "Roomy serif pages with a photograph. Warm, calm and closer to a programme note than a form.",
    parsing:
      "Two columns split by a hairline. All ordinary text.",
    twoPages:
      "Comfortable. The serif face carries it and the spacing means you will get there.",
    instead:
      "Vellum for a tighter version, or Marquee if you want a dark rail with it.",
  },
  blueprint: {
    suits:
      "Technical pages where the skills want weighting. A square photo and meter bars, with nothing else competing.",
    parsing:
      "Single column with drawn meter bars. Skill names extract; levels do not.",
    twoPages:
      "Fine. The meters take room a second page rarely justifies.",
    instead:
      "Junction for listed skills, or Syntax if you want a rail with it.",
  },
  colophon: {
    suits:
      "Serif applications that want one modern element. Metered skills under a letterspaced centred name is an unusual combination and a good one.",
    parsing:
      "Single column with drawn meter bars. Skill names extract; levels do not.",
    twoPages:
      "Comfortable; the ruled header and the serif face both help.",
    instead:
      "Cameo for listed skills, or Terracotta for something bolder.",
  },
  ultramarine: {
    suits:
      "Corporate applications with a strong blue accent and the details ruled off to the right.",
    parsing:
      "Two columns with the shorter sections on the right, under coloured heading rules.",
    twoPages:
      "Good. The rules carry across even though the columns do not.",
    instead:
      "Cobalt for a deeper blue, or Longitude if you would rather the colour sat in a band.",
  },
  terrazzo: {
    suits:
      "Design and craft work that still wants a serif face. Rust rules with the sections labelled down the margin.",
    parsing:
      "Single column with the labels in their own column and coloured rules. All safe.",
    twoPages:
      "Good — the margin labels do the navigating.",
    instead:
      "Sienna for the colour in the name instead, or Marginalia without it.",
  },
  verdigris: {
    suits:
      "Light, slightly unusual applications. A mint band with metered skills, for industries where soft colour is not a risk.",
    parsing:
      "Single column under a tinted band, with drawn meter bars. Skill names extract; levels do not.",
    twoPages:
      "The band does not repeat and the meters take room. Best at one page.",
    instead:
      "Seafoam for a stronger teal, or Milestone for a listed version.",
  },
  capsule: {
    suits:
      "Short applications that should look finished rather than sparse. The boxed name and single-line skills together make a page that ends on purpose.",
    parsing:
      "Single column with a ruled box around the name. The inline skills extract as one run.",
    twoPages:
      "Poor fit — the whole shape of it is a one-page document.",
    instead:
      "Rampart for a longer history, or Sapphire if you want the inline skills without the box.",
  },
  sandpiper: {
    suits:
      "Warm serif pages with a rail. Sand and a display serif, which suits hospitality, wellness and the softer end of professional services.",
    parsing:
      "Two columns with a tinted rail. Ordinary otherwise.",
    twoPages:
      "The rail empties out before the history does.",
    instead:
      "Heirloom for a square photo, or Playbill for a cooler version.",
  },
  gridiron: {
    suits:
      "Applications with a long tools list and a second column. Four columns of skills alongside a ruled right-hand rail is the most this will hold.",
    parsing:
      "Two columns with a four-column skills block. Check the extracted order once.",
    twoPages:
      "Good. Set tight and built for volume.",
    instead:
      "Graphite for a single-column version, or Rampart if you would rather box the name.",
  },
  halyard: {
    suits:
      "About as neutral as this gets — a centred name, a rule, plain headings and three columns of skills. Safe anywhere.",
    parsing:
      "Single column. Among the safest layouts on the site.",
    twoPages:
      "Fine, if a little plain past the first page.",
    instead:
      "Standard for gridded contacts, or Aspen for a tighter version.",
  },
  plumbline: {
    suits:
      "Symmetrical, quiet two-column pages. A centred name over a rule with the page split down the middle.",
    parsing:
      "Two columns, ruled. Straightforward.",
    twoPages:
      "Adequate. The centred header does not repeat, which helps.",
    instead:
      "Strand for a slightly roomier version, or Colonnade for ruled headings.",
  },
  vitrine: {
    suits:
      "Framed, severe pages for creative and technical work. A ruled box above a near-black rail, which is two strong ideas at once.",
    parsing:
      "Two columns with a filled rail and a ruled box. Worth checking the extracted order.",
    twoPages:
      "Neither the box nor the rail survives the break. Best at one page.",
    instead:
      "Monolith without the box, or Inkwell without the rail.",
  },
};

/** The note for a template. Every template has one — the Record type makes
 *  adding a template without adding copy a compile error, which is the point. */
export const getTemplateNote = (id: TemplateId): TemplateNote =>
  TEMPLATE_NOTES[id];
