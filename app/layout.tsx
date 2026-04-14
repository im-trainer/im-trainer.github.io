import type { ReactNode } from "react";

// Root layout just passes children through.
// The [locale] layout handles <html> and <body>.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
