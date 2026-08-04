"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PermissionGuard } from "@/lib/auth/guards";
import { AgentWorkspace } from "@/features/agent/components/agent-workspace";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import type { ServiceType } from "@/types/domain";

const SERVICES: ServiceType[] = [
  "courier",
  "parcel_1_30",
  "gonder_xl",
  "ftl",
  "ltl",
  "spot",
];

function AgentPageContent() {
  const params = useSearchParams();
  const prompt = params.get("prompt");
  const serviceParam = params.get("service");
  const serviceHint = SERVICES.includes(serviceParam as ServiceType)
    ? (serviceParam as ServiceType)
    : null;
  const conversationId = params.get("conversationId");
  const fromWhatsApp = params.get("from") === "whatsapp";

  return (
    <AgentWorkspace
      initialPrompt={prompt}
      serviceHint={serviceHint}
      conversationId={conversationId}
      fromWhatsApp={fromWhatsApp}
    />
  );
}

export default function AgentPage() {
  return (
    <PermissionGuard permission="requests:create">
      <Suspense fallback={<LoadingSkeleton rows={6} />}>
        <AgentPageContent />
      </Suspense>
    </PermissionGuard>
  );
}
