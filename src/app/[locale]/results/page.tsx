import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SearchResults } from "@/features/request-engine/components/search-results";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "redesign.results" });
  return { title: t("title"), description: t("subtitle") };
}

export default function ResultsPage() {
  return <SearchResults />;
}
