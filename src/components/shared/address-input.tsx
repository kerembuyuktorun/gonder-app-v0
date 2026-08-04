"use client";

import { AppInput } from "@/components/shared/app-input";
import { AppSelect } from "@/components/shared/app-select";
import { useTranslations } from "next-intl";

export type AddressValue = {
  contactName: string;
  phone?: string;
  line1: string;
  line2?: string;
  district?: string;
  city: string;
  postalCode?: string;
  country: string;
};

export type AddressInputProps = {
  value: AddressValue;
  onChange: (value: AddressValue) => void;
  cityOptions?: { value: string; label: string }[];
};

const defaultCities = [
  { value: "istanbul", label: "İstanbul" },
  { value: "ankara", label: "Ankara" },
  { value: "izmir", label: "İzmir" },
  { value: "bursa", label: "Bursa" },
  { value: "antalya", label: "Antalya" },
];

export function AddressInput({
  value,
  onChange,
  cityOptions = defaultCities,
}: AddressInputProps) {
  const t = useTranslations("fields");

  function patch(partial: Partial<AddressValue>) {
    onChange({ ...value, ...partial });
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <AppInput
        label={t("fullName")}
        value={value.contactName}
        onChange={(e) => patch({ contactName: e.target.value })}
      />
      <AppInput
        label={t("phone")}
        value={value.phone ?? ""}
        onChange={(e) => patch({ phone: e.target.value })}
      />
      <AppInput
        className="sm:col-span-2"
        containerClassName="sm:col-span-2"
        label={t("addressLine1")}
        value={value.line1}
        onChange={(e) => patch({ line1: e.target.value })}
      />
      <AppInput
        containerClassName="sm:col-span-2"
        label={t("addressLine2")}
        value={value.line2 ?? ""}
        onChange={(e) => patch({ line2: e.target.value })}
      />
      <AppSelect
        label={t("city")}
        placeholder={t("selectPlaceholder")}
        options={cityOptions}
        value={value.city}
        onValueChange={(city) => patch({ city })}
      />
      <AppInput
        label={t("district")}
        value={value.district ?? ""}
        onChange={(e) => patch({ district: e.target.value })}
      />
      <AppInput
        label={t("postalCode")}
        value={value.postalCode ?? ""}
        onChange={(e) => patch({ postalCode: e.target.value })}
      />
      <AppInput
        label={t("country")}
        value={value.country}
        onChange={(e) => patch({ country: e.target.value })}
      />
    </div>
  );
}
