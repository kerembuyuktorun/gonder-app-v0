"use client";

import * as React from "react";
import { Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";

export function AiCommandBar() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const [prompt, setPrompt] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const query = prompt.trim();
    const href = query
      ? `/create-with-ai?prompt=${encodeURIComponent(query)}`
      : "/create-with-ai";
    router.push(href);
  }

  return (
    <section className="rounded-xl border border-border bg-card p-4 md:p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-md bg-brand-100 text-brand-800 dark:bg-brand-800 dark:text-brand-100">
          <Sparkles className="size-4" />
        </span>
        <div>
          <h2 className="text-sm font-semibold md:text-base">{t("aiTitle")}</h2>
          <p className="text-xs text-muted-foreground md:text-sm">{t("aiHint")}</p>
        </div>
      </div>
      <form
        className="flex flex-col gap-2 sm:flex-row sm:items-stretch"
        onSubmit={submit}
      >
        <AppInput
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder={t("aiPlaceholder")}
          aria-label={t("aiTitle")}
          containerClassName="flex-1"
        />
        <AppButton type="submit" className="sm:self-stretch">
          {t("aiSubmit")}
        </AppButton>
      </form>
    </section>
  );
}
