"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AgentWorkspace } from "@/features/agent/components/agent-workspace";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

function AiDemoContent() {
  const params = useSearchParams();
  const prompt =
    params.get("prompt") ??
    "İstanbul'dan Ankara'ya bugün kapalı kasa komple yük göndereceğim.";

  return (
    <AgentWorkspace initialPrompt={prompt} serviceHint="ftl" />
  );
}

export default function PublicAiRequestPage() {
  return (
    <main className="min-h-dvh bg-background p-4 md:p-8">
      <div className="mx-auto max-w-[90rem]">
        <Suspense fallback={<LoadingSkeleton rows={6} />}>
          <AiDemoContent />
        </Suspense>
      </div>
    </main>
  );
}
