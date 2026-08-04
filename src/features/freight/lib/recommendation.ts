import type {
  FreightDraft,
  FreightMode,
  FreightModeRecommendation,
} from "@/types/freight";

/** Heuristic: heavy / full capacity → FTL; partial → LTL */
export function recommendFreightMode(input: {
  totalWeightKg: number;
  pallets: number;
  volumeM3?: number;
  loadingMeters?: number;
}): FreightModeRecommendation {
  const volume = input.volumeM3 ?? 0;
  const lm = input.loadingMeters ?? 0;
  const heavy = input.totalWeightKg >= 8000 || input.pallets >= 20 || volume >= 40 || lm >= 10;
  const light = input.totalWeightKg <= 2500 && input.pallets <= 8 && volume <= 12 && lm <= 4;

  if (heavy) {
    return {
      suggested: "ftl",
      reasonKey: "freight.recommend.ftl",
      warnIfSelected: "ltl",
      warningKey: "freight.recommend.warnLtlForHeavy",
    };
  }
  if (light) {
    return {
      suggested: "ltl",
      reasonKey: "freight.recommend.ltl",
      warnIfSelected: "ftl",
      warningKey: "freight.recommend.warnFtlForLight",
    };
  }
  return {
    suggested: "ftl",
    reasonKey: "freight.recommend.neutralFtl",
  };
}

export function detectMismatch(
  mode: FreightMode,
  draft: FreightDraft,
): FreightModeRecommendation | null {
  const pallets = draft.lines.reduce((s, l) => s + l.pallets, 0);
  const rec = recommendFreightMode({
    totalWeightKg: draft.totalWeightKg,
    pallets,
    volumeM3: draft.ltl.volumeM3,
    loadingMeters: draft.ltl.loadingMeters,
  });
  if (rec.warnIfSelected === mode && rec.warningKey) return rec;
  return null;
}

export function newCargoLineId(): string {
  return `fc_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}

export function createEmptyCargoLine(index = 1) {
  return {
    id: newCargoLineId(),
    description: `Yük ${index}`,
    pallets: 2,
    boxes: 0,
    weightKg: 500,
  };
}
