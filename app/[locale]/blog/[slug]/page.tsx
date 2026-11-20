import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { getAllPosts, getAllSlugs, getPostBySlug } from "@/lib/blog";
import { routing } from "@/i18n/routing";
import { buildMetadata, blogPostingLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import CodeCopy from "@/components/CodeCopy";
import PinButton from "@/components/blog/PinButton";
import ShareButton from "@/components/blog/ShareButton";
import ScrollTopButton from "@/components/blog/ScrollTopButton";
import ArticleOutline from "@/components/blog/ArticleOutline";
import TrackVisit from "@/components/blog/TrackVisit";
import QuickLinksBar from "@/components/QuickLinksBar";
import { formatDate, tagHref } from "@/lib/formatDate";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getAllSlugs().map((slug) => ({ locale, slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getPostBySlug(slug, locale);
  if (!post) return {};
  return buildMetadata({
    locale,
    path: `/blog/${slug}`,
    title: post.title,
    description: post.excerpt,
    type: "article",
    article: {
      publishedTime: post.date,
      modifiedTime: post.date,
      tags: post.tags,
    },
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPostBySlug(slug, locale);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });

  const title = post.title;

  return (
    <>
      <JsonLd
        data={blogPostingLd({
          locale,
          slug,
          title: post.title,
          excerpt: post.excerpt,
          date: post.date,
          tags: post.tags,
        })}
      />
      <TrackVisit slug={slug} />
      <ArticleOutline headings={post.headings} />
      {/* Pinned + most visited articles, from the visitor's own browser */}
      <QuickLinksBar
        locale={locale}
        posts={getAllPosts(locale).map(({ slug, title }) => ({ slug, title }))}
        currentSlug={slug}
      />
      {/* Hero */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-8"
          >
            <ArrowLeft size={15} />
            {t("backToBlog")}
          </Link>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              <span className="font-medium">{t("publishedOn")}</span>{" "}
              {formatDate(post.date, locale)}
            </span>
            {post.tags.map((tag) => (
              <Link
                key={tag}
                href={tagHref(locale, tag)}
                aria-label={t("filterByTag", { tag })}
                className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 px-2.5 py-0.5 font-medium hover:bg-sky-100 transition-colors"
              >
                <Tag size={11} />
                {tag}
              </Link>
            ))}
            <span className="ml-auto flex items-center gap-2">
              <PinButton slug={slug} />
              <ShareButton path={`/${locale}/blog/${slug}`} title={post.title} />
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            {title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <CodeCopy>
            <div
              className="prose prose-slate max-w-none"
              dangerouslySetInnerHTML={{ __html: post.contentHtml }}
            />
          </CodeCopy>

          <div className="mt-12 pt-8 border-t border-slate-200 flex items-center justify-between gap-4">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-700 font-medium transition-colors"
            >
              <ArrowLeft size={15} />
              {t("backToBlog")}
            </Link>
            <ScrollTopButton />
          </div>
        </div>
      </section>
    </>
  );
}
