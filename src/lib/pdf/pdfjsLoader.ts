export interface RenderedPdfPage {
  pageNum: number;
  dataUrl: string;
  width: number;
  height: number;
}

export interface ExtractedPdfPageText {
  pageNum: number;
  text: string;
}

let workerConfigured = false;

export async function getPdfJs() {
  const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
  if (!workerConfigured && typeof window !== 'undefined') {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    workerConfigured = true;
  }
  return pdfjs;
}

export async function loadPdfDocument(fileOrBuffer: File | ArrayBuffer, password?: string) {
  const pdfjs = await getPdfJs();
  const data = fileOrBuffer instanceof File ? await fileOrBuffer.arrayBuffer() : fileOrBuffer.slice(0);
  const loadingTask = pdfjs.getDocument({
    data: new Uint8Array(data),
    ...(password ? { password } : {})
  });
  return loadingTask.promise;
}

export async function renderPdfPageToCanvas(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdfDoc: any,
  pageNum: number,
  scale: number = 1.5
): Promise<HTMLCanvasElement> {
  const page = await pdfDoc.getPage(pageNum);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.floor(viewport.width));
  canvas.height = Math.max(1, Math.floor(viewport.height));
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context not available');

  // White background for transparent PDF pages
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  await page.render({ canvasContext: ctx, viewport }).promise;
  return canvas;
}

export async function renderPdfAllPagesToDataUrls(
  file: File,
  options?: {
    scale?: number;
    format?: 'image/jpeg' | 'image/png';
    quality?: number;
    maxPages?: number;
  }
): Promise<RenderedPdfPage[]> {
  const scale = options?.scale ?? 1.75;
  const format = options?.format ?? 'image/jpeg';
  const quality = options?.quality ?? 0.92;
  const pdf = await loadPdfDocument(file);
  const total = options?.maxPages ? Math.min(pdf.numPages, options.maxPages) : pdf.numPages;

  const results: RenderedPdfPage[] = [];
  for (let i = 1; i <= total; i++) {
    const canvas = await renderPdfPageToCanvas(pdf, i, scale);
    results.push({
      pageNum: i,
      dataUrl: canvas.toDataURL(format, quality),
      width: canvas.width,
      height: canvas.height
    });
  }
  return results;
}

export async function extractPdfTextByPage(file: File): Promise<ExtractedPdfPageText[]> {
  const pdf = await loadPdfDocument(file);
  const pages: ExtractedPdfPageText[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    let lastY: number | null = null;
    const lines: string[] = [];
    let currentLine = '';

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    for (const item of textContent.items as any[]) {
      if (typeof item.str !== 'string') continue;
      const y = Array.isArray(item.transform) ? Math.round(item.transform[5]) : null;
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 4) {
        if (currentLine.trim()) lines.push(currentLine.trim());
        currentLine = item.str;
      } else {
        currentLine += (currentLine && !currentLine.endsWith(' ') && !item.str.startsWith(' ') ? ' ' : '') + item.str;
      }
      if (item.hasEOL) {
        if (currentLine.trim()) lines.push(currentLine.trim());
        currentLine = '';
        lastY = null;
      } else {
        lastY = y;
      }
    }
    if (currentLine.trim()) lines.push(currentLine.trim());

    pages.push({
      pageNum: i,
      text: lines.join('\n')
    });
  }

  return pages;
}

/** Strips characters outside WinAnsi range so StandardFonts in pdf-lib never throw */
export function sanitizeWinAnsi(text: string): string {
  return text
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/\u2026/g, '...')
    .replace(/[^\x20-\x7E\xA0-\xFF]/g, ' ');
}
