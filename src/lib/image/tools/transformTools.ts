/**
 * Rotate and/or Flip Image Canvas
 */
export function rotateAndFlipCanvas(
  img: HTMLImageElement,
  angleDegrees: number, // 0, 90, 180, 270
  flipHorizontal: boolean = false,
  flipVertical: boolean = false
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const rad = (angleDegrees * Math.PI) / 180;
  const isQuarterTurn = angleDegrees === 90 || angleDegrees === 270;

  canvas.width = isQuarterTurn ? img.height : img.width;
  canvas.height = isQuarterTurn ? img.width : img.height;

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rad);
  ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  return canvas;
}

/**
 * Remove Background based on color tolerance & contiguous edge flood fill
 */
export function removeBackgroundCanvas(
  img: HTMLImageElement,
  targetColorHex: string = '#FFFFFF',
  tolerance: number = 25, // 0 to 100
  replacementColorHex: string | 'transparent' = 'transparent',
  mode: 'contiguous' | 'global' = 'contiguous',
  seedPoint?: { x: number; y: number }
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const w = img.width;
  const h = img.height;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // Convert Hex target color to RGB
  const hex = targetColorHex.replace('#', '');
  const targetR = parseInt(hex.substring(0, 2), 16) || 255;
  const targetG = parseInt(hex.substring(2, 4), 16) || 255;
  const targetB = parseInt(hex.substring(4, 6), 16) || 255;

  let repR = 0, repG = 0, repB = 0, repA = 0;
  if (replacementColorHex !== 'transparent') {
    const rHex = replacementColorHex.replace('#', '');
    repR = parseInt(rHex.substring(0, 2), 16) || 255;
    repG = parseInt(rHex.substring(2, 4), 16) || 255;
    repB = parseInt(rHex.substring(4, 6), 16) || 255;
    repA = 255;
  }

  const maxDist = (tolerance / 100) * 441.67;
  const innerDist = maxDist * 0.7; // Inner boundary for soft feathering

  const colorMatch = (idx: number): number => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    return Math.sqrt((r - targetR) ** 2 + (g - targetG) ** 2 + (b - targetB) ** 2);
  };

  if (mode === 'global') {
    for (let i = 0; i < data.length; i += 4) {
      const dist = colorMatch(i);
      if (dist <= maxDist) {
        if (replacementColorHex === 'transparent') {
          const alphaFactor = dist <= innerDist ? 0 : (dist - innerDist) / (maxDist - innerDist);
          data[i + 3] = Math.round(data[i + 3] * alphaFactor);
        } else {
          data[i] = repR;
          data[i + 1] = repG;
          data[i + 2] = repB;
          data[i + 3] = repA;
        }
      }
    }
  } else {
    // Contiguous Flood Fill from borders or clicked seed point
    const visited = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    let head = 0;
    let tail = 0;

    const pushPixel = (px: number, py: number) => {
      if (px < 0 || px >= w || py < 0 || py >= h) return;
      const pIdx = py * w + px;
      if (visited[pIdx]) return;
      visited[pIdx] = 1;

      const byteIdx = pIdx * 4;
      const dist = colorMatch(byteIdx);
      if (dist <= maxDist) {
        queue[tail++] = pIdx;
      }
    };

    if (seedPoint && seedPoint.x >= 0 && seedPoint.x < w && seedPoint.y >= 0 && seedPoint.y < h) {
      pushPixel(Math.round(seedPoint.x), Math.round(seedPoint.y));
    } else {
      // Seed from perimeter borders
      for (let x = 0; x < w; x++) {
        pushPixel(x, 0);
        pushPixel(x, h - 1);
      }
      for (let y = 1; y < h - 1; y++) {
        pushPixel(0, y);
        pushPixel(w - 1, y);
      }
    }

    // BFS Expansion
    while (head < tail) {
      const pIdx = queue[head++];
      const px = pIdx % w;
      const py = Math.floor(pIdx / w);

      pushPixel(px + 1, py);
      pushPixel(px - 1, py);
      pushPixel(px, py + 1);
      pushPixel(px, py - 1);
    }

    // Apply replacement to all reached background pixels with feathering
    for (let i = 0; i < tail; i++) {
      const pIdx = queue[i];
      const byteIdx = pIdx * 4;
      const dist = colorMatch(byteIdx);

      if (replacementColorHex === 'transparent') {
        const alphaFactor = dist <= innerDist ? 0 : (dist - innerDist) / (maxDist - innerDist);
        data[byteIdx + 3] = Math.round(data[byteIdx + 3] * alphaFactor);
      } else {
        data[byteIdx] = repR;
        data[byteIdx + 1] = repG;
        data[byteIdx + 2] = repB;
        data[byteIdx + 3] = repA;
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas;
}

/**
 * Upscale Image (2x or 4x) using bicubic canvas scaling and sharpening
 */
export function upscaleImageCanvas(
  img: HTMLImageElement,
  scaleFactor: 2 | 4 = 2,
  sharpenAmount: number = 0.3 // 0 to 1
): HTMLCanvasElement {
  const targetWidth = img.width * scaleFactor;
  const targetHeight = img.height * scaleFactor;

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext('2d')!;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

  if (sharpenAmount > 0) {
    const imgData = ctx.getImageData(0, 0, targetWidth, targetHeight);
    const pixels = imgData.data;
    const w = targetWidth;
    const h = targetHeight;

    const kernel = [
      0, -sharpenAmount, 0,
      -sharpenAmount, 1 + 4 * sharpenAmount, -sharpenAmount,
      0, -sharpenAmount, 0
    ];

    const copy = new Uint8ClampedArray(pixels);

    for (let y = 1; y < h - 1; y++) {
      for (let x = 1; x < w - 1; x++) {
        for (let c = 0; c < 3; c++) {
          const idx = (y * w + x) * 4 + c;
          let val = 0;

          val += copy[((y - 1) * w + (x - 1)) * 4 + c] * kernel[0];
          val += copy[((y - 1) * w + x) * 4 + c] * kernel[1];
          val += copy[((y - 1) * w + (x + 1)) * 4 + c] * kernel[2];
          val += copy[(y * w + (x - 1)) * 4 + c] * kernel[3];
          val += copy[(y * w + x) * 4 + c] * kernel[4];
          val += copy[(y * w + (x + 1)) * 4 + c] * kernel[5];
          val += copy[((y + 1) * w + (x - 1)) * 4 + c] * kernel[6];
          val += copy[((y + 1) * w + x) * 4 + c] * kernel[7];
          val += copy[((y + 1) * w + (x + 1)) * 4 + c] * kernel[8];

          pixels[idx] = Math.min(255, Math.max(0, val));
        }
      }
    }
    ctx.putImageData(imgData, 0, 0);
  }

  return canvas;
}
