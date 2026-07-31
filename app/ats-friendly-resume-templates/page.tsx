import type { Metadata } from "next";

import {
  TemplateCollectionPage,
  collectionMetadata,
} from "@/components/content/TemplateCollection";
import { getCollection } from "@/lib/content/template-collections";

// The copy, the category and the FAQ all live in
// lib/content/template-collections.ts — this file is only the route.
const collection = getCollection("ats-friendly-resume-templates")!;

export const metadata: Metadata = collectionMetadata(collection);

export default function Page() {
  return <TemplateCollectionPage collection={collection} />;
}
