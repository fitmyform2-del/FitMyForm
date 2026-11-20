import { PDFDocument, StandardFonts, degrees, rgb } from 'pdf-lib';
import type { PDFFont } from 'pdf-lib';
import { hexToRgb } from './types';
import type { AnnotationItem, PdfFontFamily, PdfPagePlanItem } from './types';
import { sanitizeWinAnsi } from '../pdfjsLoader';

function pickStandardFont(
  family: PdfFontFamily = 'Helvetica',
  bold?: boolean,
  italic?: boolean
): StandardFonts {
  if (family === 'TimesRoman') {
    if (bold && italic) return StandardFonts.TimesRomanBoldItalic;
    if (bold) return StandardFonts.TimesRomanBold;
    if (italic) return StandardFonts.TimesRomanItalic;
    return StandardFonts.TimesRoman;
  }
  if (family === 'Courier') {
    if (bold && italic) return StandardFonts.CourierBoldOblique;
    if (bold) return StandardFonts.CourierBold;
    if (italic) return StandardFonts.CourierOblique;
    return StandardFonts.Courier;
  }
  if (bold && italic) return StandardFonts.HelveticaBoldOblique;
  if (bold) return StandardFonts.HelveticaBold;
  if (italic) return StandardFonts.HelveticaOblique;
  return StandardFonts.Helvetica;
}

/**
 * Rich PDF Editor Export Engine:
 * Supports page reordering/rotation/blank-page insertion/deletion +
 * text (with font family, bold, italic, multi-line, background fill),
 * highlights, whiteout, shapes (rect, ellipse, line, arrow),
 * freehand vector drawings, checkmarks/crosses, stamps, and embedded images.
 */
