"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import { pieceDesi, pieceVolumeM3 } from "@/features/xl/lib/totals";
import type { XlPiece } from "@/types/xl";

export function XlPiecesTable({
  pieces,
  onChange,
  onAdd,
  onRemove,
}: {
  pieces: XlPiece[];
  onChange: (id: string, patch: Partial<XlPiece>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  const t = useTranslations("xl");

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead className="border-b border-border bg-muted/60">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                {t("pieceName")}
              </th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                {t("length")}
              </th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                {t("width")}
              </th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                {t("height")}
              </th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                {t("weight")}
              </th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                {t("volume")}
              </th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {pieces.map((piece) => (
              <tr key={piece.id} className="border-b border-border last:border-0">
                <td className="px-2 py-2">
                  <AppInput
                    value={piece.name}
                    onChange={(e) => onChange(piece.id, { name: e.target.value })}
                  />
                </td>
                <td className="px-2 py-2">
                  <AppInput
                    type="number"
                    min={1}
                    value={piece.lengthCm}
                    onChange={(e) =>
                      onChange(piece.id, {
                        lengthCm: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <AppInput
                    type="number"
                    min={1}
                    value={piece.widthCm}
                    onChange={(e) =>
                      onChange(piece.id, {
                        widthCm: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <AppInput
                    type="number"
                    min={1}
                    value={piece.heightCm}
                    onChange={(e) =>
                      onChange(piece.id, {
                        heightCm: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <AppInput
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={piece.weightKg}
                    onChange={(e) =>
                      onChange(piece.id, {
                        weightKg: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-3 py-2 text-xs text-muted-foreground">
                  {pieceVolumeM3(piece).toFixed(3)} m³
                  <br />
                  ~{pieceDesi(piece).toFixed(0)} desi
                </td>
                <td className="px-2 py-2 text-right">
                  <AppButton
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={pieces.length <= 1}
                    onClick={() => onRemove(piece.id)}
                  >
                    {t("remove")}
                  </AppButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <AppButton type="button" variant="secondary" onClick={onAdd}>
        {t("addPiece")}
      </AppButton>
    </div>
  );
}
