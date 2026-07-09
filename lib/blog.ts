import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");
const FILE_RE = /^(.+)\.(ro|en)\.md$/;

export interface BlogPostMeta {
  slug: string;
  locale: string;
  title: string;
  excerpt: string;
  date: string; // ISO "YYYY-MM-DD"
  category: string;
}

export interface BlogPost extends BlogPostMeta {
  contentHtml: string;
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
    category: String(data.category ?? ""),
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

/** A single localized post with rendered HTML, or undefined if missing. */
export async function getPostBySlug(
  slug: string,
  locale: string
): Promise<BlogPost | undefined> {
  const file = `${slug}.${locale}.md`;
  const fullPath = path.join(BLOG_DIR, file);
  if (!fs.existsSync(fullPath)) return undefined;

  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  const processed = await remark()
    .use(remarkGfm)
    .use(remarkHtml)
    .process(content);

  return {
    slug,
    locale,
    title: String(data.title ?? slug),
    excerpt: String(data.excerpt ?? ""),
    date: String(data.date ?? ""),
    category: String(data.category ?? ""),
    contentHtml: processed.toString(),
  };
}
