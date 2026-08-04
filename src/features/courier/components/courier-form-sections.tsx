"use client";

import { useTranslations } from "next-intl";

import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import { AppSelect } from "@/components/shared/app-select";
import { AppTextarea } from "@/components/shared/app-textarea";
import { PhoneInput } from "@/components/shared/phone-input";
import {
  DISTRICT_COORDS,
  EXTRA_SERVICES,
  PACKAGE_TYPES,
  SERVICE_LEVELS,
  TIME_WINDOWS,
  VEHICLE_TYPES,
} from "@/mocks/data/courier";
import type {
  CourierAddress,
  CourierContact,
  CourierExtraService,
  CourierPackage,
  CourierRequestDraft,
  CourierSchedule,
  CourierServiceLevel,
  CourierStop,
  CourierVehicleType,
} from "@/types/courier";

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 rounded-xl border border-border bg-card p-4 md:p-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

const districtOptions = Object.keys(DISTRICT_COORDS).map((d) => ({
  value: d,
  label: d,
}));

function AddressFields({
  address,
  onChange,
}: {
  address: CourierAddress;
  onChange: (patch: Partial<CourierAddress>) => void;
}) {
  const t = useTranslations();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AppInput
        containerClassName="sm:col-span-2"
        label={t("fields.addressLine1")}
        value={address.line1}
        onChange={(e) => onChange({ line1: e.target.value })}
      />
      <AppSelect
        label={t("courier.district")}
        options={districtOptions}
        value={address.district}
        onValueChange={(district) => onChange({ district })}
      />
      <AppInput
        label={t("fields.city")}
        value={address.city}
        onChange={(e) => onChange({ city: e.target.value })}
      />
      <AppInput
        label={t("fields.postalCode")}
        value={address.postalCode ?? ""}
        onChange={(e) => onChange({ postalCode: e.target.value })}
      />
    </div>
  );
}

function ContactFields({
  contact,
  onChange,
}: {
  contact: CourierContact;
  onChange: (patch: Partial<CourierContact>) => void;
}) {
  const t = useTranslations();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AppInput
        label={t("fields.fullName")}
        value={contact.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
      <PhoneInput
        label={t("fields.phone")}
        value={contact.phone}
        onChange={(phone) => onChange({ phone })}
      />
      <AppInput
        label={t("courier.company")}
        value={contact.company ?? ""}
        onChange={(e) => onChange({ company: e.target.value })}
      />
      <AppInput
        label={t("fields.email")}
        type="email"
        value={contact.email ?? ""}
        onChange={(e) => onChange({ email: e.target.value })}
      />
    </div>
  );
}

export function AddressesSection({
  draft,
  updatePickup,
  updateDelivery,
  updateStop,
  addStop,
  removeStop,
}: {
  draft: CourierRequestDraft;
  updatePickup: (p: Partial<CourierAddress>) => void;
  updateDelivery: (p: Partial<CourierAddress>) => void;
  updateStop: (id: string, p: Partial<CourierStop>) => void;
  addStop: () => void;
  removeStop: (id: string) => void;
}) {
  const t = useTranslations("courier");

  return (
    <div className="space-y-4">
      <SectionCard title={t("pickupAddress")}>
        <AddressFields address={draft.pickup} onChange={updatePickup} />
      </SectionCard>
      <SectionCard title={t("deliveryAddress")}>
        <AddressFields address={draft.delivery} onChange={updateDelivery} />
      </SectionCard>
      <SectionCard title={t("extraStopsTitle")} description={t("extraStopsHint")}>
        {draft.stops.map((stop, index) => (
          <div
            key={stop.id}
            className="space-y-3 rounded-lg border border-border bg-muted/30 p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-semibold">
                {t("stopLabel", { n: index + 1 })}
              </p>
              <AppButton
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeStop(stop.id)}
              >
                {t("removeStop")}
              </AppButton>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <AppInput
                label={t("stopName")}
                value={stop.label}
                onChange={(e) => updateStop(stop.id, { label: e.target.value })}
              />
              <AppSelect
                label={t("district")}
                options={districtOptions}
                value={stop.district || undefined}
                onValueChange={(district) => updateStop(stop.id, { district })}
              />
              <AppInput
                containerClassName="sm:col-span-2"
                label={t("stopAddress")}
                value={stop.addressLine}
                onChange={(e) =>
                  updateStop(stop.id, { addressLine: e.target.value })
                }
              />
              <AppInput
                label={t("stopContact")}
                value={stop.contactName}
                onChange={(e) =>
                  updateStop(stop.id, { contactName: e.target.value })
                }
              />
              <PhoneInput
                label={t("stopPhone")}
                value={stop.phone}
                onChange={(phone) => updateStop(stop.id, { phone })}
              />
            </div>
          </div>
        ))}
        <AppButton type="button" variant="secondary" onClick={addStop}>
          {t("addStop")}
        </AppButton>
      </SectionCard>
    </div>
  );
}

