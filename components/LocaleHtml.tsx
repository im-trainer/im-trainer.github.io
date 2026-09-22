"use client";

import { useEffect } from "react";
import { storeLocale } from "@/lib/localePreference";

// Sets document.documentElement.lang to the active locale, and remembers that
// locale so the root page (`/`) can redirect back to it on the next visit.
// Works alongside suppressHydrationWarning on the root <html>.
export default function LocaleHtml({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
    storeLocale(locale);
  }, [locale]);
  return null;
}
