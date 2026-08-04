import { getTranslations, setRequestLocale } from "next-intl/server";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";

export default async function CustomerShipmentsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();

  return (
    <div className="mx-auto w-full max-w-[90rem] space-y-6">
      <PageHeader title={t("nav.shipments")} />
      <EmptyState
        title={t("customer.emptyTitle")}
        description={t("customer.emptyDescription")}
      />
    </div>
  );
}
