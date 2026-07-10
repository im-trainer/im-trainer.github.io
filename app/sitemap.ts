import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";
import { LOCALES, SITE_URL } from "@/lib/seo";

// Required for `output: export` — generate this file at build time.
export const dynamic = "force-static";

// Static routes shared across locales, with crawl hints.
const STATIC_PATHS: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/about", changeFrequency: "monthly", priority: 0.8 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/clients", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
];

/** hreflang alternates map (ro + en) for a given path. */
function languages(path: string): Record<string, string> {
  return Object.fromEntries(LOCALES.map((l) => [l, `${SITE_URL}/${l}${path}`]));
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages — one entry per locale, each cross-referencing all languages.
  for (const { path, changeFrequency, priority } of STATIC_PATHS) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        changeFrequency,
        priority,
        alternates: { languages: languages(path) },
      });
    }
  }

  // Blog posts — dates are identical across locales, so read one locale for slugs+dates.
  for (const post of getAllPosts(LOCALES[0])) {
    const path = `/blog/${post.slug}`;
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: post.date || undefined,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: languages(path) },
      });
    }
  }

  return entries;
}
