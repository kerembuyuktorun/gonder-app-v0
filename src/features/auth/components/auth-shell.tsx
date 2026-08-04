"use client";

import { cn } from "@/lib/utils/cn";

export function AuthCard({
  title,
  subtitle,
  children,
  footer,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8",
        className,
      )}
    >
      <div className="mb-6 space-y-2">
        <h1 className="font-display text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        {subtitle ? (
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {children}
      {footer ? <div className="mt-6">{footer}</div> : null}
    </div>
  );
}

export function AuthPageFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--gonder-brand-100),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,var(--gonder-brand-800),transparent_55%)]"
      />
      <main id="main-content" className="relative z-10 w-full">
        {children}
      </main>
    </div>
  );
}
