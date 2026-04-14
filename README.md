# IM Trainer SRL

> Website for **IM Trainer SRL** — IT training and software development, Romania.

**Live site:** https://im-trainer.github.io/

---

## About

IM Trainer SRL delivers corporate and public IT training as well as custom software and web development services. This repository contains the source code for the company website — a bilingual (RO/EN), SEO-optimised static site built with Next.js and hosted on GitHub Pages.

## Tech Stack

- **Framework:** Next.js (latest) + React + TypeScript
- **Styling:** Tailwind CSS
- **i18n:** next-intl — Romanian (default) and English
- **Rendering:** Static export (`output: 'export'`)
- **Hosting:** GitHub Pages, deployed via GitHub Actions

## Pages

| Route | Description |
|---|---|
| `/` | Home — hero, services overview, clients, testimonials |
| `/about` | About IM Trainer SRL |
| `/services` | Training and software services |
| `/clients` | Past clients and portfolio |
| `/blog` | Articles and course notes |
| `/contact` | Contact form and social links |

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site locally.

## Build & Deploy

```bash
npm run build   # produces static output in /out
```

Deployment is automated via GitHub Actions on every push to `master`.

## Requirements

See [requirements.md](./requirements.md) for full project requirements, design decisions, and open items.
