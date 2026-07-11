---
name: og-image
description: Regenerate or redesign the branded Open Graph / social share image (public/og.png) for the IM Trainer site. Use whenever the user wants to change, redesign, regenerate, or fix the OG image, social preview, or link-share card. Covers editing the source SVG, rendering to PNG, verifying, and publishing.
---

# Branded OG (social share) image

The **Open Graph image** is the preview card shown when an im-trainer.github.io link is shared on LinkedIn, X/Twitter, Slack, WhatsApp, Facebook, etc. It is a single site-wide **1200×630 PNG**.

## Files involved

| File | Role |
|---|---|
| `design/og.svg` | **Source of truth** — the editable vector design. Change this, then re-render. |
| `public/og.png` | The rendered raster the site serves. **Generated — never hand-edit.** |
| `lib/seo.ts` (`OG_IMAGE`) | Wires the PNG into `og:image`, `twitter:image`, and each article's `BlogPosting.image`. |

`next build` copies `public/og.png` into `out/og.png` automatically. The absolute URL served is `https://im-trainer.github.io/og.png`.

## Requirements (one-time)

Rendering SVG → PNG uses **`rsvg-convert`** (librsvg):

```bash
rsvg-convert --version || brew install librsvg
```

Fallbacks if `rsvg-convert` is unavailable: `sharp` (already a project dependency) — see [Regenerate](#regenerate-the-png) below.

## Design spec

- **Canvas:** 1200 × 630 px (the standard OG ratio; also used for Twitter `summary_large_image`).
- **Concept:** _"Code meets Classroom"_ — software precision + teaching warmth.
- **Palette** (from `requirements.md` §5):

  | Role | Hex |
  |---|---|
  | Background (deep navy) | `#0F172A` (→ `#111f3d` gradient) |
  | Accent (electric teal) | `#0EA5E9` / lighter `#38BDF8` |
  | Highlight (soft amber) | `#F59E0B` |
  | Muted text (slate) | `#94A3B8` / `#64748B` |
  | Warm white | `#F8FAFC` |

- **Fonts:** sans-serif `Arial, Helvetica` for headline/body; monospace `Menlo` for the kicker and the decorative code watermark. (librsvg resolves these via system fontconfig — stick to widely-installed families so text renders on any machine.)
- **Layout:** mono kicker `</> IM TRAINER SRL` (teal, top-left) · two-line bold headline `IT Training &` (white) / `Software Development` (teal gradient) · amber accent bar · two-line slate subheadline · footer wordmark `IM Trainer · im-trainer.github.io` · faint monospace code-snippet watermark on the right · subtle teal glow (top-right) + amber glow (bottom-right).

## Reusable design brief (the "prompt")

Paste this to an AI (or use it yourself) to regenerate the SVG from scratch or spin a variation. Keep it in sync with the spec above.

> Create a **1200×630 Open Graph image** as a single self-contained **SVG** for **IM Trainer SRL**, a Romanian IT-training & web-development company. Concept: _"Code meets Classroom."_
> **Palette:** deep-navy background `#0F172A`→`#111f3d`, electric-teal accent `#0EA5E9`/`#38BDF8`, soft-amber highlight `#F59E0B`, slate muted text `#94A3B8`/`#64748B`, warm-white `#F8FAFC`.
> **Layout (left-aligned, 80px left margin):** a monospace kicker `</> IM TRAINER SRL` in teal at the top; a two-line bold sans-serif headline — line 1 `IT Training &` in white, line 2 `Software Development` in a teal gradient; a short amber accent bar under the headline; a two-line slate subheadline (`Corporate & public web-dev courses. Custom software.` / `Based in Romania · delivered in RO / EN.`); a footer wordmark `IM Trainer · im-trainer.github.io`. On the right, a faint (opacity ~0.10) monospace code-snippet watermark. Add a subtle teal glow (top-right circle) and amber glow (bottom-right circle).
> Fonts: `Arial, Helvetica, sans-serif` for text, `Menlo, monospace` for code. Output valid SVG only, no external assets.

The current rendered `design/og.svg` is the reference implementation of this brief — read it before editing to match style.

## How to edit

1. Open **`design/og.svg`** and change text, colors, or layout. Common edits:
   - **Headline / subheadline / wordmark:** the `<text>` elements (search for the string you want to change).
   - **Colors:** the `<linearGradient>` stops (`#bg`, `#accent`) and the `fill="…"` values.
   - **Code watermark:** the `<g opacity="0.10">` block near the top of the body.
2. Keep the `viewBox="0 0 1200 630"` and `width`/`height` at 1200×630.
3. Escape `&`, `<`, `>` inside text as `&amp;` `&lt;` `&gt;` (that's why the kicker is `&lt;/&gt;`).
4. Re-render (next section) and **visually check** the PNG before committing.

## Regenerate the PNG

From the repo root:

```bash
rsvg-convert -w 1200 -h 630 design/og.svg -o public/og.png
```

**Fallback with `sharp`** (no Homebrew needed; `density` keeps text crisp):

```bash
node -e "require('sharp')('design/og.svg',{density:200}).resize(1200,630).png().toFile('public/og.png').then(()=>console.log('ok'))"
```

## Verify

```bash
# 1. Dimensions must be exactly 1200×630
sips -g pixelWidth -g pixelHeight public/og.png

# 2. Look at it (Claude: use the Read tool on public/og.png to view the render)
open public/og.png

# 3. Confirm it still ships and is wired into the tags
npm run build >/dev/null && ls -la out/og.png
grep -o '<meta property="og:image"[^>]*>' out/en.html
```

Check text isn't clipped and stays legible at small sizes (previews render ~small).

## Publish

1. The image is already wired via `OG_IMAGE` in `lib/seo.ts` — no code change needed unless you rename the file or change dimensions (update `width`/`height`/`url` there too).
2. Commit **both** `design/og.svg` (source) and `public/og.png` (render).
3. Push to `master` → GitHub Actions builds and deploys (`.github/workflows/deploy.yml`).
4. **Bust social caches** — platforms cache OG images aggressively. After deploy, refresh with:
   - LinkedIn: <https://www.linkedin.com/post-inspector/>
   - Facebook/Meta: <https://developers.facebook.com/tools/debug/>
   - X/Twitter: <https://cards-dev.twitter.com/validator>

## Per-page / localized variants (future)

Today one image serves every page and both locales. To vary it (e.g. per-article or per-language), either add more PNGs to `public/` and pass `images` through `buildMetadata`, or switch to Next's `opengraph-image` + `ImageResponse` convention (works under static export when the route is fully static). Not needed for v1.
