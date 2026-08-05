"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import { AppTextarea } from "@/components/shared/app-textarea";
import { MoneyDisplay } from "@/components/shared/money-display";
import { Link } from "@/lib/i18n/navigation";
import type {
  InvoiceDetails,
  PaymentBreakdown,
  PaymentIntent,
  PaymentMethod,
  PaymentTiming,
  SavedCard,
} from "@/types/payment";
import type { Money } from "@/types/domain";
import type { SpotOffer } from "@/types/spot";
import { cn } from "@/lib/utils/cn";

export function SpotCheckout({
  offer,
  breakdown,
  paymentMethod,
  onPaymentMethod,
  timing,
  onTiming,
  cards,
  savedCardId,
  onSavedCardId,
  wallet,
  discountCode,
  onDiscountCode,
  onApplyDiscount,
  discountPercent,
  invoice,
  onInvoice,
  contractAccepted,
  onContractAccepted,
  require3ds,
  onRequire3ds,
  simulateOutcome,
  onSimulateOutcome,
  onPay,
  submitting,
  error,
}: {
  offer: SpotOffer;
  breakdown: PaymentBreakdown;
  paymentMethod: PaymentMethod;
  onPaymentMethod: (m: PaymentMethod) => void;
  timing: PaymentTiming;
  onTiming: (t: PaymentTiming) => void;
  cards: SavedCard[];
  savedCardId: string;
  onSavedCardId: (id: string) => void;
  wallet?: Money;
  discountCode: string;
  onDiscountCode: (v: string) => void;
  onApplyDiscount: () => void;
  discountPercent: number;
  invoice: InvoiceDetails;
  onInvoice: (p: Partial<InvoiceDetails>) => void;
  contractAccepted: boolean;
  onContractAccepted: (v: boolean) => void;
  require3ds: boolean;
  onRequire3ds: (v: boolean) => void;
  simulateOutcome?: "succeeded" | "failed" | "uncertain";
  onSimulateOutcome: (v: "succeeded" | "failed" | "uncertain" | undefined) => void;
  onPay: () => void;
  submitting: boolean;
  error: string | null;
}) {
  const t = useTranslations("spot");

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4">
        <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
          <h2 className="text-base font-semibold">{t("paymentTitle")}</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {(
              [
                ["saved_card", "paymentMethods.savedCard"],
                ["new_card", "paymentMethods.newCard"],
                ["wallet", "paymentMethods.wallet"],
                ["net_terms", "paymentMethods.netTerms"],
              ] as const
            ).map(([method, label]) => {
              const disabled =
                method === "net_terms" && !breakdown.netTermsEligible;
              return (
                <button
                  key={method}
                  type="button"
                  disabled={disabled}
                  onClick={() => onPaymentMethod(method)}
                  className={cn(
                    "rounded-lg border px-3 py-3 text-left text-sm disabled:opacity-40",
                    paymentMethod === method
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-accent/40",
                  )}
                >
                  <span className="font-semibold">{t(label)}</span>
                  {method === "wallet" && wallet ? (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      <MoneyDisplay value={wallet} size="sm" />
                    </span>
                  ) : null}
                  {method === "net_terms" && !breakdown.netTermsEligible ? (
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {t("netTermsIneligible")}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {paymentMethod === "saved_card" ? (
            <AppSelectCards
              cards={cards}
              value={savedCardId}
              onChange={onSavedCardId}
            />
          ) : null}

          {paymentMethod === "new_card" ? (
            <p className="text-xs text-muted-foreground">{t("newCardHint")}</p>
          ) : null}

          <div className="grid gap-2 sm:grid-cols-2">
            {(["full", "deposit"] as const).map((tm) => (
              <button
                key={tm}
                type="button"
                onClick={() => onTiming(tm)}
                className={cn(
                  "rounded-lg border px-3 py-2 text-left text-sm",
                  timing === tm
                    ? "border-primary bg-primary/10"
                    : "border-border",
                )}
              >
                {t(`timing.${tm}`)}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-end gap-2">
            <AppInput
              label={t("discountCode")}
              value={discountCode}
              onChange={(e) => onDiscountCode(e.target.value)}
            />
            <AppButton type="button" variant="secondary" onClick={onApplyDiscount}>
              {t("applyDiscount")}
            </AppButton>
            {discountPercent > 0 ? (
              <span className="pb-2 text-xs text-success-fg">
                %{discountPercent}
              </span>
            ) : null}
          </div>

          <div className="space-y-2 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
            <p className="font-medium text-foreground">{t("mockControls")}</p>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={require3ds}
                onChange={(e) => onRequire3ds(e.target.checked)}
                className="size-4 rounded border-border"
              />
              {t("force3ds")}
            </label>
            <label className="flex items-center gap-2">
              <span>{t("simulate")}</span>
              <select
                className="h-8 rounded border border-border bg-card px-2"
                value={simulateOutcome ?? ""}
                onChange={(e) =>
                  onSimulateOutcome(
                    (e.target.value || undefined) as
                      | "succeeded"
                      | "failed"
                      | "uncertain"
                      | undefined,
                  )
                }
              >
                <option value="">{t("simulateNone")}</option>
                <option value="failed">{t("simulateFailed")}</option>
                <option value="uncertain">{t("simulateUncertain")}</option>
              </select>
            </label>
          </div>
        </section>

        <section className="space-y-3 rounded-xl border border-border bg-card p-4 md:p-5">
          <h2 className="text-base font-semibold">{t("invoiceTitle")}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <AppInput
              label={t("invoice.company")}
              value={invoice.companyName}
              onChange={(e) => onInvoice({ companyName: e.target.value })}
            />
            <AppInput
              label={t("invoice.taxNumber")}
              value={invoice.taxNumber}
              onChange={(e) => onInvoice({ taxNumber: e.target.value })}
            />
            <AppInput
              label={t("invoice.taxOffice")}
              value={invoice.taxOffice}
              onChange={(e) => onInvoice({ taxOffice: e.target.value })}
            />
            <AppInput
              label={t("invoice.email")}
              type="email"
              value={invoice.email}
              onChange={(e) => onInvoice({ email: e.target.value })}
            />
            <div className="sm:col-span-2">
              <AppTextarea
                label={t("invoice.address")}
                rows={2}
                value={invoice.address}
                onChange={(e) => onInvoice({ address: e.target.value })}
              />
            </div>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input
              type="checkbox"
              checked={contractAccepted}
              onChange={(e) => onContractAccepted(e.target.checked)}
              className="mt-0.5 size-4 rounded border-border"
            />
            <span>{t("contractAccept")}</span>
          </label>
          {error ? (
            <p className="text-sm text-error-fg">
              {error === "invalid_discount"
                ? t("errors.invalid_discount")
                : error === "pay_failed"
                  ? t("errors.pay_failed")
                  : t("errors.generic")}
            </p>
          ) : null}
          <AppButton
            type="button"
            onClick={onPay}
            loading={submitting}
            disabled={!contractAccepted || submitting}
          >
            {t("payNow")}
          </AppButton>
        </section>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
        <div className="rounded-xl border border-border bg-card p-4">
          <h3 className="text-sm font-semibold">{t("orderSummary")}</h3>
          <p className="mt-2 text-sm font-medium">{offer.supplierName}</p>
          <dl className="mt-3 space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("breakdown.subtotal")}</dt>
              <dd>
                <MoneyDisplay value={breakdown.subtotal} size="sm" />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("breakdown.tax")}</dt>
              <dd>
                <MoneyDisplay value={breakdown.tax} size="sm" />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("breakdown.surcharges")}</dt>
              <dd>
                <MoneyDisplay value={breakdown.surcharges} size="sm" />
              </dd>
            </div>
            {breakdown.discount.amount > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">{t("breakdown.discount")}</dt>
                <dd>
                  −
                  <MoneyDisplay value={breakdown.discount} size="sm" />
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt>{t("breakdown.due")}</dt>
              <dd>
                <MoneyDisplay value={breakdown.totalDue} size="md" />
              </dd>
            </div>
          </dl>
        </div>
      </aside>
    </div>
  );
}

function AppSelectCards({
  cards,
  value,
  onChange,
}: {
  cards: SavedCard[];
  value: string;
  onChange: (id: string) => void;
}) {
  const t = useTranslations("spot");
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{t("savedCards")}</p>
      {cards.map((card) => (
        <label
          key={card.id}
          className={cn(
            "flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm",
            value === card.id ? "border-primary bg-primary/10" : "border-border",
          )}
        >
          <input
            type="radio"
            name="saved-card"
            checked={value === card.id}
            onChange={() => onChange(card.id)}
          />
          {card.brand} •••• {card.last4} ({card.expMonth}/{card.expYear})
        </label>
      ))}
    </div>
  );
}

export function SpotPaymentResult({
  intent,
  onConfirm3ds,
  onPoll,
  onReset,
  submitting,
}: {
  intent: PaymentIntent;
  onConfirm3ds: () => void;
  onPoll: () => void;
  onReset: () => void;
  submitting: boolean;
}) {
  const t = useTranslations("spot");

  return (
    <div className="mx-auto max-w-lg space-y-4 py-8 text-center">
      <div
        className={cn(
          "mx-auto flex size-14 items-center justify-center rounded-full text-2xl",
          intent.status === "succeeded" && "bg-success-bg text-success-fg",
          intent.status === "failed" && "bg-error-bg text-error-fg",
          (intent.status === "uncertain" || intent.status === "requires_3ds") &&
            "bg-warning-bg text-warning-fg",
        )}
      >
        {intent.status === "succeeded"
          ? "✓"
          : intent.status === "failed"
            ? "!"
            : "?"}
      </div>
      <h1 className="font-display text-2xl font-semibold">
        {t(`results.${intent.status}`)}
      </h1>
      <p className="text-sm text-muted-foreground">
        {t(`resultHints.${intent.status}`)}
      </p>
      <p className="text-sm">
        <MoneyDisplay value={intent.amount} size="md" />
      </p>
      {intent.orderId ? (
        <p className="text-sm font-medium">{intent.orderId}</p>
      ) : null}

      {intent.status === "requires_3ds" ? (
        <AppButton type="button" onClick={onConfirm3ds} loading={submitting}>
          {t("complete3ds")}
        </AppButton>
      ) : null}

      {intent.status === "uncertain" ? (
        <div className="space-y-2">
          <p className="text-sm text-warning-fg">{t("uncertainSafety")}</p>
          <AppButton type="button" onClick={onPoll} loading={submitting}>
            {t("pollStatus")}
          </AppButton>
        </div>
      ) : null}

      {intent.status === "failed" ? (
        <AppButton type="button" variant="secondary" onClick={onReset}>
          {t("tryAgain")}
        </AppButton>
      ) : null}

      {intent.status === "succeeded" ? (
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/dashboard">
            <AppButton type="button">{t("backHome")}</AppButton>
          </Link>
          <AppButton type="button" variant="secondary" onClick={onReset}>
            {t("newSpot")}
          </AppButton>
        </div>
      ) : null}
    </div>
  );
}
