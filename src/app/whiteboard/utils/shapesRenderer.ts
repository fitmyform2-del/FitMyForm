import { ShapeElement, StickyNoteElement, MathElement } from '../types/whiteboard';

export { renderManipulative } from './manipulativesRenderer';

export function renderShape(ctx: CanvasRenderingContext2D, el: ShapeElement) {
  ctx.save();
  ctx.strokeStyle = el.strokeColor;
  ctx.lineWidth = el.strokeWidth;
  ctx.fillStyle = el.fillColor;

  if (el.strokeStyle === 'dashed') ctx.setLineDash([8, 6]);
  else if (el.strokeStyle === 'dotted') ctx.setLineDash([3, 4]);
  else ctx.setLineDash([]);

  const { x, y, width: w, height: h, shapeType } = el;

  ctx.beginPath();
  switch (shapeType) {
    case 'rectangle':
      ctx.rect(x, y, w, h);
      break;
    case 'rounded-rect': {
      const r = Math.min(16, Math.abs(w) / 4, Math.abs(h) / 4);
      if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
      else ctx.rect(x, y, w, h);
      break;
    }
    case 'circle':
    case 'ellipse': {
      const rx = Math.abs(w) / 2;
      const ry = Math.abs(h) / 2;
      ctx.ellipse(x + rx, y + ry, rx, ry, 0, 0, Math.PI * 2);
      break;
    }
    case 'triangle':
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      break;
    case 'right-triangle':
      ctx.moveTo(x, y);
      ctx.lineTo(x, y + h);
      ctx.lineTo(x + w, y + h);
      ctx.closePath();
      break;
    case 'diamond':
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h / 2);
      ctx.lineTo(x + w / 2, y + h);
      ctx.lineTo(x, y + h / 2);
      ctx.closePath();
      break;
    case 'star': {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const spikes = 5;
      const outerR = Math.min(Math.abs(w), Math.abs(h)) / 2;
      const innerR = outerR * 0.45;
      let rot = (Math.PI / 2) * 3;
      const step = Math.PI / spikes;
      ctx.moveTo(cx, cy - outerR);
      for (let i = 0; i < spikes; i++) {
        ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
        rot += step;
        ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
        rot += step;
      }
      ctx.closePath();
      break;
    }
    case 'polygon': {
      const cx = x + w / 2;
      const cy = y + h / 2;
      const r = Math.min(Math.abs(w), Math.abs(h)) / 2;
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI) / 3;
        const px = cx + r * Math.cos(angle);
        const py = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }
    case 'line':
      ctx.moveTo(x, y);
      ctx.lineTo(x + w, y + h);
      break;
    case 'arrow':
      drawArrow(ctx, x, y, x + w, y + h, false);
      break;
    case 'double-arrow':
      drawArrow(ctx, x, y, x + w, y + h, true);
      break;
    case 'curved-arrow':
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + w * 0.2, y + h * 0.8, x + w, y + h);
      break;
  }

  if (el.isFilled && shapeType !== 'line' && !shapeType.includes('arrow')) {
    ctx.fill();
  }
  ctx.stroke();
  ctx.restore();
}

function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number, double: boolean) {
  const headLen = 14;
  const angle = Math.atan2(toY - fromY, toX - fromX);
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(toX, toY);
  ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
  if (double) {
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(fromX + headLen * Math.cos(angle - Math.PI / 6), fromY + headLen * Math.sin(angle - Math.PI / 6));
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(fromX + headLen * Math.cos(angle + Math.PI / 6), fromY + headLen * Math.sin(angle + Math.PI / 6));
  }
}

export function renderStickyNote(ctx: CanvasRenderingContext2D, el: StickyNoteElement) {
  const colorMap: Record<string, { bg: string; border: string; text: string }> = {
    yellow: { bg: '#fef08a', border: '#eab308', text: '#713f12' },
    blue: { bg: '#bae6fd', border: '#0284c7', text: '#0c4a6e' },
    green: { bg: '#bbf7d0', border: '#16a34a', text: '#14532d' },
    pink: { bg: '#fbcfe8', border: '#db2777', text: '#831843' },
    purple: { bg: '#e9d5ff', border: '#9333ea', text: '#581c87' },
    orange: { bg: '#fed7aa', border: '#ea580c', text: '#7c2d12' }
  };
  const theme = colorMap[el.color] || colorMap.yellow;
  const { x, y, width: w, height: h } = el;

  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;

  ctx.fillStyle = theme.bg;
  ctx.fillRect(x, y, w, h);

  ctx.shadowColor = 'transparent';
  ctx.strokeStyle = theme.border;
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = theme.border;
  ctx.beginPath();
  ctx.moveTo(x + w - 16, y);
  ctx.lineTo(x + w, y + 16);
  ctx.lineTo(x + w - 16, y + 16);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = theme.text;
  ctx.font = `${el.fontSize || 16}px system-ui, sans-serif`;
  ctx.textBaseline = 'top';
  const lines = el.text.split('\n');
  const lineHeight = (el.fontSize || 16) * 1.35;
  lines.forEach((line, idx) => {
    if ((idx + 1) * lineHeight < h - 20) {
      ctx.fillText(line, x + 12, y + 16 + idx * lineHeight, w - 24);
    }
  });

  ctx.restore();
}

export function renderMathBlock(ctx: CanvasRenderingContext2D, el: MathElement) {
  ctx.save();
  const { x, y, width: w, height: h } = el;
  ctx.fillStyle = 'rgba(30, 41, 59, 0.9)';
  ctx.strokeStyle = '#38bdf8';
  if (ctx.roundRect) ctx.roundRect(x, y, w, h, 8);
  else ctx.fillRect(x, y, w, h);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = el.color || '#f8fafc';
  ctx.font = `italic 600 ${el.fontSize || 22}px 'Times New Roman', serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(el.renderedText || el.latex, x + w / 2, y + h / 2, w - 20);
  ctx.restore();
}
