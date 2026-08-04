"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import { AppTextarea } from "@/components/shared/app-textarea";
import { MoneyDisplay } from "@/components/shared/money-display";
import type { SpotOffer } from "@/types/spot";

export function SpotCounterOfferModal({
  offer,
  open,
  onOpenChange,
  onSubmit,
  submitting,
}: {
  offer: SpotOffer | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (amount: number, note: string) => void;
  submitting: boolean;
}) {
  if (!offer) return null;
  return (
    <SpotCounterOfferModalInner
      key={offer.id}
      offer={offer}
      open={open}
      onOpenChange={onOpenChange}
      onSubmit={onSubmit}
      submitting={submitting}
    />
  );
}

function SpotCounterOfferModalInner({
  offer,
  open,
  onOpenChange,
  onSubmit,
  submitting,
}: {
  offer: SpotOffer;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (amount: number, note: string) => void;
  submitting: boolean;
}) {
  const t = useTranslations("spot");
  const [amount, setAmount] = React.useState(
    String(Math.round(offer.total.amount * 0.92)),
  );
  const [note, setNote] = React.useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("counterTitle")}</DialogTitle>
          <DialogDescription>
            {offer.supplierName} · <MoneyDisplay value={offer.total} size="sm" />
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <AppInput
            label={t("counterAmount")}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <AppTextarea
            label={t("counterNote")}
            rows={2}
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <AppButton
            type="button"
            className="w-full"
            loading={submitting}
            disabled={!amount || Number(amount) <= 0}
            onClick={() => onSubmit(Number(amount), note)}
          >
            {t("sendCounter")}
          </AppButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SpotAcceptConfirm({
  offer,
  open,
  explicitAccept,
  onExplicitAccept,
  onConfirm,
  onCancel,
  submitting,
}: {
  offer: SpotOffer | null;
  open: boolean;
  explicitAccept: boolean;
  onExplicitAccept: (v: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  submitting: boolean;
}) {
  const t = useTranslations("spot");
  if (!offer) return null;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("acceptTitle")}</DialogTitle>
          <DialogDescription>{t("acceptHint")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-3 text-sm">
          <p className="font-medium">{offer.supplierName}</p>
          <dl className="space-y-1 rounded-lg border border-border p-3">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("breakdown.subtotal")}</dt>
              <dd>
                <MoneyDisplay value={offer.price} size="sm" />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("breakdown.tax")}</dt>
              <dd>
                <MoneyDisplay value={offer.tax} size="sm" />
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">{t("breakdown.surcharges")}</dt>
              <dd>
                <MoneyDisplay value={offer.surcharges} size="sm" />
              </dd>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-semibold">
              <dt>{t("breakdown.total")}</dt>
              <dd>
                <MoneyDisplay value={offer.total} size="sm" />
              </dd>
            </div>
          </dl>
          {offer.recommended ? (
            <p className="rounded-md bg-warning-bg px-2 py-1.5 text-xs text-warning-fg">
              {t("aiRecommendSafety")}
            </p>
          ) : null}
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              checked={explicitAccept}
              onChange={(e) => onExplicitAccept(e.target.checked)}
              className="mt-0.5 size-4 rounded border-border"
            />
            <span>{t("explicitAccept")}</span>
          </label>
          <div className="flex gap-2">
            <AppButton
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={onCancel}
            >
              {t("cancel")}
            </AppButton>
            <AppButton
              type="button"
              className="flex-1"
              disabled={!explicitAccept}
              loading={submitting}
              onClick={onConfirm}
            >
              {t("continueCheckout")}
            </AppButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
