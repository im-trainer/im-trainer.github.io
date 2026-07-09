---
name: add-blog-post
description: Add a new bilingual (RO + EN) blog article to the IM Trainer site. Use whenever the user wants to add, write, or publish a blog post / article / blog page. Creates the two Markdown files under content/blog/ — no code changes needed.
---

# Add a blog post

The IM Trainer blog is a **file-based Markdown pipeline**. Each article is two files — one per language — under `content/blog/`, sharing a slug:

```
content/blog/{slug}.ro.md
content/blog/{slug}.en.md
```

The loader (`lib/blog.ts`) reads these at build time, so **adding a post means creating two files. Never edit `lib/blog.ts` or the page components to add content.** Posts auto-sort newest-first by `date` — no ordering to manage.

## Steps

1. **Gather the article details.** You need, for **both** RO and EN:
   - `title` — the article headline in that language
   - `excerpt` — a 1–2 sentence summary (shown on the blog list card and used as the meta description)
   - the Markdown body
   And shared across both languages:
   - `slug` — **always English**, kebab-case, ASCII, no dots (e.g. `intro-to-typescript`), even for a Romanian article. The slug is shared across both languages and forms the URL: `/{locale}/blog/{slug}` (same convention as the site's route keys, e.g. `/ro/clients`).
   - `date` — `YYYY-MM-DD`. Default to today if the user doesn't specify.
   - `category` — free-form string shown as-is (e.g. `Web Tips`, `Career`, `Course Notes`). May differ per language if the user wants a translated label; otherwise keep it identical.

   If the user provides only one language, draft the other by translating (RO is the site's default language), and confirm the translation with them before writing.

2. **Verify the slug is free.** Check that no `content/blog/{slug}.ro.md` or `content/blog/{slug}.en.md` already exists. If it does, pick a different slug or confirm the user wants to overwrite.

3. **Write both files** with this exact frontmatter shape:

   ```md
   ---
   title: "Title in this language"
   excerpt: "One or two sentence summary."
   date: "2026-07-09"
   category: "Web Tips"
   ---

   ## First heading

   Body paragraph with full Markdown support.
   ```

   Keep `date` identical in both files.

4. **Confirm to the user** the two file paths created and the resulting URLs (`/ro/blog/{slug}` and `/en/blog/{slug}`).

5. **Verify** (recommended): run `npm run dev`, open `/ro/blog` and `/en/blog` (the new post should appear at/near the top, sorted by date), open both post URLs, then run `npm run build` to confirm the static export succeeds.

## Markdown support

The body is rendered with `remark` + `remark-gfm` → HTML, styled with Tailwind Typography (`prose`). Full Markdown works: `##`/`###` headings, **bold**, *italic*, `inline code`, fenced code blocks, [links](https://example.com), ordered and unordered lists, blockquotes, tables, and images.

- **Images:** put the asset in `public/` and reference it with a root-relative path, e.g. `![Alt text](/blog/my-image.png)`. Note the site is statically exported with unoptimized images.
- Do **not** include an H1 (`#`) in the body — the page renders the `title` as the H1 already. Start section headings at `##`.

## Reference — files involved
- `content/blog/` — the article Markdown files (what you create)
- `lib/blog.ts` — loader: `getAllPosts(locale)`, `getAllSlugs()`, `getPostBySlug(slug, locale)` (do not edit to add content)
- `app/[locale]/blog/page.tsx` — the article list
- `app/[locale]/blog/[slug]/page.tsx` — the article detail page
- `messages/{ro,en}.json` (`blog` namespace) — page chrome only (hero, "read more", etc.), not article content
