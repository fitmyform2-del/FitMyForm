import { DocumentRequirements, CropRect } from '@/types/document';

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
    // Manual interactive crop mode
    const { x, y, width: cw, height: ch, zoom, rotation } = cropRect;
    ctx.save();
    ctx.translate(targetW / 2, targetH / 2);
    if (rotation) {
      ctx.rotate((rotation * Math.PI) / 180);
    }

    const scale = zoom || 1;
    // Draw cropped region of image onto full target canvas
    ctx.drawImage(
      img,
      x, y, cw, ch,
      -targetW / 2 * scale, -targetH / 2 * scale, targetW * scale, targetH * scale
    );
    ctx.restore();
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

  return canvas;
}
