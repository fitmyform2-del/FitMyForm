import { WhiteboardElement, StrokeElement, Point } from '../types/whiteboard';

export function getCanvasCoords(
  e: { clientX: number; clientY: number },
  canvas: HTMLCanvasElement,
  zoom: number,
  pan: { x: number; y: number }
): { x: number; y: number } {
  const rect = canvas.getBoundingClientRect();
  const clientX = e.clientX - rect.left;
  const clientY = e.clientY - rect.top;
  return {
    x: (clientX - pan.x) / zoom,
    y: (clientY - pan.y) / zoom
  };
}

export function hitTestElement(el: WhiteboardElement, px: number, py: number): boolean {
  if (el.type === 'stroke') {
    return isPointNearStroke(el, px, py, Math.max(el.strokeWidth, 8));
  }
  const minX = Math.min(el.x, el.x + el.width);
  const maxX = Math.max(el.x, el.x + el.width);
  const minY = Math.min(el.y, el.y + el.height);
  const maxY = Math.max(el.y, el.y + el.height);
  return px >= minX && px <= maxX && py >= minY && py <= maxY;
}

export function hitTestResizeHandle(el: WhiteboardElement, px: number, py: number): boolean {
  if (el.type === 'stroke') return false;
  const handleX = el.x + el.width;
  const handleY = el.y + el.height;
  return Math.hypot(px - handleX, py - handleY) <= 16;
}

export function isPointNearStroke(stroke: StrokeElement, px: number, py: number, tolerance: number): boolean {
  for (let i = 0; i < stroke.points.length - 1; i++) {
    const p1 = stroke.points[i];
    const p2 = stroke.points[i + 1];
    const dist = distToSegment({ x: px, y: py }, p1, p2);
    if (dist <= tolerance) return true;
  }
  return false;
}

function distToSegment(p: Point, v: Point, w: Point): number {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
}

export function createId(prefix = 'el'): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
}
