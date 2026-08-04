import type { ReactNode } from "react";

/** Root layout required by Next.js — html/body live in [locale]/layout. */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
