export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  date: string;
  coverImage: string;
  content: Section[];
};

type Section = {
  type: "paragraph" | "heading" | "subheading" | "list" | "numbered-list" | "callout" | "quote" | "evidence-grid" | "stats-grid" | "sleep-stages" | "action-grid" | "study-cards" | "mechanism-list" | "risk-grid" | "food-table" | "hormone-axes" | "level-cards" | "mechanism-cards" | "dosing-guide";
  text?: string;
  items?: string[];
  evidence?: { label: string; strength: "strong" | "mixed" | "weak" | "context"; text: string }[];
  stats?: { value: string; label: string; description: string }[];
  stages?: { color: string; name: string; text: string }[];
  actions?: { title: string; text: string }[];
  studies?: { author: string; title: string; year: string; tags: string[]; body: string; verdict: string; verdictStrength: "strong" | "conditional" | "weak" }[];
  mechanisms?: { title: string; text: string }[];
  risks?: { title: string; text: string }[];
  foods?: { food: string; serving: string; zinc: string; bioavailability: string }[];
  nutrientLabel?: string;
  axes?: { title: string; steps: string[] }[];
  levels?: { level: string; title: string; text: string }[];
  mechanismCards?: { title: string; text: string }[];
  dosingGuide?: { label: string; confidence: "high" | "moderate" | "low" | "avoid"; text: string }[];
};

/**
 * Articles.
 *
 * Emptied deliberately. The previous entries were Rock Mountain's
 * testosterone-supplement articles: wrong brand, wrong category, and
 * carrying dosing guidance and effect claims that must not appear beside a
 * research-peptide catalog. The engine, types and routes are intact — add
 * entries here and /blog and /blog/[slug] pick them up with no other change.
 *
 * Before writing any article for this site, note that a blog post is
 * surrounding-circumstance evidence of intended use in exactly the way
 * product copy is. Articles describing what a compound does for a person
 * undercut the research-use position no matter what the footer says.
 */
export const blogPosts: BlogPost[] = [];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
