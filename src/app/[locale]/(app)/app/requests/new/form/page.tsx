"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionGuard } from "@/lib/auth/guards";
import { AppButton } from "@/components/shared/app-button";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { AppInput } from "@/components/shared/app-input";
import { AppSelect } from "@/components/shared/app-select";
import { AppTextarea } from "@/components/shared/app-textarea";
import type { ServiceType } from "@/types/domain";

const SERVICE_ROUTES: Record<ServiceType, string> = {
  courier: "/app/requests/courier",
  parcel_1_30: "/app/requests/parcel",
  gonder_xl: "/app/requests/xl",
  ftl: "/app/requests/ftl",
  ltl: "/app/requests/ltl",
  spot: "/app/requests/spot",
};

export default function RequestFormFallbackPage() {
  const t = useTranslations();
  const router = useRouter();
  const [service, setService] = React.useState<ServiceType>("parcel_1_30");
  const [origin, setOrigin] = React.useState("");
  const [destination, setDestination] = React.useState("");
  const [notes, setNotes] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  function onContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!origin.trim() || !destination.trim()) {
      setError(t("agent.formValidation"));
      return;
    }
    setError(null);
    const qs = new URLSearchParams({
      origin: origin.trim(),
      destination: destination.trim(),
      notes: notes.trim(),
    });
    router.push(`${SERVICE_ROUTES[service]}?${qs.toString()}`);
  }

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
        <form
          onSubmit={onContinue}
          className="grid gap-4 rounded-xl border border-border bg-card p-4 md:p-6"
          noValidate
        >
          <AppSelect
            label={t("agent.fields.serviceType")}
            value={service}
            onValueChange={(v) => setService(v as ServiceType)}
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
            <AppInput
              label={t("agent.fields.origin")}
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              required
              error={error && !origin.trim() ? error : undefined}
            />
            <AppInput
              label={t("agent.fields.destination")}
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
              error={error && !destination.trim() ? error : undefined}
            />
          </div>
          <AppInput label={t("agent.fields.pickupDate")} type="date" />
          <AppTextarea
            label={t("agent.fields.notes")}
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {error ? (
            <p className="text-sm text-error-fg" role="alert">
              {error}
            </p>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <AppButton type="submit">{t("agent.formContinue")}</AppButton>
            <Link href="/app/agent">
              <AppButton type="button" variant="ghost">
                {t("agent.title")}
              </AppButton>
            </Link>
          </div>
        </form>
      </div>
    </PermissionGuard>
  );
}
