"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronDown, Pin, TrendingUp, X } from "lucide-react";
import {
  MOST_VISITED_LIMIT,
  selectQuickLinks,
  togglePin,
  useActivityLoaded,
  useBlogActivity,
} from "@/lib/blogActivity";

// From this many pins on, the row belongs to the pins: the most visited
// articles fold into a dropdown at every screen width. (On small screens they
// already fold as soon as there is a single pin.)
const FOLD_FROM_PINS = 3;

type Item = { slug: string; title: string; count: number };

type Props = {
  locale: string;
  /** Every article in the current language; titles are looked up by slug. */
  posts: { slug: string; title: string }[];
  /** On an article page: its slug, so the empty-pin hint can pin it directly. */
  currentSlug?: string;
};

function VisitCount({ count }: { count: number }) {
  const t = useTranslations("home.quickLinks");
  return (
    <span
      title={t("visits", { count })}
      className="shrink-0 rounded-full bg-slate-100 px-1.5 text-xs font-medium text-slate-500"
    >
      <span aria-hidden="true">{count}</span>
      <span className="sr-only">{t("visits", { count })}</span>
    </span>
  );
}

/** The most visited articles behind one button, for when the row is full. */
function MostVisitedMenu({
  locale,
  items,
  className = "",
}: {
  locale: string;
  items: Item[];
  className?: string;
}) {
  const t = useTranslations("home.quickLinks");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative shrink-0 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={t("mostVisited")}
        title={t("mostVisited")}
        className={`flex items-center gap-1 rounded-full border px-2.5 py-1.5 transition-colors cursor-pointer ${
          open
            ? "border-sky-300 bg-white text-sky-600"
            : "border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-600"
        }`}
      >
        <TrendingUp size={14} />
        <ChevronDown
          size={14}
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg">
          <p className="px-2.5 pb-1.5 pt-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
            {t("mostVisited")}
          </p>
          <ul>
            {items.map(({ slug, title, count }) => (
              <li key={slug}>
                <Link
                  href={`/${locale}/blog/${slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between gap-3 rounded-lg px-2.5 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-sky-600 transition-colors"
                >
                  <span className="min-w-0">{title}</span>
                  <VisitCount count={count} />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * Strip under the navigation on the home page, the blog index and every
 * article: the articles this visitor pinned, then the ones they open most.
 * Everything comes from their own localStorage, so the static HTML only
 * carries the empty bar; with nothing pinned it shows a hint that pinned
 * articles land here.
 */
export default function QuickLinksBar({ locale, posts, currentSlug }: Props) {
  const t = useTranslations("home.quickLinks");
  const tBlog = useTranslations("blog");
  const activity = useBlogActivity();
  const loaded = useActivityLoaded();

  const titles = new Map(posts.map((post) => [post.slug, post.title]));
  const { pinned, mostVisited } = selectQuickLinks(
    activity,
    new Set(titles.keys()),
  );
  const visited: Item[] = mostVisited.map(({ slug, count }) => ({
    slug,
    count,
    title: titles.get(slug) ?? slug,
  }));
  const inline = visited.slice(0, MOST_VISITED_LIMIT);

  // Where the most visited articles go: in the row while there is room for
  // them, behind a dropdown (which lists a few more) once pins take it over.
  const hasMenu = visited.length > 0 && pinned.length > 0;
  const menuOnly = hasMenu && pinned.length >= FOLD_FROM_PINS;

  // With two or more links the section names collapse to their icon (the
  // name stays as a tooltip and for screen readers) to leave room for titles.
  const compact = pinned.length + inline.length >= 2;
  const heading =
    "flex shrink-0 items-center gap-1 text-xs font-semibold uppercase tracking-wide text-slate-400";
  const headingText = compact ? "sr-only" : undefined;
  // Titles show in full while they fit; when the row runs out of room every
  // chip shrinks (and truncates) down to a floor, and only then does it scroll.
  const chip =
    "flex min-w-24 items-center rounded-full border border-slate-200 bg-white text-sm text-slate-700 hover:border-sky-300 hover:text-sky-600 transition-colors";
  const hint = `flex shrink-0 items-center gap-1.5 py-1 text-sm text-slate-400 ${loaded ? "" : "invisible"}`;

  return (
    <nav
      aria-label={t("label")}
      className="bg-slate-50 border-b border-slate-200"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* The dropdown sits outside the scrolling row: a scroll container
            would clip its panel. */}
        <div className="flex items-center gap-2 py-2.5">
          <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto">
            {pinned.length === 0 ? (
              // Nothing pinned yet: say what this spot is for. Kept invisible
              // (but in the layout) until the stored pins are known, so a
              // visitor who does have pins never sees the hint flash by.
              currentSlug ? (
                <button
                  type="button"
                  onClick={() => togglePin(currentSlug)}
                  title={tBlog("pinHint")}
                  className={`${hint} hover:text-sky-600 transition-colors cursor-pointer`}
                >
                  <Pin size={14} />
                  {t("pinCurrent")}
                </button>
              ) : (
                <span className={hint}>
                  <Pin size={14} />
                  {t("pinnedEmpty")}
                </span>
              )
            ) : (
              <>
                <span className={heading} title={t("pinned")}>
                  <Pin size={14} />
                  <span className={headingText}>{t("pinned")}</span>
                </span>
                {pinned.map((slug) => (
                  <span key={slug} className={chip}>
                    <Link
                      href={`/${locale}/blog/${slug}`}
                      className="min-w-0 truncate py-1 pl-3 pr-1"
                    >
                      {titles.get(slug)}
                    </Link>
                    <button
                      type="button"
                      onClick={() => togglePin(slug)}
                      aria-label={tBlog("unpinHint")}
                      title={tBlog("unpinHint")}
                      className="mr-1 shrink-0 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </>
            )}

            {inline.length > 0 && !menuOnly && (
              // `contents`: the chips stay direct items of the row, so they
              // share its space (and shrink) together with the pins.
              <div className={hasMenu ? "hidden md:contents" : "contents"}>
                <span className={`${heading} ml-4`} title={t("mostVisited")}>
                  <TrendingUp size={14} />
                  <span className={headingText}>{t("mostVisited")}</span>
                </span>
                {inline.map(({ slug, title, count }) => (
                  <Link
                    key={slug}
                    href={`/${locale}/blog/${slug}`}
                    className={`${chip} gap-2 py-1 pl-3 pr-1.5`}
                  >
                    <span className="min-w-0 truncate">{title}</span>
                    <VisitCount count={count} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {hasMenu && (
            <MostVisitedMenu
              locale={locale}
              items={visited}
              className={menuOnly ? "" : "md:hidden"}
            />
          )}
        </div>
      </div>
    </nav>
  );
}
