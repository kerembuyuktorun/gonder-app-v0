import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-md border px-2 py-0.5 text-xs font-medium transition-[color,box-shadow] [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      tone: {
        success: "border-success/20 bg-success-bg text-success-fg",
        warning: "border-warning/20 bg-warning-bg text-warning-fg",
        error: "border-error/20 bg-error-bg text-error-fg",
        info: "border-info/20 bg-info-bg text-info-fg",
        neutral: "border-border/80 bg-neutral-bg text-neutral-fg",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  },
);

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof badgeVariants>;

export function Badge({ className, tone, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props} />
  );
}
