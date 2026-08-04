import type { XlDraft, XlPiece, XlTotals } from "@/types/xl";

export function newPieceId(): string {
  return `xlp_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function createEmptyPiece(index = 1): XlPiece {
  return {
    id: newPieceId(),
    name: `Parça ${index}`,
    lengthCm: 120,
    widthCm: 80,
    heightCm: 90,
    weightKg: 45,
  };
}

export function pieceVolumeM3(piece: XlPiece): number {
  return (piece.lengthCm * piece.widthCm * piece.heightCm) / 1_000_000;
}

export function pieceDesi(piece: XlPiece): number {
  const volumetric =
    (piece.lengthCm * piece.widthCm * piece.heightCm) / 3000;
  return Math.max(volumetric, piece.weightKg);
}

export function summarizeXlTotals(pieces: XlPiece[]): XlTotals {
  const totalWeightKg = pieces.reduce((s, p) => s + p.weightKg, 0);
  const totalVolumeM3 = pieces.reduce((s, p) => s + pieceVolumeM3(p), 0);
  const chargeableDesi = pieces.reduce((s, p) => s + pieceDesi(p), 0);
  return {
    pieceCount: pieces.length,
    totalWeightKg: Math.round(totalWeightKg * 10) / 10,
    totalVolumeM3: Math.round(totalVolumeM3 * 1000) / 1000,
    chargeableDesi: Math.round(chargeableDesi * 10) / 10,
  };
}

/** Below 30 desi should nudge back to parcel — XL is for oversized. */
export function isBelowParcelThreshold(draft: XlDraft): boolean {
  return summarizeXlTotals(draft.pieces).chargeableDesi <= 30;
}
