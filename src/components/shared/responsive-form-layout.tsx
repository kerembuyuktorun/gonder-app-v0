import { cn } from "@/lib/utils/cn";

export type ResponsiveFormLayoutProps = {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
};

/**
 * Two-column form layout on desktop; stacks on tablet/mobile.
 * Prefer for dense B2B forms with sticky summary on the right.
 */
export function ResponsiveFormLayout({
  children,
  sidebar,
  className,
}: ResponsiveFormLayoutProps) {
  return (
    <div
      className={cn(
        "grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(16rem,22rem)] lg:items-start",
        className,
      )}
    >
      <div className="min-w-0 space-y-6">{children}</div>
      {sidebar ? (
        <div className="lg:sticky lg:top-20">{sidebar}</div>
      ) : null}
    </div>
  );
}
