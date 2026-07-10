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

## Audience & editorial scope (read this before writing)

The blog is a **lead magnet for IM Trainer SRL**, a Romanian company with two offerings: **IT training** (corporate + public web-dev courses) and **custom software / web development**. Every post must earn its place by serving people one of those two businesses sells to. It is not a general tech/personal blog — a post that wouldn't help a reader trust IM Trainer as either a *web-dev trainer* or a *software builder* does not belong here.

### Two audiences — pick one (or both) per post

Every article deliberately targets **Audience A (Training)**, **Audience B (Software dev)**, or **both**. Training is the primary audience; software-dev is the secondary one. A post can serve both, but only when the same piece genuinely helps each — don't force it. Decide this before writing; it drives the topic depth, tone, and tags.

**Audience A — Training (primary).** Readers who learn from us or hire us to teach.
- Aspiring & early-career web developers — career-changers and students learning web dev or working through fundamentals (see `why-learn-web-development`, `html-css-fundamentals`).
- Course participants & alumni — people taking/having taken our public or corporate courses (FastTrackIT, Transilvania IT) who use posts as reference.
- Corporate developers from non-web backgrounds — backend/other engineers deepening their frontend understanding (the Broadridge-style audience from `/clients`).
- Prospective training clients (team leads, HR, engineering managers) judging whether we teach well.

*Training pillars:* web-dev fundamentals & how-tos (HTML, CSS, JS, React, Next.js, TypeScript, accessibility); dev tools & workflow (Git, SSH, editor, terminal, debugging — see the `git-*` and `multiple-github-accounts-ssh` posts); career & learning advice; course notes & practical tips.

**Audience B — Software development (secondary).** Readers who might hire us to build software.
- Founders, product owners, and technical decision-makers at companies evaluating a dev partner.
- Developers on their teams sizing up our engineering judgement.

*Software-dev pillars:* how we approach building web apps/sites; practical engineering lessons and trade-offs from real work; tech choices explained for a decision-maker; lightweight case-study-style "how we'd build X" pieces. Keep these credibility-building and useful — **never a sales pitch** (see out-of-scope below).

### Tone — must match the author's style

**This is non-negotiable: every post reads in Nicolae's voice, the same across both audiences.** Practical, project-based, **jargon-free and accessible to mixed backgrounds**, encouraging, first-person where natural. Teach one concrete thing per post; prefer runnable examples and real trade-offs over theory. A software-dev post is *not* a marketing register — it's the same teacher explaining how something is built. Read the existing posts and match their rhythm, heading style, and directness before drafting.

### Out of scope / off-brand — don't write (or flag to the user first)
- Topics with no tie to web development, teaching, or how we build software (unrelated backend deep-dives, crypto, hardware, generic business/lifestyle content).
- Hard-sell marketing, press releases, or opinion pieces that don't teach the reader something — including software-dev posts that pitch instead of explain.
- Content aimed at senior specialists that our learner/mixed-background audience couldn't follow, unless explicitly framed as advanced.

If a requested topic doesn't clearly fit an audience and pillar above, **say so and propose an on-scope angle before writing** — e.g. reframe a generic topic toward what a learner (A) or a prospective software client (B) would actually gain.

## Steps

1. **Pick the audience & check fit.** Before drafting, state explicitly whether the post targets **Training (A)**, **Software dev (B)**, or **both**, and which pillar it lands in. Confirm it reads in the author's voice (see Tone). If the topic is borderline or off-scope, surface that to the user and suggest an on-brand angle rather than writing it anyway. Reuse an existing tag where the topic overlaps one.

2. **Gather the article details.** You need, for **both** RO and EN:
   - `title` — the article headline in that language
   - `excerpt` — a 1–2 sentence summary (shown on the blog list card and used as the meta description)
   - the Markdown body
   And shared across both languages:
   - `slug` — **always English**, kebab-case, ASCII, no dots (e.g. `intro-to-typescript`), even for a Romanian article. The slug is shared across both languages and forms the URL: `/{locale}/blog/{slug}` (same convention as the site's route keys, e.g. `/ro/clients`).
   - `date` — `YYYY-MM-DD`. Default to today if the user doesn't specify.
   - `tags` — a YAML array of free-form strings, each shown as its own pill (e.g. `["Git", "Dev Tools"]`, `["Career"]`). Kept identical across languages unless the user wants translated labels. The legacy single-string `category:` field is still supported for backward compatibility (rendered as one tag), but prefer `tags` for new posts. Tags are the basis for future filtering, so reuse existing tag names where possible — see `getAllTags(locale)` in `lib/blog.ts`.

   If the user provides only one language, draft the other by translating (RO is the site's default language), and confirm the translation with them before writing.

3. **Verify the slug is free.** Check that no `content/blog/{slug}.ro.md` or `content/blog/{slug}.en.md` already exists. If it does, pick a different slug or confirm the user wants to overwrite.

4. **Write both files** with this exact frontmatter shape:

   ```md
   ---
   title: "Title in this language"
   excerpt: "One or two sentence summary."
   date: "2026-07-09"
   tags: ["Web Tips"]
   ---

   ## First heading

   Body paragraph with full Markdown support.
   ```

   Keep `date` identical in both files.

5. **Confirm to the user** the two file paths created and the resulting URLs (`/ro/blog/{slug}` and `/en/blog/{slug}`).

6. **Verify** (recommended): run `npm run dev`, open `/ro/blog` and `/en/blog` (the new post should appear at/near the top, sorted by date), open both post URLs, then run `npm run build` to confirm the static export succeeds.

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
