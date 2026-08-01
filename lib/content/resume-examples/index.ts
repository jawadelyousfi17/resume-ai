// The resume examples behind /resume-examples and /resume-examples/<slug>.
//
// Content is split by field only so the files stay a readable length — the
// route, sitemap and index page read the combined list, so adding an example
// is adding an entry to one of the four arrays.

import { ADMIN_SUPPORT_EXAMPLES } from "./admin-support";
import { BUSINESS_EXAMPLES } from "./business";
import { ENGINEERING_EXAMPLES } from "./engineering";
import { HEALTHCARE_EXAMPLES } from "./healthcare";
import { PEOPLE_EXAMPLES } from "./people";
import { STUDENT_EXAMPLES } from "./student";
import { TECH_OPS_EXAMPLES } from "./tech-ops";
import { EXAMPLE_CATEGORIES, type ExampleCategoryId, type ResumeExample } from "./types";

export {
  EXAMPLE_CATEGORIES,
  toResumeData,
  type ExampleCategoryId,
  type ExampleSection,
  type KeywordGroup,
  type ResumeExample,
} from "./types";

export const RESUME_EXAMPLES: ResumeExample[] = [
  ...ENGINEERING_EXAMPLES,
  ...TECH_OPS_EXAMPLES,
  ...BUSINESS_EXAMPLES,
  ...PEOPLE_EXAMPLES,
  ...HEALTHCARE_EXAMPLES,
  ...ADMIN_SUPPORT_EXAMPLES,
  ...STUDENT_EXAMPLES,
];

export const EXAMPLE_SLUGS = RESUME_EXAMPLES.map((example) => example.slug);

export const getExample = (slug: string) =>
  RESUME_EXAMPLES.find((example) => example.slug === slug);

/** The examples in one field, in the order they were written. */
export const examplesInCategory = (category: ExampleCategoryId) =>
  RESUME_EXAMPLES.filter((example) => example.category === category);

/** The categories that actually have examples, each with its own. Drives the
 *  index page, so a category with nothing in it can't render an empty heading. */
export const EXAMPLES_BY_CATEGORY = EXAMPLE_CATEGORIES.map((category) => ({
  ...category,
  examples: examplesInCategory(category.id),
})).filter((group) => group.examples.length > 0);
