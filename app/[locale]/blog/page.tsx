import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getAllPosts, getAllTags } from "@/lib/blog";
import { formatDate } from "@/lib/formatDate";
import BlogList from "@/components/blog/BlogList";
import QuickLinksBar from "@/components/QuickLinksBar";
import { buildMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog.meta" });
  return buildMetadata({
    locale,
    path: "/blog",
    title: t("title"),
    description: t("description"),
  });
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const posts = getAllPosts(locale).map((post) => ({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    dateLabel: formatDate(post.date, locale),
    tags: post.tags,
  }));

  return (
    <>
      {/* Pinned + most visited articles, from the visitor's own browser */}
      <QuickLinksBar locale={locale} posts={posts} />
      <BlogList locale={locale} posts={posts} tags={getAllTags(locale)} />
    </>
  );
}
