import { WatermarkOptions, BlurBox } from './types';

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

    const x = Math.max(0, Math.min(Math.round(box.x), canvas.width - 1));
    const y = Math.max(0, Math.min(Math.round(box.y), canvas.height - 1));
    const w = Math.min(Math.round(box.width), canvas.width - x);
    const h = Math.min(Math.round(box.height), canvas.height - y);
    if (w <= 0 || h <= 0) continue;

    if (box.type === 'censor') {
      ctx.fillStyle = '#000000';
      ctx.fillRect(x, y, w, h);
    } else if (box.type === 'pixelate') {
      const sampleSize = Math.max(4, Math.floor(box.intensity || 14));
      const smallW = Math.max(1, Math.floor(w / sampleSize));
      const smallH = Math.max(1, Math.floor(h / sampleSize));

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = smallW;
      tempCanvas.height = smallH;
      const tempCtx = tempCanvas.getContext('2d')!;

      tempCtx.drawImage(canvas, x, y, w, h, 0, 0, smallW, smallH);

      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(tempCanvas, 0, 0, smallW, smallH, x, y, w, h);
      ctx.imageSmoothingEnabled = true;
    } else {
      const blurRadius = Math.max(4, Math.floor(box.intensity || 16));
      const bleed = Math.min(blurRadius * 2, 40);
      const bx = Math.max(0, x - bleed);
      const by = Math.max(0, y - bleed);
      const bw = Math.min(canvas.width - bx, w + bleed * 2);
      const bh = Math.min(canvas.height - by, h + bleed * 2);

      const subCanvas = document.createElement('canvas');
      subCanvas.width = bw;
      subCanvas.height = bh;
      const subCtx = subCanvas.getContext('2d')!;
      subCtx.drawImage(canvas, bx, by, bw, bh, 0, 0, bw, bh);

      const blurredCanvas = document.createElement('canvas');
      blurredCanvas.width = bw;
      blurredCanvas.height = bh;
      const blurredCtx = blurredCanvas.getContext('2d')!;
      blurredCtx.filter = `blur(${blurRadius}px)`;
      blurredCtx.drawImage(subCanvas, 0, 0);

      ctx.drawImage(blurredCanvas, x - bx, y - by, w, h, x, y, w, h);
    }
  }

  return canvas;
}

/**
 * Render Meme with Impact text, black outline stroke, multi-line wrap & upper case styling
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

  const maxW = canvas.width * 0.9;
  const lineHeight = fontSize * 1.15;

  if (topText.trim()) {
    ctx.textBaseline = 'top';
    wrapMemeText(ctx, topText, canvas.width / 2, 20, maxW, lineHeight, false);
  }

  if (bottomText.trim()) {
    ctx.textBaseline = 'bottom';
    wrapMemeText(ctx, bottomText, canvas.width / 2, canvas.height - 20, maxW, lineHeight, true);
  }

  return canvas;
}

function wrapMemeText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  isBottom: boolean
) {
  const words = text.toUpperCase().split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const testLine = `${currentLine} ${words[i]}`;
    if (ctx.measureText(testLine).width < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine);
      currentLine = words[i];
    }
  }
  lines.push(currentLine);

  const startY = isBottom ? y - (lines.length - 1) * lineHeight : y;
  lines.forEach((line, index) => {
    const lineY = startY + index * lineHeight;
    ctx.strokeText(line, x, lineY);
    ctx.fillText(line, x, lineY);
  });
}
