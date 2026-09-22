"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { detectBrowserLocale, readStoredLocale } from "@/lib/localePreference";

// Root page: send the visitor to the language they last browsed in, falling
// back to the browser language (and then to the default locale, Romanian).
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const locale = readStoredLocale() ?? detectBrowserLocale();
    router.replace(`/${locale}`);
  }, [router]);

  return null;
}
