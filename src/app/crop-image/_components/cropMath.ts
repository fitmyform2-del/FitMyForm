export interface CropBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type DragAction = 'move' | 'nw' | 'ne' | 'se' | 'sw' | 'n' | 's' | 'e' | 'w' | null;

export function computeFreeformResize(
  action: DragAction,
  dx: number,
  dy: number,
  startBox: CropBox,
  naturalWidth: number,
  naturalHeight: number
): CropBox {
  const MIN = 30;
  const newBox = { ...startBox };

  if (action?.includes('e')) {
    newBox.width = Math.round(Math.max(MIN, Math.min(naturalWidth - startBox.x, startBox.width + dx)));
  }
  if (action?.includes('s')) {
    newBox.height = Math.round(Math.max(MIN, Math.min(naturalHeight - startBox.y, startBox.height + dy)));
  }
  if (action?.includes('w')) {
    const w = Math.round(Math.max(MIN, Math.min(startBox.x + startBox.width, startBox.width - dx)));
    newBox.x = startBox.x + (startBox.width - w);
    newBox.width = w;
  }
  if (action?.includes('n')) {
    const h = Math.round(Math.max(MIN, Math.min(startBox.y + startBox.height, startBox.height - dy)));
    newBox.y = startBox.y + (startBox.height - h);
    newBox.height = h;
  }
  return newBox;
}

export function computeAspectResize(
  action: DragAction,
  dx: number,
  dy: number,
  startBox: CropBox,
  naturalWidth: number,
  naturalHeight: number,
  ratio: number
): CropBox {
  const MIN = 30;
  let w = startBox.width;
  let h = startBox.height;

  if (action === 'se' || action === 'e' || action === 's') {
    const maxW = naturalWidth - startBox.x;
    const maxH = naturalHeight - startBox.y;
    const targetW = action === 's' ? (startBox.height + dy) * ratio : startBox.width + dx;
    w = Math.max(MIN, Math.min(maxW, targetW));
    h = Math.round(w / ratio);
    if (h > maxH) {
      h = maxH;
      w = Math.round(h * ratio);
    }
    return { x: startBox.x, y: startBox.y, width: Math.round(w), height: Math.round(h) };
  }

  if (action === 'sw') {
    const rightEdge = startBox.x + startBox.width;
    const targetW = startBox.width - dx;
    w = Math.max(MIN, Math.min(rightEdge, targetW));
    h = Math.round(w / ratio);
    if (startBox.y + h > naturalHeight) {
      h = naturalHeight - startBox.y;
      w = Math.round(h * ratio);
    }
    return { x: Math.round(rightEdge - w), y: startBox.y, width: Math.round(w), height: Math.round(h) };
  }

  if (action === 'ne') {
    const bottomEdge = startBox.y + startBox.height;
    const targetW = startBox.width + dx;
    w = Math.max(MIN, Math.min(naturalWidth - startBox.x, targetW));
    h = Math.round(w / ratio);
    if (bottomEdge - h < 0) {
      h = bottomEdge;
      w = Math.round(h * ratio);
    }
    return { x: startBox.x, y: Math.round(bottomEdge - h), width: Math.round(w), height: Math.round(h) };
  }

  if (action === 'nw' || action === 'w' || action === 'n') {
    const rightEdge = startBox.x + startBox.width;
    const bottomEdge = startBox.y + startBox.height;
    const targetW = action === 'n' ? (startBox.height - dy) * ratio : startBox.width - dx;
    w = Math.max(MIN, Math.min(rightEdge, targetW));
    h = Math.round(w / ratio);
    if (bottomEdge - h < 0) {
      h = bottomEdge;
      w = Math.round(h * ratio);
    }
    return {
      x: Math.round(rightEdge - w),
      y: Math.round(bottomEdge - h),
      width: Math.round(w),
      height: Math.round(h),
    };
  }

  return startBox;
}
