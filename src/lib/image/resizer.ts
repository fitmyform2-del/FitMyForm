import { DocumentRequirements, CropRect } from '@/types/document';
import { applyPhotoStamp } from './tools/stampTools';
import { applySignatureFilter } from './tools/signatureTools';
import { applyWhiteBackground } from './tools/whiteBgTools';

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error('Failed to load source image: ' + err));
    img.src = src;
  });
}

export function renderToCanvas(
  img: HTMLImageElement,
  reqs: DocumentRequirements,
  cropRect?: CropRect
): HTMLCanvasElement {
  const targetW = Math.max(10, reqs.width || img.width);
  const targetH = Math.max(10, reqs.height || img.height);

  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // High quality image smoothing
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fill default background color
  const bgColor = reqs.bgColor || '#FFFFFF';
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, targetW, targetH);

  const mode = reqs.cropMode || 'fill';

  if (mode === 'manual' && cropRect) {
    // Manual interactive crop mode: normalized center offsets (x, y) + zoom + rotation
    // Matches InteractiveCropper WYSIWYG preview pixel-for-pixel
    const { x, y, zoom, rotation } = cropRect;
    const baseScale = Math.max(targetW / img.width, targetH / img.height);
    const totalScale = baseScale * (zoom || 1);

    ctx.save();
    ctx.translate(targetW / 2 + x * targetW, targetH / 2 + y * targetH);
    if (rotation) {
      ctx.rotate((rotation * Math.PI) / 180);
    }
    ctx.scale(totalScale, totalScale);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();

    if (reqs.whiteBg?.enabled) applyWhiteBackground(canvas, reqs.whiteBg);
    if (reqs.signatureFilter?.enabled) applySignatureFilter(canvas, reqs.signatureFilter);
    if (reqs.photoStamp?.enabled) applyPhotoStamp(canvas, reqs.photoStamp);
    return canvas;
  }

  const srcW = img.width;
  const srcH = img.height;
  const srcAspect = srcW / srcH;
  const targetAspect = targetW / targetH;

  if (mode === 'stretch') {
    ctx.drawImage(img, 0, 0, targetW, targetH);
  } else if (mode === 'center' || mode === 'fill') {
    // Center Crop (Cover target)
    let drawW: number;
    let drawH: number;
    let offsetX: number;
    let offsetY: number;

    if (srcAspect > targetAspect) {
      // Source is wider than target
      drawH = targetH;
      drawW = targetH * srcAspect;
      offsetX = (targetW - drawW) / 2;
      offsetY = 0;
    } else {
      // Source is taller than target
      drawW = targetW;
      drawH = targetW / srcAspect;
      offsetX = 0;
      offsetY = (targetH - drawH) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  } else if (mode === 'fit') {
    // Fit inside target canvas with padding
    let drawW: number;
    let drawH: number;
    let offsetX: number;
    let offsetY: number;

    if (srcAspect > targetAspect) {
      drawW = targetW;
      drawH = targetW / srcAspect;
      offsetX = 0;
      offsetY = (targetH - drawH) / 2;
    } else {
      drawH = targetH;
      drawW = targetH * srcAspect;
      offsetX = (targetW - drawW) / 2;
      offsetY = 0;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }

  if (reqs.whiteBg?.enabled) {
    applyWhiteBackground(canvas, reqs.whiteBg);
  }

  if (reqs.signatureFilter?.enabled) {
    applySignatureFilter(canvas, reqs.signatureFilter);
  }

  if (reqs.photoStamp?.enabled) {
    applyPhotoStamp(canvas, reqs.photoStamp);
  }

  return canvas;
}
