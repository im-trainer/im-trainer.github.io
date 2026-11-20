"use client";

import { useEffect } from "react";
import { recordVisit, VISIT_AFTER_MS } from "@/lib/blogActivity";

/**
 * Counts a visit to an article in the visitor's own browser — but only once
 * they have actually had it on screen for `VISIT_AFTER_MS`. Time in a
 * background tab does not count: the clock pauses while the page is hidden and
 * resumes when it comes back. Renders nothing.
 */
export default function TrackVisit({ slug }: { slug: string }) {
  useEffect(() => {
    let remaining = VISIT_AFTER_MS;
    let startedAt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const pause = () => {
      if (timer === undefined) return;
      clearTimeout(timer);
      timer = undefined;
      remaining -= Date.now() - startedAt;
    };

    const resume = () => {
      if (timer !== undefined || remaining <= 0) return;
      startedAt = Date.now();
      timer = setTimeout(() => {
        remaining = 0;
        timer = undefined;
        recordVisit(slug);
      }, remaining);
    };

    const onVisibility = () =>
      document.visibilityState === "visible" ? resume() : pause();

    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      clearTimeout(timer);
    };
  }, [slug]);

  return null;
}
