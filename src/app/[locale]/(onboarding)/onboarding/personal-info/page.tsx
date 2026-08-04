"use client";

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
import { useAuthAction } from "@/features/auth/hooks/use-auth-action";
import { personalInfoSchema } from "@/features/auth/schemas/auth-schemas";
import { OnboardingGuard } from "@/lib/auth/guards";
import { pathForOnboardingStep } from "@/lib/auth/onboarding-paths";
import { useRouter } from "@/lib/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";

type FormValues = z.infer<typeof personalInfoSchema>;

export default function PersonalInfoPage() {
  return (
    <OnboardingGuard>
      <PersonalInfoContent />
    </OnboardingGuard>
  );
}

function PersonalInfoContent() {
  const t = useTranslations("auth");
  const tFields = useTranslations("fields");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const { loading, run, refresh, authRepository, AuthErrorView } =
    useAuthAction();
  const form = useForm<FormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: user?.firstName ?? "",
      lastName: user?.lastName ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
    },
  });

  async function onSubmit(values: FormValues) {
    const updated = await run(() =>
      authRepository.updatePersonalInfo({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email || undefined,
        phone: values.phone || undefined,
      }),
    );
    if (updated) {
      await refresh();
      router.push(pathForOnboardingStep(updated.onboarding.step));
    }
  }

  return (
    <AuthPageFrame>
      <AuthCard
        title={t("personalTitle")}
        subtitle={t("personalSubtitle")}
        className="mx-auto"
      >
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <AppInput label={t("firstName")} {...form.register("firstName")} />
          <AppInput label={t("lastName")} {...form.register("lastName")} />
          <AppInput
            label={tFields("email")}
            type="email"
            {...form.register("email")}
          />
          <AppInput label={tFields("phone")} {...form.register("phone")} />
          <AppButton type="submit" className="w-full" loading={loading}>
            {tCommon("continue")}
          </AppButton>
          <AuthErrorView />
        </form>
      </AuthCard>
    </AuthPageFrame>
  );
}
