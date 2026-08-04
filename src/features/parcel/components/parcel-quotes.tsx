"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { MoneyDisplay } from "@/components/shared/money-display";
import { DetailDrawer } from "@/components/shared/detail-drawer";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { cn } from "@/lib/utils/cn";
import type {
  ParcelQuoteOffer,
  ParcelQuoteSort,
  ParcelQuoteViewMode,
} from "@/types/parcel";

function serviceLabel(
  t: ReturnType<typeof useTranslations>,
  level: ParcelQuoteOffer["serviceLevel"],
) {
  return t(`serviceLevels.${level}`);
}

export function ParcelQuoteToolbar({
  sort,
  onSort,
  viewMode,
  onViewMode,
  compareCount,
}: {
  sort: ParcelQuoteSort;
  onSort: (s: ParcelQuoteSort) => void;
  viewMode: ParcelQuoteViewMode;
  onViewMode: (m: ParcelQuoteViewMode) => void;
  compareCount: number;
}) {
  const t = useTranslations("parcel");
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        <label className="flex items-center gap-2 text-sm">
          <span className="text-muted-foreground">{t("sortBy")}</span>
          <select
            className="h-9 rounded-lg border border-border bg-card px-2 text-sm"
            value={sort}
            onChange={(e) => onSort(e.target.value as ParcelQuoteSort)}
          >
            <option value="price_asc">{t("sort.priceAsc")}</option>
            <option value="price_desc">{t("sort.priceDesc")}</option>
            <option value="eta_asc">{t("sort.etaAsc")}</option>
            <option value="carrier_asc">{t("sort.carrierAsc")}</option>
          </select>
        </label>
      </div>
      <div className="flex items-center gap-2">
        {compareCount > 0 ? (
          <span className="text-xs text-muted-foreground">
            {t("compareSelected", { count: compareCount })}
          </span>
        ) : null}
        <AppButton
          type="button"
          size="sm"
          variant={viewMode === "table" ? "primary" : "secondary"}
          onClick={() => onViewMode("table")}
        >
          {t("viewTable")}
        </AppButton>
        <AppButton
          type="button"
          size="sm"
          variant={viewMode === "cards" ? "primary" : "secondary"}
          onClick={() => onViewMode("cards")}
        >
          {t("viewCards")}
        </AppButton>
      </div>
    </div>
  );
}

