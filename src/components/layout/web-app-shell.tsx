"use client";

import {
  ChevronDown,
  Home,
  BarChart3,
  Package,
  FileText,
  Plus,
  Link2,
  Settings,
  LifeBuoy,
  X,
  Menu,
  Sun,
  Moon,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { AppButton } from "@/components/shared/app-button";
import { SearchInput } from "@/components/shared/search-input";
import { NotificationCenter } from "@/features/orders/components/notification-center";
import { OrganizationSwitcher } from "@/components/layout/organization-switcher";
import { UserMenu } from "@/components/layout/user-menu";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { useUiStore } from "@/stores/ui-store";
import * as React from "react";

const navItems = [
  { href: "/app/home", labelKey: "shell.home", icon: Home },
  { href: "/app/orders", labelKey: "shell.shipments", icon: Package },
  { href: "/app/quotes", labelKey: "shell.quotes", icon: FileText },
  { href: "/app/requests/new", labelKey: "shell.newRequest", icon: Plus },
  { href: "/app/integrations", labelKey: "shell.integrations", icon: Link2 },
  { href: "/app/reports", labelKey: "shell.reports", icon: BarChart3 },
  { href: "/app/settings", labelKey: "shell.settings", icon: Settings },
  { href: "/app/support", labelKey: "shell.support", icon: LifeBuoy },
] as const;

function ShellNavLinks({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <nav className="flex-1 space-y-1 p-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium touch-target",
              active
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
            )}
            title={t(item.labelKey)}
          >
            <Icon className="size-4 shrink-0" />
            {!collapsed ? <span>{t(item.labelKey)}</span> : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function WebAppShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const setSidebarCollapsed = useUiStore((s) => s.setSidebarCollapsed);
  const nextLocale = locale === "tr" ? "en" : "tr";
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 1024 && window.innerWidth < 1280) {
        setSidebarCollapsed(true);
      }
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [setSidebarCollapsed]);

  return (
    <div className="flex min-h-dvh bg-background">
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 border-r border-border bg-card md:flex md:flex-col",
          sidebarCollapsed
            ? "w-[var(--sidebar-collapsed)]"
            : "w-[var(--sidebar-width)]",
        )}
      >
        <div className="flex h-[var(--topbar-height)] items-center border-b border-border px-4">
          <Link href="/app/home" className="flex min-w-0 items-center gap-2">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              G
            </span>
            {!sidebarCollapsed ? (
              <span className="truncate font-display text-lg font-semibold">
                {t("meta.appName")}
              </span>
            ) : null}
          </Link>
        </div>
        <ShellNavLinks collapsed={sidebarCollapsed} />
        <div className="border-t border-border p-3">
          <AppButton
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={toggleSidebar}
            aria-label={
              sidebarCollapsed
                ? t("shell.expandSidebar")
                : t("shell.collapseSidebar")
            }
          >
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                sidebarCollapsed ? "-rotate-90" : "rotate-90",
              )}
            />
            {!sidebarCollapsed ? (
              <span className="ml-2">{t("shell.collapseSidebar")}</span>
            ) : null}
          </AppButton>
        </div>
      </aside>

      {mobileNavOpen ? (
        <div className="fixed inset-0 z-[var(--z-overlay)] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-brand-950/50"
            aria-label={t("nav.closeMenu")}
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-[min(100%,18rem)] flex-col bg-card shadow-lg">
            <div className="flex h-[var(--topbar-height)] items-center justify-between border-b border-border px-4">
              <span className="font-display text-lg font-semibold">
                {t("meta.appName")}
              </span>
              <AppButton
                variant="ghost"
                size="icon"
                aria-label={t("nav.closeMenu")}
                onClick={() => setMobileNavOpen(false)}
              >
                <X className="size-5" />
              </AppButton>
            </div>
            <ShellNavLinks
              collapsed={false}
              onNavigate={() => setMobileNavOpen(false)}
            />
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-[var(--z-sticky)] flex h-[var(--topbar-height)] items-center gap-2 border-b border-border bg-card/95 px-3 backdrop-blur md:gap-3 md:px-4">
          <AppButton
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t("nav.openMenu")}
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-5" />
          </AppButton>

          <OrganizationSwitcher />

          <div className="hidden min-w-0 flex-1 md:block md:max-w-md lg:max-w-xl">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t("auth.globalSearch")}
            />
          </div>

          <div className="ml-auto flex items-center gap-1 md:gap-2">
            <Link href="/app/requests/new">
              <AppButton size="sm" className="gap-1.5">
                <Plus className="size-4" />
                <span className="hidden sm:inline">{t("auth.newRequest")}</span>
              </AppButton>
            </Link>
            <NotificationCenter />
            <Link
              href={pathname}
              locale={nextLocale}
              className="inline-flex h-11 items-center rounded-lg px-2 text-sm font-medium hover:bg-accent"
            >
              {nextLocale.toUpperCase()}
            </Link>
            <AppButton
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label={t("common.theme")}
            >
              <Sun className="size-4 dark:hidden" />
              <Moon className="hidden size-4 dark:block" />
            </AppButton>
            <UserMenu />
          </div>
        </header>

        <div className="border-b border-border px-3 py-2 md:hidden">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={t("auth.globalSearch")}
          />
        </div>

        <main className="flex-1 p-4 md:p-6 xl:p-8">{children}</main>
      </div>
    </div>
  );
}
