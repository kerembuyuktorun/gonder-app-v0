"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import {
  AuthCard,
  AuthPageFrame,
} from "@/features/auth/components/auth-shell";
import { useAuthAction } from "@/features/auth/hooks/use-auth-action";
import { OnboardingGuard } from "@/lib/auth/guards";
import { useRouter } from "@/lib/i18n/navigation";

export default function OnboardingCompletePage() {
  return (
    <OnboardingGuard>
      <CompleteContent />
    </OnboardingGuard>
  );
}

function CompleteContent() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { loading, run, refresh, authRepository, AuthErrorView } =
    useAuthAction();

  React.useEffect(() => {
    void (async () => {
      await run(() => authRepository.completeOnboarding());
      await refresh();
    })();
    // complete once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthPageFrame>
      <AuthCard
        title={t("completeTitle")}
        subtitle={t("completeSubtitle")}
        className="mx-auto text-center"
      >
        <div className="flex flex-col items-center gap-4">
          <CheckCircle2 className="size-12 text-success" />
          <AppButton
            className="w-full"
            loading={loading}
            onClick={() => router.replace("/app/home")}
          >
            {t("goToApp")}
          </AppButton>
          <AuthErrorView />
        </div>
      </AuthCard>
    </AuthPageFrame>
  );
}
