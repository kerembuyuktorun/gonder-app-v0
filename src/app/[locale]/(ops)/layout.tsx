"use client";

import { ClipboardList, PackageSearch, LayoutDashboard } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppShell } from "@/components/layout/app-shell";

const navItems = [
  {
    href: "/ops",
    labelKey: "nav.dashboard",
    icon: <LayoutDashboard className="size-4" />,
  },
  {
    href: "/ops/shipments",
    labelKey: "nav.shipments",
    icon: <PackageSearch className="size-4" />,
  },
  {
    href: "/ops/quotes",
    labelKey: "nav.quotes",
    icon: <ClipboardList className="size-4" />,
  },
];

export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations("nav");
  return (
    <AppShell navItems={navItems} panelTitle={t("opsPanel")}>
      {children}
    </AppShell>
  );
}
