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
  EB_Garamond,
  Inter,
  JetBrains_Mono,
  Lora,
  Manrope,
  Merriweather,
  Roboto,
  Source_Sans_3,
  Source_Serif_4,
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
// `weight` is omitted throughout because every family here is a variable font,
// which gives the whole weight range from a single file. Italic is included
// because several templates set the job title in it.

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
].join(" ");
