"use client";

import { Menu, Moon, Sun, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { AppButton } from "@/components/shared/app-button";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils/cn";
import { useUiStore } from "@/stores/ui-store";

export type NavItem = {
  href: string;
  labelKey: string;
  icon?: React.ReactNode;
};

export type AppShellProps = {
  children: React.ReactNode;
  navItems: NavItem[];
  panelTitle: string;
};

export function AppShell({ children, navItems, panelTitle }: AppShellProps) {
  const t = useTranslations();
  const pathname = usePathname();
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);

  const nextLocale = locale === "tr" ? "en" : "tr";

  return (
    <div className="flex min-h-dvh bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[var(--z-modal)] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        {t("common.skipToContent")}
      </a>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          "sticky top-0 hidden h-dvh shrink-0 border-r border-border bg-card lg:flex lg:flex-col",
          sidebarCollapsed ? "w-[var(--sidebar-collapsed)]" : "w-[var(--sidebar-width)]",
        )}
      >
        <div className="flex h-[var(--topbar-height)] items-center border-b border-border px-4">
          <Link href="/" className="flex min-w-0 items-center gap-2">
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
        <nav className="flex-1 space-y-1 p-3">
          {!sidebarCollapsed ? (
            <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {panelTitle}
            </p>
          ) : null}
          {navItems.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium touch-target",
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                )}
              >
                {item.icon}
                {!sidebarCollapsed ? <span>{t(item.labelKey)}</span> : null}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <AppButton
            variant="ghost"
            size="sm"
            className="w-full justify-start"
            onClick={toggleSidebar}
          >
            {sidebarCollapsed ? "»" : "«"}
          </AppButton>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileNavOpen ? (
        <div className="fixed inset-0 z-[var(--z-overlay)] lg:hidden">
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
            <nav className="flex-1 space-y-1 p-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileNavOpen(false)}
                  className="flex items-center rounded-lg px-3 py-2.5 text-sm font-medium text-foreground hover:bg-accent touch-target"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-[var(--z-sticky)] flex h-[var(--topbar-height)] items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur">
          <AppButton
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label={t("nav.openMenu")}
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-5" />
          </AppButton>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium lg:hidden">
              {panelTitle}
            </p>
          </div>
          <AppButton
            variant="ghost"
            size="sm"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label={t("common.theme")}
          >
            <Sun className="size-4 dark:hidden" />
            <Moon className="hidden size-4 dark:block" />
          </AppButton>
          <Link
            href={pathname}
            locale={nextLocale}
            className="inline-flex h-11 items-center rounded-lg px-3 text-sm font-medium hover:bg-accent"
          >
            {nextLocale.toUpperCase()}
          </Link>
        </header>
        <main id="main-content" className="flex-1 p-4 md:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
