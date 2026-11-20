import { CropRect } from '@/types/document';

export interface InkBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  found: boolean;
}

/**
 * Detects the bounding box of dark signature ink strokes against a light paper backdrop.
 */
export function detectSignatureInkBounds(img: HTMLImageElement): InkBounds {
  const maxDim = 600;
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const sw = Math.max(1, Math.round(img.width * scale));
  const sh = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = sw;
  canvas.height = sh;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { minX: 0, minY: 0, maxX: img.width, maxY: img.height, width: img.width, height: img.height, found: false };
  }

  ctx.drawImage(img, 0, 0, sw, sh);
  const { data } = ctx.getImageData(0, 0, sw, sh);

  // Estimate paper brightness from corners
  const corners = [0, sw - 1, (sh - 1) * sw, sh * sw - 1];
  let paperLumSum = 0;
  for (const pos of corners) {
    const idx = pos * 4;
    paperLumSum += 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
  }
  const avgPaperLum = paperLumSum / corners.length;
  const inkThreshold = Math.min(200, Math.max(80, avgPaperLum - 38));

  // Ignore extreme 2% outer border artifacts (scanner shadow / notebook edge)
  const marginX = Math.floor(sw * 0.02);
  const marginY = Math.floor(sh * 0.02);

  let minX = sw;
  let minY = sh;
  let maxX = 0;
  let maxY = 0;
  let inkPixels = 0;

  for (let y = marginY; y < sh - marginY; y++) {
    for (let x = marginX; x < sw - marginX; x++) {
      const idx = (y * sw + x) * 4;
      if (data[idx + 3] < 40) continue; // transparent pixel
      const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
      if (lum < inkThreshold) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        inkPixels++;
      }
    }
  }

  if (inkPixels < 12 || maxX <= minX || maxY <= minY) {
    return { minX: 0, minY: 0, maxX: img.width, maxY: img.height, width: img.width, height: img.height, found: false };
  }

  // Convert back to original image pixel coordinates with comfortable 8% breathing margin
  const origMinX = Math.floor(minX / scale);
  const origMinY = Math.floor(minY / scale);
  const origMaxX = Math.ceil(maxX / scale);
  const origMaxY = Math.ceil(maxY / scale);

  const inkW = origMaxX - origMinX;
  const inkH = origMaxY - origMinY;
  const padX = Math.round(inkW * 0.1);
  const padY = Math.round(inkH * 0.14);

  const fMinX = Math.max(0, origMinX - padX);
  const fMinY = Math.max(0, origMinY - padY);
  const fMaxX = Math.min(img.width, origMaxX + padX);
  const fMaxY = Math.min(img.height, origMaxY + padY);

  return {
    minX: fMinX,
    minY: fMinY,
    maxX: fMaxX,
    maxY: fMaxY,
    width: Math.max(10, fMaxX - fMinX),
    height: Math.max(10, fMaxY - fMinY),
    found: true
  };
}

/**
 * Computes a normalized CropRect (compatible with renderToCanvas manual mode)
 * that centers and zooms the detected signature ink cleanly inside targetW × targetH.
 */
export function computeAutoTrimSignatureCrop(
  img: HTMLImageElement,
  targetW: number,
  targetH: number
): CropRect | null {
  const bounds = detectSignatureInkBounds(img);
  if (!bounds.found) return null;

  const baseScale = Math.max(targetW / img.width, targetH / img.height);

  // Desired total scale so ink fits nicely inside 86% of target canvas
  const desiredScale = Math.min((targetW * 0.86) / bounds.width, (targetH * 0.82) / bounds.height);
  const zoom = Math.max(0.4, Math.min(3.5, Number((desiredScale / baseScale).toFixed(2))));
  const effectiveScale = baseScale * zoom;

  const inkCenterX = (bounds.minX + bounds.maxX) / 2;
  const inkCenterY = (bounds.minY + bounds.maxY) / 2;

  const offsetFromImgCenterX = inkCenterX - img.width / 2;
  const offsetFromImgCenterY = inkCenterY - img.height / 2;

  // In renderToCanvas: translate(targetW/2 + x*targetW, targetH/2 + y*targetH), scale(effectiveScale)
  // To place inkCenter at canvas center: x * targetW = -offsetFromImgCenterX * effectiveScale
  const normX = (-offsetFromImgCenterX * effectiveScale) / targetW;
  const normY = (-offsetFromImgCenterY * effectiveScale) / targetH;

  return {
    x: Number(normX.toFixed(4)),
    y: Number(normY.toFixed(4)),
    width: 1,
    height: 1,
    zoom,
    rotation: 0
  };
}
