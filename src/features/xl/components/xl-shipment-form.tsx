"use client";

import { useTranslations } from "next-intl";
import { AppInput } from "@/components/shared/app-input";
import { AppSelect } from "@/components/shared/app-select";
import { AppTextarea } from "@/components/shared/app-textarea";
import { XlPiecesTable } from "@/features/xl/components/xl-pieces-table";
import { XlPhotoUploader } from "@/features/xl/components/xl-photo-uploader";
import {
  XL_CATEGORIES,
  XL_EXTRAS,
  XL_PACKAGING,
} from "@/mocks/data/xl";
import type {
  XlAddress,
  XlDraft,
  XlExtraService,
  XlPiece,
  XlProductCategory,
  XlPackaging,
} from "@/types/xl";

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

function AddressBlock({
  address,
  onChange,
  title,
}: {
  address: XlAddress;
  onChange: (p: Partial<XlAddress>) => void;
  title: string;
}) {
  const t = useTranslations();
  const tx = useTranslations("xl");
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{title}</h3>
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
          label={tx("floor")}
          value={address.floor}
          onChange={(e) => onChange({ floor: e.target.value })}
        />
        <label className="flex items-center gap-2 self-end pb-2 text-sm">
          <input
            type="checkbox"
            checked={address.hasElevator}
            onChange={(e) => onChange({ hasElevator: e.target.checked })}
            className="size-4 rounded border-border"
          />
          {tx("hasElevator")}
        </label>
      </div>
    </div>
  );
}

export function XlShipmentForm({
  draft,
  patchDraft,
  updatePickup,
  updateDelivery,
  updatePiece,
  addPiece,
  removePiece,
  addPhotos,
  removePhoto,
  toggleExtra,
}: {
  draft: XlDraft;
  patchDraft: (p: Partial<XlDraft>) => void;
  updatePickup: (p: Partial<XlAddress>) => void;
  updateDelivery: (p: Partial<XlAddress>) => void;
  updatePiece: (id: string, p: Partial<XlPiece>) => void;
  addPiece: () => void;
  removePiece: (id: string) => void;
  addPhotos: (files: FileList) => void;
  removePhoto: (id: string) => void;
  toggleExtra: (s: XlExtraService) => void;
}) {
  const t = useTranslations("xl");

  return (
    <div className="space-y-4">
      <Section title={t("addressesTitle")}>
        <div className="space-y-6">
          <AddressBlock
            title={t("pickupAddress")}
            address={draft.pickup}
            onChange={updatePickup}
          />
          <AddressBlock
            title={t("deliveryAddress")}
            address={draft.delivery}
            onChange={updateDelivery}
          />
        </div>
      </Section>

      <Section title={t("productTitle")} description={t("productHint")}>
        <div className="grid gap-3 sm:grid-cols-2">
          <AppSelect
            label={t("category")}
            options={XL_CATEGORIES.map((c) => ({
              value: c,
              label: t(`categories.${c}`),
            }))}
            value={draft.category}
            onValueChange={(v) =>
              patchDraft({ category: v as XlProductCategory })
            }
          />
          <AppSelect
            label={t("packaging")}
            options={XL_PACKAGING.map((p) => ({
              value: p,
              label: t(`packagingOptions.${p}`),
            }))}
            value={draft.packaging}
            onValueChange={(v) => patchDraft({ packaging: v as XlPackaging })}
          />
          <div className="sm:col-span-2">
            <AppTextarea
              label={t("description")}
              rows={2}
              value={draft.description}
              onChange={(e) => patchDraft({ description: e.target.value })}
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
          <AppInput
            label={t("transportDate")}
            type="date"
            value={draft.transportDate}
            onChange={(e) => patchDraft({ transportDate: e.target.value })}
          />
        </div>
      </Section>

      <Section title={t("piecesTitle")} description={t("piecesHint")}>
        <XlPiecesTable
          pieces={draft.pieces}
          onChange={updatePiece}
          onAdd={addPiece}
          onRemove={removePiece}
        />
      </Section>

      <Section title={t("photosSection")}>
        <XlPhotoUploader
          photos={draft.photos}
          onAdd={addPhotos}
          onRemove={removePhoto}
        />
      </Section>

      <Section title={t("extrasTitle")} description={t("extrasHint")}>
        <div className="grid gap-2 sm:grid-cols-2">
          {XL_EXTRAS.map((extra) => (
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
              {t(`extras.${extra}`)}
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
      </Section>
    </div>
  );
}
