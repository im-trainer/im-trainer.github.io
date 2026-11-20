"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Check, Share2 } from "lucide-react";

const RESET_MS = 3000;

type Props = {
  /** Site-relative path of the article, e.g. `/ro/blog/my-post`. */
  path: string;
  title: string;
  className?: string;
};

/**
 * Shares an article: the system share sheet where the browser has one,
 * otherwise the link is copied to the clipboard.
 */
export default function ShareButton({ path, title, className = "" }: Props) {
  const t = useTranslations("blog");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function share() {
    const url = new URL(path, window.location.origin).href;

    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // Dismissed by the user, or refused — nothing to report either way.
      }
      return;
    }

    // `navigator.clipboard` is undefined outside a secure context (plain http).
    if (!navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), RESET_MS);
  }

  const label = copied ? t("linkCopied") : t("share");

  return (
    <button
      type="button"
      onClick={share}
      aria-label={label}
      title={label}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors cursor-pointer ${
        copied
          ? "border-emerald-200 bg-emerald-50 text-emerald-600"
          : "border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-600"
      } ${className}`}
    >
      {copied ? <Check size={14} /> : <Share2 size={14} />}
    </button>
  );
}
