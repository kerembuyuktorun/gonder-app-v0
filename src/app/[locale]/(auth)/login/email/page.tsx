"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { z } from "zod";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import {
  AuthCard,
  AuthPageFrame,
} from "@/features/auth/components/auth-shell";
import { AuthDemoHints, useAuthAction } from "@/features/auth/hooks/use-auth-action";
import { emailLoginSchema } from "@/features/auth/schemas/auth-schemas";
import { UnauthenticatedGuard } from "@/lib/auth/guards";

type FormValues = z.infer<typeof emailLoginSchema>;

export default function EmailLoginPage() {
  return (
    <UnauthenticatedGuard>
      <EmailLoginContent />
    </UnauthenticatedGuard>
  );
}

function EmailLoginContent() {
  const t = useTranslations("auth");
  const tFields = useTranslations("fields");
  const { loading, run, completeAuth, authRepository, AuthErrorView } =
    useAuthAction();
  const form = useForm<FormValues>({
    resolver: zodResolver(emailLoginSchema),
    defaultValues: { email: "ayse@example.com", password: "Password1!" },
  });

  async function onSubmit(values: FormValues) {
    const snapshot = await run(() =>
      authRepository.signInWithEmail(values.email, values.password),
    );
    if (snapshot) await completeAuth(snapshot);
  }

  return (
    <AuthPageFrame>
      <AuthCard
        title={t("emailTitle")}
        subtitle={t("emailSubtitle")}
        className="mx-auto"
        footer={<AuthDemoHints />}
      >
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <AppInput
            label={tFields("email")}
            type="email"
            autoComplete="email"
            {...form.register("email")}
            error={form.formState.errors.email ? tFields("email") : undefined}
          />
          <AppInput
            label={t("password")}
            type="password"
            autoComplete="current-password"
            {...form.register("password")}
            error={form.formState.errors.password ? t("password") : undefined}
          />
          <div className="flex justify-end">
            <Link
              href="/login/forgot-password"
              className="text-sm font-medium text-primary hover:underline"
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <AppButton type="submit" className="w-full" loading={loading}>
            {t("signIn")}
          </AppButton>
          <AuthErrorView />
        </form>
      </AuthCard>
    </AuthPageFrame>
  );
}
