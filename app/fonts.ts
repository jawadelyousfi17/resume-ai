// The typefaces a resume can be set in.
//
// All of them are variable fonts, self-hosted by next/font — no request leaves
// the app at runtime, and the PDF renderer gets the same files the preview
// does, so an export matches what was on screen. Declaring a font here doesn't
// download it: the browser only fetches a face once something on the page is
// actually set in it.
//
// The catalogue that names and groups these for the UI lives in lib/fonts.ts;
// this file only loads them and hands out the CSS variables.

import {
  Bitter,
  Cormorant_Garamond,
  Crimson_Pro,
  DM_Sans,
  EB_Garamond,
  IBM_Plex_Mono,
  IBM_Plex_Sans,
  Inter,
  JetBrains_Mono,
  Lato,
  Libre_Baskerville,
  Lora,
  Manrope,
  Merriweather,
  Montserrat,
  Nunito_Sans,
  Open_Sans,
  PT_Serif,
  Playfair_Display,
  Roboto,
  Roboto_Mono,
  Source_Code_Pro,
  Source_Sans_3,
  Source_Serif_4,
  Work_Sans,
} from "next/font/google";

/** The app's own interface font — not offered as a resume typeface. */
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

// Written out one by one, repetition and all: next/font reads these at build
// time and rejects anything that isn't a literal — no shared options object,
// no helper, no spread.
//
// `weight` is omitted wherever the family is a variable font, which gives the
// whole weight range from a single file. The three that aren't — Lato, PT Serif
// and IBM Plex Mono — have to name their weights, and only the ones the page
// actually reaches for: body, semibold and bold, plus Lato's black for a name
// set large. Italic is included throughout because several templates set the
// job title in it.

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const ebGaramond = EB_Garamond({
  variable: "--font-eb-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair-display",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const libreBaskerville = Libre_Baskerville({
  variable: "--font-libre-baskerville",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const ptSerif = PT_Serif({
  variable: "--font-pt-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  variable: "--font-crimson-pro",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const bitter = Bitter({
  variable: "--font-bitter",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  variable: "--font-cormorant-garamond",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceCodePro = Source_Code_Pro({
  variable: "--font-source-code-pro",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

/** Every font variable, for the <html> element. Put on the root so the print
 *  page — which renders outside the editor — resolves them too. */
export const fontVariables = [
  manrope.variable,
  inter.variable,
  roboto.variable,
  sourceSans.variable,
  lora.variable,
  sourceSerif.variable,
  merriweather.variable,
  ebGaramond.variable,
  jetbrainsMono.variable,
  openSans.variable,
  lato.variable,
  montserrat.variable,
  workSans.variable,
  nunitoSans.variable,
  dmSans.variable,
  ibmPlexSans.variable,
  playfairDisplay.variable,
  libreBaskerville.variable,
  ptSerif.variable,
  crimsonPro.variable,
  bitter.variable,
  cormorantGaramond.variable,
  ibmPlexMono.variable,
  robotoMono.variable,
  sourceCodePro.variable,
].join(" ");
