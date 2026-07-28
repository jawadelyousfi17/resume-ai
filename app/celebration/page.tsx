import type { Metadata } from "next";

import { SupporterCelebration } from "@/components/dashboard/SupporterCelebration";
import { EARLY_SUPPORTER } from "@/lib/plans";

// A standing look at the early-supporter thank-you.
//
// The real dialog with invented numbers, so it can be checked without
// arranging to be one of the first hundred and without spending the one
// showing a real account gets. Kept out of the sitemap and out of search.

export const metadata: Metadata = {
  title: "Celebration preview — meniacv",
  robots: { index: false, follow: false },
};

export default function CelebrationPreviewPage() {
  const until = new Date();
  until.setMonth(until.getMonth() + EARLY_SUPPORTER.months);

  return (
    <SupporterCelebration
      preview
      celebration={{
        number: 7,
        places: EARLY_SUPPORTER.places,
        until: until.getTime(),
      }}
    />
  );
}
