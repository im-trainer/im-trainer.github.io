/**
 * Long, localized form of a post's "YYYY-MM-DD" date ("9 iulie 2026").
 * Pinned to UTC, the zone a date-only string is parsed in, so the day never
 * shifts with the timezone of the machine doing the formatting.
 */
export function formatDate(dateStr: string, locale: string): string {
  return new Date(dateStr).toLocaleDateString(
    locale === "ro" ? "ro-RO" : "en-GB",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    },
  );
}

/**
 * URL form of a tag: every run of spaces or special characters becomes a
 * single "-" ("Dev Tools" -> "Dev-Tools", "HTML & CSS" -> "HTML-CSS"), so the
 * query string never needs percent-encoding.
 */
export function tagSlug(tag: string): string {
  return tag.replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-+|-+$/g, "");
}

/** Slugs are compared case-insensitively, so a hand-typed `?tag=git` works. */
export function sameTagSlug(a: string, b: string): boolean {
  return a.toLowerCase() === b.toLowerCase();
}

/** Link to the blog list filtered by the given tags (none = the full list). */
export function tagHref(locale: string, tags: string | string[]): string {
  const query = (Array.isArray(tags) ? tags : [tags])
    .map((tag) => `tag=${encodeURIComponent(tagSlug(tag))}`)
    .join("&");
  return `/${locale}/blog${query ? `?${query}` : ""}`;
}
