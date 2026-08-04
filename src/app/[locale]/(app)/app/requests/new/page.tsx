"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PermissionGuard } from "@/lib/auth/guards";
import { AgentWorkspace } from "@/features/agent/components/agent-workspace";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { useRouter } from "@/lib/i18n/navigation";
import type { ServiceType } from "@/types/domain";

const SERVICES: ServiceType[] = [
  "courier",
  "parcel_1_30",
  "gonder_xl",
  "ftl",
  "ltl",
  "spot",
];

function NewRequestRouter() {
  const params = useSearchParams();
  const router = useRouter();
  const mode = params.get("mode");
  const prompt = params.get("prompt");
  const serviceParam = params.get("service");
  const serviceHint = SERVICES.includes(serviceParam as ServiceType)
    ? (serviceParam as ServiceType)
    : null;

  React.useEffect(() => {
    if (mode === "form") {
      router.replace("/app/requests/new/form");
    }
  }, [mode, router]);

  if (mode === "form") {
    return <LoadingSkeleton rows={4} />;
  }

  return (
    <AgentWorkspace initialPrompt={prompt} serviceHint={serviceHint} />
  );
}

export default function NewRequestPage() {
  return (
    <PermissionGuard permission="requests:create">
      <Suspense fallback={<LoadingSkeleton rows={6} />}>
        <NewRequestRouter />
      </Suspense>
    </PermissionGuard>
  );
}
