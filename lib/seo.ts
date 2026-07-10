import type { Metadata } from "next";

/** Canonical production origin (GitHub Pages, org/user page → root path). */
export const SITE_URL = "https://im-trainer.github.io";
export const SITE_NAME = "IM Trainer SRL";
export const LOCALES = ["ro", "en"] as const;
export const DEFAULT_LOCALE = "ro";

/** Open Graph locale codes per app locale. */
const OG_LOCALE: Record<string, string> = { ro: "ro_RO", en: "en_US" };

/** Default social share image (1200×630, in public/). */
export const OG_IMAGE = {
  url: `${SITE_URL}/og.png`,
  width: 1200,
  height: 630,
  alt: SITE_NAME,
};

/** Absolute URL for a locale + path ("" = locale home, e.g. "/about"). */
export function urlFor(locale: string, path = ""): string {
  return `${SITE_URL}/${locale}${path}`;
}

/**
 * hreflang alternates for a path across all locales, plus x-default.
 * Returns relative paths; `metadataBase` resolves them to absolute URLs.
 */
function languagesFor(path = ""): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) languages[l] = `/${l}${path}`;
  languages["x-default"] = `/${DEFAULT_LOCALE}${path}`;
  return languages;
}

type BuildMetadataOpts = {
  locale: string;
  /** Path after the locale segment, e.g. "/about". Empty string for the home page. */
  path?: string;
  title: string;
  description: string;
  type?: "website" | "article";
  /** Extra Open Graph fields for article pages (blog posts). */
  article?: { publishedTime?: string; modifiedTime?: string; tags?: string[] };
};

/**
 * Build a page's Metadata with canonical URL, hreflang alternates, Open Graph,
 * and Twitter Card — the full per-page SEO surface. Every page's
 * generateMetadata should return this so the tags stay consistent.
 */
export function buildMetadata({
  locale,
  path = "",
  title,
  description,
  type = "website",
  article,
}: BuildMetadataOpts): Metadata {
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}${path}`,
      languages: languagesFor(path),
    },
    openGraph: {
      title,
      description,
      url: urlFor(locale, path),
      siteName: SITE_NAME,
      locale: OG_LOCALE[locale] ?? OG_LOCALE[DEFAULT_LOCALE],
      type,
      images: [OG_IMAGE],
      ...(article
        ? {
            publishedTime: article.publishedTime,
            modifiedTime: article.modifiedTime,
            tags: article.tags,
          }
        : {}),
    },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE.url] },
  };
}

/* ------------------------------------------------------------------ */
/* JSON-LD structured data builders                                    */
/* ------------------------------------------------------------------ */

const SAME_AS = [
  "https://github.com/nmatei",
  "https://www.linkedin.com/in/nicolaematei",
  "https://nmatei.github.io/web",
];

/** Organization schema — site-wide identity for rich results. */
export function organizationLd(description: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description,
    areaServed: "Worldwide",
    knowsLanguage: ["ro", "en"],
    sameAs: SAME_AS,
  };
}

/** WebSite schema — site-wide, declares the two languages. */
export function webSiteLd(description: string): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description,
    inLanguage: ["ro", "en"],
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };
}

/** BlogPosting schema for a single article. */
export function blogPostingLd(opts: {
  locale: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  tags: string[];
}): Record<string, unknown> {
  const url = urlFor(opts.locale, `/blog/${opts.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.title,
    description: opts.excerpt,
    datePublished: opts.date,
    dateModified: opts.date,
    inLanguage: opts.locale,
    keywords: opts.tags.join(", "),
    image: OG_IMAGE.url,
    url,
    mainEntityOfPage: url,
    author: { "@type": "Person", name: "Nicolae Matei", url: "https://github.com/nmatei" },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/favicon.svg` },
    },
  };
}
