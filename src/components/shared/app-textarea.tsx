"use client";

import * as React from "react";
import { Textarea, type TextareaProps } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils/cn";

export type AppTextareaProps = TextareaProps & {
  label?: string;
  hint?: string;
  error?: string;
};

export const AppTextarea = React.forwardRef<
  HTMLTextAreaElement,
  AppTextareaProps
>(({ label, hint, error, id, className, ...props }, ref) => {
  const inputId = id ?? React.useId();
  return (
    <div className="flex w-full flex-col gap-1.5">
      {label ? <Label htmlFor={inputId}>{label}</Label> : null}
      <Textarea
        ref={ref}
        id={inputId}
        aria-invalid={Boolean(error) || undefined}
        className={cn(error && "border-error", className)}
        {...props}
      />
      {error ? (
        <p className="text-xs text-error-fg">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
});
AppTextarea.displayName = "AppTextarea";
