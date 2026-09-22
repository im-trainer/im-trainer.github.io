import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeHighlightSubset from "@/lib/highlight";
import rehypeCodeBlock from "@/lib/rehype/code-block";
import rehypeExternalLinks from "@/lib/rehype/external-links";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const FILE_RE = /^(.+)\.(ro|en)\.md$/;

export interface BlogPostMeta {
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  date: string; // ISO "YYYY-MM-DD"
  tags: string[];
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
}

/**
 * Normalize frontmatter tags into a clean string array.
 * Accepts `tags` as a YAML array or a comma-separated string, and falls back
 * to the legacy single `category` field so older posts keep working.
 */
function normalizeTags(data: Record<string, unknown>): string[] {
  const { tags, category } = data as { tags?: unknown; category?: unknown };
  if (Array.isArray(tags)) {
    return tags.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof tags === "string" && tags.trim()) {
    return tags.split(",").map((t) => t.trim()).filter(Boolean);
  }
  if (typeof category === "string" && category.trim()) {
    return [category.trim()];
  }
  return [];
}

function readAllFiles(): { slug: string; locale: string; file: string }[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .map((file) => {
      const m = file.match(FILE_RE);
      return m ? { slug: m[1], locale: m[2], file } : null;
    })
    .filter((x): x is { slug: string; locale: string; file: string } => x !== null);
}

function readMeta(slug: string, locale: string, file: string): BlogPostMeta {
  const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf8");
  const { data } = matter(raw);
  return {
    slug,
    locale,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    tags: normalizeTags(data),
  };
}

/** All posts for a locale, sorted newest-first by date. */
export function getAllPosts(locale: string): BlogPostMeta[] {
  return readAllFiles()
    .filter((f) => f.locale === locale)
    .map((f) => readMeta(f.slug, f.locale, f.file))
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** Unique slugs across all languages (for generateStaticParams). */
export function getAllSlugs(): string[] {
  return [...new Set(readAllFiles().map((f) => f.slug))];
}

/** All unique tags used by posts in a locale, sorted alphabetically (for filtering). */
export function getAllTags(locale: string): string[] {
  const set = new Set<string>();
  for (const post of getAllPosts(locale)) {
    for (const tag of post.tags) set.add(tag);
  }
  return [...set].sort((a, b) => a.localeCompare(b));
}

/**
 * Markdown -> HTML, with build-time syntax highlighting.
 *
 * This is a full unified pipeline rather than `remark-html` because
 * `remark-html` is a terminal compiler (mdast straight to an HTML string):
 * there is no point at which a rehype plugin could run. Going through
 * `remark-rehype` gives us the hast stage the highlighter needs.
 *
 * Security note: we do NOT pass `allowDangerousHtml`, and we do not add
 * `rehype-raw`, so raw HTML written in a Markdown file is dropped — same as
 * before this migration. What we did lose is `remark-html`'s implicit
 * `hast-util-sanitize` pass, which also filtered URL protocols. Adding
 * `rehype-sanitize` back is not worth it here: posts are Markdown we author
 * and commit ourselves, and the sanitizer would have to run *before*
 * highlighting (or it strips every token span) and then be re-taught about
 * `div.code-block`, `button` and every `hljs-*` class.
 */
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeHighlightSubset)
  .use(rehypeExternalLinks)
  .use(rehypeCodeBlock)
  .use(rehypeStringify);

// Every post is rendered twice per page — once in `generateMetadata`, once in
// the page component. That was free with plain Markdown; with highlighting it
// is not. This module only ever runs at build time (`output: "export"`), so a
// plain Map is safe.
const postCache = new Map<string, BlogPost | undefined>();

/** A single localized post with rendered HTML, or undefined if missing. */
export async function getPostBySlug(
  slug: string,
  locale: string
): Promise<BlogPost | undefined> {
  const key = `${slug}.${locale}`;
  if (postCache.has(key)) return postCache.get(key);

  const post = await renderPost(slug, locale);
  postCache.set(key, post);
  return post;
}

async function renderPost(
  slug: string,
  locale: string
): Promise<BlogPost | undefined> {
  const file = `${slug}.${locale}.md`;
  const fullPath = path.join(BLOG_DIR, file);
  if (!fs.existsSync(fullPath)) return undefined;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const processed = await processor.process(content);

  return {
    slug,
    locale,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    tags: normalizeTags(data),
    contentHtml: processed.toString(),
  };
}
