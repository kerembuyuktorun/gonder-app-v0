"use client";

import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { AppButton } from "@/components/shared/app-button";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import {
  useIntegrationConnectionsQuery,
  useIntegrationProvidersQuery,
} from "@/features/integrations/hooks/use-integrations";
import {
  INTEGRATION_CATEGORIES,
  statusTone,
} from "@/features/integrations/lib/constants";
import type { IntegrationCategory } from "@/types/integrations";
import { cn } from "@/lib/utils/cn";
import { Link } from "@/lib/i18n/navigation";
import * as React from "react";

export function IntegrationMarketplace() {
  const t = useTranslations("integrations");
  const tRoot = useTranslations();
  const { data: providers, isLoading } = useIntegrationProvidersQuery();
  const { data: connections } = useIntegrationConnectionsQuery();
  const [category, setCategory] = React.useState<IntegrationCategory | "all">(
    "all",
  );
  const [q, setQ] = React.useState("");

  const connectionByProvider = React.useMemo(() => {
    const map = new Map(
      (connections ?? []).map((c) => [c.providerId, c] as const),
    );
    return map;
  }, [connections]);

  const filtered = (providers ?? []).filter((p) => {
    if (category !== "all" && p.category !== category) return false;
    if (!q) return true;
    return p.name.toLocaleLowerCase("tr-TR").includes(q.toLocaleLowerCase("tr-TR"));
  });

  if (isLoading) return <LoadingSkeleton rows={4} />;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={t("search")}
          className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm lg:max-w-sm"
        />
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium",
              category === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground",
            )}
          >
            {t("categories.all")}
          </button>
          {INTEGRATION_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium",
                category === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {t(`categories.${c}`)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((p) => {
          const conn = connectionByProvider.get(p.id);
          return (
            <article
              key={p.id}
              className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-display text-base font-semibold">{p.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {t(`categories.${p.category}`)}
                    {p.popular ? ` · ${t("popular")}` : ""}
                  </p>
                </div>
                {conn ? (
                  <Badge tone={statusTone[conn.status]}>
                    {t(`status.${conn.status}`)}
                  </Badge>
                ) : (
                  <Badge tone="neutral">{t("status.available")}</Badge>
                )}
              </div>
              <p className="flex-1 text-sm text-muted-foreground">
                {tRoot(p.descriptionKey)}
              </p>
              <Link href={`/integrations/${p.id}`}>
                <AppButton
                  size="sm"
                  variant={conn ? "secondary" : "primary"}
                  className="w-full"
                >
                  {conn ? t("manage") : t("connect")}
                </AppButton>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
