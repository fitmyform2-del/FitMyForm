import { BackgroundType } from '../types/whiteboard';

export function renderBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  background: BackgroundType,
  customBgColor?: string,
  backgroundImage?: string | null
) {
  ctx.save();

  // 1. Base Fill
  let bgColor = '#ffffff';
  if (background === 'blackboard') {
    bgColor = '#1e293b'; // Slate dark chalkboard
  } else if (background === 'greenboard') {
    bgColor = '#1b382b'; // Deep classroom green chalkboard
  } else if (background === 'music') {
    bgColor = '#fdfbf7'; // Ivory manuscript paper
  } else if (background === 'custom' && customBgColor) {
    bgColor = customBgColor;
  }
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);

  // 2. Render background image if present (PDF page or imported template)
  if (backgroundImage) {
    const img = new Image();
    img.src = backgroundImage;
    if (img.complete && img.naturalWidth > 0) {
      ctx.drawImage(img, 0, 0, width, height);
    }
  }

  // 3. Grid Patterns
  const isDark = background === 'blackboard' || background === 'greenboard' || bgColor === '#0f172a' || bgColor === '#1e293b' || bgColor === '#1b382b';
  const gridLineColor = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)';
  const gridSubLineColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
  const dotColor = isDark ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.2)';

  if (background === 'grid-sm' || background === 'grid-lg') {
    const step = background === 'grid-sm' ? 24 : 48;
    ctx.lineWidth = 1;
    for (let x = 0; x <= width; x += step) {
      ctx.strokeStyle = x % (step * 5) === 0 ? gridLineColor : gridSubLineColor;
      ctx.beginPath();
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += step) {
      ctx.strokeStyle = y % (step * 5) === 0 ? gridLineColor : gridSubLineColor;
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
      ctx.stroke();
    }
  } else if (background === 'dots') {
    const step = 28;
    ctx.fillStyle = dotColor;
    for (let x = step / 2; x < width; x += step) {
      for (let y = step / 2; y < height; y += step) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else if (background === 'lined') {
    const lineSpacing = 32;
    ctx.strokeStyle = isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(148, 163, 184, 0.4)';
    ctx.lineWidth = 1;
    for (let y = 80; y < height; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
      ctx.stroke();
    }
    // Margin line
    ctx.strokeStyle = isDark ? 'rgba(244, 63, 94, 0.4)' : 'rgba(244, 63, 94, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(72, 0);
    ctx.lineTo(72, height);
    ctx.stroke();
  } else if (background === 'music') {
    const staffSpacing = 9;
    const staffGap = 48;
    const staffTotalHeight = staffSpacing * 4;
    ctx.strokeStyle = 'rgba(100, 116, 139, 0.45)';
    ctx.lineWidth = 1;
    for (let topY = 64; topY < height - 40; topY += staffTotalHeight + staffGap) {
      for (let line = 0; line < 5; line++) {
        const y = topY + line * staffSpacing;
        ctx.beginPath();
        ctx.moveTo(32, y + 0.5);
        ctx.lineTo(width - 32, y + 0.5);
        ctx.stroke();
      }
    }
  } else if (background === 'isometric') {
    const size = 30;
    const h = (size * Math.sqrt(3)) / 2;
    ctx.strokeStyle = gridSubLineColor;
    ctx.lineWidth = 0.8;
    for (let y = 0; y < height; y += h) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    const tan60 = Math.tan(Math.PI / 3);
    for (let x = -height; x < width + height; x += size) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + height / tan60, height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x - height / tan60, height);
      ctx.stroke();
    }
  }

  ctx.restore();
}
