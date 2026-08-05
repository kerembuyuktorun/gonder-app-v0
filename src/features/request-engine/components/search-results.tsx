"use client";

import * as React from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Filter,
  MapPin,
  Pencil,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";
import { MoneyDisplay } from "@/components/shared/money-display";
import { useAuthStore } from "@/stores/auth-store";
import { useRequestDraftStore } from "@/stores/request-draft-store";
import { getRequestQuotes } from "@/features/request-engine/lib/quotes";
import { cn } from "@/lib/utils/cn";
import type { SearchQuote } from "@/types/request-engine";

type Sort = "recommended" | "price" | "speed";

export function SearchResults() {
  const t = useTranslations("redesign.results");
  const router = useRouter();
  const authStatus = useAuthStore((state) => state.status);
  const draft = useRequestDraftStore((state) => state.draft);
  const selectQuote = useRequestDraftStore((state) => state.selectQuote);
  const setMode = useRequestDraftStore((state) => state.setMode);
  const [sort, setSort] = React.useState<Sort>("recommended");
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [pickupOnly, setPickupOnly] = React.useState(false);

  const quotes = React.useMemo(() => {
    const next = getRequestQuotes(draft).filter((quote) =>
      pickupOnly ? quote.pickup !== "Planlı" : true,
    );
    return [...next].sort((a, b) => {
      if (sort === "price") {
        return (a.price?.amount ?? Infinity) - (b.price?.amount ?? Infinity);
      }
      if (sort === "speed") return Number(Boolean(b.fastest)) - Number(Boolean(a.fastest));
      return Number(Boolean(b.recommended)) - Number(Boolean(a.recommended));
    });
  }, [draft, pickupOnly, sort]);

  function continueWith(quote: SearchQuote) {
    selectQuote(quote.id);
    setMode("shipment");
    if (authStatus === "authenticated") {
      router.push("/create-shipment");
      return;
    }
    sessionStorage.setItem("gonder.auth.returnTo", "/create-shipment");
    router.push("/login/email");
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between px-4 py-4 md:px-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              G
            </span>
            <span className="font-display text-xl font-semibold">Gönder</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/">
              <AppButton variant="ghost" size="sm">
                <ArrowLeft className="size-4" />
                <span className="hidden sm:inline">{t("back")}</span>
              </AppButton>
            </Link>
            <Link href="/login/email">
              <AppButton variant="secondary" size="sm">
                {t("signIn")}
              </AppButton>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[90rem] px-4 py-6 md:px-8 md:py-8">
        <section className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-3">
              <SummaryItem
                icon={MapPin}
                label={t("route")}
                value={`${draft.origin || "—"} → ${draft.destination || "—"}`}
              />
              <SummaryItem
                icon={Clock3}
                label={t("date")}
                value={draft.date}
              />
              <SummaryItem
                icon={Sparkles}
                label={t("operation")}
                value={t(`types.${draft.operationType}`)}
              />
            </div>
            <Link href="/">
              <AppButton variant="secondary" size="sm">
                <Pencil className="size-4" />
                {t("edit")}
              </AppButton>
            </Link>
          </div>
        </section>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-primary">
              {t("count", { count: quotes.length })}
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight">
              {t("title")}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>
          <AppButton
            variant="secondary"
            className="lg:hidden"
            onClick={() => setFiltersOpen((value) => !value)}
            aria-expanded={filtersOpen}
          >
            <Filter className="size-4" />
            {t("filters")}
          </AppButton>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)]">
          <aside
            className={cn(
              "h-fit space-y-6 rounded-xl border border-border bg-card p-4 lg:sticky lg:top-4 lg:block",
              filtersOpen ? "block" : "hidden",
            )}
          >
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-primary" />
              <h2 className="font-semibold">{t("filters")}</h2>
            </div>
            <fieldset className="space-y-2">
              <legend className="mb-2 text-sm font-medium">{t("sort")}</legend>
              {(["recommended", "price", "speed"] as Sort[]).map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 text-sm"
                >
                  <input
                    type="radio"
                    name="sort"
                    value={value}
                    checked={sort === value}
                    onChange={() => setSort(value)}
                    className="size-4 accent-primary"
                  />
                  {t(`sortOptions.${value}`)}
                </label>
              ))}
            </fieldset>
            <label className="flex cursor-pointer items-start gap-2 border-t border-border pt-4 text-sm">
              <input
                type="checkbox"
                checked={pickupOnly}
                onChange={(event) => setPickupOnly(event.target.checked)}
                className="mt-0.5 size-4 accent-primary"
              />
              <span>
                <span className="font-medium">{t("pickupOnly")}</span>
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  {t("pickupOnlyDescription")}
                </span>
              </span>
            </label>
          </aside>

          <div className="space-y-4">
            {quotes.map((quote) => (
              <QuoteResultCard
                key={quote.id}
                quote={quote}
                onContinue={() => continueWith(quote)}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryItem({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof MapPin;
  label: string;
  value: string;
}) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="size-4" />
      </span>
      <span className="min-w-0">
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className="block truncate text-sm font-semibold">{value}</span>
      </span>
    </div>
  );
}

function QuoteResultCard({
  quote,
  onContinue,
}: {
  quote: SearchQuote;
  onContinue: () => void;
}) {
  const t = useTranslations("redesign.results");
  const [detailsOpen, setDetailsOpen] = React.useState(false);

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border bg-card",
        quote.recommended ? "border-brand-400" : "border-border",
      )}
    >
      {quote.recommended ? (
        <div className="bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground">
          {t("recommended")}
        </div>
      ) : null}
      <div className="grid gap-5 p-4 md:grid-cols-[minmax(0,1fr)_auto] md:p-5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-lg font-semibold">{quote.provider}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {quote.serviceName}
              </p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-status-warning-bg px-2 py-1 text-xs font-medium text-status-warning-fg">
              <Star className="size-3 fill-current" />
              {quote.score}
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Meta label={t("delivery")} value={quote.eta} />
            <Meta label={t("pickup")} value={quote.pickup} />
            <Meta label={t("insurance")} value={quote.insurance} />
          </div>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {quote.terms.map((term) => (
              <li
                key={term}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
              >
                <Check className="size-3.5 text-success" />
                {term}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex min-w-48 flex-col justify-between gap-4 border-t border-border pt-4 md:border-l md:border-t-0 md:pl-5 md:pt-0">
          {quote.preparing ? (
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-warning">
                {t("preparing")}
              </p>
              <p className="mt-1 text-sm font-semibold">{t("firstQuote")}</p>
            </div>
          ) : quote.price ? (
            <div>
              <p className="text-xs text-muted-foreground">{t("total")}</p>
              <MoneyDisplay value={quote.price} size="lg" />
              <p className="mt-1 text-xs text-muted-foreground">
                {t("taxIncluded")}
              </p>
            </div>
          ) : null}
          <AppButton onClick={onContinue} className="w-full">
            {quote.preparing ? t("requestQuote") : t("select")}
            <ArrowRight className="size-4" />
          </AppButton>
          <button
            type="button"
            onClick={() => setDetailsOpen((value) => !value)}
            aria-expanded={detailsOpen}
            className="inline-flex items-center justify-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            <ShieldCheck className="size-3.5" />
            {detailsOpen ? t("hideDetails") : t("details")}
          </button>
        </div>
      </div>
      {detailsOpen ? (
        <div className="border-t border-border bg-muted/25 px-4 py-4 text-sm md:px-5">
          <p className="font-semibold">{t("termsTitle")}</p>
          <p className="mt-1 text-muted-foreground">{t("termsDescription")}</p>
        </div>
      ) : null}
    </article>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-medium">{value}</p>
    </div>
  );
}
