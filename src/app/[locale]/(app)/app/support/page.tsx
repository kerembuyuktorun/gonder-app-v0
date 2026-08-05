"use client";

import { useTranslations } from "next-intl";
import { PageHeader } from "@/components/shared/page-header";
import { PermissionGuard } from "@/lib/auth/guards";
import { AppButton } from "@/components/shared/app-button";
import { Link } from "@/lib/i18n/navigation";
import { LifeBuoy, MessageSquare, BookOpen } from "lucide-react";

export default function SupportPage() {
  const t = useTranslations("supportPage");

  const cards = [
    {
      icon: MessageSquare,
      title: t("chatTitle"),
      body: t("chatBody"),
      href: "/create-with-ai",
      cta: t("chatCta"),
    },
    {
      icon: BookOpen,
      title: t("docsTitle"),
      body: t("docsBody"),
      href: "/orders",
      cta: t("docsCta"),
    },
    {
      icon: LifeBuoy,
      title: t("issueTitle"),
      body: t("issueBody"),
      href: "/orders?view=problematic",
      cta: t("issueCta"),
    },
  ];

  return (
    <PermissionGuard permission="support:access">
      <div className="mx-auto w-full max-w-[90rem] space-y-6">
        <PageHeader title={t("title")} description={t("subtitle")} />
        <div className="grid gap-4 md:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.title}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4"
              >
                <Icon className="size-5 text-primary" aria-hidden />
                <h2 className="font-display text-base font-semibold">{card.title}</h2>
                <p className="flex-1 text-sm text-muted-foreground">{card.body}</p>
                <Link href={card.href}>
                  <AppButton size="sm" variant="secondary" className="w-full">
                    {card.cta}
                  </AppButton>
                </Link>
              </article>
            );
          })}
        </div>
        <p className="text-sm text-muted-foreground">
          {t("contact")}:{" "}
          <a className="text-primary hover:underline" href="mailto:destek@gonder.example">
            destek@gonder.example
          </a>
        </p>
      </div>
    </PermissionGuard>
  );
}
