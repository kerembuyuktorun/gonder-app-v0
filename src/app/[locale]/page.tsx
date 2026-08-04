import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return {
    title: `${t("appName")} · ${t("tagline")}`,
    description: t("tagline"),
  };
}

export default async function MarketingHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="relative min-h-dvh overflow-hidden bg-background">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,var(--gonder-brand-100),transparent_55%),radial-gradient(ellipse_at_bottom_right,var(--gonder-brand-50),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top_left,var(--gonder-brand-800),transparent_55%),radial-gradient(ellipse_at_bottom_right,var(--gonder-brand-950),transparent_50%)]"
      />
      <header className="relative z-10 mx-auto flex w-full max-w-[90rem] items-center justify-between px-4 py-5 md:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
            G
          </span>
          <div>
            <p className="font-display text-xl font-semibold leading-none">
              {t("meta.appName")}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("meta.operatedBy")}
            </p>
          </div>
        </div>
        <nav className="flex items-center gap-2">
          <Link
            href="/design-system"
            className="hidden h-11 items-center rounded-lg px-3 text-sm font-medium hover:bg-accent sm:inline-flex"
          >
            {t("nav.designSystem")}
          </Link>
          <Link href="/welcome">
            <AppButton size="sm">{t("auth.signIn")}</AppButton>
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[90rem] flex-col gap-10 px-4 pb-16 pt-10 md:px-8 md:pt-20">
        <section className="max-w-3xl space-y-5">
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-brand-500">
            {t("meta.tagline")}
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            {t("home.title")}
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground md:text-lg">
            {t("home.subtitle")}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/splash">
              <AppButton size="lg">{t("auth.signIn")}</AppButton>
            </Link>
            <Link href="/welcome">
              <AppButton size="lg" variant="secondary">
                {t("auth.welcomeTitle")}
              </AppButton>
            </Link>
            <Link href="/design-system">
              <AppButton size="lg" variant="ghost">
                {t("home.ctaDesign")}
              </AppButton>
            </Link>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              "courier",
              "parcel_1_30",
              "gonder_xl",
              "ftl",
              "ltl",
              "spot",
            ] as const
          ).map((key) => (
            <article
              key={key}
              className="rounded-xl border border-border bg-card/80 p-5"
            >
              <h2 className="text-base font-semibold">{t(`services.${key}`)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {t(
                  `services.${
                    key === "parcel_1_30"
                      ? "parcelDesc"
                      : key === "gonder_xl"
                        ? "xlDesc"
                        : `${key}Desc`
                  }`,
                )}
              </p>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
