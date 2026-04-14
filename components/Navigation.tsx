"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X } from "lucide-react";

const navLinks = [
  { key: "home", href: "/" },
  { key: "about", href: "/about" },
  { key: "services", href: "/services" },
  { key: "clients", href: "/clients" },
  { key: "blog", href: "/blog" },
  { key: "contact", href: "/contact" },
] as const;

export default function Navigation() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Strip locale prefix to get the current path segment
  const currentPath = pathname.replace(`/${locale}`, "") || "/";

  function localePath(path: string) {
    return `/${locale}${path === "/" ? "" : path}`;
  }

  function otherLocale() {
    return locale === "ro" ? "en" : "ro";
  }

  function otherLocalePath() {
    return `/${otherLocale()}${currentPath === "/" ? "" : currentPath}`;
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={localePath("/")}
            className="flex items-center gap-1 font-mono text-lg font-semibold shrink-0"
          >
            <span className="text-sky-500">&lt;</span>
            <span className="text-slate-900">IM Trainer</span>
            <span className="text-sky-500">/&gt;</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ key, href }) => {
              const isActive =
                href === "/"
                  ? currentPath === "/"
                  : currentPath.startsWith(href);
              return (
                <Link
                  key={key}
                  href={localePath(href)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-sky-600 bg-sky-50"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {t(key)}
                </Link>
              );
            })}
          </div>

          {/* Language switcher + mobile toggle */}
          <div className="flex items-center gap-2">
            {/* Language toggle */}
            <Link
              href={otherLocalePath()}
              className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:border-sky-400 hover:text-sky-600 transition-colors"
            >
              {otherLocale().toUpperCase()}
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-slate-100 mt-1">
            <div className="flex flex-col gap-1">
              {navLinks.map(({ key, href }) => {
                const isActive =
                  href === "/"
                    ? currentPath === "/"
                    : currentPath.startsWith(href);
                return (
                  <Link
                    key={key}
                    href={localePath(href)}
                    onClick={() => setMenuOpen(false)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive
                        ? "text-sky-600 bg-sky-50"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    {t(key)}
                  </Link>
                );
              })}
              <Link
                href={otherLocalePath()}
                onClick={() => setMenuOpen(false)}
                className="mt-2 px-3 py-2 rounded-md text-sm font-medium text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                {otherLocale() === "ro" ? "🇷🇴 Română" : "🇬🇧 English"}
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
