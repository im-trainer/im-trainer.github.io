"use client";

import { useEffect } from "react";

// Sets document.documentElement.lang to the active locale.
// Works alongside suppressHydrationWarning on the root <html>.
export default function LocaleHtml({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
