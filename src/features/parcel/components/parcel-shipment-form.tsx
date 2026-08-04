"use client";

import { useTranslations } from "next-intl";
import { AppInput } from "@/components/shared/app-input";
import { AppTextarea } from "@/components/shared/app-textarea";
import { PhoneInput } from "@/components/shared/phone-input";
import { ParcelPackagesEditor } from "@/features/parcel/components/parcel-packages";
import type {
  ParcelAddress,
  ParcelExtraService,
  ParcelPackage,
  ParcelParty,
  ParcelShipmentDraft,
} from "@/types/parcel";

const EXTRAS: ParcelExtraService[] = [
  "insurance",
  "cod",
  "sms",
  "weekend_delivery",
  "fragile",
];

function Section({
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
        <h2 className="text-base font-semibold">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}

function PartyFields({
  party,
  onChange,
}: {
  party: ParcelParty;
  onChange: (p: Partial<ParcelParty>) => void;
}) {
  const t = useTranslations();
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AppInput
        label={t("fields.fullName")}
        value={party.name}
        onChange={(e) => onChange({ name: e.target.value })}
      />
      <PhoneInput
        label={t("fields.phone")}
        value={party.phone}
        onChange={(phone) => onChange({ phone })}
      />
      <AppInput
        label={t("parcel.company")}
        value={party.company ?? ""}
        onChange={(e) => onChange({ company: e.target.value })}
      />
      <AppInput
        label={t("fields.email")}
        type="email"
        value={party.email ?? ""}
        onChange={(e) => onChange({ email: e.target.value })}
      />
    </div>
  );
}

function AddressFields({
  address,
  onChange,
}: {
  address: ParcelAddress;
  onChange: (p: Partial<ParcelAddress>) => void;
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
      <AppInput
        label={t("fields.district")}
        value={address.district}
        onChange={(e) => onChange({ district: e.target.value })}
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

export function ParcelShipmentForm({
  draft,
  patchDraft,
  updateSender,
  updateRecipient,
  updatePickup,
  updateDelivery,
  updateReturn,
  updatePackage,
  addPackage,
  removePackage,
  toggleExtra,
}: {
  draft: ParcelShipmentDraft;
  patchDraft: (p: Partial<ParcelShipmentDraft>) => void;
  updateSender: (p: Partial<ParcelParty>) => void;
  updateRecipient: (p: Partial<ParcelParty>) => void;
  updatePickup: (p: Partial<ParcelAddress>) => void;
  updateDelivery: (p: Partial<ParcelAddress>) => void;
  updateReturn: (p: Partial<ParcelAddress>) => void;
  updatePackage: (id: string, p: Partial<ParcelPackage>) => void;
  addPackage: () => void;
  removePackage: (id: string) => void;
  toggleExtra: (s: ParcelExtraService) => void;
}) {
  const t = useTranslations("parcel");

  return (
    <div className="space-y-4">
      <Section title={t("sender")}>
        <PartyFields party={draft.sender} onChange={updateSender} />
      </Section>
      <Section title={t("recipient")}>
        <PartyFields party={draft.recipient} onChange={updateRecipient} />
      </Section>
      <Section title={t("pickupAddress")}>
        <AddressFields address={draft.pickup} onChange={updatePickup} />
      </Section>
      <Section title={t("deliveryAddress")}>
        <AddressFields address={draft.delivery} onChange={updateDelivery} />
      </Section>
      <Section title={t("packagesTitle")} description={t("packagesHint")}>
        <ParcelPackagesEditor
          packages={draft.packages}
          onChange={updatePackage}
          onAdd={addPackage}
          onRemove={removePackage}
        />
      </Section>
      <Section title={t("shipmentDetails")}>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <AppTextarea
              label={t("content")}
              rows={2}
              value={draft.contentDescription}
              onChange={(e) =>
                patchDraft({ contentDescription: e.target.value })
              }
            />
          </div>
          <AppInput
            label={t("declaredValue")}
            type="number"
            min={0}
            value={draft.declaredValue.amount}
            onChange={(e) =>
              patchDraft({
                declaredValue: {
                  amount: Number(e.target.value) || 0,
                  currency: "TRY",
                },
              })
            }
          />
          <label className="flex items-center gap-2 self-end pb-2 text-sm">
            <input
              type="checkbox"
              checked={draft.pickupFromAddress}
              onChange={(e) =>
                patchDraft({ pickupFromAddress: e.target.checked })
              }
              className="size-4 rounded border-border"
            />
            {t("pickupFromAddress")}
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input
              type="checkbox"
              checked={draft.useReturnAddress}
              onChange={(e) => {
                patchDraft({
                  useReturnAddress: e.target.checked,
                  returnAddress: e.target.checked
                    ? (draft.returnAddress ?? {
                        line1: "",
                        district: "",
                        city: "İstanbul",
                        country: "TR",
                      })
                    : null,
                });
              }}
              className="size-4 rounded border-border"
            />
            {t("useReturnAddress")}
          </label>
          {draft.useReturnAddress && draft.returnAddress ? (
            <div className="sm:col-span-2">
              <AddressFields
                address={draft.returnAddress}
                onChange={updateReturn}
              />
            </div>
          ) : null}
        </div>
      </Section>
      <Section title={t("extras")} description={t("extrasHint")}>
        <div className="grid gap-2 sm:grid-cols-2">
          {EXTRAS.map((extra) => (
            <label
              key={extra}
              className="flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={draft.extras.includes(extra)}
                onChange={() => toggleExtra(extra)}
                className="size-4 rounded border-border"
              />
              {t(`extrasList.${extra}`)}
            </label>
          ))}
        </div>
      </Section>
    </div>
  );
}
