"use client";

import { AppInput } from "@/components/shared/app-input";

export type AppDateTimePickerProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
};

export function AppDateTimePicker({
  label,
  value,
  onChange,
  error,
  disabled,
}: AppDateTimePickerProps) {
  return (
    <AppInput
      type="datetime-local"
      label={label}
      value={value}
      disabled={disabled}
      error={error}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
