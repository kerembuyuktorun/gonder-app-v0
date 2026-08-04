"use client";

import { useEffect } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

function RedirectShipments() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const qs = searchParams.toString();
    router.replace(qs ? `/app/orders?${qs}` : "/app/orders");
  }, [router, searchParams]);

  return <LoadingSkeleton rows={3} />;
}

/** Legacy shipments route — redirects to unified orders module. */
export default function AppShipmentsRedirectPage() {
  return (
    <Suspense fallback={<LoadingSkeleton rows={3} />}>
      <RedirectShipments />
    </Suspense>
  );
}
