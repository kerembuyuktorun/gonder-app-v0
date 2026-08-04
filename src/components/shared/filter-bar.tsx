"use client";

import { AppButton } from "@/components/shared/app-button";
import { SearchInput } from "@/components/shared/search-input";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

export type FilterBarProps = {
  search?: string;
  onSearchChange?: (value: string) => void;
  onReset?: () => void;
  children?: React.ReactNode;
  className?: string;
};

export function FilterBar({
  search,
  onSearchChange,
  onReset,
  children,
  className,
}: FilterBarProps) {
  const t = useTranslations("common");

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-border bg-card p-3 lg:flex-row lg:items-center",
        className,
      )}
    >
      <SearchInput
        value={search}
        onChange={onSearchChange}
        placeholder={t("search")}
        className="lg:max-w-sm"
      />
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      {onReset ? (
        <AppButton variant="ghost" size="sm" onClick={onReset}>
          {t("reset")}
        </AppButton>
      ) : null}
    </div>
  );
}
