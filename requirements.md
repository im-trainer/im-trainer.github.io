# Requirements — IM Trainer SRL Website

## 1. Project Overview

| Field | Value |
|---|---|
| Company | IM Trainer SRL |
| Country | Romania |
| Owner | IM Trainer SRL |
| Site URL | https://im-trainer.github.io/ |
| Purpose | Business card & lead magnet — attract corporate training clients and software development clients |
| Languages | Romanian (default), English |
| Stage | v1 — initial public presence |

IM Trainer SRL offers IT training (corporate and public) and custom software/web development services. The site must clearly communicate both domains and invite potential clients to get in touch.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (latest stable) |
| UI library | React (latest stable) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| i18n | next-intl (EN + RO, URL-prefix routing) |
| SEO | Next.js Metadata API, OG tags, JSON-LD, sitemap, robots.txt |
| Rendering | Static export (`output: 'export'`) — required for GitHub Pages |
| Hosting | GitHub Pages |
| CI/CD | GitHub Actions (push to master → build → deploy) |

---

## 3. Site Map & Routes

All routes are **public** (no authentication). Every page carries a language toggle.

| Page | Route | Notes |
|---|---|---|
| Home | `/` | Landing page / first impression |
| About | `/about` | Company & trainer background |
| Services | `/services` | What IM Trainer SRL offers |
| Clients & Portfolio | `/clients` | Past clients + portfolio (projects TBD) |
| Blog | `/blog` | Articles list |
| Blog Article | `/blog/[slug]` | Individual article |
| Contact | `/contact` | Contact form + social links |

Language prefix pattern: `/en/...` and `/ro/...` (e.g. `/en/about`, `/ro/about`).  
Root `/` redirects to the browser's preferred language or defaults to RO.

---

## 4. Page Content

### 4.1 Home (`/`)

