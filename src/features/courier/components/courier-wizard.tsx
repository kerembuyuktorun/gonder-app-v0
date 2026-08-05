"use client";

import { useTranslations } from "next-intl";

import { AppButton } from "@/components/shared/app-button";
import { PageHeader } from "@/components/shared/page-header";
import { Link } from "@/lib/i18n/navigation";
import { useCourierWizard, COURIER_STEPS } from "@/features/courier/hooks/use-courier-wizard";
import { CourierStepNav } from "@/features/courier/components/courier-step-nav";
import { CourierMapPreview } from "@/features/courier/components/courier-map-preview";
import { CourierPriceSidebar } from "@/features/courier/components/courier-price-sidebar";
import {
  AddressesSection,
  ContactsSection,
  PackageSection,
  VehicleServiceSection,
  ScheduleExtrasSection,
  ReviewSection,
} from "@/features/courier/components/courier-form-sections";

export function CourierWizard() {
  const t = useTranslations("courier");
  const {
    draft,
    step,
    goTo,
    nextStep,
    prevStep,
    stepIndex,
    isFirst,
    isLast,
    quote,
    validation,
    isQuoteLoading,
    patchDraft,
    updatePickup,
    updateDelivery,
    updateStop,
    addStop,
    removeStop,
    updateSender,
    updateRecipient,
    updatePackage,
    updateSchedule,
    toggleExtra,
    confirm,
    submitting,
    submitted,
    submitError,
    acceptedTerms,
    setAcceptedTerms,
    reset,
  } = useCourierWizard();

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg space-y-4 py-12 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-success-bg text-2xl text-success-fg">
          ✓
        </div>
        <h1 className="font-display text-2xl font-semibold text-foreground">
          {t("confirmedTitle")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("confirmedTracking", { tracking: submitted.trackingNumber })}
        </p>
        <p className="text-xs text-muted-foreground">{submitted.requestId}</p>
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          <Link href="/dashboard">
            <AppButton type="button">{t("backHome")}</AppButton>
          </Link>
          <AppButton type="button" variant="secondary" onClick={reset}>
            {t("newRequest")}
          </AppButton>
        </div>
      </div>
    );
  }

  const quoteTotal =
    quote?.status === "ready"
      ? `${quote.total.amount.toLocaleString("tr-TR")} ${quote.total.currency}`
      : undefined;

  return (
    <div className="space-y-6">
      <PageHeader title={t("title")} description={t("subtitle")} />

      <CourierStepNav current={step} onSelect={goTo} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-4">
          {step === "addresses" ? (
            <AddressesSection
              draft={draft}
              updatePickup={updatePickup}
              updateDelivery={updateDelivery}
              updateStop={updateStop}
              addStop={addStop}
              removeStop={removeStop}
            />
          ) : null}
          {step === "contacts" ? (
            <ContactsSection
              draft={draft}
              updateSender={updateSender}
              updateRecipient={updateRecipient}
            />
          ) : null}
          {step === "package" ? (
            <PackageSection draft={draft} updatePackage={updatePackage} />
          ) : null}
          {step === "vehicle_service" ? (
            <VehicleServiceSection draft={draft} patchDraft={patchDraft} />
          ) : null}
          {step === "schedule_extras" ? (
            <ScheduleExtrasSection
              draft={draft}
              updateSchedule={updateSchedule}
              toggleExtra={toggleExtra}
              patchDraft={patchDraft}
            />
          ) : null}
          {step === "review" ? (
            <ReviewSection
              draft={draft}
              acceptedTerms={acceptedTerms}
              setAcceptedTerms={setAcceptedTerms}
              quoteTotal={quoteTotal}
            />
          ) : null}

          {submitError ? (
            <p className="rounded-lg border border-error/40 bg-error-bg px-3 py-2 text-sm text-error-fg">
              {t("submitError")}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <AppButton
              type="button"
              variant="ghost"
              disabled={isFirst}
              onClick={prevStep}
            >
              {t("back")}
            </AppButton>
            <div className="flex gap-2">
              {!isLast ? (
                <AppButton type="button" onClick={nextStep}>
                  {t("next")}
                </AppButton>
              ) : (
                <AppButton
                  type="button"
                  onClick={() => void confirm()}
                  disabled={
                    !acceptedTerms ||
                    submitting ||
                    quote?.status !== "ready"
                  }
                  loading={submitting}
                >
                  {t("confirm")}
                </AppButton>
              )}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("stepProgress", {
              current: stepIndex + 1,
              total: COURIER_STEPS.length,
            })}
          </p>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <div className="rounded-xl border border-border bg-card p-4">
            <CourierMapPreview draft={draft} />
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <CourierPriceSidebar
              quote={quote}
              validation={validation}
              isLoading={isQuoteLoading}
              onApplyVanSuggestion={() => patchDraft({ vehicleType: "van" })}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
