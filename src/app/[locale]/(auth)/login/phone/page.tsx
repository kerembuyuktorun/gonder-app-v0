"use client";

import * as React from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";
import { PhoneInput } from "@/components/shared/phone-input";
import {
  AuthCard,
  AuthPageFrame,
} from "@/features/auth/components/auth-shell";
import { AuthDemoHints, useAuthAction } from "@/features/auth/hooks/use-auth-action";
import { phoneSchema } from "@/features/auth/schemas/auth-schemas";
import { UnauthenticatedGuard } from "@/lib/auth/guards";
import { z } from "zod";

type FormValues = z.infer<typeof phoneSchema>;

export default function PhoneLoginPage() {
  return (
    <UnauthenticatedGuard>
      <PhoneLoginContent />
    </UnauthenticatedGuard>
  );
}

function PhoneLoginContent() {
  const t = useTranslations("auth");
  const tFields = useTranslations("fields");
  const router = useRouter();
  const { loading, run, authRepository, AuthErrorView } = useAuthAction();
  const form = useForm<FormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phone: "+90555" },
  });

  async function onSubmit(values: FormValues) {
    const challenge = await run(() =>
      authRepository.requestPhoneOtp(values.phone.replace(/\s/g, "")),
    );
    if (challenge) {
      sessionStorage.setItem(
        "gonder.otp.challenge",
        JSON.stringify(challenge),
      );
      router.push("/login/otp");
    }
  }

  const phoneValue = useWatch({ control: form.control, name: "phone" });

  return (
    <AuthPageFrame>
      <AuthCard
        title={t("phoneTitle")}
        subtitle={t("phoneSubtitle")}
        className="mx-auto"
        footer={<AuthDemoHints />}
      >
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <PhoneInput
            label={tFields("phone")}
            value={phoneValue}
            onChange={(value) =>
              form.setValue("phone", value, { shouldValidate: true })
            }
            error={form.formState.errors.phone ? tFields("phone") : undefined}
          />
          <AppButton type="submit" className="w-full" loading={loading}>
            {t("sendCode")}
          </AppButton>
          <AuthErrorView />
        </form>
      </AuthCard>
    </AuthPageFrame>
  );
}
