"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import type { ChannelType } from "@/types/conversation";
import type { StatusTone } from "@/types/domain";

const toneMap: Record<ChannelType, StatusTone> = {
  web: "info",
  mobile: "neutral",
  whatsapp: "success",
  api: "warning",
  operator: "neutral",
};

export function ChannelBadge({ channel }: { channel: ChannelType }) {
  const t = useTranslations("agent");
  const labelKey = {
    web: "channelWeb",
    mobile: "channelMobile",
    whatsapp: "channelWhatsapp",
    api: "channelApi",
    operator: "channelOperator",
  }[channel];

  return <Badge tone={toneMap[channel]}>{t(labelKey)}</Badge>;
}
