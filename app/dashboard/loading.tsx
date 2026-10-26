// The dashboard while its resumes are being read.
//
// The sidebar isn't loading — it's the same sidebar it always is — so it
// renders for real and only the grid below is a placeholder.

import { BottomNav, SidebarNav } from "@/components/dashboard/nav";

export default function Loading() {
  return (
    <div className="flex min-h-dvh w-full bg-panel pb-16 md:pb-0">
      <aside className="hidden w-[248px] shrink-0 flex-col border-r border-divider px-3 pb-4 md:flex">
        <SidebarNav active="resumes" />
      </aside>

      <main className="min-w-0 flex-1">
        <div className="flex h-[72px] items-center border-b border-divider px-4 max-md:hidden sm:px-10 lg:px-14">
          <h1 className="text-[22px] font-bold tracking-tight text-ink">
            Resumes
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 py-5 sm:px-10 sm:py-8 md:grid-cols-[repeat(auto-fill,minmax(200px,1fr))] md:gap-x-6 lg:px-14">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="block aspect-[210/297] animate-pulse rounded-none bg-canvas"
            />
          ))}
        </div>
      </main>

      <BottomNav active="resumes" />
    </div>
  );
}
