@AGENTS.md

# Project Overview — IM Trainer SRL website

Bilingual (Romanian default, English) marketing + lead-gen site for **IM Trainer SRL**, a Romanian company offering IT training (corporate & public web-dev courses) and custom software/web development. Goal: communicate both offerings and drive contact. See `readme.md` and `requirements.md` for the full spec.

## Stack
- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **next-intl 4** for i18n
- **Tailwind CSS v4** — CSS-based config (no `tailwind.config.js`); config lives in `app/globals.css` (`@import "tailwindcss"`, `@theme`, `@plugin`)
- **Static export** (`output: "export"` in `next.config.ts`) → deployed to **GitHub Pages** via `.github/workflows/deploy.yml` on push to `master`. Images are `unoptimized`.
- Path alias `@/*` → repo root.

> ⚠️ Per `AGENTS.md`, this Next.js version has breaking changes — check `node_modules/next/dist/docs/` before writing framework code. Notably `params` is a `Promise` on every page (`await params`); server components run at build time under static export (so `fs` reads are fine).

## Routing & i18n
- **No `middleware.ts`** — static export handles locales via the `app/[locale]/…` segment + `generateStaticParams` (`app/[locale]/layout.tsx` maps `routing.locales`).
- Config: `i18n/routing.ts` (`locales: ["ro","en"]`, `defaultLocale: "ro"`, `localePrefix: "always"`) and `i18n/request.ts` (loads `messages/{locale}.json`). Registered via `createNextIntlPlugin` in `next.config.ts`.
- Root `/` (`app/page.tsx`) client-side redirects to `/ro` or `/en` by browser language.
- **No hardcoded UI strings** — all copy goes through `messages/ro.json` / `messages/en.json` (identical key trees; namespaces per page + `nav`, `footer`, `common`). Pages use `getTranslations({ locale, namespace })`; internal links are manually locale-prefixed (`/${locale}/…`), not next-intl's `<Link>`.
- Pages call `setRequestLocale(locale)` and define `generateMetadata` (title/description/OG) — this is the SEO surface.

## Routes (under `app/[locale]/`)
`/` home · `/about` · `/services` · `/clients` · `/blog` (list) · `/blog/[slug]` (article) · `/contact` (the only `"use client"` page — contact form).

## Shared components (`components/`)
`Navigation.tsx` (sticky nav + language switcher + mobile menu, client), `Footer.tsx` (links + social), `LocaleHtml.tsx` (sets `<html lang>`). Icons via `lucide-react`.

## Blog — file-based Markdown pipeline
Articles are **Markdown files**, two per post (one per language), under `content/blog/`:
```
content/blog/{slug}.ro.md
content/blog/{slug}.en.md
```
Each has YAML frontmatter (`title`, `excerpt`, `date` "YYYY-MM-DD", `category`) and a Markdown body. `lib/blog.ts` loads them at build time (`gray-matter` + `remark`/`remark-gfm`/`remark-html`), exposing `getAllPosts(locale)` (sorted newest-first), `getAllSlugs()`, and `getPostBySlug(slug, locale)`. The detail page renders `contentHtml` in a Tailwind `prose` container.

**To add a post, use the `add-blog-post` skill** (`.claude/skills/add-blog-post/`) — it creates the two files; no code edits needed. The `blog` namespace in `messages/*.json` is page chrome only, not article content.

## SEO (implemented)
- `app/sitemap.ts` + `app/robots.ts` generate `sitemap.xml` / `robots.txt` at build. Both need `export const dynamic = "force-static"` under `output: export`. Sitemap lists all routes × locales + blog posts, each with `xhtml:link` hreflang alternates.
- `lib/seo.ts` — `buildMetadata({ locale, path, title, description, type?, article? })` is the single source for per-page canonical + hreflang (`ro`/`en`/`x-default`) + Open Graph + Twitter Card. Every page's `generateMetadata` returns it. Also holds the JSON-LD builders (`organizationLd`, `webSiteLd`, `blogPostingLd`).
- `components/JsonLd.tsx` renders `<script type="application/ld+json">`. `Organization` + `WebSite` are injected site-wide in `app/[locale]/layout.tsx`; `BlogPosting` on each article page.
- Contact is `"use client"` so it can't export metadata — `app/[locale]/contact/layout.tsx` (server) supplies its SEO tags.
- `og:image` / `twitter:image` → `public/og.png` (1200×630), wired via `OG_IMAGE` in `lib/seo.ts` and also used as `BlogPosting.image`. Source lives at `design/og.svg`; regenerate with `rsvg-convert -w 1200 -h 630 design/og.svg -o public/og.png` if the design changes.
- When adding a page, return `buildMetadata(...)` from its `generateMetadata` and add its path to `STATIC_PATHS` in `app/sitemap.ts`.

## Known gaps
- **`<html lang>` is `"ro"` in static HTML for every route** — the root layout sits above `[locale]` so can't read the locale; `LocaleHtml` corrects it to `en` client-side after hydration.
- Contact form is client-only (no Formspree/backend wired yet).
