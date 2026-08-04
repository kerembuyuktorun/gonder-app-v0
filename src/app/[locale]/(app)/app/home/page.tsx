"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { useAuthStore } from "@/stores/auth-store";
import { useShipmentsQuery, useQuotesQuery } from "@/features/services/hooks";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { MoneyDisplay } from "@/components/shared/money-display";
import { StatusBadge } from "@/components/shared/status-badge";
import { Link } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";

export default function AppHomePage() {
  const t = useTranslations();
  const user = useAuthStore((s) => s.user);
  const { data: shipments, isLoading: loadingShipments } = useShipmentsQuery();
  const { data: quotes, isLoading: loadingQuotes } = useQuotesQuery();

  return (
    <div className="mx-auto w-full max-w-[90rem] space-y-6">
      <PageHeader
        title={t("appHome.title")}
        description={t("appHome.welcomeBack", {
          name: user?.firstName ?? t("meta.appName"),
        })}
        actions={
          <Link href="/app/requests/new">
            <AppButton>{t("shell.newRequest")}</AppButton>
          </Link>
        }
      />

      <div className="grid gap-4 md:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{t("shell.shipments")}</h2>
            <Link
              href="/app/shipments"
              className="text-xs font-medium text-primary hover:underline"
            >
              {t("common.viewAll")}
            </Link>
          </div>
          {loadingShipments ? (
            <LoadingSkeleton rows={2} />
          ) : (
            <ul className="space-y-3">
              {(shipments?.items ?? []).slice(0, 3).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.trackingNumber}</p>
                    <p className="truncate text-muted-foreground">
                      {item.originCity} → {item.destinationCity}
                    </p>
                  </div>
                  <StatusBadge status={item.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold">{t("shell.quotes")}</h2>
            <Link
              href="/app/quotes"
              className="text-xs font-medium text-primary hover:underline"
            >
              {t("common.viewAll")}
            </Link>
          </div>
          {loadingQuotes ? (
            <LoadingSkeleton rows={2} />
          ) : (
            <ul className="space-y-3">
              {(quotes?.items ?? []).slice(0, 3).map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.reference}</p>
                    <p className="truncate text-muted-foreground">
                      {item.originCity} → {item.destinationCity}
                    </p>
                  </div>
                  <MoneyDisplay value={item.total} size="sm" />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
