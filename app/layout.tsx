import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { AuthDialogProvider } from "@/components/auth/AuthDialog";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ResumeAI — Build a standout resume",
  description: "Create, customize, and export a beautiful resume in minutes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("h-full font-sans", manrope.variable)}>
      <body className="min-h-full">
        {/* Caps the whole app at 7xl and centres it, so it doesn't sprawl on
            wide monitors. Children still own their own full-height layout. */}
        <AuthDialogProvider>
          <div className="mx-auto w-full max-w-[1600px]">{children}</div>
        </AuthDialogProvider>
        <Toaster />
      </body>
    </html>
  );
}
