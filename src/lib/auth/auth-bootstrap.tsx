"use client";

import * as React from "react";
import { useAuthStore } from "@/stores/auth-store";

/** Starts session hydration without blocking public marketing pages. */
export function AuthBootstrap({ children }: { children: React.ReactNode }) {
  const status = useAuthStore((s) => s.status);
  const bootstrap = useAuthStore((s) => s.bootstrap);

  React.useEffect(() => {
    if (status === "idle") {
      void bootstrap();
    }
  }, [bootstrap, status]);

  return <>{children}</>;
}
