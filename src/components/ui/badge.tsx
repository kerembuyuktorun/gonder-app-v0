import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      tone: {
        success: "bg-success-bg text-success-fg",
        warning: "bg-warning-bg text-warning-fg",
        error: "bg-error-bg text-error-fg",
        info: "bg-info-bg text-info-fg",
        neutral: "bg-neutral-bg text-neutral-fg",
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
