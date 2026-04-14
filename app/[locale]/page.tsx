import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BookOpen,
  Code2,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  Monitor,
  Quote,
} from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home.meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

const clients = [
  { name: "FastTrackIT", url: "https://fasttrackit.org/" },
  { name: "Transilvania IT", url: "https://www.transilvaniait.ro/" },
  { name: "Broadridge", url: "https://www.broadridge.com/" },
];

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "home" });
  const s = await getTranslations({ locale, namespace: "services" });

  const services = [
    { icon: GraduationCap, key: "corporate", href: "/services", color: "bg-sky-50 text-sky-600" },
    { icon: BookOpen, key: "public", href: "/services", color: "bg-amber-50 text-amber-600" },
    { icon: Code2, key: "software", href: "/services", color: "bg-emerald-50 text-emerald-600" },
    { icon: Lightbulb, key: "consulting", href: "/services", color: "bg-violet-50 text-violet-600" },
  ];

  const testimonials = [0, 1, 2].map((i) => ({
    quote: t(`testimonials.items.${i}.quote` as Parameters<typeof t>[0]),
    author: t(`testimonials.items.${i}.author` as Parameters<typeof t>[0]),
    company: t(`testimonials.items.${i}.company` as Parameters<typeof t>[0]),
  }));

  return (
    <>
      {/* Hero */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <pre className="absolute top-8 right-8 text-xs text-slate-100 font-mono leading-relaxed hidden lg:block">
            {`const trainer = {
  focus: ['HTML', 'CSS', 'JS'],
  delivery: ['ro', 'en'],
  format: ['classroom', 'online'],
};`}
          </pre>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-mono font-semibold mb-6 border border-sky-100">
              <span className="text-sky-400">&lt;</span>
              {t("hero.badge")}
              <span className="text-sky-400">/&gt;</span>
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              {t("hero.headline")}
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-xl">
              {t("hero.subheadline")}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 transition-colors shadow-sm"
              >
                {t("hero.ctaPrimary")}
                <ArrowRight size={16} />
              </Link>
              <Link
                href={`/${locale}/services`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-slate-200 text-slate-700 font-semibold hover:border-slate-300 hover:bg-slate-50 transition-colors"
              >
                {t("hero.ctaSecondary")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              {t("intro.title")}
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed">
              {t("intro.text")}
            </p>
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              {t("services.title")}
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              {t("services.subtitle")}
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, key, href, color }) => (
              <Link
                key={key}
                href={`/${locale}${href}`}
                className="group p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-sky-200 hover:bg-white hover:shadow-sm transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 group-hover:text-sky-600 transition-colors">
                  {s(`${key}.title` as Parameters<typeof s>[0])}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
                  {s(`${key}.description` as Parameters<typeof s>[0])}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Udemy callout */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-mono font-semibold mb-4">
                {t("udemy.badge")}
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                {t("udemy.title")}
              </h2>
              <p className="text-sky-100 max-w-xl mb-6 leading-relaxed">
                {t("udemy.description")}
              </p>
              <a
                href="https://nmatei.github.io/web"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-sky-600 font-semibold hover:bg-sky-50 transition-colors shadow-sm"
              >
                {t("udemy.cta")}
                <ExternalLink size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Clients strip */}
      <section className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-slate-400 mb-8">
            {t("clients.title")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12">
            {clients.map(({ name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-slate-700 font-semibold text-lg transition-colors"
              >
                {name}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            {t("testimonials.title")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map(({ quote, author, company }, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100">
                <Quote size={24} className="text-sky-200 mb-4" />
                <p className="text-slate-700 leading-relaxed mb-4 italic">
                  &ldquo;{quote}&rdquo;
                </p>
                <div className="border-t border-slate-100 pt-4">
                  <p className="text-sm font-semibold text-slate-800">{author}</p>
                  <p className="text-xs text-slate-400">{company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">{t("cta.title")}</h2>
          <p className="text-slate-400 mb-8 max-w-lg mx-auto">{t("cta.subtitle")}</p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-400 transition-colors"
          >
            {t("cta.button")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
