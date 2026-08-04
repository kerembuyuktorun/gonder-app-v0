"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { AppButton } from "@/components/shared/app-button";
import { ErrorState } from "@/components/shared/error-state";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { Link } from "@/lib/i18n/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useDashboardQuery } from "@/features/dashboard/hooks/use-dashboard-query";
import { AiCommandBar } from "@/features/dashboard/components/ai-command-bar";
import { ServiceCards } from "@/features/dashboard/components/service-cards";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { DashboardWidget } from "@/features/dashboard/components/dashboard-widget";
import {
  ActiveShipmentsList,
  CompletedShipmentsList,
  PaymentList,
  QuoteList,
} from "@/features/dashboard/components/operation-lists";
import { IntegrationStatusList } from "@/features/dashboard/components/integration-status";
import { UsageSummaryCard } from "@/features/dashboard/components/usage-summary";

export default function AppHomePage() {
  const t = useTranslations();
  const user = useAuthStore((s) => s.user);
  const session = useAuthStore((s) => s.session);
  const activeOrganization = useAuthStore((s) => s.activeOrganization);
  const org = activeOrganization();
  const { data, isLoading, isError, refetch, isFetching } = useDashboardQuery();

  const name = data?.greetingName ?? user?.firstName ?? t("meta.appName");
  const orgLabel =
    session?.activeContext.type === "organization"
      ? (data?.contextLabel || org?.name)
      : null;

  const welcomeDescription = orgLabel
    ? t("dashboard.welcomeOrg", { org: orgLabel, name })
    : t("dashboard.welcome", { name });

  if (isLoading && !data) {
    return (
      <div className="mx-auto w-full max-w-[90rem] space-y-6">
        <LoadingSkeleton rows={2} variant="form" />
        <LoadingSkeleton rows={3} variant="cards" />
        <LoadingSkeleton rows={4} />
      </div>
    );
  }

  if (isError && !data) {
    return (
      <div className="mx-auto w-full max-w-[90rem]">
        <ErrorState
          title={t("dashboard.errorTitle")}
          description={t("dashboard.errorDescription")}
          onRetry={() => refetch()}
          retryLabel={t("common.retry")}
        />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="mx-auto w-full max-w-[90rem] space-y-6">
      {/* First viewport: greeting, AI, services, critical ops */}
      <div className="space-y-5 xl:min-h-[calc(100dvh-var(--topbar-height)-4rem)] xl:space-y-6">
        <PageHeader
          title={t("dashboard.title")}
          description={welcomeDescription}
          actions={
            <Link href="/app/requests/new">
              <AppButton>{t("shell.newRequest")}</AppButton>
            </Link>
          }
        />

        <AiCommandBar />

        <ServiceCards services={data.services} />

        <div className="grid gap-4 xl:grid-cols-2">
          <DashboardWidget
            title={t("dashboard.widgets.activeShipments")}
            href="/app/orders?view=active"
            count={data.activeShipments.length}
            isLoading={isFetching && !data.activeShipments.length}
            isError={false}
            isEmpty={data.activeShipments.length === 0}
            emptyTitle={t("dashboard.empty.activeShipments")}
            dense
          >
            <ActiveShipmentsList items={data.activeShipments} />
          </DashboardWidget>

          <DashboardWidget
            title={t("dashboard.widgets.pendingQuotes")}
            href="/app/orders?view=awaiting_quote"
            count={data.pendingQuoteRequests.length}
            isEmpty={data.pendingQuoteRequests.length === 0}
            emptyTitle={t("dashboard.empty.pendingQuotes")}
            dense
          >
            <QuoteList items={data.pendingQuoteRequests} showAmount={false} />
          </DashboardWidget>

          <DashboardWidget
            title={t("dashboard.widgets.awaitingApproval")}
            href="/app/orders?view=awaiting_approval"
            count={data.awaitingUserApproval.length}
            isEmpty={data.awaitingUserApproval.length === 0}
            emptyTitle={t("dashboard.empty.awaitingApproval")}
            dense
          >
            <QuoteList items={data.awaitingUserApproval} />
          </DashboardWidget>

          <DashboardWidget
            title={t("dashboard.widgets.awaitingPayment")}
            href="/app/orders?view=awaiting_payment"
            count={data.awaitingPayment.length}
            isEmpty={data.awaitingPayment.length === 0}
            emptyTitle={t("dashboard.empty.awaitingPayment")}
            dense
          >
            <PaymentList items={data.awaitingPayment} />
          </DashboardWidget>
        </div>
      </div>

      {/* Below first viewport */}
      <QuickActions actions={data.quickActions} />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardWidget
          title={t("dashboard.widgets.completed")}
          href="/app/orders?view=completed"
          count={data.recentlyCompleted.length}
          isEmpty={data.recentlyCompleted.length === 0}
          emptyTitle={t("dashboard.empty.completed")}
          dense
          className="xl:col-span-1 lg:col-span-2"
        >
          <CompletedShipmentsList items={data.recentlyCompleted} />
        </DashboardWidget>

        <DashboardWidget
          title={t("dashboard.widgets.integrations")}
          href="/app/integrations"
          count={data.integrations.length}
          isEmpty={data.integrations.length === 0}
          emptyTitle={t("dashboard.empty.integrations")}
        >
          <IntegrationStatusList items={data.integrations} />
        </DashboardWidget>

        <DashboardWidget title={t("dashboard.widgets.usage")}>
          <UsageSummaryCard usage={data.usage} />
        </DashboardWidget>
      </div>
    </div>
  );
}
