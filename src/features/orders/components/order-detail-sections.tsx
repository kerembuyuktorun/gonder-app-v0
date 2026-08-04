"use client";

import { useLocale, useTranslations } from "next-intl";
import { Timeline } from "@/components/shared/timeline";
import { MoneyDisplay } from "@/components/shared/money-display";
import { ServiceBadge } from "@/components/shared/service-badge";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { OrderMapPanel } from "@/features/orders/components/order-map-panel";
import { DocumentGallery } from "@/features/orders/components/document-gallery";
import { TrackingList } from "@/features/orders/components/tracking-list";
import { OrderMessaging } from "@/features/orders/components/order-messaging";
import {
  CancelOrderForm,
  ReportIssueForm,
} from "@/features/orders/components/issue-cancel-forms";
import { formatDateTime } from "@/lib/utils/format";
import type { OrderDetail } from "@/types/orders";
import { cn } from "@/lib/utils/cn";
import { Link } from "@/lib/i18n/navigation";
import { AppButton } from "@/components/shared/app-button";

function Section({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-3", className)}>
      <h2 className="font-display text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function AddressBlock({
  title,
  party,
  address,
}: {
  title: string;
  party: OrderDetail["sender"];
  address: OrderDetail["pickup"];
}) {
  return (
    <div className="space-y-1 text-sm">
      <p className="font-medium">{title}</p>
      <p>{party.name}{party.company ? ` · ${party.company}` : ""}</p>
      {party.phone ? <p className="text-muted-foreground">{party.phone}</p> : null}
      <p className="text-muted-foreground">
        {address.line1}, {address.district}, {address.city}
      </p>
    </div>
  );
}

