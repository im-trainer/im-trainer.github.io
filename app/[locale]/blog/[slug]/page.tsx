import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { blogPosts, getPostBySlug } from "@/lib/blog";
import { routing } from "@/i18n/routing";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    blogPosts.map((post) => ({ locale, slug: post.slug }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const title = locale === "ro" ? post.titleRo : post.titleEn;
  const description = locale === "ro" ? post.excerptRo : post.excerptEn;
  return {
    title,
    description,
    openGraph: { title, description },
  };
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(
    locale === "ro" ? "ro-RO" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );
}

function renderContent(content: string) {
  return content
    .split("\n\n")
    .map((block, i) => {
      if (block.startsWith("## ")) {
        return (
          <h2 key={i} className="text-2xl font-bold text-slate-900 mt-10 mb-4">
            {block.slice(3)}
          </h2>
        );
      }
      if (block.startsWith("- ")) {
        const items = block.split("\n").filter((l) => l.startsWith("- "));
        return (
          <ul key={i} className="list-disc list-inside space-y-1 text-slate-600">
            {items.map((item, j) => (
              <li key={j}>{item.slice(2)}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={i} className="text-slate-600 leading-relaxed">
          {block}
        </p>
      );
    });
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = getPostBySlug(slug);
  if (!post) notFound();

  const t = await getTranslations({ locale, namespace: "blog" });

  const title = locale === "ro" ? post.titleRo : post.titleEn;
  const content = locale === "ro" ? post.contentRo : post.contentEn;

  return (
    <>
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
          <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              <span className="font-medium">{t("publishedOn")}</span>{" "}
              {formatDate(post.date, locale)}
            </span>
            <span className="flex items-center gap-1">
              <Tag size={12} />
              {post.category}
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
          <div className="space-y-4">{renderContent(content)}</div>
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