- **Hero section** — headline + subheadline (bilingual), two CTA buttons: _Contact Us_ and _See Services_
- **Intro strip** — 2–3 sentences about IM Trainer SRL: who we are, what we do, Romania-based
- **Services preview** — 3–4 service cards with icons (Corporate Training, Public Courses, Software Development, Consulting)
- **Udemy course callout** — highlight card linking to [nmatei.github.io/web](https://nmatei.github.io/web): _"Become a Web Developer from Scratch"_
- **Clients logo strip** — logos / names of FastTrackIT, Transilvania IT, Broadridge
- **Testimonials section** — 2–3 quotes from past clients/students (placeholders initially)
- **Footer CTA banner** — _"Ready to level up your team?"_ → Contact button

### 4.2 About (`/about`)

- Overview of IM Trainer SRL — who we are, what drives us
- Company story and background in IT training and software development
- Training philosophy (practical, project-based, accessible to mixed-background audiences)
- Tech stack / skills overview (HTML, CSS, JavaScript, React, Next.js, Git, etc.)
- Values: continuous learning, quality over quantity, real-world applicability

### 4.3 Services (`/services`)

1. **Corporate IT Training** — tailored web development courses for company employees; delivered in Romanian or English; experience with teams of mixed backgrounds (backend devs, non-web devs)
2. **Public Web Development Courses** — open-enrollment courses (intro to advanced); past delivery via FastTrackIT and Transilvania IT
3. **Custom Software & Websites** — web application and website development for clients on request
4. **Technical Consulting** — architecture reviews, code reviews, team guidance
5. **Online Course (Udemy)** — _"Become a Web Developer from Scratch, step by step Guide"_ — link to [nmatei.github.io/web](https://nmatei.github.io/web)

### 4.4 Clients & Portfolio (`/clients`)

**Past training clients:**

| Client | Collaboration | Details |
|---|---|---|
| [FastTrackIT](https://fasttrackit.org/) | Long-term collaboration | Among the founding trainers; in-class and online web development courses; HTML/CSS/JS curriculum |
| [Transilvania IT](https://www.transilvaniait.ro/) | Course collaboration | Web development courses for Romanian SMEs (intro and advanced levels) |
| [Broadridge / itiviti](https://www.broadridge.com/capability/front-office-solutions/) | Internal corporate training | Multiple training groups; delivered in Romanian and English; audience: developers with non-web backgrounds; goal: deepen web/frontend understanding |

**Portfolio (software projects):** — _to be added in a future update_

### 4.5 Blog (`/blog`)

- Article list page: date, title, short excerpt, language badge (EN / RO)
- Article detail: `/blog/[slug]`
- Markdown or MDX content source
- Initially empty or 1–2 placeholder/intro articles
- Categories TBD (e.g. Web Tips, Course Notes, Career Advice)

### 4.6 Contact (`/contact`)

- **Contact form** fields: Name, Email, Subject, Message — initially via Formspree or `mailto:` link (no custom backend in v1)
- **Social links:**
  - LinkedIn: _[to be added]_
  - GitHub: [github.com/nmatei](https://github.com/nmatei)
- **Company info:** IM Trainer SRL, Romania
- Response time note (e.g. _"We usually reply within 1 business day"_)

---

## 5. Visual Identity

### Concept: _"Code meets Classroom"_

The design bridges two worlds — the precision of software engineering and the warmth of teaching. Light, clean, and professional with technical personality details.

### Color Palette

| Role | Color | Hex |
|---|---|---|
| Primary (text, nav) | Deep navy | `#0F172A` |
| Accent (links, CTAs) | Electric teal | `#0EA5E9` |
| Background | Warm white | `#F8FAFC` |
| Highlight / warmth | Soft amber | `#F59E0B` |
| Muted text | Slate | `#64748B` |

### Typography

- **UI / body:** Modern sans-serif (e.g. Inter or Geist Sans)
- **Code accents / labels:** Monospace (e.g. JetBrains Mono or Geist Mono) — used sparingly in section labels, badges, or decorative code snippets to signal tech identity

### Logo

- Text-based: _"IM Trainer"_ in primary navy with teal accent
- Subtle icon: TBD — could be a stylised `< />` combined with a graduation-style element
- Placeholder acceptable for v1

### Iconography

- Clean line icons (e.g. Lucide React or Heroicons)
- Consistent stroke weight throughout

---

## 6. SEO Requirements

Every page must include:

- Unique `<title>` and `<meta name="description">` per page, per language
- Open Graph tags: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter Card tags
- JSON-LD structured data:
  - `Organization` (IM Trainer SRL, url, logo, contactPoint)
  - `WebPage` per page
- `<link rel="alternate" hreflang="ro" ...>` and `hreflang="en"` on every page
- Canonical URL (`<link rel="canonical">`)
- `sitemap.xml` — auto-generated at build time listing all routes × languages
- `robots.txt` — allow all, point to sitemap

---

## 7. Internationalisation (i18n)

- **Library:** next-intl
- **Default language:** Romanian (`ro`)
- **Supported languages:** `ro`, `en`
- **URL structure:** `/ro/[page]` and `/en/[page]`; root `/` auto-redirects
- **Translation files:** JSON per language, e.g. `messages/ro.json`, `messages/en.json`
- **Rule:** No hardcoded UI strings — all text goes through translation keys
- **Language switcher:** visible in the top navigation on every page; preserves current route

---

## 8. GitHub Pages Deployment

- **Build:** `next build` with `output: 'export'` produces static files in `/out`
- **GitHub Actions workflow:** triggered on push to `master`
  1. Checkout code
  2. Install dependencies
  3. Build (`npm run build`)
  4. Deploy `/out` to `gh-pages` branch
- **Base path:** `/` (the repo is an organisation/user page: `im-trainer.github.io`)
- **Custom domain:** not required in v1; can be added via `CNAME` later
- **404 handling:** custom `404.html` for GitHub Pages (Next.js exports this automatically)

---

## 9. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Performance | Lighthouse score ≥ 90 on all categories |
| Accessibility | WCAG 2.1 AA compliance |
| Mobile | Fully responsive (mobile-first) |
| Browser support | Modern evergreen browsers (Chrome, Firefox, Safari, Edge) |
| Load time | First Contentful Paint < 2 s on 3G |
| Images | Optimised (WebP where possible); Next.js `<Image>` component |

---

## 10. Out of Scope (v1)

- Authentication or user accounts
- CMS or admin panel
- E-commerce / payments
- Full software portfolio entries (user will add later)
- Custom backend API or database
- Newsletter / mailing list integration
- Analytics (can be added in v1.1 — e.g. Plausible or Vercel Analytics)

---

## 11. Open Items

| # | Item | Owner |
|---|---|---|
| 1 | LinkedIn profile URL | IM Trainer SRL |
| 2 | Logo / brand icon direction | IM Trainer SRL + designer |
| 3 | OG image design | IM Trainer SRL + designer |
| 4 | Real testimonial quotes | IM Trainer SRL |
| 5 | Portfolio project entries | Nicolae (future update) |
| 6 | Blog initial articles | IM Trainer SRL |
| 7 | Contact email address | IM Trainer SRL |
| 8 | Formspree account / mailto address | IM Trainer SRL |
