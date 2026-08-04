"use client";

import { Package, FileText, LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppShell } from "@/components/layout/app-shell";

const navItems = [
  {
    href: "/customer",
    labelKey: "nav.dashboard",
    icon: <LayoutDashboard className="size-4" />,
  },
  {
    href: "/customer/shipments",
    labelKey: "nav.shipments",
    icon: <Package className="size-4" />,
  },
  {
    href: "/customer/quotes",
    labelKey: "nav.quotes",
    icon: <FileText className="size-4" />,
  },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations("nav");
  return (
    <AppShell navItems={navItems} panelTitle={t("customerPanel")}>
      {children}
    </AppShell>
  );
}
