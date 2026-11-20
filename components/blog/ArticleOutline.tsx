"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Heading } from "@/lib/rehype/headings";

/**
 * A heading counts as "reached" once it is this far from the top of the
 * viewport: the sticky header (64px) plus some breathing room. Matches the
 * `scroll-margin-top` on prose headings in `app/globals.css`, so the section
 * you jump to is also the one that lights up.
 */
const ACTIVE_OFFSET_PX = 104;

/**
 * Reading-progress rail pinned to the right edge of an article: one dash per
 * section, the current one highlighted. Hovering (or tabbing into) the rail
 * expands it into the list of section titles; each one jumps to its section.
 *
 * Desktop only — it needs both the side margin and a hover pointer.
 */
export default function ArticleOutline({ headings }: { headings: Heading[] }) {
  const t = useTranslations("blog");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    let frame = 0;

    function update() {
      frame = 0;
      let current: string | null = null;
      for (const { id } of headings) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top > ACTIVE_OFFSET_PX) break;
        current = id;
      }
      // A short last section can never reach the top of the viewport, so at
      // the very bottom of the page the last section wins.
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom && headings.length > 0) {
        current = headings[headings.length - 1].id;
      }
      setActiveId(current);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav
      aria-label={t("outline")}
      className="group fixed right-3 top-1/2 z-30 hidden -translate-y-1/2 lg:block print:hidden"
    >
      <ol className="max-h-[80vh] overflow-y-auto rounded-xl border border-transparent py-1.5 transition-colors duration-150 group-hover:border-slate-200 group-hover:bg-white group-hover:shadow-lg group-focus-within:border-slate-200 group-focus-within:bg-white group-focus-within:shadow-lg">
        {headings.map(({ id, text, level }) => {
          const active = id === activeId;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={active ? "location" : undefined}
                className="group/item flex items-center justify-end py-1.5 pr-2 pl-2 outline-none group-hover:pl-4 group-focus-within:pl-4"
              >
                <span
                  className={`max-w-0 overflow-hidden text-[13px] leading-4 whitespace-nowrap text-ellipsis opacity-0 transition-opacity duration-150 group-hover:mr-3 group-hover:max-w-72 group-hover:opacity-100 group-focus-within:mr-3 group-focus-within:max-w-72 group-focus-within:opacity-100 ${
                    active
                      ? "font-medium text-slate-900"
                      : "text-slate-500 group-hover/item:text-slate-900 group-focus-visible/item:text-slate-900"
                  }`}
                >
                  {text}
                </span>
                <span
                  aria-hidden="true"
                  className={`h-0.5 shrink-0 rounded-full transition-colors duration-150 ${
                    level === 2 ? "w-5" : "ml-2 w-3"
                  } ${active
                      ? "bg-sky-500"
                      : "bg-slate-300 group-hover/item:bg-slate-900 group-focus-visible/item:bg-slate-900"}`}
                />
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
