import { AlertTriangle } from "lucide-react";
import { AppButton } from "@/components/shared/app-button";
import { cn } from "@/lib/utils/cn";

export type ErrorStateProps = {
  title: string;
  description?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
};

export function ErrorState({
  title,
  description,
  onRetry,
  retryLabel,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-xl border border-error/30 bg-error-bg px-6 py-10 text-center",
        className,
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-card text-error">
        <AlertTriangle className="size-5" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-error-fg">{title}</h3>
        {description ? (
          <p className="max-w-md text-sm text-error-fg/80">{description}</p>
        ) : null}
      </div>
      {onRetry ? (
        <AppButton variant="secondary" onClick={onRetry}>
          {retryLabel ?? "Retry"}
        </AppButton>
      ) : null}
    </div>
  );
}
