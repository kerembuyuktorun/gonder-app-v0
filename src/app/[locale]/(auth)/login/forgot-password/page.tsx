"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import {
  AuthCard,
  AuthPageFrame,
} from "@/features/auth/components/auth-shell";
import { OtpInput } from "@/features/auth/components/otp-input";
import { AuthDemoHints, useAuthAction } from "@/features/auth/hooks/use-auth-action";
import {
  passwordResetRequestSchema,
  passwordResetSchema,
} from "@/features/auth/schemas/auth-schemas";
import { UnauthenticatedGuard } from "@/lib/auth/guards";
import { useRouter } from "@/lib/i18n/navigation";

type RequestValues = z.infer<typeof passwordResetRequestSchema>;
type ResetValues = z.infer<typeof passwordResetSchema>;

export default function ForgotPasswordPage() {
  return (
    <UnauthenticatedGuard>
      <ForgotPasswordContent />
    </UnauthenticatedGuard>
  );
}

function ForgotPasswordContent() {
  const t = useTranslations("auth");
  const tFields = useTranslations("fields");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { loading, run, authRepository, AuthErrorView } = useAuthAction();
  const [challengeId, setChallengeId] = React.useState<string | null>(null);
  const [code, setCode] = React.useState("");

  const requestForm = useForm<RequestValues>({
    resolver: zodResolver(passwordResetRequestSchema),
    defaultValues: { email: "ayse@example.com" },
  });

  const resetForm = useForm<ResetValues>({
    resolver: zodResolver(passwordResetSchema),
    defaultValues: { code: "", newPassword: "", confirmPassword: "" },
  });

  async function onRequest(values: RequestValues) {
    const challenge = await run(() =>
      authRepository.requestPasswordReset(values.email),
    );
    if (challenge) setChallengeId(challenge.challengeId);
  }

  async function onReset(values: ResetValues) {
    if (!challengeId) return;
    const result = await run(() =>
      authRepository.resetPassword(challengeId, code || values.code, values.newPassword),
    );
    if (result !== null) {
      router.push("/login/email");
    }
  }

  return (
    <AuthPageFrame>
      <AuthCard
        title={t("resetTitle")}
        subtitle={t("resetSubtitle")}
        className="mx-auto"
        footer={<AuthDemoHints />}
      >
        {!challengeId ? (
          <form
            className="space-y-4"
            onSubmit={requestForm.handleSubmit(onRequest)}
          >
            <AppInput
              label={tFields("email")}
              type="email"
              {...requestForm.register("email")}
            />
            <AppButton type="submit" className="w-full" loading={loading}>
              {t("sendCode")}
            </AppButton>
            <AuthErrorView />
          </form>
        ) : (
          <form className="space-y-4" onSubmit={resetForm.handleSubmit(onReset)}>
            <p className="text-sm text-success-fg">{t("resetSent")}</p>
            <OtpInput
              value={code}
              onChange={(value) => {
                setCode(value);
                resetForm.setValue("code", value);
              }}
            />
            <AppInput
              label={t("newPassword")}
              type="password"
              {...resetForm.register("newPassword")}
            />
            <AppInput
              label={t("confirmPassword")}
              type="password"
              {...resetForm.register("confirmPassword")}
            />
            <AppButton type="submit" className="w-full" loading={loading}>
              {t("resetSubmit")}
            </AppButton>
            <AppButton
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => setChallengeId(null)}
            >
              {tCommon("back")}
            </AppButton>
            <AuthErrorView />
          </form>
        )}
      </AuthCard>
    </AuthPageFrame>
  );
}
