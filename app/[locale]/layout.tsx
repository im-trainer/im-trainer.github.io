import type { ReactNode } from "react";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import LocaleHtml from "@/components/LocaleHtml";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: {
    default: "IM Trainer SRL",
    template: "%s | IM Trainer SRL",
  },
  description:
    "IT training and software development. Based in Romania, serving clients globally.",
  metadataBase: new URL("https://im-trainer.github.io"),
  openGraph: {
    siteName: "IM Trainer SRL",
    type: "website",
  },
};

type Props = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      {/* Sets document.documentElement.lang client-side per locale */}
      <LocaleHtml locale={locale} />
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </NextIntlClientProvider>
  );
}
