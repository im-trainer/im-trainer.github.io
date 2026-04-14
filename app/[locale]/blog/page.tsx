import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, BookOpen, Calendar, Tag } from "lucide-react";
import { blogPosts } from "@/lib/blog";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog.meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(
    locale === "ro" ? "ro-RO" : "en-GB",
    { year: "numeric", month: "long", day: "numeric" }
  );
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "blog" });

  return (
    <>
      {/* Hero */}
      <section className="bg-white py-16 lg:py-24 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-5">
              {t("hero.title")}
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogPosts.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen size={48} className="text-slate-300 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-slate-700 mb-2">
                {t("noPostsTitle")}
              </h2>
              <p className="text-slate-400 max-w-sm mx-auto text-sm">
                {t("noPostsDescription")}
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.map((post) => {
                const title = locale === "ro" ? post.titleRo : post.titleEn;
                const excerpt = locale === "ro" ? post.excerptRo : post.excerptEn;
                return (
                  <Link
                    key={post.slug}
                    href={`/${locale}/blog/${post.slug}`}
                    className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-sky-200 hover:shadow-sm transition-all"
                  >
                    <div className="h-1 bg-sky-500" />
                    <div className="p-6">
                      <div className="flex items-center gap-3 text-xs text-slate-400 mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(post.date, locale)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag size={12} />
                          {post.category}
                        </span>
                      </div>
                      <h2 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors leading-snug">
                        {title}
                      </h2>
                      <p className="text-sm text-slate-500 leading-relaxed mb-4">
                        {excerpt}
                      </p>
                      <span className="inline-flex items-center gap-1.5 text-sm text-sky-500 font-medium">
                        {t("readMore")}
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
