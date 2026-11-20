import {
  MemeText,
  MemeSticker,
  MemeImageSettings,
  MemeLayoutMode,
  MemeImageOverlay
} from './memeTypes';
import { renderTexts } from './memeTextRenderer';

export function renderCompositeMemeCanvas(
  img: HTMLImageElement,
  layout: MemeLayoutMode,
  texts: MemeText[],
  stickers: MemeSticker[],
  settings: MemeImageSettings,
  overlayImages: { overlay: MemeImageOverlay; img: HTMLImageElement }[] = []
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const rawW = img.naturalWidth || img.width || 720;
  const rawH = img.naturalHeight || img.height || 720;
  const scale = Math.min(1, 1400 / Math.max(rawW, rawH));
  const baseW = Math.round(rawW * scale);
  const baseH = Math.round(rawH * scale);

  let headerH = 0;
  let marginX = 0;
  let marginY = 0;
  let bottomH = 0;

  if (layout === 'modern-header') {
    headerH = Math.max(90, Math.floor(baseH * 0.22));
    canvas.width = baseW;
    canvas.height = baseH + headerH;
  } else if (layout === 'demotivational') {
    marginX = Math.floor(baseW * 0.08);
    marginY = Math.floor(baseH * 0.07);
    bottomH = Math.floor(baseH * 0.26);
    canvas.width = baseW + marginX * 2;
    canvas.height = baseH + marginY + bottomH;
  } else {
    canvas.width = baseW;
    canvas.height = baseH;
  }

  const ctx = canvas.getContext('2d')!;
  ctx.save();

  // Draw Background for layout
  if (layout === 'modern-header') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, headerH);
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, headerH - 2, canvas.width, 2);
  } else if (layout === 'demotivational') {
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 2;
    ctx.strokeRect(marginX - 6, marginY - 6, baseW + 12, baseH + 12);
  }

  // Draw Base Image with transforms and filters
  const imgX = marginX;
  const imgY = layout === 'modern-header' ? headerH : marginY;
  const centerX = imgX + baseW / 2;
  const centerY = imgY + baseH / 2;

  ctx.save();
  ctx.translate(centerX, centerY);
  if (settings.rotation) ctx.rotate((settings.rotation * Math.PI) / 180);
  ctx.scale(settings.flipHorizontal ? -1 : 1, settings.flipVertical ? -1 : 1);

  let filterStr = `brightness(${settings.brightness}%) contrast(${settings.contrast}%) saturate(${settings.saturation}%)`;
  if (settings.filter === 'deepfry') filterStr += ' contrast(220%) saturate(240%)';
  if (settings.filter === 'grayscale') filterStr += ' grayscale(100%)';
  if (settings.filter === 'sepia') filterStr += ' sepia(100%)';
  if (settings.filter === 'invert') filterStr += ' invert(100%)';
  if (settings.filter === 'high-contrast') filterStr += ' contrast(190%)';
  if (settings.filter === 'vintage') filterStr += ' sepia(40%) contrast(125%)';
  ctx.filter = filterStr;

  ctx.drawImage(img, -baseW / 2, -baseH / 2, baseW, baseH);
  ctx.restore();

  if (settings.filter === 'deepfry') {
    ctx.fillStyle = 'rgba(239, 68, 68, 0.12)';
    ctx.fillRect(imgX, imgY, baseW, baseH);
  }

  // Draw Overlay Images (e.g. template slots or floating images)
  if (overlayImages.length > 0) {
    renderOverlayImages(ctx, overlayImages, imgX, imgY, baseW, baseH);
  }

  if (layout === 'bottom-bar') {
    const barH = Math.floor(canvas.height * 0.18);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
    ctx.fillRect(0, canvas.height - barH, canvas.width, barH);
  }

  // Render Texts
  renderTexts(ctx, canvas, texts, layout, headerH, marginY, baseH, bottomH);

  // Render Stickers
  renderStickers(ctx, canvas, stickers);

  // Render Watermark
  if (settings.showWatermark && settings.watermarkText.trim()) {
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 2;
    ctx.textAlign = 'right';
    ctx.strokeText(settings.watermarkText, canvas.width - 12, canvas.height - 12);
    ctx.fillText(settings.watermarkText, canvas.width - 12, canvas.height - 12);
  }

  ctx.restore();
  return canvas;
}

function renderOverlayImages(
  ctx: CanvasRenderingContext2D,
  overlayImages: { overlay: MemeImageOverlay; img: HTMLImageElement }[],
  imgX: number,
  imgY: number,
  baseW: number,
  baseH: number
) {
  overlayImages.forEach(({ overlay, img }) => {
    ctx.save();
    ctx.globalAlpha = overlay.opacity ?? 1;
    const x = imgX + (baseW * overlay.xPercent) / 100;
    const y = imgY + (baseH * overlay.yPercent) / 100;
    const w = (baseW * overlay.widthPercent) / 100;
    const h = (baseH * overlay.heightPercent) / 100;

    ctx.translate(x + w / 2, y + h / 2);
    if (overlay.rotation) ctx.rotate((overlay.rotation * Math.PI) / 180);

    const iw = img.naturalWidth || img.width;
    const ih = img.naturalHeight || img.height;

    if (overlay.fit === 'contain') {
      const scale = Math.min(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
    } else {
      const srcRatio = iw / ih;
      const dstRatio = w / h;
      let sx = 0;
      let sy = 0;
      let sw = iw;
      let sh = ih;
      if (srcRatio > dstRatio) {
        sw = ih * dstRatio;
        sx = (iw - sw) / 2;
      } else {
        sh = iw / dstRatio;
        sy = (ih - sh) / 2;
      }
      ctx.drawImage(img, sx, sy, sw, sh, -w / 2, -h / 2, w, h);
    }
    ctx.restore();
  });
}

function renderStickers(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, stickers: MemeSticker[]) {
  stickers.forEach((s) => {
    ctx.save();
    const x = (canvas.width * s.xPercent) / 100;
    const y = (canvas.height * s.yPercent) / 100;
    const size = Math.max(24, Math.floor((canvas.height * s.sizePercent) / 100));

    ctx.translate(x, y);
    if (s.rotation) ctx.rotate((s.rotation * Math.PI) / 180);
    ctx.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(s.emoji, 0, 0);
    ctx.restore();
  });
}
