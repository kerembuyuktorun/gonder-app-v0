"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AppButton } from "@/components/shared/app-button";
import { useTranslations } from "next-intl";

export type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  destructive?: boolean;
  loading?: boolean;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  destructive,
  loading,
}: ConfirmDialogProps) {
  const t = useTranslations();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title ?? t("confirm.title")}</DialogTitle>
          <DialogDescription>
            {description ?? t("confirm.description")}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <AppButton
            variant="secondary"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelLabel ?? t("common.cancel")}
          </AppButton>
          <AppButton
            variant={destructive ? "destructive" : "primary"}
            loading={loading}
            onClick={onConfirm}
          >
            {confirmLabel ?? t("common.confirm")}
          </AppButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
