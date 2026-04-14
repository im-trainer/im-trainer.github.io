import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ExternalLink } from "lucide-react";

function GitHubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedInIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const locale = useLocale();

  function localePath(path: string) {
    return `/${locale}${path === "/" ? "" : path}`;
  }

  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href={localePath("/")}
              className="inline-flex items-center gap-1 font-mono text-lg font-semibold mb-3"
            >
              <span className="text-sky-400">&lt;</span>
              <span className="text-white">IM Trainer</span>
              <span className="text-sky-400">/&gt;</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
          </div>

          {/* Pages */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              {t("pages")}
            </h3>
            <ul className="space-y-2">
              {[
                { key: "home", href: "/" },
                { key: "about", href: "/about" },
                { key: "services", href: "/services" },
                { key: "clients", href: "/clients" },
                { key: "blog", href: "/blog" },
                { key: "contact", href: "/contact" },
              ].map(({ key, href }) => (
                <li key={key}>
                  <Link
                    href={localePath(href)}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {nav(key as Parameters<typeof nav>[0])}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              {t("social")}
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/nmatei"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <GitHubIcon size={16} />
                  GitHub
                  <ExternalLink size={12} className="text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.linkedin.com/company/im-trainer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <LinkedInIcon size={16} />
                  LinkedIn
                  <ExternalLink size={12} className="text-slate-600" />
                </a>
              </li>
              <li>
                <a
                  href="https://nmatei.github.io/web"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                >
                  <ExternalLink size={16} />
                  Udemy Course
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <span>
            &copy; {year} {t("company")}. {t("rights")}
          </span>
          <span className="font-mono text-slate-600">
            &lt;built with Next.js /&gt;
          </span>
        </div>
      </div>
    </footer>
  );
}
