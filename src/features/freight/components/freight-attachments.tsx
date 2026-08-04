"use client";

import * as React from "react";
import { FileText, ImageIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import type { FreightAttachment } from "@/types/freight";

function DropZone({
  label,
  hint,
  accept,
  kind,
  onAdd,
}: {
  label: string;
  hint: string;
  accept: string;
  kind: "photo" | "document";
  onAdd: (files: FileList, kind: "photo" | "document") => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);
  const Icon = kind === "photo" ? ImageIcon : FileText;

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-6 text-center",
        dragging ? "border-primary bg-primary/5" : "border-border bg-card",
      )}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files.length) onAdd(e.dataTransfer.files, kind);
      }}
    >
      <Icon className="size-5 text-muted-foreground" />
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
      <button
        type="button"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
        onClick={() => inputRef.current?.click()}
      >
        {label}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) onAdd(e.target.files, kind);
        }}
      />
    </div>
  );
}

export function FreightAttachments({
  attachments,
  onAdd,
  onRemove,
}: {
  attachments: FreightAttachment[];
  onAdd: (files: FileList, kind: "photo" | "document") => void;
  onRemove: (id: string) => void;
}) {
  const t = useTranslations("freight");
  const photos = attachments.filter((a) => a.kind === "photo");
  const docs = attachments.filter((a) => a.kind === "document");

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <DropZone
          label={t("uploadPhotos")}
          hint={t("uploadPhotosHint")}
          accept="image/*"
          kind="photo"
          onAdd={onAdd}
        />
        <DropZone
          label={t("uploadDocs")}
          hint={t("uploadDocsHint")}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg"
          kind="document"
          onAdd={onAdd}
        />
      </div>
      {(photos.length > 0 || docs.length > 0) && (
        <div className="grid gap-3 md:grid-cols-2">
          <AttachmentList
            title={t("photos")}
            items={photos}
            onRemove={onRemove}
          />
          <AttachmentList
            title={t("documents")}
            items={docs}
            onRemove={onRemove}
          />
        </div>
      )}
    </div>
  );
}

function AttachmentList({
  title,
  items,
  onRemove,
}: {
  title: string;
  items: FreightAttachment[];
  onRemove: (id: string) => void;
}) {
  const t = useTranslations("freight");
  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-muted/20 px-3 py-4 text-sm text-muted-foreground">
        {title}: —
      </div>
    );
  }
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">{title}</p>
      <ul className="space-y-1">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
          >
            <span className="min-w-0 truncate">
              {item.name}{" "}
              <span className="text-xs text-muted-foreground">
                {item.sizeLabel}
              </span>
            </span>
            <button
              type="button"
              className="rounded p-1 text-muted-foreground hover:bg-accent"
              onClick={() => onRemove(item.id)}
              aria-label={t("remove")}
            >
              <X className="size-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
