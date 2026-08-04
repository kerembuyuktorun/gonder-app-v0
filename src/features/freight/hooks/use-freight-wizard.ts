"use client";

import * as React from "react";
import { freightRepository } from "@/lib/api/client";
import { createDefaultFreightDraft } from "@/mocks/data/freight";
import {
  createEmptyCargoLine,
  detectMismatch,
  recommendFreightMode,
} from "@/features/freight/lib/recommendation";
import type {
  FreightAddress,
  FreightAttachment,
  FreightCargoLine,
  FreightDraft,
  FreightFtlDetails,
  FreightLtlDetails,
  FreightMode,
  FreightRequest,
  FreightWizardStepId,
} from "@/types/freight";

export function useFreightWizard(initialMode: FreightMode | null = null) {
  const [draft, setDraft] = React.useState<FreightDraft>(() =>
    createDefaultFreightDraft(initialMode),
  );
  const [step, setStep] = React.useState<FreightWizardStepId>(
    initialMode ? "form" : "select",
  );
  const [request, setRequest] = React.useState<FreightRequest | null>(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [messageDraft, setMessageDraft] = React.useState("");
  const [revisionNote, setRevisionNote] = React.useState("");

  const recommendation = React.useMemo(() => {
    const pallets = draft.lines.reduce((s, l) => s + l.pallets, 0);
    return recommendFreightMode({
      totalWeightKg: draft.totalWeightKg,
      pallets,
      volumeM3: draft.ltl.volumeM3,
      loadingMeters: draft.ltl.loadingMeters,
    });
  }, [draft.lines, draft.totalWeightKg, draft.ltl.volumeM3, draft.ltl.loadingMeters]);

  const mismatch =
    draft.mode != null ? detectMismatch(draft.mode, draft) : null;

  function selectMode(mode: FreightMode) {
    setDraft(createDefaultFreightDraft(mode));
    setStep("form");
    setRequest(null);
    setError(null);
  }

  function patchDraft(patch: Partial<FreightDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function updateLoading(patch: Partial<FreightAddress>) {
    setDraft((prev) => ({ ...prev, loading: { ...prev.loading, ...patch } }));
  }

  function updateDelivery(patch: Partial<FreightAddress>) {
    setDraft((prev) => ({ ...prev, delivery: { ...prev.delivery, ...patch } }));
  }

  function updateLine(id: string, patch: Partial<FreightCargoLine>) {
    setDraft((prev) => {
      const lines = prev.lines.map((l) =>
        l.id === id ? { ...l, ...patch } : l,
      );
      const totalWeightKg = lines.reduce((s, l) => s + l.weightKg, 0);
      return { ...prev, lines, totalWeightKg };
    });
  }

  function addLine() {
    setDraft((prev) => ({
      ...prev,
      lines: [...prev.lines, createEmptyCargoLine(prev.lines.length + 1)],
    }));
  }

  function removeLine(id: string) {
    setDraft((prev) => {
      const lines =
        prev.lines.length <= 1
          ? prev.lines
          : prev.lines.filter((l) => l.id !== id);
      return {
        ...prev,
        lines,
        totalWeightKg: lines.reduce((s, l) => s + l.weightKg, 0),
      };
    });
  }

  function patchFtl(patch: Partial<FreightFtlDetails>) {
    setDraft((prev) => ({ ...prev, ftl: { ...prev.ftl, ...patch } }));
  }

  function patchLtl(patch: Partial<FreightLtlDetails>) {
    setDraft((prev) => ({ ...prev, ltl: { ...prev.ltl, ...patch } }));
  }

  function addAttachments(files: FileList, kind: "photo" | "document") {
    const items: FreightAttachment[] = Array.from(files).map((f, i) => ({
      id: `att_${Date.now()}_${i}`,
      name: f.name,
      kind,
      sizeLabel: `${Math.max(1, Math.round(f.size / 1024))} KB`,
    }));
    setDraft((prev) => ({
      ...prev,
      attachments: [...prev.attachments, ...items],
    }));
  }

  function removeAttachment(id: string) {
    setDraft((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((a) => a.id !== id),
    }));
  }

  async function submit() {
    if (!draft.mode) return;
    setSubmitting(true);
    setError(null);
    try {
      const { request: created } = await freightRepository.submit(draft);
      setRequest(created);
      setStep("status");
    } catch {
      setError("submit_failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function advance() {
    if (!request) return;
    setSubmitting(true);
    try {
      const next = await freightRepository.advanceStatus(request.id);
      setRequest(next);
      if (next.quote.status === "accepted") setStep("success");
    } catch {
      setError("advance_failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function accept() {
    if (!request) return;
    setSubmitting(true);
    try {
      const next = await freightRepository.acceptQuote(request.id);
      setRequest(next);
      setStep("success");
    } catch {
      setError("accept_failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function requestRevision() {
    if (!request) return;
    setSubmitting(true);
    try {
      const next = await freightRepository.requestRevision(
        request.id,
        revisionNote,
      );
      setRequest(next);
      setRevisionNote("");
    } catch {
      setError("revision_failed");
    } finally {
      setSubmitting(false);
    }
  }

  async function sendMessage() {
    if (!request || !messageDraft.trim()) return;
    const messages = await freightRepository.sendMessage(
      request.id,
      messageDraft.trim(),
    );
    const refreshed = await freightRepository.getRequest(request.id);
    setRequest({ ...refreshed, messages });
    setMessageDraft("");
    // Mock ops auto-reply
    if (messageDraft.toLowerCase().includes("?")) {
      const opsMessages = await freightRepository.replyAsOps(
        request.id,
        "Mesajınızı aldık. Eksik alanları kontrol edip teklifi güncelleyeceğiz.",
      );
      const again = await freightRepository.getRequest(request.id);
      setRequest({ ...again, messages: opsMessages });
    }
  }

  function reset() {
    setDraft(createDefaultFreightDraft(initialMode));
    setStep(initialMode ? "form" : "select");
    setRequest(null);
    setError(null);
    setMessageDraft("");
    setRevisionNote("");
  }

  function goTo(next: FreightWizardStepId) {
    setStep(next);
  }

  return {
    draft,
    step,
    goTo,
    selectMode,
    recommendation,
    mismatch,
    patchDraft,
    updateLoading,
    updateDelivery,
    updateLine,
    addLine,
    removeLine,
    patchFtl,
    patchLtl,
    addAttachments,
    removeAttachment,
    submit,
    advance,
    accept,
    requestRevision,
    sendMessage,
    messageDraft,
    setMessageDraft,
    revisionNote,
    setRevisionNote,
    request,
    submitting,
    error,
    reset,
  };
}
