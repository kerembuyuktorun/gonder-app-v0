"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { AuthErrorAlert, toAuthError } from "@/features/auth/components/auth-error-alert";
import { useAuthStore } from "@/stores/auth-store";
import { authRepository } from "@/lib/api/client";
import { useRouter } from "@/lib/i18n/navigation";
import type { SessionSnapshot } from "@/types/auth";

export function useAuthAction() {
  const applySnapshot = useAuthStore((s) => s.applySnapshot);
  const refresh = useAuthStore((s) => s.refresh);
  const postAuthRedirectPath = useAuthStore((s) => s.postAuthRedirectPath);
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  async function run<T>(action: () => Promise<T>): Promise<T | null> {
    setLoading(true);
    setError(null);
    try {
      return await action();
    } catch (err) {
      setError(toAuthError(err));
      return null;
    } finally {
      setLoading(false);
    }
  }

  async function completeAuth(snapshot: SessionSnapshot) {
    applySnapshot(snapshot);
    router.replace(postAuthRedirectPath());
  }

  function AuthErrorView({ onRetry }: { onRetry?: () => void }) {
    return <AuthErrorAlert error={error} onRetry={onRetry} />;
  }

  return {
    loading,
    error,
    setError,
    run,
    completeAuth,
    refresh,
    authRepository,
    AuthErrorView,
  };
}

export function AuthDemoHints() {
  const t = useTranslations("auth");
  return (
    <p className="text-xs text-muted-foreground">
      {t("demoHint")}
      <br />
      {t("demoEmail")}
    </p>
  );
}
