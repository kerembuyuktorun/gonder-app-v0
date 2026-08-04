"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { pathForOnboardingStep } from "@/lib/auth/onboarding-paths";
import { hasPermission } from "@/lib/auth/permissions";
import { staffPermissions } from "@/lib/auth/staff";
import type { Permission } from "@/types/auth";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

const INDIVIDUAL_PERMISSIONS: Permission[] = [
  "shipments:read",
  "shipments:write",
  "quotes:read",
  "quotes:write",
  "requests:create",
  "reports:read",
  "settings:manage",
  "support:access",
];

type GuardProps = {
  children: React.ReactNode;
};

export function AuthenticatedGuard({ children }: GuardProps) {
  const status = useAuthStore((s) => s.status);
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/welcome");
    }
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="p-6">
        <LoadingSkeleton rows={3} />
      </div>
    );
  }

  return <>{children}</>;
}

export function UnauthenticatedGuard({ children }: GuardProps) {
  const status = useAuthStore((s) => s.status);
  const postAuthRedirectPath = useAuthStore((s) => s.postAuthRedirectPath);
  const router = useRouter();

  React.useEffect(() => {
    if (status === "authenticated") {
      router.replace(postAuthRedirectPath());
    }
  }, [status, router, postAuthRedirectPath]);

  if (status === "authenticated") {
    return (
      <div className="p-6">
        <LoadingSkeleton rows={2} />
      </div>
    );
  }

  return <>{children}</>;
}

export function OnboardingGuard({ children }: GuardProps) {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/welcome");
      return;
    }
    if (status === "authenticated" && user?.onboarding.status === "completed") {
      router.replace("/app/home");
    }
  }, [status, user, router]);

  if (status !== "authenticated" || !user) {
    return (
      <div className="p-6">
        <LoadingSkeleton rows={2} />
      </div>
    );
  }

  if (user.onboarding.status === "completed") {
    return (
      <div className="p-6">
        <LoadingSkeleton rows={2} />
      </div>
    );
  }

  return <>{children}</>;
}

export function CompletedOnboardingGuard({ children }: GuardProps) {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/welcome");
      return;
    }
    if (
      status === "authenticated" &&
      user &&
      user.onboarding.status !== "completed"
    ) {
      router.replace(pathForOnboardingStep(user.onboarding.step));
    }
  }, [status, user, router]);

  if (status !== "authenticated" || !user) {
    return (
      <div className="p-6">
        <LoadingSkeleton rows={2} />
      </div>
    );
  }

  if (user.onboarding.status !== "completed") {
    return (
      <div className="p-6">
        <LoadingSkeleton rows={2} />
      </div>
    );
  }

  return <>{children}</>;
}

export function OrganizationGuard({ children }: GuardProps) {
  const session = useAuthStore((s) => s.session);
  const organizations = useAuthStore((s) => s.organizations);
  const t = useTranslations("authStates");

  if (!session || session.activeContext.type !== "organization") {
    return (
      <ErrorState
        title={t("organizationNotFoundTitle")}
        description={t("organizationNotFoundDescription")}
      />
    );
  }

  const organizationId = session.activeContext.organizationId;
  const exists = organizations.some((o) => o.id === organizationId);
  if (!exists) {
    return (
      <ErrorState
        title={t("organizationNotFoundTitle")}
        description={t("organizationNotFoundDescription")}
      />
    );
  }

  return <>{children}</>;
}

export function useEffectivePermissions(): Permission[] {
  const session = useAuthStore((s) => s.session);
  const user = useAuthStore((s) => s.user);
  const activeMembership = useAuthStore((s) => s.activeMembership);
  if (!session || !user) return [];
  const staff = staffPermissions(user.staffRole);
  if (user.staffRole) return staff;
  if (session.activeContext.type === "individual") {
    return INDIVIDUAL_PERMISSIONS;
  }
  return activeMembership()?.permissions ?? [];
}

export function OpsStaffGuard({ children }: GuardProps) {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const router = useRouter();
  const t = useTranslations("authStates");

  React.useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/welcome");
    }
  }, [status, router]);

  if (status !== "authenticated" || !user) {
    return (
      <div className="p-6">
        <LoadingSkeleton rows={3} />
      </div>
    );
  }

  if (!user.staffRole) {
    return (
      <ErrorState
        title={t("unauthorizedTitle")}
        description={t("unauthorizedDescription")}
      />
    );
  }

  return <>{children}</>;
}

export function OpsPermissionGuard({
  children,
  permission,
  fallback,
}: GuardProps & {
  permission: Permission;
  fallback?: React.ReactNode;
}) {
  const permissions = useEffectivePermissions();
  const t = useTranslations("authStates");

  if (!permissions.includes(permission)) {
    return (
      fallback ?? (
        <ErrorState
          title={t("unauthorizedTitle")}
          description={t("unauthorizedDescription")}
        />
      )
    );
  }

  return <>{children}</>;
}

export function PermissionGuard({
  children,
  permission,
  fallback,
}: GuardProps & {
  permission: Permission;
  fallback?: React.ReactNode;
}) {
  const permissions = useEffectivePermissions();
  const t = useTranslations("authStates");

  if (!permissions.includes(permission)) {
    return (
      fallback ?? (
        <ErrorState
          title={t("unauthorizedTitle")}
          description={t("unauthorizedDescription")}
        />
      )
    );
  }

  return <>{children}</>;
}

export function Can({
  permission,
  children,
  fallback = null,
}: {
  permission: Permission;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const permissions = useEffectivePermissions();
  if (!permissions.includes(permission)) return <>{fallback}</>;
  return <>{children}</>;
}

export { hasPermission };
