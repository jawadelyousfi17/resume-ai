import type { Metadata } from "next";
import { fontVariables } from "./fonts";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { configuredSiteUrl } from "@/lib/site-url";
import { AuthDialogProvider } from "@/components/auth/AuthDialog";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
import { DEFAULT_THEME, THEME_KEY } from "@/lib/themes";

const siteUrl = configuredSiteUrl();

export const metadata: Metadata = {
  // Pages declare canonical and Open Graph URLs as paths; Next resolves them
  // against this. Left undefined when NEXT_PUBLIC_SITE_URL isn't set, so those
  // URLs stay relative rather than pointing at a host we guessed wrong.
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: "maniacv — Build a standout resume",
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
            __html: `try{var t=localStorage.getItem(${JSON.stringify(THEME_KEY)});if(t)document.documentElement.dataset.theme=t}catch(e){}`,
          }}
        />
      </head>
      <body className="min-h-full">
        {/* Nothing is capped here. The signed-in app is centred and held to
            `--container-app` by its own shells, and the public pages run edge
            to edge — a cap at this level put the marketing header's border and
            background inside a centred box, which reads as a bug on a wide
            monitor. */}
        <AuthDialogProvider>{children}</AuthDialogProvider>
        <ThemeSwitcher />
        <Toaster />
      </body>
    </html>
  );
}
