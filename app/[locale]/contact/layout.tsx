import type { Metadata } from "next";
import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import { buildMetadata } from "@/lib/seo";

// The contact page itself is a client component ("use client") and can't export
// metadata, so this server layout provides its SEO tags.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact.meta" });
  return buildMetadata({
    locale,
    path: "/contact",
    title: t("title"),
    description: t("description"),
  });
}

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
