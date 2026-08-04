"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import {
  useConnectIntegrationMutation,
  useIntegrationActionMutation,
  useIntegrationDetailQuery,
} from "@/features/integrations/hooks/use-integrations";
import { statusTone } from "@/features/integrations/lib/constants";
import { Link } from "@/lib/i18n/navigation";

export function IntegrationDetailView({ providerId }: { providerId: string }) {
  const t = useTranslations("integrations");
  const tRoot = useTranslations();
  const { data, isLoading } = useIntegrationDetailQuery(providerId);
  const connect = useConnectIntegrationMutation();
  const action = useIntegrationActionMutation();
  const [storeName, setStoreName] = React.useState("");

  if (isLoading) return <LoadingSkeleton rows={4} />;
  if (!data) {
    return (
      <EmptyState title={t("notFoundTitle")} description={t("notFoundDescription")} />
    );
  }

  const conn = data.connection;

  return (
    <div className="mx-auto w-full max-w-[48rem] space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title={data.name}
          description={tRoot(data.descriptionKey)}
        />
        <Link href="/app/integrations">
          <AppButton variant="secondary" size="sm">
            {t("back")}
          </AppButton>
        </Link>
      </div>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="info">{t(`categories.${data.category}`)}</Badge>
          {conn ? (
            <Badge tone={statusTone[conn.status]}>
              {t(`status.${conn.status}`)}
            </Badge>
          ) : null}
        </div>
        {conn?.errorMessage ? (
          <p className="text-sm text-error-fg">{conn.errorMessage}</p>
        ) : null}
        {conn?.storeName ? (
          <p className="text-sm text-muted-foreground">
            {t("store")}: {conn.storeName}
          </p>
        ) : null}
        {conn?.lastSyncAt ? (
          <p className="text-xs text-muted-foreground">
            {t("lastSync")}: {new Date(conn.lastSyncAt).toLocaleString()}
          </p>
        ) : null}
      </section>

      <section className="space-y-2 rounded-xl border border-border bg-card p-4">
        <h2 className="font-display text-base font-semibold">{t("capabilities")}</h2>
        <ul className="list-inside list-disc text-sm text-muted-foreground">
          {data.capabilities.map((c) => (
            <li key={c}>{t(`capabilitiesList.${c.replace(/\./g, "_")}`)}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2 rounded-xl border border-border bg-card p-4">
        <h2 className="font-display text-base font-semibold">{t("setupTitle")}</h2>
        <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
          {data.setupSteps.map((s) => (
            <li key={s}>{t(`setup.${s}`)}</li>
          ))}
        </ol>
      </section>

      {!conn || conn.status === "disabled" || conn.status === "auth_expired" ? (
        <section className="space-y-3 rounded-xl border border-border bg-card p-4">
          <h2 className="font-display text-base font-semibold">{t("connectTitle")}</h2>
          <AppInput
            label={t("storeName")}
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            placeholder={t("storeNamePlaceholder")}
          />
          <AppButton
            size="sm"
            disabled={connect.isPending}
            onClick={() =>
              void connect.mutateAsync({
                providerId: data.id,
                storeName: storeName || undefined,
              })
            }
          >
            {connect.isPending ? t("connecting") : t("connect")}
          </AppButton>
        </section>
      ) : (
        <section className="flex flex-wrap gap-2 rounded-xl border border-border bg-card p-4">
          {conn.status === "sync_error" || conn.status === "syncing" ? (
            <AppButton
              size="sm"
              variant="secondary"
              disabled={action.isPending}
              onClick={() =>
                void action.mutateAsync({
                  action: "retry",
                  connectionId: conn.id,
                })
              }
            >
              {t("retrySync")}
            </AppButton>
          ) : null}
          <AppButton
            size="sm"
            variant="secondary"
            disabled={action.isPending}
            onClick={() =>
              void action.mutateAsync({
                action: "disable",
                connectionId: conn.id,
              })
            }
          >
            {t("disable")}
          </AppButton>
          <AppButton
            size="sm"
            variant="destructive"
            disabled={action.isPending}
            onClick={() =>
              void action.mutateAsync({
                action: "disconnect",
                connectionId: conn.id,
              })
            }
          >
            {t("disconnect")}
          </AppButton>
        </section>
      )}
    </div>
  );
}
