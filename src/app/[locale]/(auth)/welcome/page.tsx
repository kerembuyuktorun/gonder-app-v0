"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";
import {
  AuthCard,
  AuthPageFrame,
} from "@/features/auth/components/auth-shell";
import { SocialAuthButtons } from "@/features/auth/components/social-auth-buttons";
import { AuthDemoHints, useAuthAction } from "@/features/auth/hooks/use-auth-action";
import { UnauthenticatedGuard } from "@/lib/auth/guards";
import { Separator } from "@/components/ui/separator";

export default function WelcomePage() {
  return (
    <UnauthenticatedGuard>
      <WelcomeContent />
    </UnauthenticatedGuard>
  );
}

function WelcomeContent() {
  const t = useTranslations("auth");
  const { loading, run, completeAuth, authRepository, AuthErrorView } =
    useAuthAction();

  return (
    <AuthPageFrame>
      <AuthCard
        title={t("welcomeTitle")}
        subtitle={t("welcomeSubtitle")}
        className="mx-auto"
        footer={<AuthDemoHints />}
      >
        <div className="space-y-4">
          <Link href="/login/phone" className="block">
            <AppButton className="w-full">{t("continueWithPhone")}</AppButton>
          </Link>
          <Link href="/login/email" className="block">
            <AppButton variant="secondary" className="w-full">
              {t("continueWithEmail")}
            </AppButton>
          </Link>
          <div className="flex items-center gap-3">
            <Separator className="flex-1" />
            <span className="text-xs uppercase text-muted-foreground">
              {t("or")}
            </span>
            <Separator className="flex-1" />
          </div>
          <SocialAuthButtons
            loading={loading}
            onGoogle={async () => {
              const snapshot = await run(() => authRepository.signInWithGoogle());
              if (snapshot) await completeAuth(snapshot);
            }}
            onApple={async () => {
              const snapshot = await run(() => authRepository.signInWithApple());
              if (snapshot) await completeAuth(snapshot);
            }}
          />
          <AuthErrorView />
        </div>
      </AuthCard>
    </AuthPageFrame>
  );
}
