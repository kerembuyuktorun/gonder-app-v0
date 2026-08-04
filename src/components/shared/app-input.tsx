"use client";

import * as React from "react";
import { Input, type InputProps } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export type AppInputProps = InputProps & {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
};

export const AppInput = React.forwardRef<HTMLInputElement, AppInputProps>(
  ({ label, hint, error, id, containerClassName, className, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    return (
      <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
        {label ? (
          <Label htmlFor={inputId} className={error ? "text-error" : undefined}>
            {label}
          </Label>
        ) : null}
        <Input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error) || undefined}
          aria-describedby={
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          className={cn(error && "border-error", className)}
          {...props}
        />
        {error ? (
          <p id={`${inputId}-error`} className="text-xs text-error-fg">
            {error}
          </p>
        ) : hint ? (
          <p id={`${inputId}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);
AppInput.displayName = "AppInput";
