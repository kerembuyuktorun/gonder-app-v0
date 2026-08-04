"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { AuthPageFrame } from "@/features/auth/components/auth-shell";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function SplashPage() {
  const t = useTranslations("auth");
  const status = useAuthStore((s) => s.status);
  const postAuthRedirectPath = useAuthStore((s) => s.postAuthRedirectPath);
  const router = useRouter();

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace(postAuthRedirectPath());
    } else if (status === "unauthenticated") {
      router.replace("/welcome");
    }
  }, [status, router, postAuthRedirectPath]);

  return (
    <AuthPageFrame>
      <div className="mx-auto w-full max-w-md space-y-4 text-center">
        <p className="font-display text-2xl font-semibold">{t("splashLoading")}</p>
        <LoadingSkeleton rows={2} variant="form" />
      </div>
    </AuthPageFrame>
  );
}
