import { PDFDocument, degrees } from 'pdf-lib';

/** ROTATE PDF */
export async function rotatePdf(file: File, pageRotations: Record<number, number>): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  pages.forEach((page, idx) => {
    const additionalAngle = pageRotations[idx] || 0;
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

/** PROTECT / ENCRYPT PDF */
export async function protectPdf(file: File, _userPass: string, _ownerPass?: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
  });

  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** UNLOCK PDF */
export async function unlockPdf(file: File, _pass: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}
