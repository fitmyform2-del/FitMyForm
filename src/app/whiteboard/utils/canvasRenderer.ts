import { WhiteboardPage, WhiteboardElement, LaserPoint } from '../types/whiteboard';
import { renderBackground } from './gridRenderer';
import { renderShape, renderStickyNote, renderMathBlock, renderManipulative } from './shapesRenderer';

export function renderWhiteboard(
  ctx: CanvasRenderingContext2D,
  page: WhiteboardPage,
  zoom: number,
  pan: { x: number; y: number },
  selectedIds: string[],
  draftElement: WhiteboardElement | null,
  laserPoints: LaserPoint[],
  canvasWidth: number,
  canvasHeight: number
) {
  // Clear full canvas buffer
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // Apply zoom and pan transformations
  ctx.translate(pan.x, pan.y);
  ctx.scale(zoom, zoom);

  // 1. Draw Page Background
  renderBackground(ctx, canvasWidth / zoom, canvasHeight / zoom, page.background, page.customBgColor, page.backgroundImage);

  // 2. Draw Committed Elements
  for (const el of page.elements) {
    renderElement(ctx, el);
  }

  // 3. Draw In-progress Draft Element
  if (draftElement) {
    renderElement(ctx, draftElement);
  }

  // 4. Draw Laser Pointer Trails
  renderLaserTrail(ctx, laserPoints);

  // 5. Draw Selection Bounds & Handles
  if (selectedIds.length > 0) {
    renderSelectionUI(ctx, page.elements, selectedIds);
  }

  ctx.restore();
}

function renderElement(ctx: CanvasRenderingContext2D, el: WhiteboardElement) {
  ctx.save();
  if (el.opacity !== undefined) ctx.globalAlpha = el.opacity;
  if (el.rotation) {
    const cx = el.x + el.width / 2;
    const cy = el.y + el.height / 2;
    ctx.translate(cx, cy);
    ctx.rotate((el.rotation * Math.PI) / 180);
    ctx.translate(-cx, -cy);
  }

  switch (el.type) {
    case 'stroke':
      renderStroke(ctx, el);
      break;
    case 'shape':
      renderShape(ctx, el);
      break;
    case 'text':
      renderText(ctx, el);
      break;
    case 'stickynote':
      renderStickyNote(ctx, el);
      break;
    case 'math':
      renderMathBlock(ctx, el);
      break;
    case 'image':
      renderImage(ctx, el);
      break;
    case 'manipulative':
      renderManipulative(ctx, el);
      break;
  }
  ctx.restore();
}

function renderStroke(ctx: CanvasRenderingContext2D, el: WhiteboardElement & { type: 'stroke' }) {
  if (el.points.length === 0) return;
  ctx.save();
  ctx.strokeStyle = el.strokeColor;
  ctx.lineWidth = el.strokeWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  if (el.tool === 'highlighter') {
    ctx.globalAlpha = 0.35;
    ctx.lineWidth = Math.max(el.strokeWidth, 20);
  }

  ctx.beginPath();
  if (el.points.length === 1) {
    ctx.arc(el.points[0].x, el.points[0].y, el.strokeWidth / 2, 0, Math.PI * 2);
    ctx.fillStyle = el.strokeColor;
    ctx.fill();
  } else {
    ctx.moveTo(el.points[0].x, el.points[0].y);
    for (let i = 1; i < el.points.length - 1; i++) {
      const xc = (el.points[i].x + el.points[i + 1].x) / 2;
      const yc = (el.points[i].y + el.points[i + 1].y) / 2;
      ctx.quadraticCurveTo(el.points[i].x, el.points[i].y, xc, yc);
    }
    const last = el.points[el.points.length - 1];
    ctx.lineTo(last.x, last.y);
    ctx.stroke();
  }
  ctx.restore();
}

function renderText(ctx: CanvasRenderingContext2D, el: WhiteboardElement & { type: 'text' }) {
  ctx.save();
  const fontStyle = `${el.italic ? 'italic ' : ''}${el.bold ? 'bold ' : ''}`;
  ctx.font = `${fontStyle}${el.fontSize || 20}px ${el.fontFamily || 'sans-serif'}`;
  ctx.fillStyle = el.color;
  ctx.textAlign = el.align || 'left';
  ctx.textBaseline = 'top';

  if (el.backgroundColor) {
    ctx.fillStyle = el.backgroundColor;
    ctx.fillRect(el.x, el.y, el.width, el.height);
    ctx.fillStyle = el.color;
  }

  const lines = el.text.split('\n');
  const lineHeight = (el.fontSize || 20) * 1.3;
  let startX = el.x;
  if (el.align === 'center') startX = el.x + el.width / 2;
  else if (el.align === 'right') startX = el.x + el.width;

  lines.forEach((line, i) => {
    ctx.fillText(line, startX, el.y + i * lineHeight);
  });
  ctx.restore();
}

const imageCache = new Map<string, HTMLImageElement>();
function renderImage(ctx: CanvasRenderingContext2D, el: WhiteboardElement & { type: 'image' }) {
  let img = imageCache.get(el.src);
  if (!img) {
    img = new Image();
    img.src = el.src;
    imageCache.set(el.src, img);
  }
  if (img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, el.x, el.y, el.width, el.height);
  }
}

function renderLaserTrail(ctx: CanvasRenderingContext2D, laserPoints: LaserPoint[]) {
  const now = Date.now();
  for (let i = 0; i < laserPoints.length; i++) {
    const pt = laserPoints[i];
    const age = now - pt.time;
    if (age > 1500) continue;
    const alpha = (1 - age / 1500);

    ctx.save();
    ctx.fillStyle = pt.color || '#ef4444';
    ctx.shadowColor = pt.color || '#ef4444';
    ctx.shadowBlur = 12;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function renderSelectionUI(ctx: CanvasRenderingContext2D, elements: WhiteboardElement[], selectedIds: string[]) {
  const selected = elements.filter((e) => selectedIds.includes(e.id));
  if (selected.length === 0) return;

  for (const el of selected) {
    ctx.save();
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    const pad = 6;
    ctx.strokeRect(el.x - pad, el.y - pad, el.width + pad * 2, el.height + pad * 2);

    // Corner resize handles
    ctx.setLineDash([]);
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 1.5;
    const handleSize = 8;
    const corners = [
      { x: el.x - pad, y: el.y - pad },
      { x: el.x + el.width + pad, y: el.y - pad },
      { x: el.x + el.width + pad, y: el.y + el.height + pad },
      { x: el.x - pad, y: el.y + el.height + pad }
    ];
    for (const c of corners) {
      ctx.fillRect(c.x - handleSize / 2, c.y - handleSize / 2, handleSize, handleSize);
      ctx.strokeRect(c.x - handleSize / 2, c.y - handleSize / 2, handleSize, handleSize);
    }
    ctx.restore();
  }
}
