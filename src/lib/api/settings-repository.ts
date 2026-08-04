import type { FavoriteAddress } from "@/types/integrations";
import type {
  InvoiceProfile,
  LocaleThemePrefs,
  NotificationPrefs,
  OrganizationSettings,
  PersonalProfileSettings,
  SavedPaymentMethod,
  SettingsSnapshot,
  TeamMember,
  WorkspaceRole,
} from "@/types/settings";

export interface SettingsRepository {
  getSnapshot(): Promise<SettingsSnapshot>;
  updateProfile(profile: PersonalProfileSettings): Promise<PersonalProfileSettings>;
  updateOrganization(org: OrganizationSettings): Promise<OrganizationSettings>;
  inviteMember(email: string, role: WorkspaceRole): Promise<TeamMember>;
  updateMemberRole(memberId: string, role: WorkspaceRole): Promise<TeamMember>;
  removeMember(memberId: string): Promise<void>;
  saveAddress(address: Omit<FavoriteAddress, "id"> & { id?: string }): Promise<FavoriteAddress>;
  deleteAddress(id: string): Promise<void>;
  listPaymentMethods(): Promise<SavedPaymentMethod[]>;
  removePaymentMethod(id: string): Promise<void>;
  updateInvoice(invoice: InvoiceProfile): Promise<InvoiceProfile>;
  updateNotifications(prefs: NotificationPrefs): Promise<NotificationPrefs>;
  updateLocaleTheme(prefs: LocaleThemePrefs): Promise<LocaleThemePrefs>;
  revokeSession(sessionId: string): Promise<void>;
}
