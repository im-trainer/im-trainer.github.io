import { routing, type Locale } from "@/i18n/routing";

// Remembers the language the visitor last browsed in, so the root page
// (`/`) can send them back to it instead of re-detecting the browser language.
// Client-side only; every access is guarded because localStorage throws in
// private windows and when site data is blocked.
const STORAGE_KEY = "im-trainer.locale";

function isLocale(value: string | null): value is Locale {
  return value !== null && (routing.locales as readonly string[]).includes(value);
}

export function readStoredLocale(): Locale | null {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return isLocale(stored) ? stored : null;
  } catch {
    return null;
  }
}

export function storeLocale(locale: string) {
  if (!isLocale(locale)) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Ignore — the preference is a convenience, not required for the site to work.
  }
}

export function detectBrowserLocale(): Locale {
  const languages = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const language of languages) {
    const tag = language.toLowerCase().split("-")[0];
    if (isLocale(tag)) return tag;
  }
  return routing.defaultLocale;
}
