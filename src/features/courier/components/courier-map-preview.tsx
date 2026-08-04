"use client";

import { useTranslations } from "next-intl";
import type { CourierMapPoint, CourierRequestDraft } from "@/types/courier";
import { haversineKm } from "@/features/courier/lib/pricing";

function buildPoints(draft: CourierRequestDraft): CourierMapPoint[] {
  const points: CourierMapPoint[] = [
    {
      id: "pickup",
      label: "A",
      lat: draft.pickup.lat,
      lng: draft.pickup.lng,
      kind: "pickup",
    },
  ];
  draft.stops.forEach((stop, index) => {
    // Approximate stop near midpoint of pickup/delivery for mock map
    const t = (index + 1) / (draft.stops.length + 1);
    points.push({
      id: stop.id,
      label: String(index + 1),
      lat: draft.pickup.lat + (draft.delivery.lat - draft.pickup.lat) * t,
      lng: draft.pickup.lng + (draft.delivery.lng - draft.pickup.lng) * t,
      kind: "stop",
    });
  });
  points.push({
    id: "delivery",
    label: "B",
    lat: draft.delivery.lat,
    lng: draft.delivery.lng,
    kind: "delivery",
  });
  return points;
}

/** Decorative mock map — not a real map SDK. Positions pins relatively. */
export function CourierMapPreview({ draft }: { draft: CourierRequestDraft }) {
  const t = useTranslations("courier");
  const points = buildPoints(draft);

  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latSpan = Math.max(maxLat - minLat, 0.02);
  const lngSpan = Math.max(maxLng - minLng, 0.02);

  function toXY(lat: number, lng: number) {
    const x = ((lng - minLng) / lngSpan) * 80 + 10;
    const y = (1 - (lat - minLat) / latSpan) * 70 + 15;
    return { x, y };
  }

  const path = points
    .map((p, i) => {
      const { x, y } = toXY(p.lat, p.lng);
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  const distance = haversineKm(draft.pickup, draft.delivery);

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold">{t("mapTitle")}</h3>
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-[linear-gradient(160deg,var(--gonder-brand-50),var(--gonder-brand-100)_40%,#e8eef5)] dark:bg-[linear-gradient(160deg,var(--gonder-brand-900),var(--gonder-brand-800))]">
        <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
          <path
            d={path}
            fill="none"
            stroke="var(--gonder-brand-500)"
            strokeWidth="1.2"
            strokeDasharray="2 1.5"
          />
          {points.map((point) => {
            const { x, y } = toXY(point.lat, point.lng);
            const fill =
              point.kind === "pickup"
                ? "var(--status-info)"
                : point.kind === "delivery"
                  ? "var(--status-success)"
                  : "var(--status-warning)";
            return (
              <g key={point.id}>
                <circle cx={x} cy={y} r="3.2" fill={fill} />
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  fontSize="3"
                  fill="white"
                  fontWeight="700"
                >
                  {point.label}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="absolute bottom-2 left-2 rounded-md bg-card/90 px-2 py-1 text-[11px] text-muted-foreground backdrop-blur">
          {t("distance")}: ~{distance.toFixed(1)} km
        </div>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <p>
          <span className="font-medium text-foreground">A · </span>
          {draft.pickup.district} — {draft.pickup.line1}
        </p>
        {draft.stops.map((stop, index) => (
          <p key={stop.id}>
            <span className="font-medium text-foreground">{index + 1} · </span>
            {stop.district || stop.label} — {stop.addressLine || "—"}
          </p>
        ))}
        <p>
          <span className="font-medium text-foreground">B · </span>
          {draft.delivery.district} — {draft.delivery.line1}
        </p>
        {draft.stops.length > 0 ? (
          <p className="pt-1 text-foreground">
            {t("stopsCount", { count: draft.stops.length })}
          </p>
        ) : null}
      </div>
    </div>
  );
}