export function ContactsSection({
  draft,
  updateSender,
  updateRecipient,
}: {
  draft: CourierRequestDraft;
  updateSender: (p: Partial<CourierContact>) => void;
  updateRecipient: (p: Partial<CourierContact>) => void;
}) {
  const t = useTranslations("courier");
  return (
    <div className="space-y-4">
      <SectionCard title={t("sender")}>
        <ContactFields contact={draft.sender} onChange={updateSender} />
      </SectionCard>
      <SectionCard title={t("recipient")}>
        <ContactFields contact={draft.recipient} onChange={updateRecipient} />
      </SectionCard>
    </div>
  );
}

export function PackageSection({
  draft,
  updatePackage,
}: {
  draft: CourierRequestDraft;
  updatePackage: (p: Partial<CourierPackage>) => void;
}) {
  const t = useTranslations("courier");
  const pkg = draft.package;
  return (
    <SectionCard title={t("packageTitle")} description={t("packageHint")}>
      <div className="grid gap-3 sm:grid-cols-2">
        <AppSelect
          label={t("packageType")}
          options={PACKAGE_TYPES.map((type) => ({
            value: type,
            label: t(`packages.${type}`),
          }))}
          value={pkg.type}
          onValueChange={(type) =>
            updatePackage({ type: type as CourierPackage["type"] })
          }
        />
        <AppInput
          label={t("quantity")}
          type="number"
          min={1}
          value={pkg.quantity}
          onChange={(e) =>
            updatePackage({ quantity: Number(e.target.value) || 1 })
          }
        />
        <AppInput
          label={t("weight")}
          type="number"
          min={0.1}
          step={0.1}
          value={pkg.weightKg}
          onChange={(e) =>
            updatePackage({ weightKg: Number(e.target.value) || 0 })
          }
        />
        <div className="grid grid-cols-3 gap-2 sm:col-span-2">
          <AppInput
            label={t("length")}
            type="number"
            value={pkg.lengthCm ?? ""}
            onChange={(e) =>
              updatePackage({ lengthCm: Number(e.target.value) || 0 })
            }
          />
          <AppInput
            label={t("width")}
            type="number"
            value={pkg.widthCm ?? ""}
            onChange={(e) =>
              updatePackage({ widthCm: Number(e.target.value) || 0 })
            }
          />
          <AppInput
            label={t("height")}
            type="number"
            value={pkg.heightCm ?? ""}
            onChange={(e) =>
              updatePackage({ heightCm: Number(e.target.value) || 0 })
            }
          />
        </div>
        <div className="sm:col-span-2">
          <AppTextarea
            label={t("packageDesc")}
            rows={2}
            value={pkg.description ?? ""}
            onChange={(e) => updatePackage({ description: e.target.value })}
          />
        </div>
      </div>
    </SectionCard>
  );
}

