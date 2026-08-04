"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { PermissionGuard } from "@/lib/auth/guards";
import { AppButton } from "@/components/shared/app-button";
import { Link } from "@/lib/i18n/navigation";
import { AppInput } from "@/components/shared/app-input";
import { AppSelect } from "@/components/shared/app-select";
import { AppTextarea } from "@/components/shared/app-textarea";

export default function RequestFormFallbackPage() {
  const t = useTranslations();

  return (
    <PermissionGuard permission="requests:create">
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <PageHeader
          title={t("agent.formFallbackTitle")}
          description={t("agent.formFallbackDescription")}
          actions={
            <Link href="/app/agent">
              <AppButton variant="secondary">{t("agent.title")}</AppButton>
            </Link>
          }
        />
        <div className="grid gap-4 rounded-xl border border-border bg-card p-4 md:p-6">
          <AppSelect
            label={t("agent.fields.serviceType")}
            options={[
              { value: "courier", label: t("services.courier") },
              { value: "parcel_1_30", label: t("services.parcel_1_30") },
              { value: "gonder_xl", label: t("services.gonder_xl") },
              { value: "ftl", label: t("services.ftl") },
              { value: "ltl", label: t("services.ltl") },
              { value: "spot", label: t("services.spot") },
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <AppInput label={t("agent.fields.origin")} />
            <AppInput label={t("agent.fields.destination")} />
          </div>
          <AppInput label={t("agent.fields.pickupDate")} type="date" />
          <AppTextarea label={t("agent.fields.notes")} rows={3} />
          <EmptyState
            title={t("agent.formFallbackTitle")}
            description={t("agent.formFallbackDescription")}
            action={
              <AppButton disabled>{t("common.save")}</AppButton>
            }
            className="border-0 bg-transparent py-6"
          />
        </div>
      </div>
    </PermissionGuard>
  );
}
