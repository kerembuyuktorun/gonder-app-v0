"use client";

import * as React from "react";
import { Building2, Check, ChevronsUpDown, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils/cn";

export function OrganizationSwitcher() {
  const t = useTranslations("auth");
  const organizations = useAuthStore((s) => s.organizations);
  const session = useAuthStore((s) => s.session);
  const setActiveContext = useAuthStore((s) => s.setActiveContext);
  const activeOrganization = useAuthStore((s) => s.activeOrganization);
  const [open, setOpen] = React.useState(false);
  const org = activeOrganization();

  const label =
    session?.activeContext.type === "individual"
      ? t("individualProfile")
      : (org?.name ?? t("noOrganizations"));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <AppButton
          variant="outline"
          size="sm"
          className="max-w-[10rem] justify-between gap-2 sm:max-w-[14rem]"
          aria-label={t("switchContext")}
        >
          {session?.activeContext.type === "individual" ? (
            <User className="size-4 shrink-0" />
          ) : (
            <Building2 className="size-4 shrink-0" />
          )}
          <span className="truncate">{label}</span>
          <ChevronsUpDown className="size-3.5 opacity-50" />
        </AppButton>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-2" align="start">
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-left text-sm hover:bg-accent touch-target",
            session?.activeContext.type === "individual" && "bg-accent",
          )}
          onClick={async () => {
            await setActiveContext({ type: "individual" });
            setOpen(false);
          }}
        >
          <User className="size-4" />
          <span className="flex-1">{t("individualProfile")}</span>
          {session?.activeContext.type === "individual" ? (
            <Check className="size-4" />
          ) : null}
        </button>
        <div className="my-1 h-px bg-border" />
        {organizations.length === 0 ? (
          <p className="px-2 py-2 text-xs text-muted-foreground">
            {t("noOrganizations")}
          </p>
        ) : (
          organizations.map((organization) => {
            const active =
              session?.activeContext.type === "organization" &&
              session.activeContext.organizationId === organization.id;
            return (
              <button
                key={organization.id}
                type="button"
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-left text-sm hover:bg-accent touch-target",
                  active && "bg-accent",
                )}
                onClick={async () => {
                  await setActiveContext({
                    type: "organization",
                    organizationId: organization.id,
                  });
                  setOpen(false);
                }}
              >
                <Building2 className="size-4" />
                <span className="flex-1 truncate">{organization.name}</span>
                {active ? <Check className="size-4" /> : null}
              </button>
            );
          })
        )}
      </PopoverContent>
    </Popover>
  );
}
