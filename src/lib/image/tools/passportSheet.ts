import { PDFDocument } from 'pdf-lib';

export type SheetPaperSize = '4x6' | 'a4-12' | 'a4-30';

export interface PassportSheetSpec {
  id: SheetPaperSize;
  label: string;
  subtitle: string;
  /** Sheet dimensions at 300 DPI */
  widthPx: number;
  heightPx: number;
  /** Physical dimensions in PDF points (72 pt = 1 inch) */
  widthPt: number;
  heightPt: number;
  cols: number;
  rows: number;
}

export const PASSPORT_SHEET_SPECS: Record<SheetPaperSize, PassportSheetSpec> = {
  '4x6': {
    id: '4x6',
    label: '4×6" Photo Paper',
    subtitle: '8 copies (4×2 grid) — Standard studio print',
    widthPx: 1800,
    heightPx: 1200,
    widthPt: 432,
    heightPt: 288,
    cols: 4,
    rows: 2
  },
  'a4-12': {
    id: 'a4-12',
    label: 'A4 Sheet (Large)',
    subtitle: '12 copies (4×3 grid) — Easy scissor cutting',
    widthPx: 2480,
    heightPx: 3508,
    widthPt: 595.28,
    heightPt: 841.89,
    cols: 4,
    rows: 3
  },
  'a4-30': {
    id: 'a4-30',
    label: 'A4 Sheet (Economy)',
    subtitle: '30 copies (5×6 grid) — Maximum value',
    widthPx: 2480,
    heightPx: 3508,
    widthPt: 595.28,
    heightPt: 841.89,
    cols: 5,
    rows: 6
  }
};

/**
 * Renders a crisp 300 DPI printable sheet tiled with copies of the passport photo,
 * optional dashed cut guides, and even outer margins.
 */
export function renderPassportSheetCanvas(
  photoImg: HTMLImageElement,
  paperSize: SheetPaperSize,
  showCutLines: boolean = true
): HTMLCanvasElement {
  const spec = PASSPORT_SHEET_SPECS[paperSize];
  const canvas = document.createElement('canvas');
  canvas.width = spec.widthPx;
  canvas.height = spec.heightPx;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, spec.widthPx, spec.heightPx);

  const outerMargin = Math.round(Math.min(spec.widthPx, spec.heightPx) * 0.045);
  const gap = Math.round(Math.min(spec.widthPx, spec.heightPx) * 0.018);

  const availW = spec.widthPx - outerMargin * 2 - gap * (spec.cols - 1);
  const availH = spec.heightPx - outerMargin * 2 - gap * (spec.rows - 1);

  const maxCellW = availW / spec.cols;
  const maxCellH = availH / spec.rows;

  const photoAspect = photoImg.width / Math.max(1, photoImg.height);
  let cellW = maxCellW;
  let cellH = cellW / photoAspect;
  if (cellH > maxCellH) {
    cellH = maxCellH;
    cellW = cellH * photoAspect;
  }

  const totalGridW = cellW * spec.cols + gap * (spec.cols - 1);
  const totalGridH = cellH * spec.rows + gap * (spec.rows - 1);
  const startX = (spec.widthPx - totalGridW) / 2;
  const startY = (spec.heightPx - totalGridH) / 2;

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  for (let r = 0; r < spec.rows; r++) {
    for (let c = 0; c < spec.cols; c++) {
      const x = Math.round(startX + c * (cellW + gap));
      const y = Math.round(startY + r * (cellH + gap));
      const w = Math.round(cellW);
      const h = Math.round(cellH);

      ctx.drawImage(photoImg, x, y, w, h);

      if (showCutLines) {
        ctx.save();
        ctx.strokeStyle = '#94A3B8';
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 6]);
        ctx.strokeRect(x - 1, y - 1, w + 2, h + 2);
        ctx.restore();
      }
    }
  }

  // Subtle footer watermark text outside cut area
  ctx.fillStyle = '#94A3B8';
  ctx.font = `600 ${Math.round(spec.widthPx * 0.011)}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.fillText(
    `${spec.label} • ${spec.cols * spec.rows} Copies • 300 DPI Print Ready (FitMyForm)`,
    spec.widthPx / 2,
    spec.heightPx - Math.round(outerMargin * 0.35)
  );

  return canvas;
}

export async function exportPassportSheetBlob(
  photoImg: HTMLImageElement,
  paperSize: SheetPaperSize,
  format: 'JPG' | 'PDF',
  showCutLines: boolean = true
): Promise<{ blob: Blob; fileName: string }> {
  const canvas = renderPassportSheetCanvas(photoImg, paperSize, showCutLines);
  const spec = PASSPORT_SHEET_SPECS[paperSize];

  const jpgBlob: Blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Failed to generate sheet JPG'))),
      'image/jpeg',
      0.95
    );
  });

  if (format === 'JPG') {
    return {
      blob: jpgBlob,
      fileName: `passport-sheet-${paperSize}-${spec.cols * spec.rows}x.jpg`
    };
  }

  // Wrap 300 DPI JPG into exact physical-size print PDF
  const pdfDoc = await PDFDocument.create();
  const jpgBytes = new Uint8Array(await jpgBlob.arrayBuffer());
  const embedded = await pdfDoc.embedJpg(jpgBytes);
  const page = pdfDoc.addPage([spec.widthPt, spec.heightPt]);
  page.drawImage(embedded, {
    x: 0,
    y: 0,
    width: spec.widthPt,
    height: spec.heightPt
  });
  const pdfBytes = await pdfDoc.save();
  const pdfBlob = new Blob([pdfBytes as unknown as BlobPart], { type: 'application/pdf' });
  return {
    blob: pdfBlob,
    fileName: `passport-sheet-${paperSize}-${spec.cols * spec.rows}x.pdf`
  };
}
