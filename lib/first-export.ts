// The first resume out the door, and the one moment it's worth stopping to
// say so.
//
// Kept in the browser rather than the database: nothing depends on it, a guest
// has to be able to have the moment too, and the worst case — a new browser,
// a second celebration — costs nobody anything. `<FirstExportCelebration>`
// listens for the event and puts the card up; the download itself doesn't know
// or care what happens next.

const KEY = "meniacv:first-export";

/** Fired on `window` the first time a resume PDF lands. */
export const FIRST_EXPORT_EVENT = "meniacv:first-export";

/**
 * Records a finished export, and says whether it was the first one.
 *
 * Storage that throws — private mode, a blocked origin — answers false: no
 * celebration is a far better failure than one on every download.
 */
export function recordExport(): boolean {
  try {
    if (localStorage.getItem(KEY)) return false;
    localStorage.setItem(KEY, new Date().toISOString());
    return true;
  } catch {
    return false;
  }
}
