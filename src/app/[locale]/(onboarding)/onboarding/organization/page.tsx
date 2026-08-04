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
import { organizationSchema } from "@/features/auth/schemas/auth-schemas";
import { OnboardingGuard } from "@/lib/auth/guards";
import { pathForOnboardingStep } from "@/lib/auth/onboarding-paths";
import { useRouter } from "@/lib/i18n/navigation";

type FormValues = z.infer<typeof organizationSchema>;

export default function OrganizationPage() {
  return (
    <OnboardingGuard>
      <OrganizationContent />
    </OnboardingGuard>
  );
}

function OrganizationContent() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { loading, run, refresh, authRepository, AuthErrorView } =
    useAuthAction();
  const form = useForm<FormValues>({
    resolver: zodResolver(organizationSchema),
    defaultValues: { name: "" },
  });

  async function onSubmit(values: FormValues) {
    const result = await run(() => authRepository.createOrganization(values));
    if (result) {
      await refresh();
      router.push(pathForOnboardingStep(result.user.onboarding.step));
    }
  }

  return (
    <AuthPageFrame>
      <AuthCard title={t("orgTitle")} subtitle={t("orgSubtitle")} className="mx-auto">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <AppInput label={t("orgName")} {...form.register("name")} />
          <AppButton type="submit" className="w-full" loading={loading}>
            {tCommon("continue")}
          </AppButton>
          <AuthErrorView />
        </form>
      </AuthCard>
    </AuthPageFrame>
  );
}
