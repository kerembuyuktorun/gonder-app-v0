"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { ServiceType } from "@/types/domain";

export function ServiceBadge({ type }: { type: ServiceType }) {
  const t = useTranslations("services");
  return <Badge tone="info">{t(type)}</Badge>;
}
