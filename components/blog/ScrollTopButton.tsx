"use client";

import { useTranslations } from "next-intl";
import { ArrowUp } from "lucide-react";

/** Scrolls back to the top of the page (smoothly, unless motion is reduced). */
export default function ScrollTopButton() {
  const t = useTranslations("blog");

  function scrollTop() {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollTop}
      title={t("backToTopHint")}
      className="inline-flex items-center gap-1.5 text-sm text-sky-500 hover:text-sky-700 font-medium transition-colors cursor-pointer"
    >
      {t("backToTop")}
      <ArrowUp size={15} />
    </button>
  );
}