export function ParcelQuoteTable({
  offers,
  selectedId,
  compareIds,
  onSelect,
  onToggleCompare,
  onOpenDetail,
}: {
  offers: ParcelQuoteOffer[];
  selectedId: string | null;
  compareIds: string[];
  onSelect: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onOpenDetail: (id: string) => void;
}) {
  const t = useTranslations("parcel");
  if (offers.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        {t("noOffers")}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead className="border-b border-border bg-muted/60">
          <tr>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground">
              {t("columns.compare")}
            </th>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground">
              {t("columns.carrier")}
            </th>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground">
              {t("columns.total")}
            </th>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground">
              {t("columns.eta")}
            </th>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground">
              {t("columns.pickup")}
            </th>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground">
              {t("columns.service")}
            </th>
            <th className="px-3 py-3 text-left font-medium text-muted-foreground">
              {t("columns.insurance")}
            </th>
            <th className="px-3 py-3 text-right font-medium text-muted-foreground">
              {t("columns.actions")}
            </th>
          </tr>
        </thead>
        <tbody>
          {offers.map((offer) => {
            const selected = selectedId === offer.id;
            return (
              <tr
                key={offer.id}
                className={cn(
                  "border-b border-border last:border-0",
                  selected && "bg-primary/5",
                )}
              >
                <td className="px-3 py-3">
                  <input
                    type="checkbox"
                    checked={compareIds.includes(offer.id)}
                    onChange={() => onToggleCompare(offer.id)}
                    className="size-4 rounded border-border"
                    aria-label={t("columns.compare")}
                  />
                </td>
                <td className="px-3 py-3 font-medium">
                  {t(`carriers.${offer.carrierId}`)}
                </td>
                <td className="px-3 py-3">
                  <MoneyDisplay value={offer.total} size="sm" />
                </td>
                <td className="px-3 py-3 text-muted-foreground">
                  {t("etaDays", {
                    min: offer.etaDaysMin,
                    max: offer.etaDaysMax,
                  })}
                </td>
                <td className="px-3 py-3">
                  {offer.pickupFromAddress ? t("yes") : t("no")}
                </td>
                <td className="px-3 py-3">
                  {serviceLabel(t, offer.serviceLevel)}
                </td>
                <td className="px-3 py-3">
                  {offer.insuranceIncluded ? t("yes") : t("no")}
                </td>
                <td className="px-3 py-3">
                  <div className="flex justify-end gap-2">
                    <AppButton
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => onOpenDetail(offer.id)}
                    >
                      {t("details")}
                    </AppButton>
                    <AppButton
                      type="button"
                      size="sm"
                      variant={selected ? "primary" : "secondary"}
                      onClick={() => onSelect(offer.id)}
                    >
                      {selected ? t("selected") : t("select")}
                    </AppButton>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ParcelQuoteCards({
  offers,
  selectedId,
  compareIds,
  onSelect,
  onToggleCompare,
  onOpenDetail,
}: {
  offers: ParcelQuoteOffer[];
  selectedId: string | null;
  compareIds: string[];
  onSelect: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onOpenDetail: (id: string) => void;
}) {
  const t = useTranslations("parcel");
  if (offers.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
        {t("noOffers")}
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
      {offers.map((offer) => {
        const selected = selectedId === offer.id;
        return (
          <div
            key={offer.id}
            className={cn(
              "flex flex-col rounded-xl border bg-card p-4",
              selected ? "border-primary" : "border-border",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold">
                  {t(`carriers.${offer.carrierId}`)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {serviceLabel(t, offer.serviceLevel)}
                </p>
              </div>
              <label className="flex items-center gap-1 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={compareIds.includes(offer.id)}
                  onChange={() => onToggleCompare(offer.id)}
                  className="size-3.5 rounded border-border"
                />
                {t("columns.compare")}
              </label>
            </div>
            <div className="mt-3">
              <MoneyDisplay value={offer.total} size="lg" />
              <p className="mt-1 text-xs text-muted-foreground">
                {t("etaDays", {
                  min: offer.etaDaysMin,
                  max: offer.etaDaysMax,
                })}
              </p>
            </div>
            <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
              <li>
                {t("columns.pickup")}:{" "}
                {offer.pickupFromAddress ? t("yes") : t("no")}
              </li>
              <li>
                {t("columns.insurance")}:{" "}
                {offer.insuranceIncluded ? t("yes") : t("no")}
              </li>
            </ul>
            <div className="mt-auto flex gap-2 pt-4">
              <AppButton
                type="button"
                size="sm"
                variant="ghost"
                className="flex-1"
                onClick={() => onOpenDetail(offer.id)}
              >
                {t("details")}
              </AppButton>
              <AppButton
                type="button"
                size="sm"
                className="flex-1"
                variant={selected ? "primary" : "secondary"}
                onClick={() => onSelect(offer.id)}
              >
                {selected ? t("selected") : t("select")}
              </AppButton>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ParcelQuoteCompare({
  offers,
}: {
  offers: ParcelQuoteOffer[];
}) {
  const t = useTranslations("parcel");
  if (offers.length < 2) return null;

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <h3 className="text-sm font-semibold">{t("compareTitle")}</h3>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-2 py-2 text-left text-muted-foreground">
                {t("compareField")}
              </th>
              {offers.map((o) => (
                <th key={o.id} className="px-2 py-2 text-left font-semibold">
                  {t(`carriers.${o.carrierId}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(
              [
                ["total", (o: ParcelQuoteOffer) => (
                  <MoneyDisplay key="m" value={o.total} size="sm" />
                )],
                [
                  "eta",
                  (o: ParcelQuoteOffer) =>
                    t("etaDays", { min: o.etaDaysMin, max: o.etaDaysMax }),
                ],
                [
                  "service",
                  (o: ParcelQuoteOffer) => serviceLabel(t, o.serviceLevel),
                ],
                [
                  "pickup",
                  (o: ParcelQuoteOffer) =>
                    o.pickupFromAddress ? t("yes") : t("no"),
                ],
                [
                  "insurance",
                  (o: ParcelQuoteOffer) =>
                    o.insuranceIncluded ? t("yes") : t("no"),
                ],
                [
                  "returns",
                  (o: ParcelQuoteOffer) => t(`returnPolicy.${o.carrierId}`),
                ],
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
    </div>
  );
}

export function ParcelQuoteDrawer({
  offer,
  open,
  onOpenChange,
  onSelect,
}: {
  offer: ParcelQuoteOffer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (id: string) => void;
}) {
  const t = useTranslations("parcel");
  if (!offer) return null;

  return (
    <DetailDrawer
      open={open}
      onOpenChange={onOpenChange}
      title={t(`carriers.${offer.carrierId}`)}
      description={serviceLabel(t, offer.serviceLevel)}
    >
      <div className="space-y-4 pb-6">
        <div>
          <p className="text-xs text-muted-foreground">{t("columns.total")}</p>
          <MoneyDisplay value={offer.total} size="lg" />
        </div>
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{t("columns.eta")}</dt>
            <dd>
              {t("etaDays", { min: offer.etaDaysMin, max: offer.etaDaysMax })}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{t("columns.pickup")}</dt>
            <dd>{offer.pickupFromAddress ? t("yes") : t("no")}</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{t("columns.insurance")}</dt>
            <dd>
              {offer.insuranceIncluded ? t("yes") : t("no")}
              {offer.insuranceLimit
                ? ` · ≤ ${offer.insuranceLimit.amount} ${offer.insuranceLimit.currency}`
                : null}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{t("columns.returns")}</dt>
            <dd className="text-right">
              {t(`returnPolicy.${offer.carrierId}`)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-muted-foreground">{t("columns.validity")}</dt>
            <dd>
              {new Date(offer.validUntil).toLocaleString("tr-TR", {
                hour: "2-digit",
                minute: "2-digit",
                day: "2-digit",
                month: "short",
              })}
            </dd>
          </div>
        </dl>
        <div>
          <h4 className="text-sm font-semibold">{t("surchargesTitle")}</h4>
          <ul className="mt-2 space-y-1 text-sm">
            <li className="flex justify-between">
              <span className="text-muted-foreground">{t("basePrice")}</span>
              <MoneyDisplay value={offer.basePrice} size="sm" />
            </li>
            {offer.surcharges.map((s) => (
              <li key={s.id} className="flex justify-between">
                <span className="text-muted-foreground">
                  {t(`surcharges.${s.id}` as "surcharges.pickup")}
                </span>
                <MoneyDisplay value={s.amount} size="sm" />
              </li>
            ))}
          </ul>
        </div>
        <AppButton
          type="button"
          className="w-full"
          onClick={() => {
            onSelect(offer.id);
            onOpenChange(false);
          }}
        >
          {t("select")}
        </AppButton>
      </div>
    </DetailDrawer>
  );
}

export function ParcelQuotesLoading({ loading }: { loading: boolean }) {
  if (!loading) return null;
  return <LoadingSkeleton rows={4} variant="form" />;
}
