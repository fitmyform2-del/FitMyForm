import { SignatureFilterConfig } from '@/types/document';

/**
 * Whitens camera shadows/yellow notebook backgrounds and darkens ink
 * for passport/exam signature uploads.
 */
export function applySignatureFilter(
  canvas: HTMLCanvasElement,
  config: SignatureFilterConfig
): void {
  if (!config.enabled) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  const threshold = config.threshold ?? 175;

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Perceived luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    if (config.whitenBackground && lum > threshold) {
      // Whiten paper / background shadow
      data[i] = 255;
      data[i + 1] = 255;
      data[i + 2] = 255;
    } else if (config.inkBoost && lum <= threshold) {
      // Darken ink / boost contrast
      const factor = 0.55; // darken by 45%
      data[i] = Math.max(0, Math.round(r * factor));
      data[i + 1] = Math.max(0, Math.round(g * factor));
      data[i + 2] = Math.max(0, Math.round(b * factor));
    }
  }

  ctx.putImageData(imgData, 0, 0);
}
