"use client";

import { useEffect } from "react";
import { useRouter } from "@/lib/i18n/navigation";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";

export default function LegacyOpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  useEffect(() => {
    router.replace("/operations");
  }, [router]);
  void children;
  return <LoadingSkeleton rows={3} />;
}
