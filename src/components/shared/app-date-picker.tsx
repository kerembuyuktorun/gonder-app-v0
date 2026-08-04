"use client";

import * as React from "react";
import { AppInput } from "@/components/shared/app-input";

export type AppDatePickerProps = {
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
};

export function AppDatePicker({
  label,
  value,
  onChange,
  error,
  min,
  max,
  disabled,
}: AppDatePickerProps) {
  return (
    <AppInput
      type="date"
      label={label}
      value={value}
      min={min}
      max={max}
      disabled={disabled}
      error={error}
      onChange={(e) => onChange?.(e.target.value)}
    />
  );
}
