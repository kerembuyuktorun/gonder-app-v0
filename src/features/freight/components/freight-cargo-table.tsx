"use client";

import { useTranslations } from "next-intl";
import { AppButton } from "@/components/shared/app-button";
import { AppInput } from "@/components/shared/app-input";
import type { FreightCargoLine } from "@/types/freight";

export function FreightCargoTable({
  lines,
  onChange,
  onAdd,
  onRemove,
}: {
  lines: FreightCargoLine[];
  onChange: (id: string, patch: Partial<FreightCargoLine>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}) {
  const t = useTranslations("freight");

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[680px] border-collapse text-sm">
          <thead className="border-b border-border bg-muted/60">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                {t("cargoDesc")}
              </th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                {t("pallets")}
              </th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                {t("boxes")}
              </th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                {t("lineWeight")}
              </th>
              <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                {t("actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id} className="border-b border-border last:border-0">
                <td className="px-2 py-2">
                  <AppInput
                    value={line.description}
                    onChange={(e) =>
                      onChange(line.id, { description: e.target.value })
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <AppInput
                    type="number"
                    min={0}
                    value={line.pallets}
                    onChange={(e) =>
                      onChange(line.id, {
                        pallets: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <AppInput
                    type="number"
                    min={0}
                    value={line.boxes}
                    onChange={(e) =>
                      onChange(line.id, { boxes: Number(e.target.value) || 0 })
                    }
                  />
                </td>
                <td className="px-2 py-2">
                  <AppInput
                    type="number"
                    min={0}
                    value={line.weightKg}
                    onChange={(e) =>
                      onChange(line.id, {
                        weightKg: Number(e.target.value) || 0,
                      })
                    }
                  />
                </td>
                <td className="px-2 py-2 text-right">
                  <AppButton
                    type="button"
                    size="sm"
                    variant="ghost"
                    disabled={lines.length <= 1}
                    onClick={() => onRemove(line.id)}
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
        {t("addLine")}
      </AppButton>
    </div>
  );
}
