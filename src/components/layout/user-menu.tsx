"use client";

import * as React from "react";
import { LogOut, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "@/lib/i18n/navigation";

export function UserMenu() {
  const t = useTranslations("auth");
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const initials =
    `${user?.firstName?.[0] ?? ""}${user?.lastName?.[0] ?? ""}`.toUpperCase() ||
    "G";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <AppButton
          variant="ghost"
          size="icon"
          aria-label={t("account")}
          className="rounded-full"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-800 dark:bg-brand-800 dark:text-brand-100">
            {initials}
          </span>
        </AppButton>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="end">
        <div className="px-2 py-2">
          <p className="truncate text-sm font-medium">
            {user?.firstName} {user?.lastName}
          </p>
          <p className="truncate text-xs text-muted-foreground">
            {user?.email ?? user?.phone}
          </p>
        </div>
        <div className="my-1 h-px bg-border" />
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-sm hover:bg-accent touch-target"
          onClick={() => {
            setOpen(false);
            router.push("/app/settings");
          }}
        >
          <UserRound className="size-4" />
          {t("profile")}
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-md px-2 py-2.5 text-sm hover:bg-accent touch-target"
          onClick={async () => {
            setOpen(false);
            await signOut();
            router.replace("/welcome");
          }}
        >
          <LogOut className="size-4" />
          {t("signOut")}
        </button>
      </PopoverContent>
    </Popover>
  );
}
