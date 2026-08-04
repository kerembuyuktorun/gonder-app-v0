"use client";

import * as React from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { PageHeader } from "@/components/shared/page-header";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Badge } from "@/components/ui/badge";
import {
  useDeleteAddressMutation,
  useInviteMemberMutation,
  useRemoveMemberMutation,
  useRemovePaymentMethodMutation,
  useRevokeSessionMutation,
  useSettingsSnapshotQuery,
  useUpdateInvoiceMutation,
  useUpdateLocaleThemeMutation,
  useUpdateNotificationsMutation,
  useUpdateOrganizationMutation,
  useUpdateMemberRoleMutation,
  useUpdateProfileMutation,
} from "@/features/settings/hooks/use-settings";
import { useAuthStore } from "@/stores/auth-store";
import type { WorkspaceRole } from "@/types/settings";
import { cn } from "@/lib/utils/cn";
import { OrganizationSwitcher } from "@/components/layout/organization-switcher";

const SECTIONS = [
  "profile",
  "organization",
  "orgSwitch",
  "team",
  "roles",
  "addresses",
  "payments",
  "invoice",
  "notifications",
  "localeTheme",
  "security",
] as const;

type Section = (typeof SECTIONS)[number];

const ROLES: WorkspaceRole[] = [
  "org_admin",
  "ops",
  "finance",
  "requester",
  "viewer",
];

