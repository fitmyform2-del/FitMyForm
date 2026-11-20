export interface WhiteBgConfig {
  enabled: boolean;
  /** Color distance tolerance (15-95), default 42 */
  tolerance?: number;
  /** Target fill hex color, default '#FFFFFF' */
  fillColor?: string;
}

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean.padEnd(6, 'F').slice(0, 6);
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/**
 * Edge-connected flood-fill passport background whitener.
 * Samples corner & top-edge pixels to identify the backdrop color,
 * flood-fills inward from edges so foreground face/clothing is preserved,
 * and smoothly feathers boundary pixels to avoid harsh jagged cutouts.
 */
export function applyWhiteBackground(
  canvas: HTMLCanvasElement,
  config: WhiteBgConfig
): void {
  if (!config.enabled) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;
  if (w < 4 || h < 4) return;

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  const tolerance = Math.max(10, Math.min(110, config.tolerance ?? 42));
  const softRange = tolerance * 1.45;
  const [fillR, fillG, fillB] = hexToRgb(config.fillColor || '#FFFFFF');

  // Sample perimeter seeds (top edge + upper left/right corners) to estimate backdrop color
  const sampleCoords: Array<[number, number]> = [
    [0, 0],
    [w - 1, 0],
    [Math.floor(w * 0.15), 0],
    [Math.floor(w * 0.85), 0],
    [0, Math.floor(h * 0.18)],
    [w - 1, Math.floor(h * 0.18)],
    [0, Math.floor(h * 0.35)],
    [w - 1, Math.floor(h * 0.35)]
  ];

  let sumR = 0;
  let sumG = 0;
  let sumB = 0;
  for (const [sx, sy] of sampleCoords) {
    const idx = (sy * w + sx) * 4;
    sumR += data[idx];
    sumG += data[idx + 1];
    sumB += data[idx + 2];
  }
  const bgR = sumR / sampleCoords.length;
  const bgG = sumG / sampleCoords.length;
  const bgB = sumB / sampleCoords.length;

  const colorDist = (r: number, g: number, b: number, tr: number, tg: number, tb: number) => {
    const dr = r - tr;
    const dg = g - tg;
    const db = b - tb;
    return Math.sqrt(dr * dr * 0.3 + dg * dg * 0.59 + db * db * 0.11) * 1.732;
  };

  // Flood-fill mask: 0 = unvisited, 1 = background, 2 = soft feather border
  const mask = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const enqueueIfBg = (x: number, y: number) => {
    const pos = y * w + x;
    if (mask[pos] !== 0) return;
    const idx = pos * 4;
    const dist = colorDist(data[idx], data[idx + 1], data[idx + 2], bgR, bgG, bgB);
    if (dist <= tolerance) {
      mask[pos] = 1;
      queue[tail++] = pos;
    } else if (dist <= softRange) {
      mask[pos] = 2;
    }
  };

  // Seed along top, left, and right edges (and corners of bottom edge)
  for (let x = 0; x < w; x++) {
    enqueueIfBg(x, 0);
  }
  for (let y = 0; y < Math.floor(h * 0.85); y++) {
    enqueueIfBg(0, y);
    enqueueIfBg(w - 1, y);
  }
  enqueueIfBg(0, h - 1);
  enqueueIfBg(w - 1, h - 1);

  // BFS flood-fill using local + global similarity to handle subtle studio lighting gradients
  while (head < tail) {
    const pos = queue[head++];
    const x = pos % w;
    const y = (pos - x) / w;
    const pIdx = pos * 4;
    const pr = data[pIdx];
    const pg = data[pIdx + 1];
    const pb = data[pIdx + 2];

    const neighbors: Array<[number, number]> = [
      [x - 1, y],
      [x + 1, y],
      [x, y - 1],
      [x, y + 1]
    ];

    for (const [nx, ny] of neighbors) {
      if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
      const nPos = ny * w + nx;
      if (mask[nPos] !== 0) continue;

      const nIdx = nPos * 4;
      const nr = data[nIdx];
      const ng = data[nIdx + 1];
      const nb = data[nIdx + 2];

      const globalDist = colorDist(nr, ng, nb, bgR, bgG, bgB);
      const localDist = colorDist(nr, ng, nb, pr, pg, pb);

      if (globalDist <= tolerance || (globalDist <= tolerance * 1.3 && localDist <= tolerance * 0.45)) {
        mask[nPos] = 1;
        queue[tail++] = nPos;
      } else if (globalDist <= softRange) {
        mask[nPos] = 2;
      }
    }
  }

  // Apply fill with smooth 1px edge anti-aliasing
  for (let i = 0; i < w * h; i++) {
    const m = mask[i];
    if (m === 0) continue;
    const idx = i * 4;

    if (m === 1) {
      data[idx] = fillR;
      data[idx + 1] = fillG;
      data[idx + 2] = fillB;
    } else if (m === 2) {
      const dist = colorDist(data[idx], data[idx + 1], data[idx + 2], bgR, bgG, bgB);
      const alpha = Math.max(0, Math.min(1, 1 - (dist - tolerance) / (softRange - tolerance)));
      data[idx] = Math.round(data[idx] * (1 - alpha) + fillR * alpha);
      data[idx + 1] = Math.round(data[idx + 1] * (1 - alpha) + fillG * alpha);
      data[idx + 2] = Math.round(data[idx + 2] * (1 - alpha) + fillB * alpha);
    }
  }

  ctx.putImageData(imgData, 0, 0);
}
