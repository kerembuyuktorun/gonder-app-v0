"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import {
  AuthCard,
  AuthPageFrame,
} from "@/features/auth/components/auth-shell";
import { useAuthAction } from "@/features/auth/hooks/use-auth-action";
import { UnauthenticatedGuard } from "@/lib/auth/guards";

export default function RegisterPage() {
  return (
    <UnauthenticatedGuard>
      <RegisterContent />
    </UnauthenticatedGuard>
  );
}

function RegisterContent() {
  const t = useTranslations("redesign.register");
  const { loading, run, completeAuth, authRepository, AuthErrorView } =
    useAuthAction();
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [error, setError] = React.useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!form.name || !form.email.includes("@") || form.password.length < 8) {
      setError(t("validation"));
      return;
    }
    setError("");
    // Mock backend creates an onboarding-ready account using the seeded profile.
    const snapshot = await run(() =>
      authRepository.signInWithEmail("mehmet@example.com", "Password1!"),
    );
    if (snapshot) await completeAuth(snapshot);
  }

  return (
    <AuthPageFrame>
      <AuthCard
        title={t("title")}
        subtitle={t("subtitle")}
        className="mx-auto"
        footer={
          <p className="text-center text-sm text-muted-foreground">
            {t("hasAccount")}{" "}
            <Link
              href="/login/email"
              className="font-semibold text-primary hover:underline"
            >
              {t("signIn")}
            </Link>
          </p>
        }
      >
        <form className="space-y-4" onSubmit={submit} noValidate>
          <AppInput
            label={t("name")}
            value={form.name}
            onChange={(event) =>
              setForm((value) => ({ ...value, name: event.target.value }))
            }
            autoComplete="name"
          />
          <AppInput
            label={t("email")}
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm((value) => ({ ...value, email: event.target.value }))
            }
            autoComplete="email"
          />
          <AppInput
            label={t("phone")}
            value={form.phone}
            onChange={(event) =>
              setForm((value) => ({ ...value, phone: event.target.value }))
            }
            autoComplete="tel"
          />
          <AppInput
            label={t("password")}
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((value) => ({ ...value, password: event.target.value }))
            }
            autoComplete="new-password"
          />
          {error ? (
            <p className="text-sm text-error-fg" role="alert">
              {error}
            </p>
          ) : null}
          <AppButton type="submit" className="w-full" loading={loading}>
            {t("submit")}
          </AppButton>
          <AuthErrorView />
          <p className="text-xs leading-relaxed text-muted-foreground">
            {t("terms")}
          </p>
        </form>
      </AuthCard>
    </AuthPageFrame>
  );
}
