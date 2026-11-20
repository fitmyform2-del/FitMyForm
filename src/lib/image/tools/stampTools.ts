import { PhotoStampConfig } from '@/types/document';

/**
 * Draws a formal Name & Date of Photo (DOP) banner onto a canvas.
 * Compliant with SSC / UPSC / State examination photo upload guidelines.
 */
export function applyPhotoStamp(
  canvas: HTMLCanvasElement,
  config: PhotoStampConfig
): void {
  if (!config.enabled) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Banner height is approximately 18% of photo height (min 32px, max 90px)
  const bannerH = Math.max(32, Math.min(90, Math.round(height * 0.18)));
  const isTop = config.position === 'top';
  const bannerY = isTop ? 0 : height - bannerH;

  // 1. Draw banner background
  ctx.save();
  ctx.fillStyle = config.bgColor || '#FFFFFF';
  ctx.fillRect(0, bannerY, width, bannerH);

  // 2. Draw subtle border line separating image and stamp
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = Math.max(1, Math.round(width * 0.003));
  ctx.beginPath();
  if (isTop) {
    ctx.moveTo(0, bannerH);
    ctx.lineTo(width, bannerH);
  } else {
    ctx.moveTo(0, bannerY);
    ctx.lineTo(width, bannerY);
  }
  ctx.stroke();

  // 3. Setup text styles
  const textColor = config.textColor || '#000000';
  ctx.fillStyle = textColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const nameText = (config.name || 'CANDIDATE NAME').trim().toUpperCase();
  const dateText = config.date
    ? `DOP: ${config.date.trim()}`
    : `DOP: ${new Date().toLocaleDateString('en-GB')}`;

  // Calculate dynamic font size to prevent overflow
  const fontSize = Math.max(9, Math.round(bannerH * 0.32));
  ctx.font = `bold ${fontSize}px sans-serif`;

  const line1Y = bannerY + bannerH * 0.32;
  const line2Y = bannerY + bannerH * 0.72;

  ctx.fillText(nameText, width / 2, line1Y, width - 16);
  ctx.font = `600 ${Math.max(8, fontSize - 1)}px monospace`;
  ctx.fillText(dateText, width / 2, line2Y, width - 16);

  ctx.restore();
}
