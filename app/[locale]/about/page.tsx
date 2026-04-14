import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, CheckCircle2, BookOpen, Target, Award } from "lucide-react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about.meta" });
  return {
    title: t("title"),
    description: t("description"),
    openGraph: { title: t("title"), description: t("description") },
  };
}

const skills = [
  { category: "Frontend", items: ["HTML5", "CSS3", "JavaScript (ES6+)", "React", "Next.js", "TypeScript"] },
  { category: "Styling", items: ["Tailwind CSS", "CSS Grid", "Flexbox", "Responsive Design", "CSS Custom Properties"] },
  { category: "Tooling", items: ["Git & GitHub", "VS Code", "npm / Node.js", "ESLint", "Webpack / Vite"] },
  { category: "Concepts", items: ["DOM Manipulation", "REST APIs", "Web Performance", "Accessibility", "SEO basics"] },
];

const philosophyIcons = [Target, BookOpen, Award];

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "about" });
  const tHome = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  const philosophyKeys = ["item1", "item2", "item3"] as const;

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

      {/* Story */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6">
                {t("story.title")}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-4">{t("story.p1")}</p>
              <p className="text-slate-600 leading-relaxed">{t("story.p2")}</p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs">
              <pre className="text-sm font-mono text-slate-700 leading-loose overflow-x-auto">
                <span className="text-sky-500">const</span>{" "}
                <span className="text-amber-500">imTrainer</span>{" = {"}
                {"\n"}
                {"  "}
                <span className="text-slate-400">{"// Romania-based"}</span>
                {"\n"}
                {"  "}country:{" "}
                <span className="text-emerald-600">&apos;Romania&apos;</span>,{"\n"}
                {"  "}languages: [<span className="text-emerald-600">&apos;ro&apos;</span>, <span className="text-emerald-600">&apos;en&apos;</span>],{"\n"}
                {"  "}focus: [{"\n"}
                {"    "}<span className="text-emerald-600">&apos;training&apos;</span>,{"\n"}
                {"    "}<span className="text-emerald-600">&apos;software&apos;</span>,{"\n"}
                {"  "}],{"\n"}
                {"  "}delivery: [{"\n"}
                {"    "}<span className="text-emerald-600">&apos;classroom&apos;</span>,{"\n"}
                {"    "}<span className="text-emerald-600">&apos;online&apos;</span>,{"\n"}
                {"  "}],{"\n"}
                {"}"};
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            {t("philosophy.title")}
          </h2>
          <div className="grid sm:grid-cols-3 gap-8">
            {philosophyKeys.map((key, i) => {
              const Icon = philosophyIcons[i];
              return (
                <div key={key} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-sky-50 flex items-center justify-center mx-auto mb-5 text-sky-500">
                    <Icon size={26} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-3">
                    {t(`philosophy.${key}.title` as Parameters<typeof t>[0])}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {t(`philosophy.${key}.description` as Parameters<typeof t>[0])}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              {t("skills.title")}
            </h2>
            <p className="text-slate-500">{t("skills.subtitle")}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map(({ category, items }) => (
              <div key={category} className="bg-white rounded-2xl p-6 border border-slate-100">
                <h3 className="font-mono text-xs font-semibold uppercase tracking-wider text-sky-500 mb-4">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
