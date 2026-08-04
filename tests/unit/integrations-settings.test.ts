import { describe, expect, it, beforeEach } from "vitest";
import { mockIntegrationsRepository } from "@/mocks/repositories/mock-integrations-repository";
import { mockSettingsRepository } from "@/mocks/repositories/mock-settings-repository";
import { WORKSPACE_ROLE_PERMISSIONS } from "@/types/settings";

describe("mock integrations repository", () => {
  beforeEach(() => {
    mockIntegrationsRepository._reset();
  });

  it("lists providers across categories and connections", async () => {
    const providers = await mockIntegrationsRepository.listProviders();
    expect(providers.length).toBeGreaterThanOrEqual(10);
    expect(providers.some((p) => p.name === "Shopify")).toBe(true);
    expect(providers.some((p) => p.category === "marketplace")).toBe(true);

    const connections = await mockIntegrationsRepository.listConnections();
    expect(connections.some((c) => c.status === "connected")).toBe(true);
    expect(connections.some((c) => c.status === "sync_error")).toBe(true);
  });

  it("connects and retries sync", async () => {
    const detail = await mockIntegrationsRepository.getDetail("prov_ikas");
    expect(detail?.connection).toBeUndefined();

    const conn = await mockIntegrationsRepository.connect({
      providerId: "prov_ikas",
      storeName: "İkas Demo",
    });
    expect(conn.status).toBe("connected");
    expect(conn.storeName).toBe("İkas Demo");

    const errored = (await mockIntegrationsRepository.listConnections()).find(
      (c) => c.status === "sync_error",
    );
    expect(errored).toBeTruthy();
    const retried = await mockIntegrationsRepository.retrySync(errored!.id);
    expect(retried.status).toBe("connected");
  });

  it("runs excel import mapping validation fix and bulk quotes", async () => {
    const job = await mockIntegrationsRepository.startExcelImport({
      fileName: "test.xlsx",
    });
    const sheets = await mockIntegrationsRepository.listSheets(job.id);
    expect(sheets[0].headers.length).toBeGreaterThan(0);

    const mapping = Object.fromEntries(
      sheets[0].headers.map((h) => [
        h,
        mockIntegrationsRepository._suggestMapping(h),
      ]),
    );

    const validated = await mockIntegrationsRepository.applyMapping({
      jobId: job.id,
      sheetName: sheets[0].name,
      mapping,
    });
    expect(validated.status).toBe("validated");
    expect(validated.errorRows).toBeGreaterThan(0);

    const bad = validated.rows.find((r) => r.errors.length > 0)!;
    const fixed = await mockIntegrationsRepository.fixRow({
      jobId: job.id,
      rowIndex: bad.rowIndex,
      values: {
        recipientName: "Düzeltilmiş",
        city: "İstanbul",
        address: "Test Cad. 1",
      },
    });
    expect(
      fixed.rows.find((r) => r.rowIndex === bad.rowIndex)?.errors.length,
    ).toBe(0);

    const imported = await mockIntegrationsRepository.importValidRows(job.id);
    expect(imported.status).toBe("completed");
    expect(imported.importedCount).toBeGreaterThan(0);

    const quoted = await mockIntegrationsRepository.requestBulkQuotes(job.id);
    expect(quoted.quotesRequested).toBe(imported.importedCount);
  });

  it("manages shipment templates and copy previous", async () => {
    const tpl = await mockIntegrationsRepository.saveTemplate({
      name: "Test şablon",
      serviceType: "courier",
      originLabel: "A",
      destinationLabel: "B",
    });
    expect(tpl.id).toBeTruthy();
    const list = await mockIntegrationsRepository.listTemplates();
    expect(list.some((t) => t.name === "Test şablon")).toBe(true);

    const copy = await mockIntegrationsRepository.copyPreviousShipment("ord_1");
    expect(copy.draftId).toBeTruthy();
  });
});

describe("mock settings repository", () => {
  beforeEach(() => {
    mockSettingsRepository._reset();
  });

  it("loads snapshot and updates profile / org", async () => {
    const snap = await mockSettingsRepository.getSnapshot();
    expect(snap.members.length).toBeGreaterThanOrEqual(5);
    expect(snap.organization.id).toBe("org-arf-demo");

    const profile = await mockSettingsRepository.updateProfile({
      ...snap.profile,
      firstName: "Aylin",
    });
    expect(profile.firstName).toBe("Aylin");
  });

  it("invites members and maps workspace roles to permissions", async () => {
    const member = await mockSettingsRepository.inviteMember(
      "yeni@example.com",
      "finance",
    );
    expect(member.status).toBe("invited");
    expect(WORKSPACE_ROLE_PERMISSIONS.finance).toContain("reports:read");
    expect(WORKSPACE_ROLE_PERMISSIONS.org_admin).toContain("org:manage");

    await mockSettingsRepository.updateMemberRole(member.id, "viewer");
    const snap = await mockSettingsRepository.getSnapshot();
    expect(snap.members.find((m) => m.id === member.id)?.role).toBe("viewer");
  });

  it("updates notifications and revokes sessions", async () => {
    const snap = await mockSettingsRepository.getSnapshot();
    const prefs = await mockSettingsRepository.updateNotifications({
      ...snap.notifications,
      smsDelivery: true,
    });
    expect(prefs.smsDelivery).toBe(true);

    const other = snap.sessions.find((s) => !s.current)!;
    await mockSettingsRepository.revokeSession(other.id);
    const after = await mockSettingsRepository.getSnapshot();
    expect(after.sessions.some((s) => s.id === other.id)).toBe(false);
  });
});
