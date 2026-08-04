"use client";

import { useLocale, useTranslations } from "next-intl";
import { FileText, Image as ImageIcon } from "lucide-react";
import { formatDateTime } from "@/lib/utils/format";
import type { OrderDocument, OrderDocumentType } from "@/types/orders";
import { cn } from "@/lib/utils/cn";

const IMAGE_TYPES: OrderDocumentType[] = [
  "cargo_photo",
  "delivery_photo",
  "signature",
  "barcode",
];

export function DocumentGallery({
  documents,
  className,
}: {
  documents: OrderDocument[];
  className?: string;
}) {
  const t = useTranslations("orders.documents");
  const locale = useLocale();
  const intlLocale = locale === "tr" ? "tr-TR" : "en-US";

  if (!documents.length) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <ul className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {documents.map((doc) => {
        const isImage = IMAGE_TYPES.includes(doc.type);
        return (
          <li
            key={doc.id}
            className="flex flex-col overflow-hidden rounded-xl border border-border bg-card"
          >
            <div
              className={cn(
                "flex h-28 items-center justify-center",
                isImage
                  ? "bg-[linear-gradient(135deg,var(--color-muted),var(--color-info-bg))]"
                  : "bg-muted",
              )}
            >
              {isImage ? (
                <ImageIcon className="size-8 text-muted-foreground" />
              ) : (
                <FileText className="size-8 text-muted-foreground" />
              )}
            </div>
            <div className="space-y-1 p-3">
              <p className="truncate text-sm font-medium">{doc.name}</p>
              <p className="text-xs text-muted-foreground">{t(`types.${doc.type}`)}</p>
              <p className="text-xs text-muted-foreground">
                {formatDateTime(doc.createdAt, intlLocale)}
              </p>
              <a
                href={doc.url}
                className="inline-block text-xs font-medium text-primary hover:underline"
              >
                {t("open")}
              </a>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
