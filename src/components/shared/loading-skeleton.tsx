import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils/cn";

export type LoadingSkeletonProps = {
  rows?: number;
  className?: string;
  variant?: "table" | "cards" | "form";
};

export function LoadingSkeleton({
  rows = 4,
  className,
  variant = "table",
}: LoadingSkeletonProps) {
  if (variant === "cards") {
    return (
      <div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl border border-border p-4">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 w-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={cn("space-y-2 rounded-xl border border-border p-4", className)}>
      <Skeleton className="h-10 w-full" />
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}
