import { cn } from "@/lib/utils/cn";

export type StepItem = {
  id: string;
  label: string;
};

export type StepIndicatorProps = {
  steps: StepItem[];
  currentStepId: string;
  className?: string;
};

export function StepIndicator({
  steps,
  currentStepId,
  className,
}: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStepId);

  return (
    <ol
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-2",
        className,
      )}
    >
      {steps.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step.id} className="flex items-center gap-2 sm:flex-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "flex size-8 items-center justify-center rounded-full text-xs font-semibold",
                  done && "bg-success text-white",
                  active && "bg-primary text-primary-foreground",
                  !done && !active && "bg-muted text-muted-foreground",
                )}
              >
                {index + 1}
              </span>
              <span
                className={cn(
                  "text-sm",
                  active ? "font-semibold text-foreground" : "text-muted-foreground",
                )}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 ? (
              <span className="mx-2 hidden h-px flex-1 bg-border sm:block" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
