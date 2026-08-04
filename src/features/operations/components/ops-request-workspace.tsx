"use client";

import * as React from "react";
import { useLocale, useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import { AppTextarea } from "@/components/shared/app-textarea";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ServiceBadge } from "@/components/shared/service-badge";
import { MoneyDisplay } from "@/components/shared/money-display";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { Can } from "@/lib/auth/guards";
import {
  useAssignPartnerMutation,
  useAssignVehicleMutation,
  useChangeServiceTypeMutation,
  useChangeStatusMutation,
  useCreateManualQuoteMutation,
  useOpsPartnersQuery,
  useOpsRequestQuery,
  useRequestMissingInfoMutation,
  useResolveExceptionMutation,
  useUploadOpsDocumentMutation,
} from "@/features/operations/hooks/use-operations";
import { priorityTone, slaTone } from "@/features/operations/lib/nav";
import { formatDateTime } from "@/lib/utils/format";
import { Link } from "@/lib/i18n/navigation";
import type { OpsPriceLine, OpsRequestStatus } from "@/types/operations";
import type { ServiceType } from "@/types/domain";

export function OpsRequestWorkspace({ requestId }: { requestId: string }) {
  const t = useTranslations("operations");
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";
  const { data, isLoading } = useOpsRequestQuery(requestId);
  const partners = useOpsPartnersQuery();
  const createQuote = useCreateManualQuoteMutation();
  const assignPartner = useAssignPartnerMutation();
  const assignVehicle = useAssignVehicleMutation();
  const changeStatus = useChangeStatusMutation();
  const missingInfo = useRequestMissingInfoMutation();
  const changeService = useChangeServiceTypeMutation();
  const uploadDoc = useUploadOpsDocumentMutation();
  const resolveEx = useResolveExceptionMutation();

  const [reason, setReason] = React.useState("");
  const [confirm, setConfirm] = React.useState<null | (() => void)>(null);
  const [confirmDesc, setConfirmDesc] = React.useState("");
  const [lineLabel, setLineLabel] = React.useState("Taşıma");
  const [lineAmount, setLineAmount] = React.useState("18000");
  const [partnerCost, setPartnerCost] = React.useState("16000");
  const [taxRate, setTaxRate] = React.useState("10");
  const [partnerId, setPartnerId] = React.useState("prt_1");
  const [vehicleLabel, setVehicleLabel] = React.useState("13.6m · 34 OPS 01");
  const [driverName, setDriverName] = React.useState("Sürücü Ad");
  const [driverPhone, setDriverPhone] = React.useState("+90555");
  const [status, setStatus] = React.useState<OpsRequestStatus>("active");
  const [serviceType, setServiceType] = React.useState<ServiceType>("ftl");
  const [missingMsg, setMissingMsg] = React.useState("");

  if (isLoading) return <LoadingSkeleton rows={6} />;
  if (!data) {
    return (
      <EmptyState title={t("workspace.notFound")} description={t("workspace.notFoundHint")} />
    );
  }

  function requireReason(action: () => void, description: string) {
    if (!reason.trim()) {
      window.alert(t("reasonRequired"));
      return;
    }
    setConfirmDesc(description);
    setConfirm(() => action);
  }

  const oldQuote = data.quote?.total.amount;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title={data.reference}
          description={`${data.customerName}${data.organizationName ? ` · ${data.organizationName}` : ""}`}
        />
        <Link href="/operations/queue/new">
          <AppButton size="sm" variant="secondary">{t("workspace.back")}</AppButton>
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-4">
          <Section title={t("workspace.requestInfo")}>
            <div className="flex flex-wrap gap-2">
              <ServiceBadge type={data.serviceType} />
              <Badge tone={priorityTone[data.priority]}>{t(`priority.${data.priority}`)}</Badge>
              <Badge tone={slaTone[data.slaState]}>{t(`sla.${data.slaState}`)}</Badge>
              <Badge tone="info">{t(`status.${data.status}`)}</Badge>
              <Badge tone="neutral">{t(`channel.${data.channel}`)}</Badge>
            </div>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <Item label={t("workspace.route")} value={`${data.originCity} → ${data.destinationCity}`} />
              <Item label={t("workspace.assignee")} value={data.assigneeName ?? "—"} />
              <Item label={t("workspace.customer")} value={data.customerName} />
              <Item label={t("workspace.org")} value={data.organizationName ?? "—"} />
              <Item label={t("workspace.email")} value={data.customerEmail ?? "—"} />
              <Item label={t("workspace.phone")} value={data.customerPhone ?? "—"} />
            </dl>
          </Section>

          <Section title={t("workspace.aiExtracted")}>
            {Object.keys(data.extractedFields).length === 0 ? (
              <p className="text-sm text-muted-foreground">{t("workspace.noExtracted")}</p>
            ) : (
              <ul className="grid gap-1 text-sm sm:grid-cols-2">
                {Object.entries(data.extractedFields).map(([k, v]) => (
                  <li key={k}>
                    <span className="text-muted-foreground">{k}: </span>
                    {v}
                  </li>
                ))}
              </ul>
            )}
          </Section>

          {data.missingFields.length > 0 ? (
            <Section title={t("workspace.missing")}>
              <p className="text-sm text-warning-fg">{data.missingFields.join(", ")}</p>
            </Section>
          ) : null}

          {data.quote ? (
            <Section title={t("workspace.currentQuote")}>
              <ul className="space-y-1 text-sm">
                {data.quote.lines.map((l) => (
                  <li key={l.id} className="flex justify-between">
                    <span>{l.label}</span>
                    <MoneyDisplay value={l.amount} size="sm" />
                  </li>
                ))}
              </ul>
              <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
                <Item label={t("workspace.partnerCost")} value={<MoneyDisplay value={data.quote.partnerCost} size="sm" />} />
                <Item label={t("workspace.margin")} value={<MoneyDisplay value={data.quote.margin} size="sm" />} />
                <Item label={t("workspace.tax")} value={<MoneyDisplay value={data.quote.tax} size="sm" />} />
                <Item label={t("workspace.total")} value={<MoneyDisplay value={data.quote.total} size="sm" />} />
                <Item
                  label={t("workspace.validUntil")}
                  value={formatDateTime(data.quote.validUntil, intlLocale)}
                />
              </dl>
            </Section>
          ) : null}

          <Section title={t("workspace.assignment")}>
            <p className="text-sm">
              {t("workspace.partner")}: {data.partnerName ?? "—"}
            </p>
            {data.assignment ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {data.assignment.vehicleLabel} · {data.assignment.driverName} ·{" "}
                {data.assignment.driverPhone}
              </p>
            ) : (
              <p className="mt-1 text-sm text-muted-foreground">{t("workspace.noVehicle")}</p>
            )}
          </Section>

          <Section title={t("workspace.notes")}>
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              {data.opsNotes || "—"}
            </p>
            {data.exceptionNote ? (
              <p className="mt-2 rounded-lg bg-error-bg/40 px-3 py-2 text-sm text-error-fg">
                {data.exceptionNote}
              </p>
            ) : null}
          </Section>

          <Section title={t("workspace.documents")}>
            <ul className="space-y-1 text-sm">
              {data.documents.length === 0 ? (
                <li className="text-muted-foreground">{t("workspace.noDocs")}</li>
              ) : (
                data.documents.map((d) => (
                  <li key={d.id}>
                    {d.name} · {d.uploadedBy} · {formatDateTime(d.uploadedAt, intlLocale)}
                  </li>
                ))
              )}
            </ul>
          </Section>

          <Section title={t("workspace.audit")}>
            <Can permission="ops:audit:read">
              <ul className="max-h-64 space-y-2 overflow-y-auto text-sm">
                {data.audit.length === 0 ? (
                  <li className="text-muted-foreground">{t("workspace.noAudit")}</li>
                ) : (
                  data.audit.map((a) => (
                    <li
                      key={a.id}
                      className={
                        a.critical
                          ? "rounded-lg border border-warning/40 bg-warning-bg/30 px-2 py-1.5"
                          : "border-b border-border pb-2"
                      }
                    >
                      <p className="font-medium">
                        {a.action}
                        {a.critical ? ` · ${t("workspace.critical")}` : ""}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {a.actorName} · {formatDateTime(a.at, intlLocale)}
                      </p>
                      {a.reason ? <p className="text-xs">{t("workspace.reason")}: {a.reason}</p> : null}
                      {a.before || a.after ? (
                        <p className="text-xs">
                          {a.before ?? "—"} → {a.after ?? "—"}
                        </p>
                      ) : null}
                    </li>
                  ))
                )}
              </ul>
            </Can>
          </Section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <Section title={t("workspace.manualReason")}>
            <AppTextarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={t("reasonRequired")}
              rows={2}
            />
          </Section>

          <Can permission="ops:quotes:write">
            <Section title={t("workspace.manualQuote")}>
              <div className="space-y-2">
                <AppInput label={t("workspace.lineLabel")} value={lineLabel} onChange={(e) => setLineLabel(e.target.value)} />
                <AppInput label={t("workspace.lineAmount")} value={lineAmount} onChange={(e) => setLineAmount(e.target.value)} />
                <AppInput label={t("workspace.partnerCost")} value={partnerCost} onChange={(e) => setPartnerCost(e.target.value)} />
                <AppInput label={t("workspace.taxRate")} value={taxRate} onChange={(e) => setTaxRate(e.target.value)} />
                {oldQuote !== undefined ? (
                  <p className="text-xs text-muted-foreground">
                    {t("workspace.priceDiff", {
                      old: oldQuote,
                      next: Number(lineAmount) + Math.round(Number(lineAmount) * Number(taxRate)) / 100,
                    })}
                  </p>
                ) : null}
                <AppButton
                  size="sm"
                  className="w-full"
                  disabled={createQuote.isPending}
                  onClick={() => {
                    const lines: OpsPriceLine[] = [
                      {
                        id: "new",
                        label: lineLabel,
                        amount: { amount: Number(lineAmount) || 0, currency: "TRY" },
                      },
                    ];
                    requireReason(
                      () =>
                        void createQuote.mutateAsync({
                          requestId: data.id,
                          reason: reason.trim(),
                          lines,
                          partnerCost: {
                            amount: Number(partnerCost) || 0,
                            currency: "TRY",
                          },
                          taxRate: Number(taxRate) || 0,
                          validHours: 48,
                        }),
                      t("workspace.confirmQuote"),
                    );
                  }}
                >
                  {t("workspace.createQuote")}
                </AppButton>
              </div>
            </Section>
          </Can>

          <Can permission="ops:assign">
            <Section title={t("workspace.assignPartner")}>
              <select
                className="mb-2 h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
              >
                {(partners.data ?? []).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.saasStatus})
                  </option>
                ))}
              </select>
              <AppButton
                size="sm"
                variant="secondary"
                className="w-full"
                onClick={() =>
                  requireReason(
                    () =>
                      void assignPartner.mutateAsync({
                        requestId: data.id,
                        partnerId,
                        reason: reason.trim(),
                      }),
                    t("workspace.confirmPartner", {
                      from: data.partnerName ?? "—",
                      to: partners.data?.find((p) => p.id === partnerId)?.name ?? "",
                    }),
                  )
                }
              >
                {t("workspace.assignPartnerBtn")}
              </AppButton>
            </Section>

            <Section title={t("workspace.assignVehicle")}>
              <div className="space-y-2">
                <AppInput value={vehicleLabel} onChange={(e) => setVehicleLabel(e.target.value)} label={t("workspace.vehicle")} />
                <AppInput value={driverName} onChange={(e) => setDriverName(e.target.value)} label={t("workspace.driver")} />
                <AppInput value={driverPhone} onChange={(e) => setDriverPhone(e.target.value)} label={t("workspace.driverPhone")} />
                <AppButton
                  size="sm"
                  variant="secondary"
                  className="w-full"
                  onClick={() =>
                    requireReason(
                      () =>
                        void assignVehicle.mutateAsync({
                          requestId: data.id,
                          reason: reason.trim(),
                          assignment: {
                            vehicleId: "v-manual",
                            vehicleLabel,
                            driverName,
                            driverPhone,
                          },
                        }),
                      t("workspace.confirmVehicle"),
                    )
                  }
                >
                  {t("workspace.assignVehicleBtn")}
                </AppButton>
              </div>
            </Section>
          </Can>

          <Can permission="ops:requests:write">
            <Section title={t("workspace.changeStatus")}>
              <select
                className="mb-2 h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as OpsRequestStatus)}
              >
                {(
                  [
                    "new",
                    "missing_info",
                    "quote_prep",
                    "awaiting_approval",
                    "awaiting_payment",
                    "active",
                    "delayed",
                    "problematic",
                    "completed",
                    "cancelled",
                  ] as const
                ).map((s) => (
                  <option key={s} value={s}>{t(`status.${s}`)}</option>
                ))}
              </select>
              <AppButton
                size="sm"
                variant="secondary"
                className="w-full"
                onClick={() =>
                  requireReason(
                    () =>
                      void changeStatus.mutateAsync({
                        requestId: data.id,
                        status,
                        reason: reason.trim(),
                      }),
                    t("workspace.confirmStatus", {
                      from: t(`status.${data.status}`),
                      to: t(`status.${status}`),
                    }),
                  )
                }
              >
                {t("workspace.applyStatus")}
              </AppButton>
            </Section>

            <Section title={t("workspace.changeService")}>
              <select
                className="mb-2 h-9 w-full rounded-lg border border-border bg-background px-2 text-sm"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value as ServiceType)}
              >
                {(["courier", "parcel_1_30", "gonder_xl", "ftl", "ltl", "spot"] as const).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <AppButton
                size="sm"
                variant="secondary"
                className="w-full"
                onClick={() =>
                  requireReason(
                    () =>
                      void changeService.mutateAsync({
                        requestId: data.id,
                        serviceType,
                        reason: reason.trim(),
                      }),
                    t("workspace.confirmService"),
                  )
                }
              >
                {t("workspace.applyService")}
              </AppButton>
            </Section>

            <Section title={t("workspace.askMissing")}>
              <AppTextarea
                value={missingMsg}
                onChange={(e) => setMissingMsg(e.target.value)}
                rows={2}
                placeholder={t("workspace.missingMessage")}
              />
              <AppButton
                size="sm"
                variant="secondary"
                className="mt-2 w-full"
                onClick={() =>
                  requireReason(
                    () =>
                      void missingInfo.mutateAsync({
                        requestId: data.id,
                        reason: reason.trim(),
                        fields: ["floor", "photos"],
                        message: missingMsg,
                      }),
                    t("workspace.confirmMissing"),
                  )
                }
              >
                {t("workspace.sendMissing")}
              </AppButton>
            </Section>

            <Section title={t("workspace.uploadDoc")}>
              <AppButton
                size="sm"
                variant="ghost"
                className="w-full"
                onClick={() =>
                  void uploadDoc.mutateAsync({
                    requestId: data.id,
                    name: `ops-${Date.now()}.pdf`,
                    type: "ops_doc",
                  })
                }
              >
                {t("workspace.uploadBtn")}
              </AppButton>
            </Section>

            {(data.status === "problematic" || data.status === "delayed") && (
              <Section title={t("workspace.exception")}>
                <AppButton
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    requireReason(
                      () =>
                        void resolveEx.mutateAsync({
                          requestId: data.id,
                          resolution: "İstisna kapatıldı — operasyon devam",
                          reason: reason.trim(),
                        }),
                      t("workspace.confirmException"),
                    )
                  }
                >
                  {t("workspace.resolveException")}
                </AppButton>
              </Section>
            )}
          </Can>
        </aside>
      </div>

      <ConfirmDialog
        open={Boolean(confirm)}
        onOpenChange={(open) => {
          if (!open) setConfirm(null);
        }}
        title={t("workspace.confirmTitle")}
        description={confirmDesc}
        onConfirm={() => {
          confirm?.();
          setConfirm(null);
          setReason("");
        }}
        destructive
      />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="mb-3 font-display text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Item({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </div>
  );
}
