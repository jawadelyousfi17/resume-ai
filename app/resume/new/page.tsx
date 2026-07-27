import { headers } from "next/headers";

import { requireUser } from "@/lib/auth";
import { isMobileUserAgent } from "@/lib/device";
import { NewResume } from "@/components/editor/NewResume";

// A resume that hasn't been written yet. The document was built in the browser
// when the template was chosen, so this page has nothing to load — it opens the
// editor and lets the first save happen underneath it.
export default async function NewResumePage() {
  // Not for guests: a signed-out visitor's resume lives in their browser under
  // /resume/guest, and there is nothing here to store it in.
  await requireUser();

  const mobile = isMobileUserAgent((await headers()).get("user-agent"));

  return <NewResume mobile={mobile} />;
}
