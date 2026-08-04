import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AppLayoutShell } from "./layout-shell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "nav" });
  return { title: { default: t("dashboard"), template: `%s · ${t("dashboard")}` } };
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppLayoutShell>{children}</AppLayoutShell>;
}
