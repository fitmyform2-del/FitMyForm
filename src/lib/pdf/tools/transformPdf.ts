import { PDFDocument, degrees } from 'pdf-lib';
import { loadPdfDocument, renderPdfPageToCanvas } from '../pdfjsLoader';

/** ROTATE PDF (supports specific page map or rotateAllAngle) */
export async function rotatePdf(
  file: File,
  pageRotations: Record<number, number>,
  rotateAllAngle?: number
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  pages.forEach((page, idx) => {
    const additionalAngle = rotateAllAngle ?? pageRotations[idx] ?? 0;
    if (additionalAngle !== 0) {
      const currentRotation = page.getRotation().angle;
      const newRotation = (currentRotation + additionalAngle) % 360;
      page.setRotation(degrees(newRotation));
    }
  });

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** ORGANIZE PDF (Reorder / Delete / Rotate) */
export async function organizePdf(
  file: File,
  pageOrder: number[],
  rotations: Record<number, number>
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const srcPdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const newPdf = await PDFDocument.create();

  const validIndices = pageOrder.filter((idx) => idx >= 0 && idx < srcPdf.getPageCount());
  const copiedPages = await newPdf.copyPages(srcPdf, validIndices);

  copiedPages.forEach((page, i) => {
    const origIdx = validIndices[i];
    const rot = rotations[origIdx] || 0;
    if (rot !== 0) {
      const currentRot = page.getRotation().angle;
      page.setRotation(degrees((currentRot + rot) % 360));
    }
    newPdf.addPage(page);
  });

  const pdfBytes = await newPdf.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/**
 * UNLOCK PDF (Real decryption via pdf.js using the user's password)
 * Decrypts password-protected PDFs in browser memory and saves a password-free copy.
 */
export async function unlockPdf(file: File, password: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  // Validate password & decrypt via pdf.js (throws PasswordException on wrong/missing password)
  const pdfJsDoc = await loadPdfDocument(arrayBuffer, password || undefined);

  const outPdf = await PDFDocument.create();
  outPdf.setProducer('FitMyForm PDF Unlocker');

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const page = await pdfJsDoc.getPage(i);
    const origViewport = page.getViewport({ scale: 1 });
    const canvas = await renderPdfPageToCanvas(pdfJsDoc, i, 2.0);
    const jpgBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to render decrypted page'))), 'image/jpeg', 0.94);
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
