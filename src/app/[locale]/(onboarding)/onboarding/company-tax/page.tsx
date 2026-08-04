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
import { companyTaxSchema } from "@/features/auth/schemas/auth-schemas";
import { OnboardingGuard } from "@/lib/auth/guards";
import { useRouter } from "@/lib/i18n/navigation";

type FormValues = z.infer<typeof companyTaxSchema>;

export default function CompanyTaxPage() {
  return (
    <OnboardingGuard>
      <CompanyTaxContent />
    </OnboardingGuard>
  );
}

function CompanyTaxContent() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { loading, run, refresh, authRepository, AuthErrorView } =
    useAuthAction();
  const form = useForm<FormValues>({
    resolver: zodResolver(companyTaxSchema),
    defaultValues: { legalName: "", taxNumber: "", taxOffice: "" },
  });

  async function onSubmit(values: FormValues) {
    const org = await run(() => authRepository.updateCompanyTax(values));
    if (org) {
      await refresh();
      router.push("/onboarding/default-address");
    }
  }

  return (
    <AuthPageFrame>
      <AuthCard
        title={t("companyTaxTitle")}
        subtitle={t("companyTaxSubtitle")}
        className="mx-auto"
      >
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <AppInput label={t("legalName")} {...form.register("legalName")} />
          <AppInput label={t("taxNumber")} {...form.register("taxNumber")} />
          <AppInput label={t("taxOffice")} {...form.register("taxOffice")} />
          <AppButton type="submit" className="w-full" loading={loading}>
            {tCommon("continue")}
          </AppButton>
          <AuthErrorView />
        </form>
      </AuthCard>
    </AuthPageFrame>
  );
}
