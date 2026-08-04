"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { MoneyDisplay } from "@/components/shared/money-display";
import { Link } from "@/lib/i18n/navigation";
import type { Money } from "@/types/domain";
import type { XlOrderResult, XlQuote } from "@/types/xl";

export function XlCheckout({
  quote,
  paymentMethod,
  onPaymentMethod,
  wallet,
  onConfirm,
  submitting,
  error,
}: {
  quote: XlQuote;
  paymentMethod: "card" | "balance" | "invoice";
  onPaymentMethod: (m: "card" | "balance" | "invoice") => void;
  wallet?: Money;
  onConfirm: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const t = useTranslations("xl");
  if (!quote.total) return null;

  const balanceOk =
    paymentMethod !== "balance" ||
    (wallet != null && wallet.amount >= quote.total.amount);

  return (
    <div className="space-y-4">
      <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
        <h2 className="text-base font-semibold">{t("checkoutTitle")}</h2>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">{t("modelsLabel")}</dt>
            <dd className="font-medium">{t(`models.${quote.model}`)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("total")}</dt>
            <dd>
              <MoneyDisplay value={quote.total} size="md" />
            </dd>
          </div>
        </dl>
      </section>

      <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
        <h2 className="text-base font-semibold">{t("paymentTitle")}</h2>
        <div className="grid gap-2 sm:grid-cols-3">
          {(["invoice", "balance", "card"] as const).map((method) => (
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
          {t("confirmOrder")}
        </AppButton>
      </section>
    </div>
  );
}

export function XlSuccess({
  order,
  onReset,
}: {
  order: XlOrderResult;
  onReset: () => void;
}) {
  const t = useTranslations("xl");
  return (
    <div className="mx-auto max-w-lg space-y-4 py-10 text-center">
      <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-bg text-2xl text-success-fg">
        ✓
      </div>
      <h1 className="font-display text-2xl font-semibold">{t("successTitle")}</h1>
      <p className="text-sm text-muted-foreground">{t("successBody")}</p>
      <dl className="grid gap-2 rounded-xl border border-border bg-card p-4 text-left text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted-foreground">{t("orderId")}</dt>
          <dd className="font-medium">{order.orderId}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("reference")}</dt>
          <dd className="font-medium">{order.reference}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("total")}</dt>
          <dd>
            <MoneyDisplay value={order.total} size="sm" />
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">{t("paidWith")}</dt>
          <dd className="font-medium">{t(`payment.${order.paidWith}`)}</dd>
        </div>
      </dl>
      <div className="flex flex-wrap justify-center gap-2">
        <Link href="/app/home">
          <AppButton type="button">{t("backHome")}</AppButton>
        </Link>
        <AppButton type="button" variant="secondary" onClick={onReset}>
          {t("newRequest")}
        </AppButton>
      </div>
    </div>
  );
}
