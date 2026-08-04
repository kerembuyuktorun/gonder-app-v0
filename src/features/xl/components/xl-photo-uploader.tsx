"use client";

import * as React from "react";
import { Upload, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import type { XlPhoto } from "@/types/xl";

export function XlPhotoUploader({
  photos,
  onAdd,
  onRemove,
}: {
  photos: XlPhoto[];
  onAdd: (files: FileList) => void;
  onRemove: (id: string) => void;
}) {
  const t = useTranslations("xl");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  function handleFiles(files: FileList | null) {
    if (files && files.length > 0) onAdd(files);
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-4 py-8 text-center transition-colors",
          dragging
            ? "border-primary bg-primary/5"
            : "border-border bg-card",
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
      >
        <Upload className="size-6 text-muted-foreground" />
        <p className="text-sm font-medium">{t("photosTitle")}</p>
        <p className="text-xs text-muted-foreground">{t("photosHint")}</p>
        <button
          type="button"
          className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          onClick={() => inputRef.current?.click()}
        >
          {t("browsePhotos")}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {photos.length > 0 ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {photos.map((photo) => (
            <li
              key={photo.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm"
            >
              <span className="min-w-0 truncate">
                <span className="font-medium">{photo.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {photo.sizeLabel}
                </span>
              </span>
              <button
                type="button"
                className="rounded p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
                onClick={() => onRemove(photo.id)}
                aria-label={t("remove")}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
