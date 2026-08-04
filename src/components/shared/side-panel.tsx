import { cn } from "@/lib/utils/cn";

export type SidePanelProps = {
  title?: string;
  children: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
};

export function SidePanel({ title, children, className, footer }: SidePanelProps) {
  return (
    <aside
      className={cn(
        "flex h-full w-full flex-col border-l border-border bg-card",
        className,
      )}
      style={{ maxWidth: "var(--panel-width)" }}
    >
      {title ? (
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">{title}</h2>
        </div>
      ) : null}
      <div className="flex-1 overflow-y-auto p-4">{children}</div>
      {footer ? (
        <div className="border-t border-border p-4">{footer}</div>
      ) : null}
    </aside>
  );
}
