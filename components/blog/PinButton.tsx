"use client";

import { useTranslations } from "next-intl";
import { Pin, PinOff } from "lucide-react";
import { togglePin, useBlogActivity } from "@/lib/blogActivity";

type Props = {
  slug: string;
  /** `full` shows the label next to the icon; `icon` is the compact card form. */
  variant?: "full" | "icon";
  className?: string;
};

/** Pins an article to the quick-links bar on the home page (and unpins it). */
export default function PinButton({
  slug,
  variant = "full",
  className = "",
}: Props) {
  const t = useTranslations("blog");
  const pinned = useBlogActivity().pins.includes(slug);
  // Unpinned: the short label says what the button is, the tooltip what it
  // does. Pinned: the crossed-out pin alone is enough, whatever the variant.
  const hint = pinned ? t("unpin") : t("pinHint");
  const iconOnly = variant === "icon" || pinned;
  const Icon = pinned ? PinOff : Pin;

  const shape = iconOnly
    ? "h-8 w-8 justify-center"
    : "h-8 gap-1.5 px-3 text-xs font-medium";
  const tone = pinned
    ? "border-sky-200 bg-sky-50 text-sky-700 hover:bg-sky-100"
    : "border-slate-200 bg-white text-slate-500 hover:border-sky-300 hover:text-sky-600";

  return (
    <button
      type="button"
      onClick={() => togglePin(slug)}
      aria-pressed={pinned}
      aria-label={iconOnly ? hint : undefined}
      title={hint}
      className={`inline-flex items-center rounded-full border transition-colors cursor-pointer ${shape} ${tone} ${className}`}
    >
      <Icon size={14} />
      {!iconOnly && t("pin")}
    </button>
  );
}