export function VehicleServiceSection({
  draft,
  patchDraft,
}: {
  draft: CourierRequestDraft;
  patchDraft: (patch: Partial<CourierRequestDraft>) => void;
}) {
  const t = useTranslations("courier");

  return (
    <div className="space-y-4">
      <SectionCard title={t("vehicle")} description={t("vehicleHint")}>
        <div className="grid gap-2 sm:grid-cols-2">
          {VEHICLE_TYPES.map((vehicle) => (
            <button
              key={vehicle}
              type="button"
              onClick={() =>
                patchDraft({ vehicleType: vehicle as CourierVehicleType })
              }
              className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                draft.vehicleType === vehicle
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-accent/40"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">
                {t(vehicle)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(`${vehicle}Desc`)}
              </p>
            </button>
          ))}
        </div>
      </SectionCard>
      <SectionCard title={t("serviceLevel")} description={t("serviceHint")}>
        <div className="grid gap-2 sm:grid-cols-3">
          {SERVICE_LEVELS.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() =>
                patchDraft({ serviceLevel: level as CourierServiceLevel })
              }
              className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                draft.serviceLevel === level
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card hover:bg-accent/40"
              }`}
            >
              <p className="text-sm font-semibold text-foreground">
                {level === "same_day" ? t("sameDay") : t(level)}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {level === "same_day" ? t("sameDayDesc") : t(`${level}Desc`)}
              </p>
            </button>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

export function ScheduleExtrasSection({
  draft,
  updateSchedule,
  toggleExtra,
  patchDraft,
}: {
  draft: CourierRequestDraft;
  updateSchedule: (p: Partial<CourierSchedule>) => void;
  toggleExtra: (service: CourierExtraService) => void;
  patchDraft: (patch: Partial<CourierRequestDraft>) => void;
}) {
  const t = useTranslations("courier");
  const windowValue = `${draft.schedule.windowStart}|${draft.schedule.windowEnd}`;

  return (
    <div className="space-y-4">
      <SectionCard title={t("scheduleTitle")} description={t("scheduleHint")}>
        {draft.serviceLevel === "scheduled" ||
        draft.serviceLevel === "same_day" ||
        draft.serviceLevel === "express" ? (
          <div className="grid gap-3 sm:grid-cols-2">
            <AppInput
              label={t("pickupDate")}
              type="date"
              value={draft.schedule.pickupDate}
              onChange={(e) => updateSchedule({ pickupDate: e.target.value })}
            />
            <AppSelect
              label={t("timeWindow")}
              options={TIME_WINDOWS.map((w) => ({
                value: `${w.start}|${w.end}`,
                label: `${w.start} – ${w.end}`,
              }))}
              value={windowValue}
              onValueChange={(value) => {
                const [windowStart, windowEnd] = value.split("|");
                updateSchedule({ windowStart, windowEnd });
              }}
            />
          </div>
        ) : null}
        {draft.serviceLevel !== "scheduled" ? (
          <p className="text-sm text-muted-foreground">{t("asapHint")}</p>
        ) : null}
      </SectionCard>
      <SectionCard title={t("extras")} description={t("extrasHint")}>
        <div className="grid gap-2 sm:grid-cols-2">
          {EXTRA_SERVICES.map((extra) => (
            <label
              key={extra}
              className="flex cursor-pointer items-start gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={draft.extras.includes(extra)}
                onChange={() => toggleExtra(extra)}
                className="mt-0.5 size-4 rounded border-border"
              />
              <span className="font-medium text-foreground">
                {t(`extrasList.${extra}`)}
              </span>
            </label>
          ))}
        </div>
        <div className="mt-3">
          <AppTextarea
            label={t("notes")}
            rows={3}
            value={draft.notes}
            onChange={(e) => patchDraft({ notes: e.target.value })}
          />
        </div>
      </SectionCard>
    </div>
  );
}

export function ReviewSection({
  draft,
  acceptedTerms,
  setAcceptedTerms,
  quoteTotal,
}: {
  draft: CourierRequestDraft;
  acceptedTerms: boolean;
  setAcceptedTerms: (v: boolean) => void;
  quoteTotal?: string;
}) {
  const t = useTranslations("courier");
  return (
    <div className="space-y-4">
      <SectionCard title={t("reviewTitle")} description={t("reviewHint")}>
        <dl className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">{t("pickupAddress")}</dt>
            <dd className="font-medium text-foreground">
              {draft.pickup.district} · {draft.pickup.line1}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("deliveryAddress")}</dt>
            <dd className="font-medium text-foreground">
              {draft.delivery.district} · {draft.delivery.line1}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("sender")}</dt>
            <dd className="font-medium text-foreground">
              {draft.sender.name} · {draft.sender.phone}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("recipient")}</dt>
            <dd className="font-medium text-foreground">
              {draft.recipient.name || "—"} · {draft.recipient.phone || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("packageTitle")}</dt>
            <dd className="font-medium text-foreground">
              {t(`packages.${draft.package.type}`)} · {draft.package.quantity} ×{" "}
              {draft.package.weightKg} kg
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("vehicle")}</dt>
            <dd className="font-medium text-foreground">
              {t(draft.vehicleType)} ·{" "}
              {draft.serviceLevel === "same_day"
                ? t("sameDay")
                : t(draft.serviceLevel)}
            </dd>
          </div>
          {draft.stops.length > 0 ? (
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">{t("extraStopsTitle")}</dt>
              <dd className="font-medium text-foreground">
                {draft.stops
                  .map((s) => s.label || s.district || s.addressLine)
                  .join(" → ")}
              </dd>
            </div>
          ) : null}
          {quoteTotal ? (
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">{t("price.total")}</dt>
              <dd className="font-semibold text-foreground">{quoteTotal}</dd>
            </div>
          ) : null}
        </dl>
      </SectionCard>
      <SectionCard title={t("conditionsTitle")}>
        <p className="text-sm text-muted-foreground">{t("conditionsBody")}</p>
        <label className="mt-4 flex items-start gap-2 text-sm text-foreground">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 size-4 rounded border-border"
          />
          <span>{t("terms")}</span>
        </label>
      </SectionCard>
    </div>
  );
}
