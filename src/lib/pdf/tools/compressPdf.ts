import { PDFDocument } from 'pdf-lib';

/** COMPRESS PDF */
export async function compressPdf(
  file: File,
  quality: 'extreme' | 'recommended' | 'less' | 'custom',
  targetKB?: number
): Promise<{ blob: Blob; sizeKB: number }> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  // Re-encode document using object streams and stripping unnecessary metadata
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
  copiedPages.forEach((page) => newPdf.addPage(page));

  newPdf.setTitle(file.name.replace(/\.pdf$/i, ''));
  newPdf.setProducer('FitMyForm PDF Compressor');

  const pdfBytes = await newPdf.save({ useObjectStreams: true });
  let resultBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });

  // If custom target KB specified and result is below min size, pad
  if (quality === 'custom' && targetKB && targetKB > 0) {
    const targetBytes = targetKB * 1024;
    if (resultBlob.size < targetBytes) {
      const padBytes = new Uint8Array(targetBytes - resultBlob.size);
      resultBlob = new Blob([resultBlob, padBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
    }
  }

  const sizeKB = Number((resultBlob.size / 1024).toFixed(2));
  return { blob: resultBlob, sizeKB };
}
