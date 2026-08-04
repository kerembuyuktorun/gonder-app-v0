"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export type AppComboboxOption = {
  value: string;
  label: string;
};

export type AppComboboxProps = {
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  options: AppComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
};

export function AppCombobox({
  label,
  placeholder = "Select",
  searchPlaceholder = "Search…",
  emptyText = "No results",
  options,
  value,
  onValueChange,
  className,
}: AppComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const selected = options.find((o) => o.value === value);
  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className={cn("flex w-full flex-col gap-1.5", className)}>
      {label ? <Label>{label}</Label> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <AppButton
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            <span className="truncate">{selected?.label ?? placeholder}</span>
            <ChevronsUpDown className="opacity-50" />
          </AppButton>
        </PopoverTrigger>
        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-2">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="mb-2"
          />
          <div className="max-h-56 overflow-auto">
            {filtered.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">
                {emptyText}
              </p>
            ) : (
              filtered.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-left text-sm hover:bg-accent touch-target",
                    value === option.value && "bg-accent",
                  )}
                  onClick={() => {
                    onValueChange?.(option.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "size-4",
                      value === option.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {option.label}
                </button>
              ))
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
