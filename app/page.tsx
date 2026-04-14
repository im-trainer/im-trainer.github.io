"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Root page: detect browser language and redirect to the appropriate locale.
// Defaults to Romanian if no preference is detected.
export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const lang =
      navigator.language.toLowerCase().startsWith("en") ? "en" : "ro";
    router.replace(`/${lang}`);
  }, [router]);

  return null;
}
