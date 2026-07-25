import Link from "next/link";

// Shown when the id doesn't belong to a resume this user owns.
export default function ResumeNotFound() {
  return (
    <div className="flex h-dvh flex-col items-center justify-center gap-3 text-ink-soft">
      <p className="text-lg font-bold text-ink">Resume not found</p>
      <Link
        href="/dashboard"
        className="rounded-lg bg-navy px-4 py-2 text-sm font-bold text-white"
      >
        Back to My Resumes
      </Link>
    </div>
  );
}
