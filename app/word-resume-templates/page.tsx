import type { Metadata } from "next";

import {
  EditorialLanding,
  landingMetadata,
} from "@/components/content/EditorialLanding";
import { getLanding } from "@/lib/content/landings";

// The copy lives in lib/content/landings.ts; this file is only the route.
const landing = getLanding("word-resume-templates")!;

export const metadata: Metadata = landingMetadata(landing);

export default function Page() {
  return <EditorialLanding landing={landing} />;
}
