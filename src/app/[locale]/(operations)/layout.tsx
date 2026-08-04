import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { OperationsLayoutShell } from "./layout-shell";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "operations" });
  return {
    title: { default: t("panelTitle"), template: `%s · ${t("panelTitle")}` },
  };
}

export default function OperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OperationsLayoutShell>{children}</OperationsLayoutShell>;
}
