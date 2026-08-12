/**
 * Utility functions for HTML5 Canvas Image Editing & Processing
 * 100% Client-Side Privacy & Ultra-Fast Latency
 */

export interface FilterOptions {
  brightness: number; // 0 to 200 (default 100)
  contrast: number; // 0 to 200 (default 100)
  saturate: number; // 0 to 200 (default 100)
  grayscale: number; // 0 to 100 (default 0)
  sepia: number; // 0 to 100 (default 0)
  invert: number; // 0 to 100 (default 0)
  blur: number; // 0 to 20 (default 0)
  hueRotate: number; // 0 to 360 (default 0)
}

export interface WatermarkOptions {
  type: 'text' | 'image';
  text?: string;
  imageSrc?: string;
  opacity: number; // 0 to 1
  rotation: number; // degrees
  fontSize: number; // px
  fontColor: string;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile';
}

export interface BlurBox {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'pixelate' | 'gaussian';
  intensity: number;
}

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

  const maxDist = (tolerance / 100) * 441.67; // Max Euclidean distance in RGB color space (sqrt(255^2*3) = 441.67)

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

/**
 * Apply Watermark (Text or Image overlay)
 */
export async function watermarkImageCanvas(
  img: HTMLImageElement,
  options: WatermarkOptions
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, 0, 0);

  ctx.save();
  ctx.globalAlpha = options.opacity;

  if (options.type === 'text' && options.text) {
    ctx.font = `bold ${options.fontSize}px sans-serif`;
    ctx.fillStyle = options.fontColor;
    ctx.textBaseline = 'middle';

    const textMetrics = ctx.measureText(options.text);
    const textWidth = textMetrics.width;

    if (options.position === 'tile') {
      const stepX = textWidth + 80;
      const stepY = options.fontSize * 3;
      for (let y = stepY / 2; y < canvas.height; y += stepY) {
        for (let x = 0; x < canvas.width; x += stepX) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate((options.rotation * Math.PI) / 180);
          ctx.fillText(options.text, 0, 0);
          ctx.restore();
        }
      }
    } else {
      let x = canvas.width / 2;
      let y = canvas.height / 2;

      if (options.position === 'top-left') {
        x = textWidth / 2 + 20;
        y = options.fontSize + 20;
      } else if (options.position === 'top-right') {
        x = canvas.width - textWidth / 2 - 20;
        y = options.fontSize + 20;
      } else if (options.position === 'bottom-left') {
        x = textWidth / 2 + 20;
        y = canvas.height - options.fontSize - 20;
      } else if (options.position === 'bottom-right') {
        x = canvas.width - textWidth / 2 - 20;
        y = canvas.height - options.fontSize - 20;
      }

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((options.rotation * Math.PI) / 180);
      ctx.textAlign = 'center';
      ctx.fillText(options.text, 0, 0);
      ctx.restore();
    }
  } else if (options.type === 'image' && options.imageSrc) {
    const wmImg = new Image();
    wmImg.crossOrigin = 'anonymous';
    await new Promise((res, rej) => {
      wmImg.onload = res;
      wmImg.onerror = rej;
      wmImg.src = options.imageSrc!;
    });

    const wmWidth = Math.min(canvas.width * 0.3, wmImg.width);
    const wmHeight = (wmImg.height / wmImg.width) * wmWidth;

    let x = (canvas.width - wmWidth) / 2;
    let y = (canvas.height - wmHeight) / 2;

    if (options.position === 'top-left') {
      x = 20;
      y = 20;
    } else if (options.position === 'top-right') {
      x = canvas.width - wmWidth - 20;
      y = 20;
    } else if (options.position === 'bottom-left') {
      x = 20;
      y = canvas.height - wmHeight - 20;
    } else if (options.position === 'bottom-right') {
      x = canvas.width - wmWidth - 20;
      y = canvas.height - wmHeight - 20;
    }

    ctx.translate(x + wmWidth / 2, y + wmHeight / 2);
    ctx.rotate((options.rotation * Math.PI) / 180);
    ctx.drawImage(wmImg, -wmWidth / 2, -wmHeight / 2, wmWidth, wmHeight);
  }

  ctx.restore();
  return canvas;
}

