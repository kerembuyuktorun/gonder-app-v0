"use client";

import { useLocale, useTranslations } from "next-intl";
import { formatDateTime } from "@/lib/utils/format";
import { Badge } from "@/components/ui/badge";
import type {
  DashboardIntegrationItem,
  IntegrationConnectionStatus,
} from "@/types/dashboard";
import type { StatusTone } from "@/types/domain";

const statusTone: Record<IntegrationConnectionStatus, StatusTone> = {
  connected: "success",
  pending: "warning",
  error: "error",
  disconnected: "neutral",
};

export function IntegrationStatusList({
  items,
}: {
  items: DashboardIntegrationItem[];
}) {
  const t = useTranslations();
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";

  return (
    <ul className="divide-y divide-border">
      {items.map((item) => (
        <li
          key={item.id}
          className="flex items-center justify-between gap-3 px-1 py-3 first:pt-0 last:pb-0"
        >
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{t(item.nameKey)}</p>
            {item.lastSyncedAt ? (
              <p className="text-xs text-muted-foreground">
                {t("dashboard.integrations.lastSynced", {
                  date: formatDateTime(item.lastSyncedAt, intlLocale),
                })}
              </p>
            ) : null}
          </div>
          <Badge tone={statusTone[item.status]}>
            {t(`dashboard.integrations.${item.status}`)}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
