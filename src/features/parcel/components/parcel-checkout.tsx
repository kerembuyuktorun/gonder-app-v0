"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { MoneyDisplay } from "@/components/shared/money-display";
import type { Money } from "@/types/domain";
import type { ParcelLabel, ParcelOrderResult, ParcelQuoteOffer } from "@/types/parcel";

export function ParcelCheckoutSummary({
  offer,
  paymentMethod,
  onPaymentMethod,
  wallet,
  onConfirm,
  submitting,
  error,
}: {
  offer: ParcelQuoteOffer;
  paymentMethod: "card" | "balance";
  onPaymentMethod: (m: "card" | "balance") => void;
  wallet?: Money;
  onConfirm: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const t = useTranslations("parcel");
  const balanceOk =
    paymentMethod !== "balance" ||
    (wallet != null && wallet.amount >= offer.total.amount);

  return (
    <div className="space-y-4">
      <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
        <h2 className="text-base font-semibold">{t("selectedOffer")}</h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">{t("columns.carrier")}</dt>
            <dd className="font-medium">{t(`carriers.${offer.carrierId}`)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("columns.service")}</dt>
            <dd className="font-medium">{t(`serviceLevels.${offer.serviceLevel}`)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("columns.eta")}</dt>
            <dd className="font-medium">
              {t("etaDays", { min: offer.etaDaysMin, max: offer.etaDaysMax })}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("columns.total")}</dt>
            <dd>
              <MoneyDisplay value={offer.total} size="md" />
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
        <h2 className="text-base font-semibold">{t("paymentTitle")}</h2>
        <p className="text-sm text-muted-foreground">{t("paymentHint")}</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {(["balance", "card"] as const).map((method) => (
            <button
              key={method}
              type="button"
              onClick={() => onPaymentMethod(method)}
              className={`rounded-lg border px-3 py-3 text-left text-sm ${
                paymentMethod === method
                  ? "border-primary bg-primary/10"
                  : "border-border hover:bg-accent/40"
              }`}
            >
              <span className="font-semibold">{t(`payment.${method}`)}</span>
              {method === "balance" && wallet ? (
                <span className="mt-1 block text-xs text-muted-foreground">
                  {t("walletBalance")}:{" "}
                  <MoneyDisplay value={wallet} size="sm" />
                </span>
              ) : null}
            </button>
          ))}
        </div>
        {!balanceOk ? (
          <p className="text-sm text-error-fg">{t("insufficientBalance")}</p>
        ) : null}
        {error ? (
          <p className="text-sm text-error-fg">{t("checkoutError")}</p>
        ) : null}
        <AppButton
          type="button"
          onClick={onConfirm}
          loading={submitting}
          disabled={!balanceOk || submitting}
        >
          {t("confirmPayment")}
        </AppButton>
      </section>
    </div>
  );
}

export function ParcelLabelPreview({ label }: { label: ParcelLabel }) {
  const t = useTranslations("parcel");
  return (
    <div className="space-y-3 rounded-xl border border-dashed border-border bg-card p-4">
      <h3 className="text-sm font-semibold">{t("labelPreview")}</h3>
      <div className="rounded-lg border border-border bg-muted/40 p-4 font-mono text-xs leading-relaxed">
        <p className="text-sm font-bold tracking-wide">
          {t(`carriers.${label.carrierId}`)}
        </p>
        <p className="mt-2 text-base font-semibold tracking-[0.2em]">
          {label.trackingNumber}
        </p>
        <div
          className="mt-3 h-10 w-full bg-[repeating-linear-gradient(90deg,#111_0,#111_2px,transparent_2px,transparent_4px)]"
          aria-hidden
        />
        <p className="mt-2 tracking-widest text-muted-foreground">
          {label.barcode}
        </p>
        <p className="mt-3 text-[11px] text-muted-foreground">
          {label.labelHtmlPreview}
        </p>
      </div>
    </div>
  );
}

export function ParcelSuccess({
  order,
  onReset,
  onPrint,
  onExportPdf,
}: {
  order: ParcelOrderResult;
  onReset: () => void;
  onPrint: () => void;
  onExportPdf: () => void;
}) {
  const t = useTranslations("parcel");

  return (
    <div className="mx-auto max-w-2xl space-y-6 py-6 text-center sm:text-left">
      <div className="space-y-2 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-bg text-2xl text-success-fg">
          ✓
        </div>
        <h1 className="font-display text-2xl font-semibold">
          {t("successTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("successBody")}</p>
      </div>

      <dl className="grid gap-3 rounded-xl border border-border bg-card p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">{t("orderId")}</dt>
          <dd className="font-medium">{order.orderId}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("trackingNumber")}</dt>
          <dd className="font-medium">{order.trackingNumber}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("columns.carrier")}</dt>
          <dd className="font-medium">
            {t(`carriers.${order.offer.carrierId}`)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("columns.total")}</dt>
          <dd>
            <MoneyDisplay value={order.total} size="sm" />
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("paidWith")}</dt>
          <dd className="font-medium">{t(`payment.${order.paidWith}`)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("barcode")}</dt>
          <dd className="font-mono text-xs">{order.label.barcode}</dd>
        </div>
      </dl>

      <ParcelLabelPreview label={order.label} />

      <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
        <AppButton type="button" onClick={onPrint}>
          {t("printLabel")}
        </AppButton>
        <AppButton type="button" variant="secondary" onClick={onExportPdf}>
          {t("exportPdf")}
        </AppButton>
        <AppButton type="button" variant="ghost" onClick={onReset}>
          {t("newShipment")}
        </AppButton>
      </div>
    </div>
  );
}
