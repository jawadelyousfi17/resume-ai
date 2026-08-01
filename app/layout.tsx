import type { Metadata } from "next";
import { Suspense } from "react";
import { fontVariables } from "./fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toast";
import { FirstExportCelebration } from "@/components/ui/first-export-celebration";
import { NavProgress } from "@/components/ui/nav-progress";
import { FeedbackNudge } from "@/components/feedback/FeedbackNudge";
import { configuredSiteUrl } from "@/lib/site-url";
import { AuthDialogProvider } from "@/components/auth/AuthDialog";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { FontSwitcher } from "@/components/theme/FontSwitcher";
import { DEFAULT_THEME, LEGACY_THEME_KEY, THEME_KEY } from "@/lib/themes";
import { UI_FONT_KEY } from "@/lib/ui-fonts";

const siteUrl = configuredSiteUrl();

export const metadata: Metadata = {
  // Pages declare canonical and Open Graph URLs as paths; Next resolves them
  // against this. Left undefined when NEXT_PUBLIC_SITE_URL isn't set, so those
  // URLs stay relative rather than pointing at a host we guessed wrong.
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "meniacv — Build a standout resume",
  description: "Create, customize, and export a beautiful resume in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme={DEFAULT_THEME}
      className={cn("h-full font-sans", fontVariables)}
    >
      <head>
        {/* Applies the saved theme before anything paints, so a visitor who
            picked Sunset never sees a frame of Ocean first. */}
        <script
          dangerouslySetInnerHTML={{
            // Falls back to the old key: the name used to be spelled wrong,
            // and a theme picked under it shouldn't reset itself. Moved over
            // on the way past, so this only reads twice once.
            __html: `try{var k=${JSON.stringify(THEME_KEY)},t=localStorage.getItem(k);if(!t){t=localStorage.getItem(${JSON.stringify(LEGACY_THEME_KEY)});if(t){localStorage.setItem(k,t);localStorage.removeItem(${JSON.stringify(LEGACY_THEME_KEY)})}}if(t)document.documentElement.dataset.theme=t;var f=localStorage.getItem(${JSON.stringify(UI_FONT_KEY)});if(f)document.documentElement.dataset.uiFont=f}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full">
        {/* Reads `useSearchParams`, which without a boundary would opt every
            static page into client rendering. Nothing renders until a
            navigation is slow enough to be worth a bar, so the fallback is
            nothing. */}
        <Suspense fallback={null}>
          <NavProgress />
        </Suspense>
        {/* Nothing is capped here. The signed-in app is centred and held to
            `--container-app` by its own shells, and the public pages run edge
            to edge — a cap at this level put the marketing header's border and
            background inside a centred box, which reads as a bug on a wide
            monitor. */}
        <AuthDialogProvider>{children}</AuthDialogProvider>
        <ThemeSwitcher />
        {/* A tool for picking the interface font, not a setting to ship: it
            sits above the theme pill in development and isn't rendered in a
            production build. Delete this guard to hand it to everyone. */}
        {process.env.NODE_ENV !== "production" && <FontSwitcher />}
        {/* Dormant until the first resume is downloaded, wherever that
            happens from. */}
        <FirstExportCelebration />
        {/* Asleep until something goes right — see lib/feedback-nudge. */}
        <FeedbackNudge />
        <Toaster />
      </body>
    </html>
  );
}
