"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import {
  AddressInput,
  AppButton,
  AppCombobox,
  AppDatePicker,
  AppDateTimePicker,
  AppInput,
  AppSelect,
  AppTextarea,
  ChannelBadge,
  ConfirmDialog,
  DetailDrawer,
  EmptyState,
  ErrorState,
  FileUploader,
  FilterBar,
  LoadingSkeleton,
  MoneyDisplay,
  PageHeader,
  PhoneInput,
  PriceSummary,
  ResponsiveFormLayout,
  SearchInput,
  ServiceBadge,
  SidePanel,
  StatusBadge,
  StepIndicator,
  Timeline,
} from "@/components/shared";
import { Link } from "@/lib/i18n/navigation";
import { mockPriceSummary, mockTimeline } from "@/mocks/data/catalog";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4 border-b border-border pb-8 last:border-0">
      <h2 className="text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}

export default function DesignSystemPage() {
  const t = useTranslations();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [city, setCity] = React.useState("istanbul");
  const [service, setService] = React.useState("parcel_1_30");
  const [search, setSearch] = React.useState("");
  const [address, setAddress] = React.useState({
    contactName: "",
    phone: "",
    line1: "",
    line2: "",
    district: "",
    city: "istanbul",
    postalCode: "",
    country: "TR",
  });

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-[90rem] items-center justify-between gap-4 px-4 py-4 md:px-8">
          <Link href="/" className="font-display text-lg font-semibold">
            {t("meta.appName")}
          </Link>
          <div className="flex gap-2">
            <Link href="/customer">
              <AppButton variant="secondary" size="sm">
                {t("nav.customerPanel")}
              </AppButton>
            </Link>
            <Link href="/ops">
              <AppButton size="sm">{t("nav.opsPanel")}</AppButton>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[90rem] space-y-8 px-4 py-8 md:px-8">
        <PageHeader
          title={t("designSystem.title")}
          description={t("designSystem.subtitle")}
        />

        <Section title={t("designSystem.buttons")}>
          <div className="flex flex-wrap gap-3">
            <AppButton>{t("designSystem.primary")}</AppButton>
            <AppButton variant="secondary">
              {t("designSystem.secondary")}
            </AppButton>
            <AppButton variant="ghost">{t("designSystem.ghost")}</AppButton>
            <AppButton variant="destructive">
              {t("designSystem.destructive")}
            </AppButton>
            <AppButton loading>{t("common.loading")}</AppButton>
          </div>
        </Section>

        <Section title={t("designSystem.inputs")}>
          <ResponsiveFormLayout
            sidebar={<PriceSummary summary={mockPriceSummary} />}
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <AppInput label={t("fields.fullName")} placeholder="Ada Lovelace" />
              <PhoneInput label={t("fields.phone")} />
              <AppSelect
                label={t("table.service")}
                placeholder={t("fields.selectPlaceholder")}
                value={service}
                onValueChange={setService}
                options={[
                  { value: "courier", label: t("services.courier") },
                  { value: "parcel_1_30", label: t("services.parcel_1_30") },
                  { value: "ftl", label: t("services.ftl") },
                ]}
              />
              <AppCombobox
                label={t("fields.city")}
                value={city}
                onValueChange={setCity}
                options={[
                  { value: "istanbul", label: "İstanbul" },
                  { value: "ankara", label: "Ankara" },
                  { value: "izmir", label: "İzmir" },
                ]}
              />
              <AppDatePicker label={t("fields.date")} />
              <AppDateTimePicker label={t("fields.dateTime")} />
              <div className="sm:col-span-2">
                <AppTextarea label={t("fields.notes")} rows={3} />
              </div>
              <div className="sm:col-span-2">
                <AddressInput value={address} onChange={setAddress} />
              </div>
              <div className="sm:col-span-2">
                <FileUploader />
              </div>
            </div>
          </ResponsiveFormLayout>
        </Section>

        <Section title={t("designSystem.badges")}>
          <div className="flex flex-wrap gap-2">
            <StatusBadge status="in_transit" />
            <StatusBadge status="delivered" />
            <StatusBadge status="failed" />
            <StatusBadge status="ready" kind="quote" />
            <ServiceBadge type="gonder_xl" />
            <ChannelBadge channel="b2b" />
            <ChannelBadge channel="b2c" />
            <MoneyDisplay value={{ amount: 189.5, currency: "TRY" }} size="lg" />
          </div>
        </Section>

        <Section title={t("designSystem.feedback")}>
          <div className="grid gap-4 lg:grid-cols-2">
            <EmptyState
              title={t("empty.defaultTitle")}
              description={t("empty.defaultDescription")}
              action={
                <AppButton size="sm">{t("common.continue")}</AppButton>
              }
            />
            <ErrorState
              title={t("error.defaultTitle")}
              description={t("error.defaultDescription")}
              retryLabel={t("common.retry")}
              onRetry={() => undefined}
            />
          </div>
          <LoadingSkeleton variant="cards" rows={3} />
        </Section>

        <Section title={t("designSystem.dataDisplay")}>
          <FilterBar
            search={search}
            onSearchChange={setSearch}
            onReset={() => setSearch("")}
          >
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder={t("fields.searchPlaceholder")}
              className="max-w-xs"
            />
          </FilterBar>
          <StepIndicator
            currentStepId="quote"
            steps={[
              { id: "details", label: t("steps.details") },
              { id: "quote", label: t("steps.quote") },
              { id: "payment", label: t("steps.payment") },
              { id: "tracking", label: t("steps.tracking") },
            ]}
          />
          <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
            <div className="rounded-xl border border-border bg-card p-4">
              <Timeline events={mockTimeline} />
            </div>
            <SidePanel title={t("price.summary")}>
              <PriceSummary summary={mockPriceSummary} />
            </SidePanel>
          </div>
        </Section>

        <Section title={t("designSystem.overlays")}>
          <div className="flex flex-wrap gap-3">
            <AppButton onClick={() => setConfirmOpen(true)}>
              {t("common.confirm")}
            </AppButton>
            <AppButton variant="secondary" onClick={() => setDrawerOpen(true)}>
              {t("common.details")}
            </AppButton>
          </div>
          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            onConfirm={() => setConfirmOpen(false)}
          />
          <DetailDrawer
            open={drawerOpen}
            onOpenChange={setDrawerOpen}
            title={t("common.details")}
            description={t("designSystem.subtitle")}
          >
            <Timeline events={mockTimeline} />
          </DetailDrawer>
        </Section>

        <Section title={t("designSystem.tokens")}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {[
              "bg-primary",
              "bg-success",
              "bg-warning",
              "bg-error",
              "bg-info",
              "bg-brand-500",
            ].map((token) => (
              <div key={token} className="space-y-2">
                <div className={`h-14 rounded-lg border border-border ${token}`} />
                <p className="text-xs text-muted-foreground">{token}</p>
              </div>
            ))}
          </div>
        </Section>
      </main>
    </div>
  );
}
