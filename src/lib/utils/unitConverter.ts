export type DimensionUnit = 'px' | 'cm' | 'mm' | 'in';

export interface UnitDimension {
  unit: DimensionUnit;
  width: number;
  height: number;
  dpi: number;
}

export const COMMON_DPIS = [
  { label: '200 DPI (Govt Forms)', value: 200 },
  { label: '300 DPI (High Res Print)', value: 300 },
  { label: '100 DPI (Web Standard)', value: 100 }
];

export function toPixels(value: number, unit: DimensionUnit, dpi: number = 200): number {
  if (unit === 'px' || !value || value <= 0) return Math.round(value);
  let inches = 0;
  if (unit === 'cm') inches = value / 2.54;
  else if (unit === 'mm') inches = value / 25.4;
  else if (unit === 'in') inches = value;
  return Math.max(1, Math.round(inches * dpi));
}

export function fromPixels(px: number, unit: DimensionUnit, dpi: number = 200): number {
  if (unit === 'px' || !px || px <= 0) return Math.round(px);
  const inches = px / dpi;
  if (unit === 'cm') return Number((inches * 2.54).toFixed(2));
  if (unit === 'mm') return Math.round(inches * 25.4);
  if (unit === 'in') return Number(inches.toFixed(2));
  return px;
}

export function formatDimensionDisplay(pxW: number, pxH: number, dpi: number = 200): string {
  const cmW = (pxW / dpi * 2.54).toFixed(1);
  const cmH = (pxH / dpi * 2.54).toFixed(1);
  return `${pxW}×${pxH} px (${cmW}×${cmH} cm @ ${dpi}DPI)`;
}
