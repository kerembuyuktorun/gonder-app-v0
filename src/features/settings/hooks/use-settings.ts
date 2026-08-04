"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { settingsRepository } from "@/lib/api/client";
import type { FavoriteAddress } from "@/types/integrations";
import type {
  InvoiceProfile,
  LocaleThemePrefs,
  NotificationPrefs,
  OrganizationSettings,
  PersonalProfileSettings,
  WorkspaceRole,
} from "@/types/settings";

export const settingsKeys = {
  snapshot: ["settings", "snapshot"] as const,
};

export function useSettingsSnapshotQuery() {
  return useQuery({
    queryKey: settingsKeys.snapshot,
    queryFn: () => settingsRepository.getSnapshot(),
  });
}

export function useUpdateProfileMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (profile: PersonalProfileSettings) =>
      settingsRepository.updateProfile(profile),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingsKeys.snapshot }),
  });
}

export function useUpdateOrganizationMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (org: OrganizationSettings) =>
      settingsRepository.updateOrganization(org),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingsKeys.snapshot }),
  });
}

export function useInviteMemberMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: WorkspaceRole }) =>
      settingsRepository.inviteMember(email, role),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingsKeys.snapshot }),
  });
}

export function useUpdateMemberRoleMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ memberId, role }: { memberId: string; role: WorkspaceRole }) =>
      settingsRepository.updateMemberRole(memberId, role),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingsKeys.snapshot }),
  });
}

export function useRemoveMemberMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsRepository.removeMember(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingsKeys.snapshot }),
  });
}

export function useSaveAddressMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (address: Omit<FavoriteAddress, "id"> & { id?: string }) =>
      settingsRepository.saveAddress(address),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingsKeys.snapshot }),
  });
}

export function useDeleteAddressMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsRepository.deleteAddress(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingsKeys.snapshot }),
  });
}

export function useRemovePaymentMethodMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsRepository.removePaymentMethod(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingsKeys.snapshot }),
  });
}

export function useUpdateInvoiceMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (invoice: InvoiceProfile) =>
      settingsRepository.updateInvoice(invoice),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingsKeys.snapshot }),
  });
}

export function useUpdateNotificationsMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (prefs: NotificationPrefs) =>
      settingsRepository.updateNotifications(prefs),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingsKeys.snapshot }),
  });
}

export function useUpdateLocaleThemeMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (prefs: LocaleThemePrefs) =>
      settingsRepository.updateLocaleTheme(prefs),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingsKeys.snapshot }),
  });
}

export function useRevokeSessionMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => settingsRepository.revokeSession(id),
    onSuccess: () => void qc.invalidateQueries({ queryKey: settingsKeys.snapshot }),
  });
}
