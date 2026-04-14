"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ArrowRight, CheckCircle2, MapPin, Send } from "lucide-react";

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function ContactPage() {
  const t = useTranslations("contact");
  const tFooter = useTranslations("footer");
  const locale = useLocale();

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    // Compose mailto link as a fallback (no backend in v1)
    const subject = encodeURIComponent(form.subject || "Contact IM Trainer");
    const body = encodeURIComponent(
      `${t("form.name")}: ${form.name}\n${t("form.email")}: ${form.email}\n\n${form.message}`
    );
    const mailto = `mailto:contact@im-trainer.ro?subject=${subject}&body=${body}`;
    setTimeout(() => {
      window.location.href = mailto;
      setStatus("success");
    }, 600);
  }

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

      {/* Form + Info */}
      <section className="bg-slate-50 py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900 mb-6">
                  {t("form.title")}
                </h2>

                {status === "success" ? (
                  <div className="text-center py-10">
                    <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      {t("form.successTitle")}
                    </h3>
                    <p className="text-slate-500 text-sm">{t("form.successText")}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {t("form.name")}
                        </label>
                        <input
                          type="text"
                          name="name"
                          required
                          value={form.name}
                          onChange={handleChange}
                          placeholder={t("form.namePlaceholder")}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition placeholder-slate-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                          {t("form.email")}
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={form.email}
                          onChange={handleChange}
                          placeholder={t("form.emailPlaceholder")}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition placeholder-slate-300"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("form.subject")}
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        placeholder={t("form.subjectPlaceholder")}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition placeholder-slate-300"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        {t("form.message")}
                      </label>
                      <textarea
                        name="message"
                        required
                        rows={6}
                        value={form.message}
                        onChange={handleChange}
                        placeholder={t("form.messagePlaceholder")}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition placeholder-slate-300 resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sky-500 text-white font-semibold hover:bg-sky-600 disabled:opacity-60 transition-colors"
                    >
                      {status === "sending" ? (
                        t("form.sending")
                      ) : (
                        <>
                          {t("form.submit")}
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs">
                <h2 className="text-lg font-bold text-slate-900 mb-5">
                  {t("info.title")}
                </h2>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin size={16} className="text-sky-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        {t("info.company")}
                      </p>
                      <p>{t("info.location")}</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-5 leading-relaxed">
                  {t("info.response")}
                </p>
              </div>

              <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">
                  {tFooter("social")}
                </h3>
                <div className="space-y-3">
                  <a
                    href="https://github.com/nmatei"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                      <GitHubIcon size={16} />
                    </div>
                    <span>github.com/nmatei</span>
                  </a>
                  <a
                    href="https://www.linkedin.com/company/im-trainer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-slate-600 hover:text-slate-900 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center">
                      <LinkedInIcon size={16} />
                    </div>
                    <span>{t("info.linkedin")}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
