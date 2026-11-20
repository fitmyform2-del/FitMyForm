import { ManipulativeElement } from '../types/whiteboard';

export function renderManipulative(ctx: CanvasRenderingContext2D, el: ManipulativeElement) {
  ctx.save();
  const { x, y, width: w, height: h, manipulativeType, data } = el;

  if (manipulativeType === 'ruler') {
    renderRuler(ctx, x, y, w, h);
  } else if (manipulativeType === 'protractor') {
    renderProtractor(ctx, x, y, w, h);
  } else if (manipulativeType === 'ten-frame') {
    renderTenFrame(ctx, x, y, w, h, (data.filled as number) || 0);
  } else if (manipulativeType === 'sticker') {
    ctx.font = `${Math.min(w, h) * 0.75}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText((data.emoji as string) || '⭐', x + w / 2, y + h / 2);
  }

  ctx.restore();
}

function renderRuler(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = 'rgba(254, 240, 138, 0.9)';
  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 1.5;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = '#713f12';
  ctx.font = '10px monospace';
  const cmStep = 37.8;
  const totalCm = Math.floor(w / cmStep);
  for (let i = 0; i <= totalCm; i++) {
    const curX = x + i * cmStep;
    ctx.beginPath();
    ctx.moveTo(curX, y);
    ctx.lineTo(curX, y + 16);
    ctx.stroke();
    if (i > 0) ctx.fillText(`${i}`, curX - 3, y + 26);
    if (i < totalCm) {
      ctx.beginPath();
      ctx.moveTo(curX + cmStep / 2, y);
      ctx.lineTo(curX + cmStep / 2, y + 10);
      ctx.stroke();
    }
  }
}

function renderProtractor(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.fillStyle = 'rgba(56, 189, 248, 0.35)';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 2;
  const cx = x + w / 2;
  const cy = y + h;
  const r = Math.min(w / 2, h);

  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0, false);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0f172a';
  ctx.font = '9px sans-serif';
  for (let deg = 0; deg <= 180; deg += 10) {
    const rad = Math.PI - (deg * Math.PI) / 180;
    const tx = cx + (r - 12) * Math.cos(rad);
    const ty = cy - (r - 12) * Math.sin(rad);
    ctx.beginPath();
    ctx.moveTo(cx + r * Math.cos(rad), cy - r * Math.sin(rad));
    ctx.lineTo(tx, ty);
    ctx.stroke();
    if (deg % 30 === 0 && deg > 0 && deg < 180) {
      ctx.fillText(`${deg}°`, cx + (r - 24) * Math.cos(rad) - 6, cy - (r - 24) * Math.sin(rad));
    }
  }
}

function renderTenFrame(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, filled: number) {
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);

  const cellW = w / 5;
  const cellH = h / 2;
  for (let c = 1; c < 5; c++) {
    ctx.beginPath();
    ctx.moveTo(x + c * cellW, y);
    ctx.lineTo(x + c * cellW, y + h);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(x, y + cellH);
  ctx.lineTo(x + w, y + cellH);
  ctx.stroke();

  for (let i = 0; i < 10; i++) {
    if (i < filled) {
      const col = i % 5;
      const row = Math.floor(i / 5);
      ctx.fillStyle = i < 5 ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(x + col * cellW + cellW / 2, y + row * cellH + cellH / 2, Math.min(cellW, cellH) * 0.35, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
