"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import { Check, Copy } from "lucide-react";

const RESET_MS = 2000;

/**
 * Renders the real copy button into one `<button data-code-copy>` slot that
 * `lib/rehype/code-block.ts` put in the static HTML at build time.
 */
function CopyButton({ slot }: { slot: HTMLElement }) {
  const t = useTranslations("blog");
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const label = copied ? t("codeCopied") : t("copyCode");
  const tooltip = copied ? t("codeCopiedShort") : t("copyCodeShort");

  // Both live on the slot, not on our portal content: the slot IS the <button>.
  // `aria-label` is the long form so the state change is announced rather than
  // only drawn; `data-tooltip` is the short form the CSS renders on hover, and
  // it is what keeps the tooltip out of the copied text and out of the a11y
  // tree (a CSS `content` string is not announced twice).
  useEffect(() => {
    slot.setAttribute("aria-label", label);
    slot.setAttribute("data-tooltip", tooltip);
  }, [slot, label, tooltip]);

  const copy = useCallback(async () => {
    // `navigator.clipboard` is undefined outside a secure context (plain http).
    if (!navigator.clipboard?.writeText) return;

    // Read the text back out of the DOM rather than rebuilding it: highlighting
    // has split the code into dozens of spans, and the DOM is the only source
    // that is guaranteed to match what the reader actually sees. Scoped to the
    // <pre>, so the bar's language name never ends up in the clipboard.
    const code = slot.closest(".code-block")?.querySelector("pre")?.textContent;
    if (!code) return;

    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // Denied or unavailable — say nothing rather than claim a copy happened.
      return;
    }

    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), RESET_MS);
  }, [slot]);

  useEffect(() => {
    slot.addEventListener("click", copy);
    return () => slot.removeEventListener("click", copy);
  }, [slot, copy]);

  return copied ? <Check size={15} /> : <Copy size={15} />;
}

/**
 * Wraps the rendered article and hydrates every code-block copy button.
 *
 * The article itself arrives as already-rendered `children` from a server
 * component, so it never becomes part of this client component's React tree —
 * only the small buttons do, via portals. Portals mount in an effect, after
 * hydration, so they cannot cause a hydration mismatch.
 */
export default function CodeCopy({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [slots, setSlots] = useState<HTMLElement[]>([]);

  useEffect(() => {
    if (!ref.current) return;
    setSlots(
      Array.from(ref.current.querySelectorAll<HTMLElement>("[data-code-copy]"))
    );
  }, []);

  return (
    <div ref={ref}>
      {children}
      {slots.map((slot, i) => createPortal(<CopyButton slot={slot} />, slot, String(i)))}
    </div>
  );
}
