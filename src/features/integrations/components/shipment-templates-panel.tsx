"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import { ServiceBadge } from "@/components/shared/service-badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import {
  useCopyPreviousMutation,
  useDeleteTemplateMutation,
  useRepeatShipmentMetaQuery,
  useSaveTemplateMutation,
  useShipmentTemplatesQuery,
} from "@/features/integrations/hooks/use-integrations";
import type { ServiceType } from "@/types/domain";
import { Link } from "@/lib/i18n/navigation";

export function ShipmentTemplatesPanel() {
  const t = useTranslations("integrations.templates");
  const { data: templates, isLoading } = useShipmentTemplatesQuery();
  const meta = useRepeatShipmentMetaQuery();
  const save = useSaveTemplateMutation();
  const remove = useDeleteTemplateMutation();
  const copy = useCopyPreviousMutation();

  const [name, setName] = React.useState("");
  const [copiedLabel, setCopiedLabel] = React.useState<string | null>(null);

  if (isLoading) return <LoadingSkeleton rows={3} />;

  return (
    <div className="space-y-6">
      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h3 className="font-display font-semibold">{t("repeatTitle")}</h3>
        <p className="text-sm text-muted-foreground">{t("repeatHint")}</p>
        <div className="flex flex-wrap gap-2">
          <AppButton
            size="sm"
            variant="secondary"
            disabled={copy.isPending}
            onClick={async () => {
              const res = await copy.mutateAsync("ord_p1");
              setCopiedLabel(res.label);
            }}
          >
            {t("copyPrevious")}
          </AppButton>
          <Link href="/app/requests/parcel">
            <AppButton size="sm" variant="ghost">
              {t("createFromTemplate")}
            </AppButton>
          </Link>
        </div>
        {copiedLabel ? (
          <p className="text-sm text-success-fg">
            {t("copied", { label: copiedLabel })}
          </p>
        ) : null}
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4">
        <h3 className="font-display font-semibold">{t("listTitle")}</h3>
        <ul className="divide-y divide-border">
          {(templates ?? []).map((tpl) => (
            <li
              key={tpl.id}
              className="flex flex-wrap items-center justify-between gap-2 py-3"
            >
              <div>
                <p className="font-medium">{tpl.name}</p>
                <p className="text-xs text-muted-foreground">
                  {tpl.originLabel} → {tpl.destinationLabel}
                  {tpl.carrierRule ? ` · ${tpl.carrierRule}` : ""}
                </p>
                <div className="mt-1">
                  <ServiceBadge type={tpl.serviceType} />
                </div>
              </div>
              <div className="flex gap-1">
                <Link href={`/app/requests/parcel?template=${tpl.id}`}>
                  <AppButton size="sm" variant="secondary">
                    {t("use")}
                  </AppButton>
                </Link>
                <AppButton
                  size="sm"
                  variant="ghost"
                  onClick={() => void remove.mutateAsync(tpl.id)}
                >
                  {t("delete")}
                </AppButton>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-2 border-t border-border pt-3 sm:flex-row">
          <AppInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("newName")}
            containerClassName="flex-1"
          />
          <AppButton
            size="sm"
            disabled={!name.trim() || save.isPending}
            onClick={async () => {
              await save.mutateAsync({
                name: name.trim(),
                serviceType: "parcel_1_30" as ServiceType,
                originLabel: "Merkez",
                destinationLabel: "Müşteri",
                defaultDesi: 3,
                defaultWeightKg: 2,
                carrierRule: "En ucuz",
              });
              setName("");
            }}
          >
            {t("save")}
          </AppButton>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="mb-2 text-sm font-semibold">{t("favorites")}</h4>
          <ul className="space-y-2 text-sm">
            {(meta.data?.addresses ?? []).map((a) => (
              <li key={a.id}>
                <p className="font-medium">
                  {a.label}
                  {a.isDefault ? ` · ${t("default")}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {a.line1}, {a.city}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="mb-2 text-sm font-semibold">{t("packages")}</h4>
          <ul className="space-y-2 text-sm">
            {(meta.data?.presets ?? []).map((p) => (
              <li key={p.id}>
                <p className="font-medium">
                  {p.name}
                  {p.isDefault ? ` · ${t("default")}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  {p.lengthCm}×{p.widthCm}×{p.heightCm} cm · {p.weightKg} kg
                </p>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <h4 className="mb-2 text-sm font-semibold">{t("rules")}</h4>
          <ul className="space-y-2 text-sm">
            {(meta.data?.rules ?? []).map((r) => (
              <li key={r.id}>
                <p className="font-medium">{r.name}</p>
                <p className="text-xs text-muted-foreground">
                  {r.preferCheapest ? t("cheapest") : r.preferredCarrier}
                  {r.maxEtaDays ? ` · ≤${r.maxEtaDays}g` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
