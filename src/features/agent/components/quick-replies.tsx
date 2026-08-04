"use client";

import { AppButton } from "@/components/shared/app-button";
import { cn } from "@/lib/utils/cn";

export function QuickReplies({
  options,
  onSelect,
  disabled,
}: {
  options: string[];
  onSelect: (value: string) => void;
  disabled?: boolean;
}) {
  if (options.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 px-1 pb-2">
      {options.map((option) => (
        <AppButton
          key={option}
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled}
          className={cn("h-9 max-w-full truncate")}
          onClick={() => onSelect(option)}
        >
          {option}
        </AppButton>
      ))}
    </div>
  );
}