/**
 * Blur/Pixelate rectangular regions over canvas
 */
export function blurRegionsCanvas(
  img: HTMLImageElement,
  boxes: BlurBox[]
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, 0, 0);

  for (const box of boxes) {
    if (box.width <= 0 || box.height <= 0) continue;

    if (box.type === 'pixelate') {
      const sampleSize = Math.max(4, Math.floor(box.intensity));
      const tempCanvas = document.createElement('canvas');
      const smallWidth = Math.max(1, Math.floor(box.width / sampleSize));
      const smallHeight = Math.max(1, Math.floor(box.height / sampleSize));

      tempCanvas.width = smallWidth;
      tempCanvas.height = smallHeight;
      const tempCtx = tempCanvas.getContext('2d')!;

      tempCtx.drawImage(
        canvas,
        box.x, box.y, box.width, box.height,
        0, 0, smallWidth, smallHeight
      );

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(
        tempCanvas,
        0, 0, smallWidth, smallHeight,
        box.x, box.y, box.width, box.height
      );
      ctx.imageSmoothingEnabled = true;
    } else {
      ctx.save();
      ctx.beginPath();
      ctx.rect(box.x, box.y, box.width, box.height);
      ctx.clip();
      ctx.filter = `blur(${Math.max(2, box.intensity)}px)`;
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    }
  }

  return canvas;
}

/**
 * Render Meme with Impact text, black outline stroke & upper case styling
 */
export function renderMemeCanvas(
  img: HTMLImageElement,
  topText: string,
  bottomText: string,
  fontSizeRatio: number = 0.08
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(img, 0, 0);

  const fontSize = Math.max(20, Math.floor(canvas.height * fontSizeRatio));
  ctx.font = `900 ${fontSize}px Impact, "Arial Black", sans-serif`;
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = Math.max(3, Math.floor(fontSize / 8));
  ctx.textAlign = 'center';

  if (topText.trim()) {
    ctx.textBaseline = 'top';
    const textUpper = topText.toUpperCase();
    ctx.strokeText(textUpper, canvas.width / 2, 20);
    ctx.fillText(textUpper, canvas.width / 2, 20);
  }

  if (bottomText.trim()) {
    ctx.textBaseline = 'bottom';
    const textUpper = bottomText.toUpperCase();
    ctx.strokeText(textUpper, canvas.width / 2, canvas.height - 20);
    ctx.fillText(textUpper, canvas.width / 2, canvas.height - 20);
  }

  return canvas;
}

/**
 * Apply filters (brightness, contrast, saturation, blur, etc.)
 */
export function applyFiltersCanvas(
  img: HTMLImageElement,
  filters: FilterOptions
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;

  const filterString = [
    `brightness(${filters.brightness}%)`,
    `contrast(${filters.contrast}%)`,
    `saturate(${filters.saturate}%)`,
    `grayscale(${filters.grayscale}%)`,
    `sepia(${filters.sepia}%)`,
    `invert(${filters.invert}%)`,
    `blur(${filters.blur}px)`,
    `hue-rotate(${filters.hueRotate}deg)`
  ].join(' ');

  ctx.filter = filterString;
  ctx.drawImage(img, 0, 0);
  return canvas;
}

/**
 * Render HTML / CSS string onto an image canvas
 */
export async function renderHtmlToCanvas(
  htmlContent: string,
  width: number = 800,
  height: number = 500,
  bgColor: string = '#0d121e'
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; background: ${bgColor}; color: #ffffff; font-family: system-ui, -apple-system, sans-serif; box-sizing: border-box; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 24px;">
          ${htmlContent}
        </div>
      </foreignObject>
    </svg>
  `;

  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  await new Promise((res, rej) => {
    img.onload = res;
    img.onerror = rej;
    img.src = url;
  });

  ctx.drawImage(img, 0, 0);
  URL.revokeObjectURL(url);
  return canvas;
}
