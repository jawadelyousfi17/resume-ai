// Client-side download helpers for the generated resume artifacts.

/** Trigger a browser download of a Blob under the given filename. */
export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Download a string as a .tex file. */
export function downloadTex(filename: string, content: string) {
  const name = filename.endsWith(".tex") ? filename : `${filename}.tex`;
  downloadBlob(name, new Blob([content], { type: "application/x-tex" }));
}

/** Turn a resume name into a safe file base, e.g. "Resume 1" -> "resume-1". */
export function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "resume"
  );
}