export function OrderDetailSections({
  order,
  compact = false,
}: {
  order: OrderDetail;
  compact?: boolean;
}) {
  const t = useTranslations("orders");
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";
  const canCancel =
    order.status !== "delivered" && order.status !== "cancelled";

  return (
    <div className={cn("space-y-8", order.critical && "rounded-xl ring-1 ring-error/40")}>
      <Section title={t("sections.summary")}>
        <div className="flex flex-wrap items-center gap-2">
          <ServiceBadge type={order.serviceType} />
          <OrderStatusBadge status={order.status} critical={order.critical} />
          {order.hasIssue ? (
            <span className="text-xs font-medium text-error-fg">{t("flags.issue")}</span>
          ) : null}
        </div>
        <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">{t("fields.reference")}</dt>
            <dd className="font-medium">{order.reference}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fields.tracking")}</dt>
            <dd className="font-medium">{order.trackingNumber}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fields.route")}</dt>
            <dd>
              {order.originCity} → {order.destinationCity}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fields.updated")}</dt>
            <dd>{formatDateTime(order.updatedAt, intlLocale)}</dd>
          </div>
          {order.provider.rawStatus ? (
            <div className="sm:col-span-2">
              <dt className="text-muted-foreground">{t("fields.providerStatus")}</dt>
              <dd>
                {order.provider.name}:{" "}
                <span className="font-mono text-xs">{order.provider.rawStatus}</span>
                {" → "}
                <OrderStatusBadge status={order.status} />
              </dd>
            </div>
          ) : null}
        </dl>
        {compact ? (
          <Link href={`/app/orders/${order.id}`}>
            <AppButton variant="secondary" size="sm" className="mt-2">
              {t("openFull")}
            </AppButton>
          </Link>
        ) : null}
      </Section>

      <Section title={t("sections.timeline")}>
        <Timeline events={order.timeline} />
      </Section>

      <Section title={t("sections.addresses")}>
        <div className="grid gap-4 sm:grid-cols-2">
          <AddressBlock
            title={t("fields.pickup")}
            party={order.sender}
            address={order.pickup}
          />
          <AddressBlock
            title={t("fields.delivery")}
            party={order.recipient}
            address={order.delivery}
          />
        </div>
      </Section>

      <Section title={t("sections.cargo")}>
        <ul className="divide-y divide-border rounded-xl border border-border">
          {order.cargo.map((line) => (
            <li key={line.id} className="flex justify-between gap-3 px-3 py-2 text-sm">
              <span>
                {line.description} × {line.quantity}
              </span>
              <span className="text-muted-foreground">{line.weightKg} kg</span>
            </li>
          ))}
        </ul>
      </Section>

      <Section title={t("sections.quote")}>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">{t("fields.quoteRef")}</dt>
            <dd>{order.quoteReference ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fields.quoteAmount")}</dt>
            <dd>
              {order.quoteAmount ? (
                <MoneyDisplay value={order.quoteAmount} size="sm" />
              ) : (
                "—"
              )}
            </dd>
          </div>
        </dl>
      </Section>

      <Section title={t("sections.payment")}>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">{t("fields.amount")}</dt>
            <dd>
              <MoneyDisplay value={order.total} size="sm" />
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fields.paymentStatus")}</dt>
            <dd>{t(`payment.${order.paymentStatus}`)}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fields.paymentMethod")}</dt>
            <dd>{order.paymentMethod ?? "—"}</dd>
          </div>
        </dl>
      </Section>

      <Section title={t("sections.provider")}>
        <dl className="grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground">{t("fields.provider")}</dt>
            <dd className="font-medium">{order.provider.name}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fields.vehicle")}</dt>
            <dd>{order.provider.vehicle ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fields.driver")}</dt>
            <dd>{order.provider.driverName ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">{t("fields.driverPhone")}</dt>
            <dd>{order.provider.driverPhone ?? "—"}</dd>
          </div>
        </dl>
      </Section>

      <Section title={t("sections.map")}>
        <OrderMapPanel
          location={order.location}
          origin={order.originCity}
          destination={order.destinationCity}
        />
      </Section>

      <Section title={t("sections.tracking")}>
        <TrackingList events={order.tracking} />
      </Section>

      <Section title={t("sections.documents")}>
        <DocumentGallery documents={order.documents} />
      </Section>

      <Section title={t("sections.messages")}>
        <OrderMessaging orderId={order.id} messages={order.messages} />
      </Section>

      {order.deliveryProof ? (
        <Section title={t("sections.pod")}>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-muted-foreground">{t("fields.receivedBy")}</dt>
              <dd>{order.deliveryProof.receivedBy ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("fields.deliveredAt")}</dt>
              <dd>
                {order.deliveryProof.deliveredAt
                  ? formatDateTime(order.deliveryProof.deliveredAt, intlLocale)
                  : "—"}
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("fields.podPhoto")}</dt>
              <dd>{order.deliveryProof.photoName ?? "—"}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">{t("fields.signature")}</dt>
              <dd>{order.deliveryProof.signatureName ?? "—"}</dd>
            </div>
            {order.deliveryProof.notes ? (
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">{t("fields.notes")}</dt>
                <dd>{order.deliveryProof.notes}</dd>
              </div>
            ) : null}
          </dl>
        </Section>
      ) : null}

      {order.issues.length > 0 ? (
        <Section title={t("sections.openIssues")}>
          <ul className="space-y-2">
            {order.issues.map((iss) => (
              <li
                key={iss.id}
                className="rounded-xl border border-error/30 bg-error-bg/40 px-3 py-2 text-sm"
              >
                <p className="font-medium">
                  {t(`issue.categories.${iss.category}`)} · {t(`issue.status.${iss.status}`)}
                </p>
                <p className="text-muted-foreground">{iss.description}</p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      <Section title={t("sections.reportIssue")}>
        <ReportIssueForm orderId={order.id} />
      </Section>

      {canCancel ? (
        <Section title={t("sections.cancel")}>
          <CancelOrderForm orderId={order.id} />
        </Section>
      ) : order.cancelReason ? (
        <Section title={t("sections.cancel")}>
          <p className="text-sm text-muted-foreground">{order.cancelReason}</p>
          {order.paymentStatus === "refunded" ? (
            <p className="text-sm text-success-fg">{t("cancel.refunded")}</p>
          ) : null}
        </Section>
      ) : null}
    </div>
  );
}
