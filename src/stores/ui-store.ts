"use client";

import { create } from "zustand";

type UiState = {
  sidebarCollapsed: boolean;
  mobileNavOpen: boolean;
  sidePanelOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (value: boolean) => void;
  setMobileNavOpen: (value: boolean) => void;
  setSidePanelOpen: (value: boolean) => void;
};

export const useUiStore = create<UiState>((set) => ({
  sidebarCollapsed: false,
  mobileNavOpen: false,
  sidePanelOpen: false,
  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (value) => set({ sidebarCollapsed: value }),
  setMobileNavOpen: (value) => set({ mobileNavOpen: value }),
  setSidePanelOpen: (value) => set({ sidePanelOpen: value }),
}));
