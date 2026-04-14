import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  ExternalLink,
  GraduationCap,
  Lightbulb,
  Monitor,
} from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "services.meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

const serviceConfig = [
  { key: "corporate", icon: GraduationCap, accentBg: "bg-sky-50", accentText: "text-sky-600", badgeBg: "bg-sky-100 text-sky-700" },
  { key: "public", icon: BookOpen, accentBg: "bg-amber-50", accentText: "text-amber-600", badgeBg: "bg-amber-100 text-amber-700" },
  { key: "software", icon: Monitor, accentBg: "bg-emerald-50", accentText: "text-emerald-600", badgeBg: "bg-emerald-100 text-emerald-700" },
  { key: "consulting", icon: Lightbulb, accentBg: "bg-violet-50", accentText: "text-violet-600", badgeBg: "bg-violet-100 text-violet-700" },
] as const;

export default async function ServicesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "services" });

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

      {/* Services */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {serviceConfig.map(({ key, icon: Icon, accentBg, accentText, badgeBg }) => {
            const features = t.raw(`${key}.features`) as string[];
            return (
              <div key={key} className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xs">
                <div className="grid lg:grid-cols-2 gap-8 items-start">
                  <div>
                    <div className="flex items-center gap-3 mb-5">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${accentBg} ${accentText}`}>
                        <Icon size={22} />
                      </div>
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${badgeBg}`}>
                        {t(`${key}.badge` as Parameters<typeof t>[0])}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-3">
                      {t(`${key}.title` as Parameters<typeof t>[0])}
                    </h2>
                    <p className="text-slate-500 leading-relaxed">
                      {t(`${key}.description` as Parameters<typeof t>[0])}
                    </p>
                  </div>
                  <div>
                    <ul className="space-y-3">
                      {features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 size={18} className={`mt-0.5 shrink-0 ${accentText}`} />
                          <span className="text-slate-700 text-sm leading-relaxed">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Udemy callout */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative grid sm:grid-cols-2 gap-6 items-center">
              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-mono font-semibold mb-4">
                  {t("udemy.badge")}
                </span>
                <h2 className="text-2xl font-bold mb-3">{t("udemy.title")}</h2>
                <p className="text-sky-100 leading-relaxed text-sm">{t("udemy.description")}</p>
              </div>
              <div className="sm:text-right">
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
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">{t("cta.title")}</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">{t("cta.subtitle")}</p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-400 transition-colors"
          >
            {t("cta.button")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
