"use client";

import { AppInput } from "@/components/shared/app-input";

export type PhoneInputProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
};

export function PhoneInput({
  label,
  value = "",
  onChange,
  error,
  placeholder = "+90 5xx xxx xx xx",
  disabled,
}: PhoneInputProps) {
  return (
    <AppInput
      type="tel"
      inputMode="tel"
      autoComplete="tel"
      label={label}
      value={value}
      placeholder={placeholder}
      error={error}
      disabled={disabled}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
