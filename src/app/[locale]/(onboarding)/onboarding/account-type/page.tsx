"use client";

import { useTranslations } from "next-intl";
import { Building2, User } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import {
  AuthCard,
  AuthPageFrame,
} from "@/features/auth/components/auth-shell";
import { useAuthAction } from "@/features/auth/hooks/use-auth-action";
import { OnboardingGuard } from "@/lib/auth/guards";
import { pathForOnboardingStep } from "@/lib/auth/onboarding-paths";
import { useRouter } from "@/lib/i18n/navigation";
import type { AccountType } from "@/types/auth";

export default function AccountTypePage() {
  return (
    <OnboardingGuard>
      <AccountTypeContent />
    </OnboardingGuard>
  );
}

function AccountTypeContent() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { loading, run, refresh, authRepository, AuthErrorView } =
    useAuthAction();

  async function choose(accountType: AccountType) {
    const user = await run(() => authRepository.setAccountType(accountType));
    if (user) {
      await refresh();
      router.push(pathForOnboardingStep(user.onboarding.step));
    }
  }

  return (
    <AuthPageFrame>
      <AuthCard
        title={t("accountTypeTitle")}
        subtitle={t("accountTypeSubtitle")}
        className="mx-auto"
      >
        <div className="grid gap-3">
          <AppButton
            variant="outline"
            className="h-auto justify-start gap-3 px-4 py-4"
            loading={loading}
            onClick={() => void choose("individual")}
          >
            <User className="size-5" />
            <span className="text-left">
              <span className="block font-semibold">{t("individual")}</span>
              <span className="block text-xs text-muted-foreground">
                {t("individualDesc")}
              </span>
            </span>
          </AppButton>
          <AppButton
            variant="outline"
            className="h-auto justify-start gap-3 px-4 py-4"
            loading={loading}
            onClick={() => void choose("organization")}
          >
            <Building2 className="size-5" />
            <span className="text-left">
              <span className="block font-semibold">{t("organization")}</span>
              <span className="block text-xs text-muted-foreground">
                {t("organizationDesc")}
              </span>
            </span>
          </AppButton>
          <AuthErrorView />
        </div>
      </AuthCard>
    </AuthPageFrame>
  );
}
