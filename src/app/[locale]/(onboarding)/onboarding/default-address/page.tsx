"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { AddressInput, type AddressValue } from "@/components/shared/address-input";
import {
  AuthCard,
  AuthPageFrame,
} from "@/features/auth/components/auth-shell";
import { useAuthAction } from "@/features/auth/hooks/use-auth-action";
import { OnboardingGuard } from "@/lib/auth/guards";
import { useRouter } from "@/lib/i18n/navigation";

export default function DefaultAddressPage() {
  return (
    <OnboardingGuard>
      <DefaultAddressContent />
    </OnboardingGuard>
  );
}

function DefaultAddressContent() {
  const t = useTranslations("auth");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const { loading, run, refresh, authRepository, AuthErrorView } =
    useAuthAction();
  const [address, setAddress] = React.useState<AddressValue>({
    contactName: "",
    phone: "",
    line1: "",
    line2: "",
    district: "",
    city: "istanbul",
    postalCode: "",
    country: "TR",
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const result = await run(() =>
      authRepository.setDefaultSenderAddress(address),
    );
    if (result) {
      await refresh();
      router.push("/onboarding/complete");
    }
  }

  return (
    <AuthPageFrame>
      <AuthCard
        title={t("addressTitle")}
        subtitle={t("addressSubtitle")}
        className="mx-auto max-w-2xl"
      >
        <form className="space-y-4" onSubmit={(e) => void onSubmit(e)}>
          <AddressInput value={address} onChange={setAddress} />
          <AppButton type="submit" className="w-full" loading={loading}>
            {tCommon("continue")}
          </AppButton>
          <AuthErrorView />
        </form>
      </AuthCard>
    </AuthPageFrame>
  );
}
