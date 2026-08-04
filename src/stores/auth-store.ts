"use client";

import { create } from "zustand";
import { authRepository } from "@/lib/api/client";
import { pathForOnboardingStep } from "@/lib/auth/onboarding-paths";
import type {
  ActiveContext,
  AuthError,
  Membership,
  OrganizationProfile,
  SessionSnapshot,
  UserProfile,
} from "@/types/auth";

type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";

type AuthState = {
  status: AuthStatus;
  user: UserProfile | null;
  session: SessionSnapshot["session"] | null;
  memberships: Membership[];
  organizations: OrganizationProfile[];
  error: AuthError | null;
  bootstrap: () => Promise<void>;
  applySnapshot: (snapshot: SessionSnapshot) => void;
  clear: () => void;
  signOut: () => Promise<void>;
  setActiveContext: (context: ActiveContext) => Promise<void>;
  refresh: () => Promise<void>;
  postAuthRedirectPath: () => string;
  activeMembership: () => Membership | null;
  activeOrganization: () => OrganizationProfile | null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: "idle",
  user: null,
  session: null,
  memberships: [],
  organizations: [],
  error: null,

  applySnapshot: (snapshot) => {
    set({
      status: "authenticated",
      user: snapshot.user,
      session: snapshot.session,
      memberships: snapshot.memberships,
      organizations: snapshot.organizations,
      error: null,
    });
  },

  clear: () => {
    set({
      status: "unauthenticated",
      user: null,
      session: null,
      memberships: [],
      organizations: [],
      error: null,
    });
  },

  bootstrap: async () => {
    set({ status: "loading", error: null });
    try {
      const snapshot = await authRepository.getSession();
      if (!snapshot) {
        get().clear();
        return;
      }
      get().applySnapshot(snapshot);
    } catch {
      get().clear();
    }
  },

  refresh: async () => {
    const snapshot = await authRepository.getSession();
    if (!snapshot) {
      get().clear();
      return;
    }
    get().applySnapshot(snapshot);
  },

  signOut: async () => {
    await authRepository.signOut();
    get().clear();
  },

  setActiveContext: async (context) => {
    await authRepository.setActiveContext(context);
    await get().refresh();
  },

  postAuthRedirectPath: () => {
    const user = get().user;
    if (!user) return "/welcome";
    if (user.staffRole) return "/operations";
    if (user.onboarding.status !== "completed") {
      return pathForOnboardingStep(user.onboarding.step);
    }
    return "/app/home";
  },

  activeMembership: () => {
    const { session, memberships } = get();
    if (!session) return null;
    if (session.activeContext.type !== "organization") return null;
    const organizationId = session.activeContext.organizationId;
    return (
      memberships.find((m) => m.organizationId === organizationId) ?? null
    );
  },

  activeOrganization: () => {
    const { session, organizations } = get();
    if (!session || session.activeContext.type !== "organization") return null;
    const organizationId = session.activeContext.organizationId;
    return organizations.find((o) => o.id === organizationId) ?? null;
  },
}));