export async function editPdf(
  file: File,
  annotations: AnnotationItem[],
  pagePlan?: PdfPagePlanItem[]
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  let pdfDoc: PDFDocument;
  if (pagePlan && pagePlan.length > 0) {
    pdfDoc = await PDFDocument.create();
    for (const item of pagePlan) {
      if (item.sourceIndex === -1) {
        const blank = pdfDoc.addPage([item.width || 595.28, item.height || 841.89]);
        if (item.rotation) blank.setRotation(degrees(item.rotation % 360));
      } else if (item.sourceIndex >= 0 && item.sourceIndex < srcDoc.getPageCount()) {
        const [copied] = await pdfDoc.copyPages(srcDoc, [item.sourceIndex]);
        if (item.rotation) {
          const cur = copied.getRotation().angle;
          copied.setRotation(degrees((cur + item.rotation) % 360));
        }
        pdfDoc.addPage(copied);
      }
    }
  } else {
    pdfDoc = srcDoc;
  }

  const pages = pdfDoc.getPages();
  const fontCache = new Map<StandardFonts, PDFFont>();

  const getFont = async (family?: PdfFontFamily, bold?: boolean, italic?: boolean) => {
    const key = pickStandardFont(family, bold, italic);
    const cached = fontCache.get(key);
    if (cached) return cached;
    const embedded = await pdfDoc.embedFont(key);
    fontCache.set(key, embedded);
    return embedded;
  };

  for (const ann of annotations) {
    const page = pages[ann.pageIndex];
    if (!page) continue;

    const { width, height } = page.getSize();
    const color = hexToRgb(ann.color || '#1d4ed8');
    const opacity = ann.opacity !== undefined ? Math.max(0.05, Math.min(1, ann.opacity)) : 1;
    const strokeWidth = Math.max(1, ann.strokeWidth ?? 2);

    if (ann.type === 'text' && ann.text) {
      const size = Math.max(6, ann.fontSize || 16);
      const font = await getFont(ann.fontFamily, ann.bold, ann.italic);
      const lines = ann.text.split(/\r?\n/);
      const lineHeight = size * 1.25;
      const x = ann.xRatio * width;
      const topY = (1 - ann.yRatio) * height;

      // Optional solid background box (useful for replacing existing text cleanly)
      if (ann.bgColor && ann.bgColor !== 'transparent') {
        const boxW = ann.wRatio
          ? ann.wRatio * width
          : Math.max(...lines.map((l) => font.widthOfTextAtSize(sanitizeWinAnsi(l) || ' ', size))) + 10;
        const boxH = Math.max(lines.length * lineHeight + 6, (ann.hRatio || 0) * height);
        page.drawRectangle({
          x: x - 3,
          y: Math.max(2, topY - boxH + 2),
          width: boxW,
          height: boxH,
          color: hexToRgb(ann.bgColor),
          opacity
        });
      }

      lines.forEach((rawLine, idx) => {
        const line = sanitizeWinAnsi(rawLine);
        if (!line) return;
        const lineY = topY - size - idx * lineHeight;
        page.drawText(line, {
          x,
          y: Math.max(4, lineY),
          size,
          font,
          color,
          opacity
        });
      });
    } else if (ann.type === 'highlight') {
      const w = (ann.wRatio ?? 0.22) * width;
      const h = (ann.hRatio ?? 0.03) * height;
      const x = ann.xRatio * width;
      const y = (1 - ann.yRatio) * height - h;
      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        color: hexToRgb(ann.color || '#fde047'),
        opacity: ann.opacity ?? 0.38
      });
    } else if (ann.type === 'whiteout') {
      const w = (ann.wRatio ?? 0.2) * width;
      const h = (ann.hRatio ?? 0.05) * height;
      const x = ann.xRatio * width;
      const y = (1 - ann.yRatio) * height - h;
      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        color: hexToRgb(ann.fillColor || '#ffffff'),
        opacity
      });
    } else if (ann.type === 'rect') {
      const w = (ann.wRatio ?? 0.2) * width;
      const h = (ann.hRatio ?? 0.12) * height;
      const x = ann.xRatio * width;
      const y = (1 - ann.yRatio) * height - h;
      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        borderColor: color,
        borderWidth: strokeWidth,
        borderOpacity: opacity,
        ...(ann.fillColor && ann.fillColor !== 'transparent'
          ? { color: hexToRgb(ann.fillColor), opacity: Math.min(opacity, 0.35) }
          : {})
      });
    } else if (ann.type === 'circle') {
      const w = (ann.wRatio ?? 0.16) * width;
      const h = (ann.hRatio ?? 0.12) * height;
      const cx = ann.xRatio * width + w / 2;
      const cy = (1 - ann.yRatio) * height - h / 2;
      page.drawEllipse({
        x: cx,
        y: cy,
        xScale: Math.max(2, w / 2),
        yScale: Math.max(2, h / 2),
        borderColor: color,
        borderWidth: strokeWidth,
        borderOpacity: opacity,
        ...(ann.fillColor && ann.fillColor !== 'transparent'
          ? { color: hexToRgb(ann.fillColor), opacity: Math.min(opacity, 0.35) }
          : {})
      });
    } else if (ann.type === 'line' || ann.type === 'arrow') {
      const x1 = ann.xRatio * width;
      const y1 = (1 - ann.yRatio) * height;
      const x2 = (ann.x2Ratio ?? ann.xRatio + (ann.wRatio ?? 0.18)) * width;
      const y2 = (1 - (ann.y2Ratio ?? ann.yRatio)) * height;

      page.drawLine({
        start: { x: x1, y: y1 },
        end: { x: x2, y: y2 },
        thickness: strokeWidth,
        color,
        opacity
      });

      if (ann.type === 'arrow') {
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const headLen = Math.max(10, strokeWidth * 4.5);
        const a1 = angle - Math.PI / 6;
        const a2 = angle + Math.PI / 6;
        page.drawLine({
          start: { x: x2, y: y2 },
          end: { x: x2 - headLen * Math.cos(a1), y: y2 - headLen * Math.sin(a1) },
          thickness: strokeWidth,
          color,
          opacity
        });
        page.drawLine({
          start: { x: x2, y: y2 },
          end: { x: x2 - headLen * Math.cos(a2), y: y2 - headLen * Math.sin(a2) },
          thickness: strokeWidth,
          color,
          opacity
        });
      }
    } else if (ann.type === 'draw' && ann.points && ann.points.length > 1) {
      for (let i = 1; i < ann.points.length; i++) {
        const prev = ann.points[i - 1];
        const curr = ann.points[i];
        page.drawLine({
          start: { x: prev.x * width, y: (1 - prev.y) * height },
          end: { x: curr.x * width, y: (1 - curr.y) * height },
          thickness: strokeWidth,
          color,
          opacity
        });
      }
    } else if (ann.type === 'check') {
      const w = (ann.wRatio ?? 0.04) * width;
      const h = (ann.hRatio ?? 0.03) * height;
      const s = Math.max(12, Math.min(w, h));
      const x = ann.xRatio * width;
      const y = (1 - ann.yRatio) * height - s;
      const thick = Math.max(2, s * 0.14);
      page.drawLine({
        start: { x: x + s * 0.12, y: y + s * 0.48 },
        end: { x: x + s * 0.4, y: y + s * 0.18 },
        thickness: thick,
        color,
        opacity
      });
      page.drawLine({
        start: { x: x + s * 0.4, y: y + s * 0.18 },
        end: { x: x + s * 0.88, y: y + s * 0.82 },
        thickness: thick,
        color,
        opacity
      });
    } else if (ann.type === 'cross') {
      const w = (ann.wRatio ?? 0.04) * width;
      const h = (ann.hRatio ?? 0.03) * height;
      const s = Math.max(12, Math.min(w, h));
      const x = ann.xRatio * width;
      const y = (1 - ann.yRatio) * height - s;
      const thick = Math.max(2, s * 0.14);
      page.drawLine({
        start: { x: x + s * 0.16, y: y + s * 0.16 },
        end: { x: x + s * 0.84, y: y + s * 0.84 },
        thickness: thick,
        color,
        opacity
      });
      page.drawLine({
        start: { x: x + s * 0.84, y: y + s * 0.16 },
        end: { x: x + s * 0.16, y: y + s * 0.84 },
        thickness: thick,
        color,
        opacity
      });
    } else if (ann.type === 'stamp') {
      const label = sanitizeWinAnsi((ann.text || 'APPROVED').toUpperCase());
      const w = (ann.wRatio ?? 0.24) * width;
      const h = (ann.hRatio ?? 0.065) * height;
      const x = ann.xRatio * width;
      const y = (1 - ann.yRatio) * height - h;
      const font = await getFont('Helvetica', true, false);
      const fontSize = Math.max(10, Math.min(22, h * 0.48));
      const textW = font.widthOfTextAtSize(label, fontSize);

      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        borderColor: color,
        borderWidth: 2.5,
        color: rgb(1, 1, 1),
        opacity: Math.min(opacity, 0.88),
        borderOpacity: opacity
      });
      page.drawText(label, {
        x: x + Math.max(4, (w - textW) / 2),
        y: y + Math.max(4, (h - fontSize) / 2 + 2),
        size: fontSize,
        font,
        color,
        opacity
      });
    } else if (ann.type === 'image' && ann.imageDataUrl) {
      const w = (ann.wRatio ?? 0.25) * width;
      const h = (ann.hRatio ?? 0.15) * height;
      const x = ann.xRatio * width;
      const y = (1 - ann.yRatio) * height - h;
      const embeddedImg = ann.imageDataUrl.includes('image/png')
        ? await pdfDoc.embedPng(ann.imageDataUrl)
        : await pdfDoc.embedJpg(ann.imageDataUrl);
      page.drawImage(embeddedImg, {
        x,
        y,
        width: w,
        height: h,
        opacity
      });
    }
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
