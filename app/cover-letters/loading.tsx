// Cover letters while they're being read. The navigation isn't loading, so it
// stays; only the grid is a placeholder.

import { BottomNav, SidebarNav } from "@/components/dashboard/nav";

export default function Loading() {
  return (
    <div className="flex min-h-dvh pb-16 md:pb-0">
      <aside className="hidden w-60 shrink-0 flex-col border-r border-black/5 px-4 py-6 md:flex">
        <SidebarNav active="letters" />
      </aside>

      <main className="min-w-0 flex-1 px-4 py-5 sm:px-10 sm:py-8 lg:px-14">
        <h1 className="hidden text-2xl font-extrabold tracking-tight text-ink sm:block sm:text-3xl">
          Cover Letters
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

      <BottomNav active="letters" />
    </div>
  );
}
