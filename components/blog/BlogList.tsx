"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowRight, BookOpen, Calendar, Check, Tag, X } from "lucide-react";
import PinButton from "@/components/blog/PinButton";
import ShareButton from "@/components/blog/ShareButton";
import { useActivityLoaded, useBlogActivity } from "@/lib/blogActivity";
import { sameTagSlug, tagHref, tagSlug } from "@/lib/formatDate";

/** An unread article counts as "new" for this long after its publish date. */
const NEW_FOR_MS = 30 * 24 * 60 * 60 * 1000;

export interface BlogListPost {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO "YYYY-MM-DD"; decides whether an unread article is still "new". */
  date: string;
  /** Already formatted on the server, so server and browser never disagree. */
  dateLabel: string;
  tags: string[];
}

type Props = {
  locale: string;
  posts: BlogListPost[];
  tags: string[];
};

function BlogListView({
  locale,
  posts,
  tags,
  activeSlugs,
  unreadOnly,
}: Props & { activeSlugs: string[]; unreadOnly: boolean }) {
  const t = useTranslations("blog");
  const allHref = tagHref(locale, []);
  /** The list URL for a set of tags plus the "unread only" switch. */
  const listHref = (forTags: string[], unread: boolean) => {
    const href = tagHref(locale, forTags);
    if (!unread) return href;
    return `${href}${href.includes("?") ? "&" : "?"}unread=1`;
  };

  // Read / unread comes from the visitor's own browser, so until that is
  // loaded (prerender, hydration) every card renders in its neutral, unread
  // form — which is also what a first-time visitor keeps seeing.
  const visits = useBlogActivity().visits;
  const loaded = useActivityLoaded();
  const [now] = useState(() => Date.now());
  const isRead = (slug: string) => slug in visits;
  const isNew = (post: BlogListPost) =>
    loaded && !isRead(post.slug) && now - Date.parse(post.date) < NEW_FOR_MS;

  const isActive = (tag: string) =>
    activeSlugs.some((slug) => sameTagSlug(slug, tagSlug(tag)));
  const activeTags = tags.filter(isActive);
  // A slug in the URL that matches no tag can match no article either.
  const unknown = activeSlugs.filter(
    (slug) => !tags.some((tag) => sameTagSlug(slug, tagSlug(tag))),
  );
  // Two independent filters. Read state: all or unread only, exactly one is
  // always on. Tags: any number, and an article has to carry all of them.
  // Every number in the bar is the size of the list you would get by clicking
  // it, given the *other* filter as it stands — so a count never promises
  // more than the click delivers.
  const withTags = (wanted: string[]) =>
    unknown.length > 0
      ? []
      : posts.filter((post) => wanted.every((tag) => post.tags.includes(tag)));
  const inReadState = (list: BlogListPost[]) =>
    unreadOnly ? list.filter((post) => !isRead(post.slug)) : list;

  const tagged = withTags(activeTags);
  const unreadTagged = tagged.filter((post) => !isRead(post.slug));
  const visible = unreadOnly ? unreadTagged : tagged;
  const countWithTag = (tag: string) =>
    inReadState(withTags(isActive(tag) ? activeTags : [...activeTags, tag]))
      .length;

  const pill =
    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm font-medium transition-colors";
  const pillOn = "border-sky-500 bg-sky-500 text-white hover:bg-sky-600";
  const pillOff =
    "border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-600";
  const pillEmpty = "border-slate-100 bg-slate-50 text-slate-300";

  const segment =
    "inline-flex items-center gap-1.5 px-3 py-1 transition-colors";
  const segmentOn = "bg-sky-500 text-white hover:bg-sky-600";
  const segmentOff = "text-slate-600 hover:bg-slate-50 hover:text-sky-600";

  return (
    <>
      {/* Hero */}
      <section className="bg-white py-10 lg:py-12 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>

          {tags.length > 0 && (
            <nav
              aria-label={t("tagsLabel")}
              className="mt-6 flex flex-wrap items-center gap-2"
            >
              {/* Read state: a two-way switch that leaves the tags alone. */}
              <span className="inline-flex overflow-hidden rounded-full border border-slate-200 bg-white text-sm font-medium">
                <Link
                  href={listHref(activeTags, false)}
                  scroll={false}
                  aria-current={unreadOnly ? undefined : "true"}
                  className={`${segment} ${unreadOnly ? segmentOff : segmentOn}`}
                >
                  {t("allTags")}
                  <span className="text-xs opacity-70">{tagged.length}</span>
                </Link>
                <Link
                  href={listHref(activeTags, true)}
                  scroll={false}
                  aria-current={unreadOnly ? "true" : undefined}
                  className={`${segment} border-l border-slate-200 ${unreadOnly ? segmentOn : segmentOff}`}
                >
                  {t("unread")}
                  <span className="text-xs opacity-70">
                    {unreadTagged.length}
                  </span>
                </Link>
              </span>
              {tags.map((tag) => {
                const active = isActive(tag);
                const count = countWithTag(tag);
                const content = (
                  <>
                    <Tag size={12} />
                    {tag}
                    <span className="text-xs opacity-70">{count}</span>
                  </>
                );
                // Adding this tag would leave nothing to show: not a link.
                if (!active && count === 0) {
                  return (
                    <span key={tag} className={`${pill} ${pillEmpty}`}>
                      {content}
                    </span>
                  );
                }
                return (
                  <Link
                    key={tag}
                    // Each pill toggles its own tag and keeps the others.
                    href={listHref(
                      active
                        ? activeTags.filter((other) => other !== tag)
                        : tags.filter(
                            (other) => other === tag || isActive(other),
                          ),
                      unreadOnly,
                    )}
                    scroll={false}
                    aria-pressed={active}
                    aria-label={t("filterByTag", { tag })}
                    className={`${pill} ${active ? pillOn : pillOff}`}
                  >
                    {content}
                  </Link>
                );
              })}
              {activeSlugs.length > 0 && (
                <Link
                  href={listHref([], unreadOnly)}
                  scroll={false}
                  className="inline-flex items-center gap-1 px-1.5 py-1 text-sm text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X size={14} />
                  {t("clearTags")}
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>

      {/* Posts */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-700 mb-2">
                {t("noPostsTitle")}
              </h2>
              <p className="text-slate-400 max-w-sm mx-auto text-sm">
                {t("noPostsDescription")}
              </p>
            </div>
          ) : visible.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-700 mb-4">
                {tagged.length > 0
                  ? t("noUnread")
                  : t("noPostsForTag", {
                      tag: [...activeTags, ...unknown].join(" + "),
                    })}
              </h2>
              <Link
                href={allHref}
                scroll={false}
                className="inline-flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-700 font-medium transition-colors"
              >
                {t("showAllPosts")}
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visible.map((post) => {
                const read = isRead(post.slug);
                return (
                  // The title link is stretched over the whole card (`after:`),
                  // so the card stays one big click target while the tags and
                  // the pin button, lifted above it, remain separately clickable.
                  <article
                    key={post.slug}
                    className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-sky-200 hover:shadow-sm transition-all"
                  >
                    <div
                      className={`h-1 ${read ? "bg-slate-200" : "bg-sky-500"}`}
                    />
                    <div className="p-6">
                      <div className="flex items-center justify-between gap-3 text-xs text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {post.dateLabel}
                          {isNew(post) && (
                            <span className="ml-1.5 rounded-full bg-amber-100 px-2 py-0.5 font-semibold uppercase tracking-wide text-amber-700">
                              {t("newBadge")}
                            </span>
                          )}
                          {read && (
                            <span className="ml-1.5 inline-flex items-center gap-0.5 text-slate-400">
                              <Check size={12} />
                              {t("readBadge")}
                            </span>
                          )}
                        </span>
                        <span className="relative z-10 -my-1.5 flex items-center gap-1.5">
                          <PinButton slug={post.slug} variant="icon" />
                          <ShareButton
                            path={`/${locale}/blog/${post.slug}`}
                            title={post.title}
                          />
                        </span>
                      </div>
                      {post.tags.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 mb-3">
                          {post.tags.map((tag) => (
                            <Link
                              key={tag}
                              href={tagHref(locale, tag)}
                              aria-label={t("filterByTag", { tag })}
                              className="relative z-10 inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 px-2.5 py-0.5 text-xs font-medium hover:bg-sky-100 transition-colors"
                            >
                              <Tag size={10} />
                              {tag}
                            </Link>
                          ))}
                        </div>
                      )}
                      <h2
                        className={`text-lg font-bold mb-2 group-hover:text-sky-600 transition-colors leading-snug ${read ? "text-slate-500" : "text-slate-900"}`}
                      >
                        <Link
                          href={`/${locale}/blog/${post.slug}`}
                          className="after:absolute after:inset-0"
                        >
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm text-sky-500 font-medium">
                        {t("readMore")}
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function FilteredBlogList(props: Props) {
  const params = useSearchParams();
  return (
    <BlogListView
      {...props}
      activeSlugs={params.getAll("tag").filter(Boolean)}
      unreadOnly={params.get("unread") === "1"}
    />
  );
}

/**
 * The blog index: tag filter + article cards, filtered by `?tag=` (repeatable;
 * values are tag slugs, see `tagSlug`).
 *
 * The query string does not exist at build time, so `useSearchParams` has to
 * sit under a Suspense boundary. The fallback is the same list unfiltered,
 * which is what ends up in the static HTML — every article stays in the page
 * source, and the filter is applied once the page hydrates.
 */
export default function BlogList(props: Props) {
  return (
    <Suspense
      fallback={<BlogListView {...props} activeSlugs={[]} unreadOnly={false} />}
    >
      <FilteredBlogList {...props} />
    </Suspense>
  );
}
