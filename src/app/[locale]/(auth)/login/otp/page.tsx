"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";
import {
  AuthCard,
  AuthPageFrame,
} from "@/features/auth/components/auth-shell";
import { OtpInput } from "@/features/auth/components/otp-input";
import { AuthDemoHints, useAuthAction } from "@/features/auth/hooks/use-auth-action";
import { UnauthenticatedGuard } from "@/lib/auth/guards";

type Challenge = { challengeId: string; phone: string; expiresAt: string };

function readChallenge(): Challenge | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem("gonder.otp.challenge");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Challenge;
  } catch {
    return null;
  }
}

export default function OtpPage() {
  return (
    <UnauthenticatedGuard>
      <OtpContent />
    </UnauthenticatedGuard>
  );
}

function OtpContent() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { loading, run, completeAuth, authRepository, AuthErrorView } =
    useAuthAction();
  const [code, setCode] = React.useState("");
  const [challenge, setChallenge] = React.useState<Challenge | null>(() =>
    readChallenge(),
  );

  React.useEffect(() => {
    if (!challenge) {
      router.replace("/login/phone");
    }
  }, [challenge, router]);

  async function verify() {
    if (!challenge) return;
    const snapshot = await run(() =>
      authRepository.verifyPhoneOtp(challenge.challengeId, code),
    );
    if (snapshot) {
      sessionStorage.removeItem("gonder.otp.challenge");
      await completeAuth(snapshot);
    }
  }

  async function resend() {
    if (!challenge) return;
    const next = await run(() => authRepository.requestPhoneOtp(challenge.phone));
    if (next) {
      setChallenge(next);
      sessionStorage.setItem("gonder.otp.challenge", JSON.stringify(next));
      setCode("");
    }
  }

  if (!challenge) {
    return null;
  }

  return (
    <AuthPageFrame>
      <AuthCard
        title={t("otpTitle")}
        subtitle={t("otpSubtitle", { phone: challenge.phone })}
        className="mx-auto"
        footer={<AuthDemoHints />}
      >
        <div className="space-y-4">
          <OtpInput value={code} onChange={setCode} disabled={loading} />
          <AppButton
            className="w-full"
            loading={loading}
            disabled={code.length !== 6}
            onClick={() => void verify()}
          >
            {t("verify")}
          </AppButton>
          <AppButton
            variant="ghost"
            className="w-full"
            disabled={loading}
            onClick={() => void resend()}
          >
            {t("resendCode")}
          </AppButton>
          <AuthErrorView onRetry={() => void verify()} />
        </div>
      </AuthCard>
    </AuthPageFrame>
  );
}
