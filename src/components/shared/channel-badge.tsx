"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { ChannelType } from "@/types/domain";

const toneMap: Record<ChannelType, "neutral" | "info" | "warning"> = {
  b2c: "neutral",
  b2b: "info",
  ops: "warning",
};

export function ChannelBadge({ channel }: { channel: ChannelType }) {
  const t = useTranslations("channels");
  return <Badge tone={toneMap[channel]}>{t(channel)}</Badge>;
}
