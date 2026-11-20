import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { RedactionArea, SignField } from './types';
import { loadPdfDocument, renderPdfPageToCanvas, sanitizeWinAnsi } from '../pdfjsLoader';

async function computeSha256Hex(buffer: ArrayBuffer): Promise<string> {
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
  }
  return 'UNAVAILABLE-IN-INSECURE-CONTEXT';
}

/** SIGN PDF (SINGLE SIGNATURE) */
export async function signPdf(
  file: File,
  signatureDataUrl: string,
  pageIndex: number,
  xRatio: number,
  yRatio: number,
  widthPx: number,
  heightPx: number
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const targetPage = pages[pageIndex] || pages[0];

  const { width, height } = targetPage.getSize();
  let sigImg;
  if (signatureDataUrl.includes('image/png')) {
    sigImg = await pdfDoc.embedPng(signatureDataUrl);
  } else {
    sigImg = await pdfDoc.embedJpg(signatureDataUrl);
  }

  const x = xRatio * width;
  const y = (1 - yRatio) * height - heightPx;

  targetPage.drawImage(sigImg, {
    x,
    y,
    width: widthPx,
    height: heightPx
  });

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/**
 * PERMANENT REDACT PDF
 * Flattens every page that has redaction boxes into high-resolution raster pixels
 * with solid black bars burned in — permanently destroying underlying selectable text.
 */
export async function redactPdf(file: File, redactions: RedactionArea[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const outPdf = await PDFDocument.create();
  const pdfJsDoc = await loadPdfDocument(arrayBuffer);

  const redactionsByPage = new Map<number, RedactionArea[]>();
  for (const r of redactions) {
    const list = redactionsByPage.get(r.pageIndex) || [];
    list.push(r);
    redactionsByPage.set(r.pageIndex, list);
  }

  const totalPages = srcPdf.getPageCount();
  for (let idx = 0; idx < totalPages; idx++) {
    const pageRedactions = redactionsByPage.get(idx);
    if (!pageRedactions || pageRedactions.length === 0) {
      const [copied] = await outPdf.copyPages(srcPdf, [idx]);
      outPdf.addPage(copied);
      continue;
    }

    const pdfPage = await pdfJsDoc.getPage(idx + 1);
    const origViewport = pdfPage.getViewport({ scale: 1 });
    const canvas = await renderPdfPageToCanvas(pdfJsDoc, idx + 1, 2.0);
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#000000';
      for (const red of pageRedactions) {
        ctx.fillRect(
          red.xRatio * canvas.width,
          red.yRatio * canvas.height,
          red.wRatio * canvas.width,
          red.hRatio * canvas.height
        );
      }
    }

    const jpgBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Redaction render failed'))), 'image/jpeg', 0.94);
    });
    const embedded = await outPdf.embedJpg(await jpgBlob.arrayBuffer());
    const outPage = outPdf.addPage([origViewport.width, origViewport.height]);
    outPage.drawImage(embedded, {
      x: 0,
      y: 0,
      width: origViewport.width,
      height: origViewport.height
    });
  }

  const pdfBytes = await outPdf.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** MULTI-FIELD E-SIGNATURE PDF PROCESSOR WITH REAL SHA-256 AUDIT TRAIL */
export async function signPdfMultiField(
  file: File,
  fields: SignField[],
  appendAuditTrail: boolean = true
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const sha256Hex = await computeSha256Hex(arrayBuffer);
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const originalPageCount = pages.length;
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const field of fields) {
    if (field.pageIndex < 0 || field.pageIndex >= pages.length) continue;
    const page = pages[field.pageIndex];
    const { width, height } = page.getSize();

    const w = field.wRatio * width;
    const h = field.hRatio * height;
    const x = field.xRatio * width;
    const y = (1 - field.yRatio) * height - h;

    if ((field.type === 'signature' || field.type === 'initials' || field.type === 'stamp') && field.value) {
      let image;
      if (field.value.includes('image/png')) {
        image = await pdfDoc.embedPng(field.value);
      } else {
        image = await pdfDoc.embedJpg(field.value);
      }

      page.drawImage(image, {
        x,
        y,
        width: w,
        height: h
      });
    } else if (field.type === 'checkbox') {
      const boxSize = Math.max(12, Math.min(w, h, 20));
      page.drawRectangle({
        x,
        y,
        width: boxSize,
        height: boxSize,
        borderColor: rgb(0.15, 0.38, 0.88),
        borderWidth: 1.5,
        color: rgb(0.93, 0.96, 1)
      });
      // Vector checkmark — safe across all PDF viewers without WinAnsi encoding issues
      page.drawLine({
        start: { x: x + boxSize * 0.22, y: y + boxSize * 0.5 },
        end: { x: x + boxSize * 0.44, y: y + boxSize * 0.25 },
        thickness: 2,
        color: rgb(0.1, 0.3, 0.8)
      });
      page.drawLine({
        start: { x: x + boxSize * 0.44, y: y + boxSize * 0.25 },
        end: { x: x + boxSize * 0.8, y: y + boxSize * 0.76 },
        thickness: 2,
        color: rgb(0.1, 0.3, 0.8)
      });
    } else if (field.value) {
      const fontSize = Math.max(10, Math.min(18, h * 0.55));
      page.drawText(sanitizeWinAnsi(field.value), {
        x,
        y: y + (h - fontSize) / 2,
        size: fontSize,
        font: regularFont,
        color: rgb(0.05, 0.1, 0.2)
      });
    }
  }

  if (appendAuditTrail) {
    const auditPage = pdfDoc.addPage([595, 842]);
    const { width, height } = auditPage.getSize();

    auditPage.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: rgb(0.2, 0.4, 0.8),
      borderWidth: 2,
      color: rgb(0.97, 0.98, 1)
    });

    auditPage.drawText('FitMyForm - Audit Trail & e-Sign Summary', {
      x: 50,
      y: height - 80,
      size: 18,
      font,
      color: rgb(0.1, 0.2, 0.6)
    });

    auditPage.drawText('Signed locally in your browser with zero server upload.', {
      x: 50,
      y: height - 108,
      size: 10,
      font: regularFont,
      color: rgb(0.3, 0.4, 0.5)
    });

    const timestamp = new Date().toUTCString();

    const details = [
      `Document Name: ${sanitizeWinAnsi(file.name)}`,
      `Original File Size: ${(file.size / 1024).toFixed(1)} KB`,
      `Original Page Count: ${originalPageCount}`,
      `Total Signature Fields Applied: ${fields.length}`,
      `Signing Timestamp (UTC): ${timestamp}`,
      `Original Document SHA-256:`,
      `  ${sha256Hex.slice(0, 32)}`,
      `  ${sha256Hex.slice(32)}`,
      `Signature Type: Simple Electronic Signature (SES)`,
      `Processing Mode: 100% Client-Side Browser Execution (Zero Server Upload)`
    ];

    let currentY = height - 156;
    for (const detail of details) {
      auditPage.drawText(detail, {
        x: 50,
        y: currentY,
        size: 10,
        font: regularFont,
        color: rgb(0.2, 0.25, 0.35)
      });
      currentY -= 22;
    }

    auditPage.drawRectangle({
      x: 50,
      y: 60,
      width: width - 100,
      height: 40,
      color: rgb(0.1, 0.5, 0.3)
    });

    auditPage.drawText('CLIENT-SIDE ELECTRONIC SIGNATURE SUMMARY', {
      x: 115,
      y: 75,
      size: 11,
      font,
      color: rgb(1, 1, 1)
    });
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
