"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { Textarea } from "@/components/ui/textarea";
import { VoiceInputButton } from "@/features/agent/components/voice-input-button";

export function MessageComposer({
  onSend,
  disabled,
}: {
  onSend: (text: string) => void;
  disabled?: boolean;
  initialValue?: string;
}) {
  const t = useTranslations("agent");
  const [value, setValue] = React.useState("");

  function submit() {
    const text = value.trim();
    if (!text) return;
    onSend(text);
    setValue("");
  }

  return (
    <div className="border-t border-border bg-card p-3">
      <div className="flex items-end gap-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={t("composerPlaceholder")}
          disabled={disabled}
          rows={2}
          className="min-h-[2.75rem] resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <VoiceInputButton
          disabled={disabled}
          onTranscript={(text) =>
            setValue((prev) => (prev ? `${prev} ${text}` : text))
          }
        />
        <AppButton
          type="button"
          size="icon"
          disabled={disabled || !value.trim()}
          aria-label={t("send")}
          onClick={submit}
        >
          <Send className="size-4" />
        </AppButton>
      </div>
    </div>
  );
}
