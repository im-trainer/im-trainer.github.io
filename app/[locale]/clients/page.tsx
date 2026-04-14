import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, ExternalLink, FolderOpen } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "clients.meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

const clientData = [
  { key: "fasttrackit", name: "FastTrackIT", url: "https://fasttrackit.org/", logo: "FT", logoColor: "bg-sky-500 text-white" },
  { key: "transilvaniait", name: "Transilvania IT", url: "https://www.transilvaniait.ro/", logo: "TI", logoColor: "bg-amber-500 text-white" },
  { key: "broadridge", name: "Broadridge / itiviti", url: "https://www.broadridge.com/capability/front-office-solutions/", logo: "BR", logoColor: "bg-violet-500 text-white" },
] as const;

export default async function ClientsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "clients" });
  const tHome = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

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

      {/* Client cards */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {clientData.map(({ key, name, url, logo, logoColor }) => (
            <div key={key} className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xs">
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg font-mono ${logoColor}`}>
                      {logo}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{name}</h2>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {t(`${key}.collaboration` as Parameters<typeof t>[0])}
                      </span>
                    </div>
                  </div>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-700 font-medium transition-colors"
                  >
                    {url.replace("https://", "").replace(/\/$/, "").slice(0, 30)}
                    <ExternalLink size={13} />
                  </a>
                </div>
                <div className="lg:col-span-2">
                  <p className="text-slate-600 leading-relaxed mb-5">
                    {t(`${key}.description` as Parameters<typeof t>[0])}
                  </p>
                  <ul className="space-y-2">
                    {(["detail1", "detail2", "detail3"] as const).map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 size={16} className="text-sky-400 mt-0.5 shrink-0" />
                        {t(`${key}.${detail}` as Parameters<typeof t>[0])}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio placeholder */}
      <section className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center">
            <FolderOpen size={48} className="text-slate-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-700 mb-2">
              {t("portfolio.title")}
            </h2>
            <p className="text-slate-400 max-w-md mx-auto text-sm leading-relaxed">
              {t("portfolio.placeholder")}
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white text-xl font-semibold mb-6">
            {tHome("cta.title")}
          </p>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-400 transition-colors"
          >
            {tCommon("contactUs")}
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
