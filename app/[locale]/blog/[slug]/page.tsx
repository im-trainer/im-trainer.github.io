import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import { routing } from "@/i18n/routing";
import { buildMetadata, blogPostingLd } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

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

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(
    locale === "ro" ? "ro-RO" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );
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
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full bg-sky-50 text-sky-700 px-2.5 py-0.5 font-medium"
              >
                <Tag size={11} />
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight">
            {title}
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="bg-slate-50 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-slate max-w-none"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <div className="mt-12 pt-8 border-t border-slate-200">
            <Link
              href={`/${locale}/blog`}
              className="inline-flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-700 font-medium transition-colors"
            >
              <ArrowLeft size={15} />
              {t("backToBlog")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
