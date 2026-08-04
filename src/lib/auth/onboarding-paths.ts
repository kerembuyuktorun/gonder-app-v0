import type { OnboardingStep } from "@/types/auth";

export const ONBOARDING_PATHS: Record<OnboardingStep, string> = {
  account_type: "/onboarding/account-type",
  personal_info: "/onboarding/personal-info",
  organization: "/onboarding/organization",
  company_tax: "/onboarding/company-tax",
  default_address: "/onboarding/default-address",
  complete: "/onboarding/complete",
};

export function pathForOnboardingStep(step: OnboardingStep): string {
  return ONBOARDING_PATHS[step];
}