export function SettingsWorkspace() {
  const t = useTranslations("settings");
  const { data, isLoading, isError, refetch } = useSettingsSnapshotQuery();
  const [section, setSection] = React.useState<Section>("profile");
  const setActiveContext = useAuthStore((s) => s.setActiveContext);
  const { setTheme } = useTheme();

  const updateProfile = useUpdateProfileMutation();
  const updateOrg = useUpdateOrganizationMutation();
  const invite = useInviteMemberMutation();
  const updateRole = useUpdateMemberRoleMutation();
  const removeMember = useRemoveMemberMutation();
  const deleteAddress = useDeleteAddressMutation();
  const removePm = useRemovePaymentMethodMutation();
  const updateInvoice = useUpdateInvoiceMutation();
  const updateNotif = useUpdateNotificationsMutation();
  const updateLocale = useUpdateLocaleThemeMutation();
  const revoke = useRevokeSessionMutation();

  const [inviteEmail, setInviteEmail] = React.useState("");
  const [inviteRole, setInviteRole] = React.useState<WorkspaceRole>("requester");

  if (isLoading) return <LoadingSkeleton rows={5} />;
  if (isError || !data) {
    return (
      <ErrorState
        title={t("errorTitle")}
        description={t("errorDescription")}
        onRetry={() => void refetch()}
      />
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-[90rem] flex-col gap-6 lg:flex-row">
      <aside className="w-full shrink-0 lg:w-56">
        <PageHeader title={t("title")} description={t("subtitle")} />
        <nav className="mt-4 flex flex-row gap-1 overflow-x-auto lg:flex-col">
          {SECTIONS.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setSection(id)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-2 text-left text-sm font-medium",
                section === id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              {t(`sections.${id}`)}
            </button>
          ))}
        </nav>
      </aside>

      <div className="min-w-0 flex-1 space-y-4">
        {section === "profile" ? (
          <Panel title={t("sections.profile")}>
            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                void updateProfile.mutateAsync({
                  firstName: String(fd.get("firstName") ?? ""),
                  lastName: String(fd.get("lastName") ?? ""),
                  email: String(fd.get("email") ?? ""),
                  phone: String(fd.get("phone") ?? ""),
                  jobTitle: String(fd.get("jobTitle") ?? ""),
                });
              }}
            >
              <AppInput name="firstName" label={t("fields.firstName")} defaultValue={data.profile.firstName} />
              <AppInput name="lastName" label={t("fields.lastName")} defaultValue={data.profile.lastName} />
              <AppInput name="email" label={t("fields.email")} defaultValue={data.profile.email} />
              <AppInput name="phone" label={t("fields.phone")} defaultValue={data.profile.phone} />
              <AppInput name="jobTitle" label={t("fields.jobTitle")} defaultValue={data.profile.jobTitle ?? ""} containerClassName="sm:col-span-2" />
              <AppButton type="submit" size="sm" className="sm:col-span-2 w-fit" disabled={updateProfile.isPending}>
                {t("save")}
              </AppButton>
            </form>
          </Panel>
        ) : null}

        {section === "organization" ? (
          <Panel title={t("sections.organization")}>
            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                void updateOrg.mutateAsync({
                  id: data.organization.id,
                  name: String(fd.get("name") ?? ""),
                  legalName: String(fd.get("legalName") ?? ""),
                  taxNumber: String(fd.get("taxNumber") ?? ""),
                  taxOffice: String(fd.get("taxOffice") ?? ""),
                  website: String(fd.get("website") ?? ""),
                });
              }}
            >
              <AppInput name="name" label={t("fields.orgName")} defaultValue={data.organization.name} />
              <AppInput name="legalName" label={t("fields.legalName")} defaultValue={data.organization.legalName} />
              <AppInput name="taxNumber" label={t("fields.taxNumber")} defaultValue={data.organization.taxNumber} />
              <AppInput name="taxOffice" label={t("fields.taxOffice")} defaultValue={data.organization.taxOffice} />
              <AppInput name="website" label={t("fields.website")} defaultValue={data.organization.website ?? ""} containerClassName="sm:col-span-2" />
              <AppButton type="submit" size="sm" className="w-fit" disabled={updateOrg.isPending}>
                {t("save")}
              </AppButton>
            </form>
          </Panel>
        ) : null}

        {section === "orgSwitch" ? (
          <Panel title={t("sections.orgSwitch")}>
            <p className="mb-3 text-sm text-muted-foreground">{t("orgSwitchHint")}</p>
            <OrganizationSwitcher />
            <div className="mt-4 flex flex-wrap gap-2">
              <AppButton
                size="sm"
                variant="secondary"
                onClick={() => void setActiveContext({ type: "individual" })}
              >
                {t("switchIndividual")}
              </AppButton>
              <AppButton
                size="sm"
                variant="secondary"
                onClick={() =>
                  void setActiveContext({
                    type: "organization",
                    organizationId: data.organization.id,
                  })
                }
              >
                {t("switchOrg")}
              </AppButton>
            </div>
          </Panel>
        ) : null}

        {section === "team" || section === "roles" ? (
          <Panel title={t("sections.team")}>
            <ul className="divide-y divide-border">
              {data.members.map((m) => (
                <li
                  key={m.id}
                  className="flex flex-wrap items-center justify-between gap-2 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.email}</p>
                    <Badge tone={m.status === "active" ? "success" : "warning"} className="mt-1">
                      {t(`memberStatus.${m.status}`)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      className="h-9 rounded-lg border border-border bg-background px-2 text-sm"
                      value={m.role}
                      onChange={(e) =>
                        void updateRole.mutateAsync({
                          memberId: m.id,
                          role: e.target.value as WorkspaceRole,
                        })
                      }
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {t(`roles.${r}`)}
                        </option>
                      ))}
                    </select>
                    <AppButton
                      size="sm"
                      variant="ghost"
                      onClick={() => void removeMember.mutateAsync(m.id)}
                    >
                      {t("remove")}
                    </AppButton>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-col gap-2 border-t border-border pt-3 sm:flex-row">
              <AppInput
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder={t("inviteEmail")}
                containerClassName="flex-1"
              />
              <select
                className="h-11 rounded-lg border border-border bg-background px-2 text-sm"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as WorkspaceRole)}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {t(`roles.${r}`)}
                  </option>
                ))}
              </select>
              <AppButton
                size="sm"
                disabled={!inviteEmail.includes("@") || invite.isPending}
                onClick={async () => {
                  await invite.mutateAsync({
                    email: inviteEmail.trim(),
                    role: inviteRole,
                  });
                  setInviteEmail("");
                }}
              >
                {t("invite")}
              </AppButton>
            </div>
            {section === "roles" ? (
              <div className="mt-4 space-y-2 rounded-lg bg-muted/40 p-3 text-sm">
                <p className="font-medium">{t("rolesHelpTitle")}</p>
                {ROLES.map((r) => (
                  <p key={r} className="text-muted-foreground">
                    <strong>{t(`roles.${r}`)}</strong> — {t(`rolesDesc.${r}`)}
                  </p>
                ))}
              </div>
            ) : null}
          </Panel>
        ) : null}

        {section === "addresses" ? (
          <Panel title={t("sections.addresses")}>
            <ul className="space-y-3">
              {data.addresses.map((a) => (
                <li
                  key={a.id}
                  className="flex flex-wrap items-start justify-between gap-2 rounded-lg border border-border p-3 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {a.label}
                      {a.isDefault ? ` · ${t("default")}` : ""}
                    </p>
                    <p className="text-muted-foreground">
                      {a.contactName} · {a.line1}, {a.district}, {a.city}
                    </p>
                  </div>
                  <AppButton
                    size="sm"
                    variant="ghost"
                    onClick={() => void deleteAddress.mutateAsync(a.id)}
                  >
                    {t("remove")}
                  </AppButton>
                </li>
              ))}
            </ul>
          </Panel>
        ) : null}

        {section === "payments" ? (
          <Panel title={t("sections.payments")}>
            <ul className="space-y-2">
              {data.paymentMethods.map((pm) => (
                <li
                  key={pm.id}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <span>
                    {pm.brand} ···· {pm.last4}
                    {pm.isDefault ? ` · ${t("default")}` : ""}
                    <span className="ml-2 text-muted-foreground">
                      {pm.expMonth}/{pm.expYear}
                    </span>
                  </span>
                  <AppButton
                    size="sm"
                    variant="ghost"
                    onClick={() => void removePm.mutateAsync(pm.id)}
                  >
                    {t("remove")}
                  </AppButton>
                </li>
              ))}
            </ul>
          </Panel>
        ) : null}

        {section === "invoice" ? (
          <Panel title={t("sections.invoice")}>
            <form
              className="grid gap-3 sm:grid-cols-2"
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                void updateInvoice.mutateAsync({
                  legalName: String(fd.get("legalName") ?? ""),
                  taxNumber: String(fd.get("taxNumber") ?? ""),
                  taxOffice: String(fd.get("taxOffice") ?? ""),
                  address: String(fd.get("address") ?? ""),
                  email: String(fd.get("email") ?? ""),
                });
              }}
            >
              <AppInput name="legalName" label={t("fields.legalName")} defaultValue={data.invoice.legalName} />
              <AppInput name="taxNumber" label={t("fields.taxNumber")} defaultValue={data.invoice.taxNumber} />
              <AppInput name="taxOffice" label={t("fields.taxOffice")} defaultValue={data.invoice.taxOffice} />
              <AppInput name="email" label={t("fields.invoiceEmail")} defaultValue={data.invoice.email} />
              <AppInput name="address" label={t("fields.invoiceAddress")} defaultValue={data.invoice.address} containerClassName="sm:col-span-2" />
              <AppButton type="submit" size="sm" className="w-fit" disabled={updateInvoice.isPending}>
                {t("save")}
              </AppButton>
            </form>
          </Panel>
        ) : null}

        {section === "notifications" ? (
          <Panel title={t("sections.notifications")}>
            <div className="space-y-2">
              {(
                [
                  "emailOrderUpdates",
                  "emailQuotes",
                  "emailBilling",
                  "pushCritical",
                  "smsDelivery",
                  "whatsappOps",
                ] as const
              ).map((key) => (
                <label key={key} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={data.notifications[key]}
                    onChange={(e) =>
                      void updateNotif.mutateAsync({
                        ...data.notifications,
                        [key]: e.target.checked,
                      })
                    }
                  />
                  {t(`notif.${key}`)}
                </label>
              ))}
            </div>
          </Panel>
        ) : null}

        {section === "localeTheme" ? (
          <Panel title={t("sections.localeTheme")}>
            <div className="flex flex-wrap gap-4">
              <label className="text-sm">
                {t("fields.locale")}
                <select
                  className="ml-2 h-9 rounded-lg border border-border bg-background px-2"
                  value={data.localeTheme.locale}
                  onChange={(e) =>
                    void updateLocale.mutateAsync({
                      ...data.localeTheme,
                      locale: e.target.value as "tr" | "en",
                    })
                  }
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                </select>
              </label>
              <label className="text-sm">
                {t("fields.theme")}
                <select
                  className="ml-2 h-9 rounded-lg border border-border bg-background px-2"
                  value={data.localeTheme.theme}
                  onChange={(e) => {
                    const theme = e.target.value as "light" | "dark" | "system";
                    void updateLocale.mutateAsync({
                      ...data.localeTheme,
                      theme,
                    });
                    setTheme(theme);
                  }}
                >
                  <option value="system">{t("theme.system")}</option>
                  <option value="light">{t("theme.light")}</option>
                  <option value="dark">{t("theme.dark")}</option>
                </select>
              </label>
            </div>
          </Panel>
        ) : null}

        {section === "security" ? (
          <Panel title={t("sections.security")}>
            <ul className="space-y-2">
              {data.sessions.map((s) => (
                <li
                  key={s.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {s.device}
                      {s.current ? ` · ${t("currentSession")}` : ""}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {s.location} · {new Date(s.lastActiveAt).toLocaleString()}
                    </p>
                  </div>
                  {!s.current ? (
                    <AppButton
                      size="sm"
                      variant="ghost"
                      onClick={() => void revoke.mutateAsync(s.id)}
                    >
                      {t("revoke")}
                    </AppButton>
                  ) : null}
                </li>
              ))}
            </ul>
          </Panel>
        ) : null}
      </div>
    </div>
  );
}

function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-4">
      <h2 className="mb-4 font-display text-base font-semibold">{title}</h2>
      {children}
    </section>
  );
}
