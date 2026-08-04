"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";

export function SocialAuthButtons({
  onGoogle,
  onApple,
  loading,
}: {
  onGoogle: () => void;
  onApple: () => void;
  loading?: boolean;
}) {
  const t = useTranslations("auth");

  return (
    <div className="grid gap-2">
      <AppButton
        type="button"
        variant="outline"
        loading={loading}
        onClick={onGoogle}
        className="w-full"
      >
        {t("google")}
      </AppButton>
      <AppButton
        type="button"
        variant="outline"
        loading={loading}
        onClick={onApple}
        className="w-full"
      >
        {t("apple")}
      </AppButton>
    </div>
  );
}
