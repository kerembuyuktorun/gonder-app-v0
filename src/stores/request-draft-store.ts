"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  createRequestDraft,
  type RequestDraft,
  type RequestMode,
} from "@/types/request-engine";

type RequestDraftState = {
  draft: RequestDraft;
  selectedQuoteId: string | null;
  lastSavedAt: string | null;
  updateDraft: (patch: Partial<RequestDraft>) => void;
  setMode: (mode: RequestMode) => void;
  selectQuote: (quoteId: string) => void;
  resetDraft: () => void;
};

export const useRequestDraftStore = create<RequestDraftState>()(
  persist(
    (set) => ({
      draft: createRequestDraft(),
      selectedQuoteId: null,
      lastSavedAt: null,
      updateDraft: (patch) =>
        set((state) => {
          const savedAt = new Date().toISOString();
          return {
            draft: { ...state.draft, ...patch, updatedAt: savedAt },
            lastSavedAt: savedAt,
          };
        }),
      setMode: (mode) =>
        set((state) => ({
          draft: {
            ...state.draft,
            mode,
            updatedAt: new Date().toISOString(),
          },
        })),
      selectQuote: (selectedQuoteId) => set({ selectedQuoteId }),
      resetDraft: () =>
        set({
          draft: createRequestDraft(),
          selectedQuoteId: null,
          lastSavedAt: null,
        }),
    }),
    {
      name: "gonder.request-draft.v2",
      partialize: ({ draft, selectedQuoteId, lastSavedAt }) => ({
        draft,
        selectedQuoteId,
        lastSavedAt,
      }),
    },
  ),
);
