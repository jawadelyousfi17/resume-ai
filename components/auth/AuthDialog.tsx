"use client";

// Signing in without leaving the page.
//
// `/login` still exists — OAuth comes back to it, and it's what the proxy
// redirects to — but from inside the app the same form opens over whatever the
// user was doing. It signs them back into the page they were on rather than
// the dashboard, so a guest mid-resume keeps their place.

import { createContext, useCallback, useContext, useState } from "react";
import { usePathname } from "next/navigation";
import { AuthCard } from "./AuthCard";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Mode = "signin" | "signup";

const AuthDialogContext = createContext<{
  /** Opens the sign-in form over the current page. */
  open: (mode?: Mode) => void;
}>({ open: () => {} });

/** Lets any component ask for the sign-in form — the buttons that need it are
 *  scattered from the dashboard sidebar to individual editor fields. */
export function useAuthDialog() {
  return useContext(AuthDialogContext);
}

export function AuthDialogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mode, setMode] = useState<Mode | null>(null);

  const open = useCallback((next: Mode = "signin") => setMode(next), []);

  return (
    <AuthDialogContext.Provider value={{ open }}>
      {children}

      <Dialog
        open={mode !== null}
        onOpenChange={(next) => !next && setMode(null)}
      >
        <DialogContent
          fullScreen
          className="max-w-[480px] p-8 sm:max-w-[480px]"
        >
          {/* The card carries its own heading; this one names the dialog for
              screen readers without being drawn twice. */}
          <DialogTitle className="sr-only">Sign in to maniacv</DialogTitle>
          <AuthCard
            // Land back where they were. A guest signing in from the editor
            // returns to the editor, and their resume follows them.
            next={pathname || "/dashboard"}
            initialMode={mode ?? "signin"}
          />
        </DialogContent>
      </Dialog>
    </AuthDialogContext.Provider>
  );
}
