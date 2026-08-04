"use client";

import { useEffect } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

/** Legacy /ops → /operations */
export default function LegacyOpsRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/operations");
  }, [router]);
  return <LoadingSkeleton rows={3} />;
}
