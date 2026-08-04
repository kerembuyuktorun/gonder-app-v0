"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { MoneyDisplay } from "@/components/shared/money-display";
import { DetailDrawer } from "@/components/shared/detail-drawer";
import { cn } from "@/lib/utils/cn";
import type { SpotOffer, SpotQuoteSort, SpotRequest } from "@/types/spot";

export function SpotSupplierBoard({
  request,
  counts,
  onRefresh,
  submitting,
}: {
  request: SpotRequest;
  counts: Record<string, number> | null;
  onRefresh: () => void;
  submitting: boolean;
}) {
  const t = useTranslations("spot");
  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">{t("suppliersTitle")}</h2>
          <p className="text-sm text-muted-foreground">
            {request.reference} · {request.draft.originCity} →{" "}
            {request.draft.destinationCity}
          </p>
        </div>
        <AppButton
          type="button"
          size="sm"
          variant="secondary"
          onClick={onRefresh}
          loading={submitting}
        >
          {t("refreshOffers")}
        </AppButton>
      </div>
      {counts ? (
        <div className="flex flex-wrap gap-2 text-xs">
          {(["waiting", "quoted", "declined", "invited"] as const).map((s) => (
            <span key={s} className="rounded-md bg-muted px-2 py-1">
              {t(`supplierStatus.${s}`)}: {counts[s] ?? 0}
            </span>
          ))}
        </div>
      ) : null}
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {request.suppliers.map((s) => (
          <li
            key={s.id}
            className="rounded-lg border border-border px-3 py-2 text-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium">{s.name}</p>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px]">
                {t(`supplierStatus.${s.status}`)}
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {s.vehicleFit} · ★ {s.performanceScore.toFixed(1)} ·{" "}
              {s.completedShipments} {t("shipments")}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function SpotQuoteToolbar({
  sort,
  onSort,
  serviceFilter,
  onFilter,
  compareCount,
}: {
  sort: SpotQuoteSort;
  onSort: (s: SpotQuoteSort) => void;
  serviceFilter: string;
  onFilter: (v: string) => void;
  compareCount: number;
}) {
  const t = useTranslations("spot");
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("sortBy")}</span>
          <select
            className="h-9 rounded-lg border border-border bg-card px-2 text-sm"
            value={sort}
            onChange={(e) => onSort(e.target.value as SpotQuoteSort)}
          >
            <option value="price_asc">{t("sort.priceAsc")}</option>
            <option value="price_desc">{t("sort.priceDesc")}</option>
            <option value="eta_asc">{t("sort.etaAsc")}</option>
            <option value="score_desc">{t("sort.scoreDesc")}</option>
          </select>
        </label>
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("filter")}</span>
          <select
            className="h-9 rounded-lg border border-border bg-card px-2 text-sm"
            value={serviceFilter}
            onChange={(e) => onFilter(e.target.value)}
          >
            <option value="all">{t("filterAll")}</option>
            <option value="ftl">FTL</option>
            <option value="ltl">LTL</option>
            <option value="xl">XL</option>
          </select>
        </label>
      </div>
      {compareCount > 0 ? (
        <span className="text-xs text-muted-foreground">
          {t("compareSelected", { count: compareCount })}
        </span>
      ) : null}
    </div>
  );
}

function Badge({ children, tone }: { children: React.ReactNode; tone: string }) {
  return (
    <span
      className={cn(
        "rounded px-1.5 py-0.5 text-[10px] font-medium",
        tone === "price" && "bg-success-bg text-success-fg",
        tone === "fast" && "bg-info-bg text-info-fg",
        tone === "rec" && "bg-warning-bg text-warning-fg",
      )}
    >
      {children}
    </span>
  );
}

