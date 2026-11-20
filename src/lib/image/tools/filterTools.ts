import { FilterOptions } from './types';

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

  // Normalize common HTML void tags into valid XHTML for SVG foreignObject
  const xhtml = htmlContent
    .replace(/<(br|hr|img|input)([^>]*?)(?<!\/)>/gi, '<$1$2 />')
    .replace(/&(?!(?:amp|lt|gt|quot|apos|#\d+|#x[0-9a-fA-F]+);)/g, '&amp;');

  const svgData = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <foreignObject width="100%" height="100%">
        <div xmlns="http://www.w3.org/1999/xhtml" style="width: 100%; height: 100%; background: ${bgColor}; color: #ffffff; font-family: system-ui, -apple-system, sans-serif; box-sizing: border-box; overflow: hidden; display: flex; align-items: center; justify-content: center; padding: 24px;">
          ${xhtml}
        </div>
      </foreignObject>
    </svg>
  `;

  const img = new Image();
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  try {
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = () => rej(new Error('Invalid HTML/XML markup — make sure all tags are properly closed.'));
      img.src = url;
    });
    ctx.drawImage(img, 0, 0);
  } finally {
    URL.revokeObjectURL(url);
  }
  return canvas;
}
