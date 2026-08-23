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
 * Remove Background based on color tolerance & edge threshold
 */
export function removeBackgroundCanvas(
  img: HTMLImageElement,
  targetColorHex: string = '#FFFFFF',
  tolerance: number = 30, // 0 to 100
  replacementColorHex: string | 'transparent' = 'transparent'
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
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

  const maxDist = (tolerance / 100) * 441.67; // Max Euclidean distance in RGB color space

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = Math.sqrt(
      (r - targetR) ** 2 + (g - targetG) ** 2 + (b - targetB) ** 2
    );

    if (dist <= maxDist) {
      data[i] = repR;
      data[i + 1] = repG;
      data[i + 2] = repB;
      data[i + 3] = repA;
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
