import type { SettingsRepository } from "@/lib/api/settings-repository";
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
import { MOCK_FAVORITE_ADDRESSES } from "@/mocks/data/integrations";
import { withMockLatency } from "@/mocks/repositories/helpers";

let idSeq = 8000;
function nextId(prefix: string) {
  idSeq += 1;
  return `${prefix}_${idSeq}`;
}

function hoursAgo(h: number) {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

const INITIAL: SettingsSnapshot = {
  profile: {
    firstName: "Ayşe",
    lastName: "Yılmaz",
    email: "ayse@example.com",
    phone: "+905551112233",
    jobTitle: "Operasyon Müdürü",
  },
  organization: {
    id: "org-arf-demo",
    name: "Arf Demo",
    legalName: "Arf Lojistik A.Ş.",
    taxNumber: "1234567890",
    taxOffice: "Kadıköy",
    website: "https://arf.example",
  },
  members: [
    {
      id: "tm_1",
      name: "Ayşe Yılmaz",
      email: "ayse@example.com",
      role: "org_admin",
      status: "active",
      lastActiveAt: hoursAgo(1),
    },
    {
      id: "tm_2",
      name: "Can Ops",
      email: "can@example.com",
      role: "ops",
      status: "active",
      lastActiveAt: hoursAgo(5),
    },
    {
      id: "tm_3",
      name: "Fatma Finans",
      email: "fatma@example.com",
      role: "finance",
      status: "active",
      lastActiveAt: hoursAgo(24),
    },
    {
      id: "tm_4",
      name: "Deniz Sipariş",
      email: "deniz@example.com",
      role: "requester",
      status: "invited",
    },
    {
      id: "tm_5",
      name: "Viewer Veli",
      email: "veli@example.com",
      role: "viewer",
      status: "active",
      lastActiveAt: hoursAgo(48),
    },
  ],
  addresses: structuredClone(MOCK_FAVORITE_ADDRESSES),
  paymentMethods: [
    {
      id: "pm_1",
      brand: "Visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2028,
      isDefault: true,
    },
    {
      id: "pm_2",
      brand: "Mastercard",
      last4: "4444",
      expMonth: 6,
      expYear: 2027,
    },
  ],
  invoice: {
    legalName: "Arf Lojistik A.Ş.",
    taxNumber: "1234567890",
    taxOffice: "Kadıköy",
    address: "Moda Cad. No:12 Kadıköy / İstanbul",
    email: "muhasebe@arf.example",
  },
  notifications: {
    emailOrderUpdates: true,
    emailQuotes: true,
    emailBilling: true,
    pushCritical: true,
    smsDelivery: false,
    whatsappOps: true,
  },
  localeTheme: {
    locale: "tr",
    theme: "system",
  },
  sessions: [
    {
      id: "sess_1",
      device: "Chrome · macOS",
      location: "İstanbul",
      lastActiveAt: hoursAgo(0.2),
      current: true,
    },
    {
      id: "sess_2",
      device: "Safari · iPhone",
      location: "Ankara",
      lastActiveAt: hoursAgo(30),
    },
  ],
};

export class MockSettingsRepository implements SettingsRepository {
  private data = structuredClone(INITIAL);

  async getSnapshot(): Promise<SettingsSnapshot> {
    return withMockLatency(structuredClone(this.data));
  }

  async updateProfile(profile: PersonalProfileSettings) {
    this.data.profile = { ...profile };
    return withMockLatency(structuredClone(this.data.profile), 250);
  }

  async updateOrganization(org: OrganizationSettings) {
    this.data.organization = { ...org };
    return withMockLatency(structuredClone(this.data.organization), 250);
  }

  async inviteMember(email: string, role: WorkspaceRole): Promise<TeamMember> {
    const member: TeamMember = {
      id: nextId("tm"),
      name: email.split("@")[0] ?? email,
      email,
      role,
      status: "invited",
    };
    this.data.members.push(member);
    return withMockLatency(member, 300);
  }

  async updateMemberRole(memberId: string, role: WorkspaceRole) {
    const m = this.data.members.find((x) => x.id === memberId);
    if (!m) throw new Error("Üye bulunamadı");
    m.role = role;
    return withMockLatency(structuredClone(m), 200);
  }

  async removeMember(memberId: string): Promise<void> {
    this.data.members = this.data.members.filter((m) => m.id !== memberId);
    await withMockLatency(undefined, 150);
  }

  async saveAddress(
    address: Omit<FavoriteAddress, "id"> & { id?: string },
  ): Promise<FavoriteAddress> {
    if (address.id) {
      const idx = this.data.addresses.findIndex((a) => a.id === address.id);
      if (idx >= 0) {
        this.data.addresses[idx] = { ...this.data.addresses[idx], ...address, id: address.id };
        return withMockLatency(structuredClone(this.data.addresses[idx]), 200);
      }
    }
    const saved: FavoriteAddress = {
      ...address,
      id: nextId("addr"),
    };
    this.data.addresses.push(saved);
    return withMockLatency(saved, 200);
  }

  async deleteAddress(id: string): Promise<void> {
    this.data.addresses = this.data.addresses.filter((a) => a.id !== id);
    await withMockLatency(undefined, 150);
  }

  async listPaymentMethods(): Promise<SavedPaymentMethod[]> {
    return withMockLatency(structuredClone(this.data.paymentMethods));
  }

  async removePaymentMethod(id: string): Promise<void> {
    this.data.paymentMethods = this.data.paymentMethods.filter((p) => p.id !== id);
    await withMockLatency(undefined, 150);
  }

  async updateInvoice(invoice: InvoiceProfile) {
    this.data.invoice = { ...invoice };
    return withMockLatency(structuredClone(this.data.invoice), 200);
  }

  async updateNotifications(prefs: NotificationPrefs) {
    this.data.notifications = { ...prefs };
    return withMockLatency(structuredClone(this.data.notifications), 200);
  }

  async updateLocaleTheme(prefs: LocaleThemePrefs) {
    this.data.localeTheme = { ...prefs };
    return withMockLatency(structuredClone(this.data.localeTheme), 150);
  }

  async revokeSession(sessionId: string): Promise<void> {
    this.data.sessions = this.data.sessions.filter(
      (s) => s.id !== sessionId || s.current,
    );
    await withMockLatency(undefined, 150);
  }

  _reset() {
    this.data = structuredClone(INITIAL);
  }
}

export const mockSettingsRepository = new MockSettingsRepository();