export function SpotQuoteTable({
  offers,
  badges,
  compareIds,
  onToggleCompare,
  onDetail,
  onCounter,
  onAccept,
}: {
  offers: SpotOffer[];
  badges: { lowest: string | null; fastest: string | null; recommended: string | null };
  compareIds: string[];
  onToggleCompare: (id: string) => void;
  onDetail: (id: string) => void;
  onCounter: (id: string) => void;
  onAccept: (id: string) => void;
}) {
  const t = useTranslations("spot");
  if (!offers.length) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
        {t("noOffers")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[960px] border-collapse text-sm">
        <thead className="border-b border-border bg-muted/60">
          <tr>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              {t("columns.compare")}
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              {t("columns.supplier")}
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              {t("columns.total")}
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              {t("columns.eta")}
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              {t("columns.score")}
            </th>
            <th className="px-3 py-2 text-left font-medium text-muted-foreground">
              {t("columns.terms")}
            </th>
            <th className="px-3 py-2 text-right font-medium text-muted-foreground">
              {t("columns.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => (
            <tr key={offer.id} className="border-b border-border last:border-0">
              <td className="px-3 py-3">
                <input
                  type="checkbox"
                  checked={compareIds.includes(offer.id)}
                  onChange={() => onToggleCompare(offer.id)}
                  className="size-4 rounded border-border"
                />
              </td>
              <td className="px-3 py-3">
                <div className="flex flex-wrap items-center gap-1">
                  <span className="font-medium">{offer.supplierName}</span>
                  {badges.lowest === offer.id ? (
                    <Badge tone="price">{t("badgeLowest")}</Badge>
                  ) : null}
                  {badges.fastest === offer.id ? (
                    <Badge tone="fast">{t("badgeFastest")}</Badge>
                  ) : null}
                  {badges.recommended === offer.id ? (
                    <Badge tone="rec">{t("badgeRecommended")}</Badge>
                  ) : null}
                </div>
                <p className="text-xs text-muted-foreground">
                  {t(`kinds.${offer.serviceKind}`)} · {offer.vehicleFit}
                </p>
              </td>
              <td className="px-3 py-3">
                <MoneyDisplay value={offer.total} size="sm" />
                {offer.counterOfferSent ? (
                  <p className="text-[10px] text-muted-foreground">
                    {t("counterSent")}
                  </p>
                ) : null}
              </td>
              <td className="px-3 py-3 text-muted-foreground">
                {t("etaDays", { min: offer.etaDaysMin, max: offer.etaDaysMax })}
              </td>
              <td className="px-3 py-3">
                ★ {offer.performanceScore.toFixed(1)}
                <span className="block text-xs text-muted-foreground">
                  {offer.completedShipments}
                </span>
              </td>
              <td className="px-3 py-3 text-xs text-muted-foreground">
                {offer.paymentTerms}
              </td>
              <td className="px-3 py-3">
                <div className="flex justify-end gap-1">
                  <AppButton
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => onDetail(offer.id)}
                  >
                    {t("details")}
                  </AppButton>
                  <AppButton
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => onCounter(offer.id)}
                  >
                    {t("counter")}
                  </AppButton>
                  <AppButton
                    type="button"
                    size="sm"
                    onClick={() => onAccept(offer.id)}
                  >
                    {t("select")}
                  </AppButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SpotComparePanel({ offers }: { offers: SpotOffer[] }) {
  const t = useTranslations("spot");
  if (offers.length < 2) return null;
  return (
    <section className="space-y-3 rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">{t("compareTitle")}</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-2 text-left text-muted-foreground">
                {t("compareField")}
              </th>
              {offers.map((o) => (
                <th key={o.id} className="px-2 py-2 text-left">
                  {o.supplierName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(
              [
                ["total", (o: SpotOffer) => <MoneyDisplay value={o.total} size="sm" />],
                [
                  "eta",
                  (o: SpotOffer) =>
                    t("etaDays", { min: o.etaDaysMin, max: o.etaDaysMax }),
                ],
                ["insurance", (o: SpotOffer) => o.insuranceCoverage],
                ["terms", (o: SpotOffer) => o.paymentTerms],
                ["score", (o: SpotOffer) => o.performanceScore.toFixed(1)],
              ] as const
            ).map(([key, render]) => (
              <tr key={key} className="border-b border-border last:border-0">
                <td className="px-2 py-2 text-muted-foreground">
                  {t(`compareFields.${key}`)}
                </td>
                {offers.map((o) => (
                  <td key={o.id} className="px-2 py-2">
                    {render(o)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export function SpotQuoteDrawer({
  offer,
  open,
  onOpenChange,
  onAccept,
  onCounter,
}: {
  offer: SpotOffer | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onAccept: (id: string) => void;
  onCounter: (id: string) => void;
}) {
  const t = useTranslations("spot");
  if (!offer) return null;
  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={offer.supplierName}
      description={t(`kinds.${offer.serviceKind}`)}
    >
      <div className="space-y-4 pb-6 text-sm">
        <MoneyDisplay value={offer.total} size="lg" />
        <dl className="space-y-2">
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("breakdown.subtotal")}</dt>
            <dd>
              <MoneyDisplay value={offer.price} size="sm" />
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("breakdown.tax")}</dt>
            <dd>
              <MoneyDisplay value={offer.tax} size="sm" />
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("breakdown.surcharges")}</dt>
            <dd>
              <MoneyDisplay value={offer.surcharges} size="sm" />
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("columns.eta")}</dt>
            <dd>
              {t("etaDays", { min: offer.etaDaysMin, max: offer.etaDaysMax })}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("insurance")}</dt>
            <dd>{offer.insuranceCoverage}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted-foreground">{t("validity")}</dt>
            <dd>
              {new Date(offer.validUntil).toLocaleString("tr-TR", {
                day: "2-digit",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-muted-foreground">{offer.opsNotes}</p>
        {offer.recommended ? (
          <p className="rounded-md bg-warning-bg px-2 py-1 text-xs text-warning-fg">
            {t("aiRecommendNote")}
          </p>
        ) : null}
        <div className="flex gap-2">
          <AppButton
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={() => onCounter(offer.id)}
          >
            {t("counter")}
          </AppButton>
          <AppButton
            type="button"
            className="flex-1"
            onClick={() => onAccept(offer.id)}
          >
            {t("select")}
          </AppButton>
        </div>
      </div>
    </DetailDrawer>
  );
}
