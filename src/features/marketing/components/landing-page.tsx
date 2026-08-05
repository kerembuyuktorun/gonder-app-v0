"use client";

import {
  ArrowRight,
  Boxes,
  Building2,
  CheckCircle2,
  CircleHelp,
  Code2,
  Headphones,
  PackageCheck,
  Route,
  ShieldCheck,
  Sparkles,
  Sun,
  Moon,
  Truck,
  Zap,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Link } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";
import { RequestForm } from "@/features/request-engine/components/request-form";

export function LandingPage() {
  const t = useTranslations("redesign.landing");
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 w-full max-w-[90rem] items-center justify-between px-4 md:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              G
            </span>
            <span>
              <span className="block font-display text-xl font-semibold leading-none">
                Gönder
              </span>
              <span className="mt-1 hidden text-[10px] uppercase tracking-[0.15em] text-muted-foreground sm:block">
                {t("brandLine")}
              </span>
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium lg:flex">
            <a href="#services" className="hover:text-primary">
              {t("nav.services")}
            </a>
            <a href="#how" className="hover:text-primary">
              {t("nav.how")}
            </a>
            <a href="#enterprise" className="hover:text-primary">
              {t("nav.enterprise")}
            </a>
            <Link href="/create-with-ai" className="hover:text-primary">
              {t("nav.ai")}
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <AppButton
              variant="ghost"
              size="icon"
              aria-label={t("theme")}
              onClick={() =>
                setTheme(resolvedTheme === "dark" ? "light" : "dark")
              }
            >
              <Sun className="size-4 dark:hidden" />
              <Moon className="hidden size-4 dark:block" />
            </AppButton>
            <Link href="/login/email">
              <AppButton variant="ghost" size="sm">
                {t("signIn")}
              </AppButton>
            </Link>
            <Link href="/register" className="hidden sm:block">
              <AppButton size="sm">{t("register")}</AppButton>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-border bg-card">
          <div className="mx-auto grid w-full max-w-[90rem] gap-10 px-4 py-10 md:px-8 md:py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(34rem,1.1fr)] lg:items-center lg:py-20">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-primary">
                <Sparkles className="size-3.5" />
                {t("eyebrow")}
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-[3.6rem] lg:leading-[1.08]">
                {t("headline")}
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                {t("description")}
              </p>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                {["compare", "singlePanel", "support"].map((key) => (
                  <span key={key} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-success" />
                    {t(`proof.${key}`)}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-4 border-t border-border pt-6">
                <div className="flex -space-x-2">
                  {["AR", "EK", "MD"].map((initials) => (
                    <span
                      key={initials}
                      className="flex size-9 items-center justify-center rounded-full border-2 border-card bg-accent text-[10px] font-bold text-accent-foreground"
                    >
                      {initials}
                    </span>
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t("trustTitle")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("trustDescription")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background p-4 shadow-sm md:p-6">
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl font-semibold">
                    {t("formTitle")}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t("formDescription")}
                  </p>
                </div>
                <span className="hidden rounded-lg bg-status-success-bg px-2.5 py-1 text-xs font-medium text-status-success-fg sm:inline-flex">
                  {t("guestBadge")}
                </span>
              </div>
              <RequestForm mode="price" compact />
            </div>
          </div>
        </section>

        <section id="services" className="mx-auto max-w-[90rem] px-4 py-16 md:px-8 md:py-20">
          <SectionHeading
            eyebrow={t("services.eyebrow")}
            title={t("services.title")}
            description={t("services.description")}
          />
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <ServiceBlock
              icon={PackageCheck}
              title={t("services.parcel.title")}
              description={t("services.parcel.description")}
              items={[
                t("services.parcel.item1"),
                t("services.parcel.item2"),
                t("services.parcel.item3"),
              ]}
            />
            <ServiceBlock
              icon={Zap}
              title={t("services.courier.title")}
              description={t("services.courier.description")}
              items={[
                t("services.courier.item1"),
                t("services.courier.item2"),
                t("services.courier.item3"),
              ]}
            />
            <ServiceBlock
              icon={Truck}
              title={t("services.logistics.title")}
              description={t("services.logistics.description")}
              items={[
                t("services.logistics.item1"),
                t("services.logistics.item2"),
                t("services.logistics.item3"),
              ]}
            />
          </div>
        </section>

        <section id="how" className="border-y border-border bg-card">
          <div className="mx-auto max-w-[90rem] px-4 py-16 md:px-8 md:py-20">
            <SectionHeading
              eyebrow={t("how.eyebrow")}
              title={t("how.title")}
              description={t("how.description")}
            />
            <div className="mt-10 grid gap-8 md:grid-cols-4">
              {[
                { icon: Route, key: "request" },
                { icon: Boxes, key: "compare" },
                { icon: ShieldCheck, key: "pay" },
                { icon: PackageCheck, key: "track" },
              ].map((step, index) => (
                <div key={step.key} className="relative">
                  <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <step.icon className="size-5" />
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-4 font-semibold">{t(`how.${step.key}.title`)}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {t(`how.${step.key}.description`)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="enterprise" className="mx-auto max-w-[90rem] px-4 py-16 md:px-8 md:py-20">
          <div className="grid overflow-hidden rounded-2xl border border-border bg-primary text-primary-foreground lg:grid-cols-[1fr_auto]">
            <div className="p-6 md:p-10">
              <Building2 className="size-7" />
              <h2 className="mt-5 max-w-2xl font-display text-3xl font-semibold">
                {t("enterprise.title")}
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-primary-foreground/75 md:text-base">
                {t("enterprise.description")}
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/register">
                  <AppButton variant="secondary">
                    {t("enterprise.cta")}
                    <ArrowRight className="size-4" />
                  </AppButton>
                </Link>
                <Link href="/create-with-ai">
                  <AppButton
                    variant="ghost"
                    className="text-primary-foreground hover:bg-white/10 hover:text-primary-foreground"
                  >
                    {t("enterprise.aiCta")}
                  </AppButton>
                </Link>
              </div>
            </div>
            <div className="grid border-t border-white/15 sm:grid-cols-3 lg:w-96 lg:grid-cols-1 lg:border-l lg:border-t-0">
              {[
                { icon: Code2, key: "api" },
                { icon: Headphones, key: "support" },
                { icon: CircleHelp, key: "control" },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center gap-3 border-white/15 p-5 [&:not(:last-child)]:border-b sm:[&:not(:last-child)]:border-b-0 sm:[&:not(:last-child)]:border-r lg:[&:not(:last-child)]:border-b lg:[&:not(:last-child)]:border-r-0"
                >
                  <item.icon className="size-5 shrink-0" />
                  <span className="text-sm font-medium">
                    {t(`enterprise.${item.key}`)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-[90rem] flex-col gap-4 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-8">
          <p>© 2026 Gönder · {t("footer")}</p>
          <div className="flex gap-5">
            <Link href="/support">{t("nav.support")}</Link>
            <Link href="/login/email">{t("signIn")}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
        {eyebrow}
      </p>
      <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
        {description}
      </p>
    </div>
  );
}

function ServiceBlock({
  icon: Icon,
  title,
  description,
  items,
}: {
  icon: typeof Truck;
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <article className="border-t-2 border-primary bg-card p-5 md:p-6">
      <Icon className="size-6 text-primary" />
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <ul className="mt-5 space-y-2 border-t border-border pt-4">
        {items.map((item) => (
          <li key={item} className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="size-4 text-success" />
            {item}
          </li>
        ))}
      </ul>
    </article>
  );
}
