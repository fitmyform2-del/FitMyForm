import { PDFDocument } from 'pdf-lib';

/** MERGE PDFs */
export async function mergePdfs(files: File[]): Promise<Blob> {
  const mergedPdf = await PDFDocument.create();
  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }
  const pdfBytes = await mergedPdf.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** SPLIT PDF */
export async function splitPdf(file: File, ranges: { start: number; end: number }[]): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const totalPages = pdfDoc.getPageCount();

  const blobs: Blob[] = [];

  for (const range of ranges) {
    const newPdf = await PDFDocument.create();
    const indices: number[] = [];
    for (let i = range.start - 1; i <= range.end - 1; i++) {
      if (i >= 0 && i < totalPages) {
        indices.push(i);
      }
    }
    if (indices.length > 0) {
      const copiedPages = await newPdf.copyPages(pdfDoc, indices);
      copiedPages.forEach((p) => newPdf.addPage(p));
      const pdfBytes = await newPdf.save({ useObjectStreams: true });
      blobs.push(new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' }));
    }
  }

  return blobs;
}
