"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export type AppSelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type AppSelectProps = {
  label?: string;
  placeholder?: string;
  options: AppSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  className?: string;
  id?: string;
};

export function AppSelect({
  label,
  placeholder,
  options,
  value,
  onValueChange,
  error,
  disabled,
  className,
  id,
}: AppSelectProps) {
  const generatedId = React.useId();
  const selectId = id ?? generatedId;
  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={selectId}>{label}</Label> : null}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger
          id={selectId}
          aria-invalid={Boolean(error) || undefined}
          className={cn(error && "border-error")}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? <p className="text-xs text-error-fg">{error}</p> : null}
    </div>
  );
}
