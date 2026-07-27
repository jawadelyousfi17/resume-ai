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
        {/* Caps the whole app at 7xl and centres it, so it doesn't sprawl on
            wide monitors. Children still own their own full-height layout. */}
        <AuthDialogProvider>
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </AuthDialogProvider>
        <ThemeSwitcher />
        <Toaster />
      </body>
    </html>
  );
}
