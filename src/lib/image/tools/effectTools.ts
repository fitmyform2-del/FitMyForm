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
