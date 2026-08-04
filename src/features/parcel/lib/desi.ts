import type { ParcelDesiSummary, ParcelPackage } from "@/types/parcel";

/** Standard TR desi: (L×W×H)/3000, chargeable = max(volumetric, weight). */
export const DESI_DIVISOR = 3000;
export const PARCEL_MAX_DESI = 30;

export function packageVolumetricDesi(pkg: ParcelPackage): number {
  const vol = (pkg.lengthCm * pkg.widthCm * pkg.heightCm) / DESI_DIVISOR;
  return Math.round(vol * 100) / 100;
}

export function packageChargeableDesi(pkg: ParcelPackage): number {
  return Math.max(packageVolumetricDesi(pkg), pkg.weightKg);
}

export function summarizeDesi(packages: ParcelPackage[]): ParcelDesiSummary {
  const volumetricDesi = packages.reduce(
    (sum, pkg) => sum + packageVolumetricDesi(pkg),
    0,
  );
  const chargeableDesi = packages.reduce(
    (sum, pkg) => sum + packageChargeableDesi(pkg),
    0,
  );
  const totalWeightKg = packages.reduce((sum, pkg) => sum + pkg.weightKg, 0);
  const roundedChargeable = Math.round(chargeableDesi * 100) / 100;
  const roundedVolumetric = Math.round(volumetricDesi * 100) / 100;

  return {
    volumetricDesi: roundedVolumetric,
    chargeableDesi: roundedChargeable,
    totalWeightKg: Math.round(totalWeightKg * 100) / 100,
    packageCount: packages.length,
    exceedsParcelLimit: roundedChargeable > PARCEL_MAX_DESI,
    suggestGonderXl: roundedChargeable > PARCEL_MAX_DESI,
  };
}

export function newPackageId(): string {
  return `pkg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function createEmptyPackage(): ParcelPackage {
  return {
    id: newPackageId(),
    lengthCm: 30,
    widthCm: 20,
    heightCm: 15,
    weightKg: 1,
  };
}
