"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";

export type FileUploaderProps = {
  accept?: string;
  multiple?: boolean;
  onFilesSelected?: (files: FileList) => void;
  className?: string;
};

export function FileUploader({
  accept,
  multiple,
  onFilesSelected,
  className,
}: FileUploaderProps) {
  const t = useTranslations("fields");
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = React.useState<string[]>([]);

  function handleChange(files: FileList | null) {
    if (!files || files.length === 0) return;
    setFileNames(Array.from(files).map((f) => f.name));
    onFilesSelected?.(files);
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-card px-4 py-8 text-center",
        className,
      )}
    >
      <Upload className="size-6 text-muted-foreground" />
      <div>
        <p className="text-sm font-medium">{t("upload")}</p>
        <p className="text-xs text-muted-foreground">{t("uploadHint")}</p>
      </div>
      <button
        type="button"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline touch-target px-3"
        onClick={() => inputRef.current?.click()}
      >
        {t("upload")}
      </button>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleChange(e.target.files)}
      />
      {fileNames.length > 0 ? (
        <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
          {fileNames.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
