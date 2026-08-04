"use client";

import { useTranslations } from "next-intl";
import { AuthError, type AuthErrorCode } from "@/types/auth";
import { ErrorState } from "@/components/shared/error-state";

const CODE_MAP: Record<
  AuthErrorCode,
  { titleKey: string; descriptionKey: string }
> = {
  invalid_otp: {
    titleKey: "invalidOtpTitle",
    descriptionKey: "invalidOtpDescription",
  },
  expired_otp: {
    titleKey: "expiredOtpTitle",
    descriptionKey: "expiredOtpDescription",
  },
  network_error: {
    titleKey: "networkTitle",
    descriptionKey: "networkDescription",
  },
  account_exists: {
    titleKey: "accountExistsTitle",
    descriptionKey: "accountExistsDescription",
  },
  incomplete_onboarding: {
    titleKey: "incompleteOnboardingTitle",
    descriptionKey: "incompleteOnboardingDescription",
  },
  account_suspended: {
    titleKey: "suspendedTitle",
    descriptionKey: "suspendedDescription",
  },
  organization_not_found: {
    titleKey: "organizationNotFoundTitle",
    descriptionKey: "organizationNotFoundDescription",
  },
  unauthorized: {
    titleKey: "unauthorizedTitle",
    descriptionKey: "unauthorizedDescription",
  },
  invalid_credentials: {
    titleKey: "invalidCredentialsTitle",
    descriptionKey: "invalidCredentialsDescription",
  },
  not_found: {
    titleKey: "unauthorizedTitle",
    descriptionKey: "unauthorizedDescription",
  },
};

export function AuthErrorAlert({
  error,
  onRetry,
}: {
  error: unknown;
  onRetry?: () => void;
}) {
  const t = useTranslations("authStates");
  const tCommon = useTranslations("common");

  if (!error) return null;

  const code =
    error instanceof AuthError ? error.code : ("network_error" as AuthErrorCode);
  const keys = CODE_MAP[code] ?? CODE_MAP.network_error;

  return (
    <ErrorState
      title={t(keys.titleKey)}
      description={t(keys.descriptionKey)}
      onRetry={onRetry}
      retryLabel={tCommon("retry")}
      className="py-6"
    />
  );
}

export function toAuthError(error: unknown): AuthError {
  if (error instanceof AuthError) return error;
  return new AuthError("network_error");
}
