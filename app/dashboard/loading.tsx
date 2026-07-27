// The dashboard while its resumes are being read.
//
// The sidebar isn't loading — it's the same sidebar it always is — so it
// renders for real and only the grid below is a placeholder.

import { BottomNav, SidebarNav } from "@/components/dashboard/nav";

export default function Loading() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-app pb-16 md:pb-0">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-black/5 px-4 py-6 md:flex">
        <SidebarNav active="resumes" />
      </aside>

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-10 sm:py-8 lg:px-14">
        <h1 className="text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
          My Resumes
        </h1>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-[repeat(auto-fill,minmax(190px,1fr))] md:gap-x-6">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="block aspect-[210/297] animate-pulse rounded-2xl bg-panel"
            />
          ))}
        </div>
      </main>

      <BottomNav active="resumes" />
    </div>
  );
}
