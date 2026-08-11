import { PDFDocument } from 'pdf-lib';
import { DocumentRequirements, ProcessingResult } from '@/types/document';
import { validateDocumentResult } from '../validation/documentValidator';

export async function processPdfFile(
  file: File,
  reqs: DocumentRequirements
): Promise<ProcessingResult> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  
  const pageCount = pdfDoc.getPageCount();

  // Create a copy of PDF document (re-compressing objects)
  const newPdf = await PDFDocument.create();
  const copiedPages = await newPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
  copiedPages.forEach((page) => newPdf.addPage(page));

  // Set standard PDF metadata
  newPdf.setTitle(file.name.replace('.pdf', '') + ' Formatted');
  newPdf.setProducer('FitMyForm - Client Side PDF Tool');
  newPdf.setCreator('FitMyForm');

  const pdfBytes = await newPdf.save({ useObjectStreams: true });
  let pdfBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });

  // Handle minimum size requirements if needed
  const minBytes = reqs.minSizeKB * 1024;
  if (pdfBlob.size < minBytes) {
    const paddingNeeded = minBytes - pdfBlob.size;
    const dummyBytes = new Uint8Array(paddingNeeded);
    pdfBlob = new Blob([pdfBlob, dummyBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
  }

  const previewUrl = URL.createObjectURL(pdfBlob);
  const fileSizeKB = Number((pdfBlob.size / 1024).toFixed(2));
  const outFileName = file.name.replace('.pdf', '') + '_fitmyform.pdf';

  const { isValid, validationErrors } = validateDocumentResult({
    fileSizeKB,
    width: 0,
    height: 0,
    format: 'PDF',
    requirements: reqs
  });

  return {
    blob: pdfBlob,
    previewUrl,
    fileName: outFileName,
    fileSizeKB,
    format: 'PDF',
    width: 0,
    height: 0,
    aspectRatio: 1,
    isValid,
    validationErrors,
    processedAt: new Date().toISOString()
  };
}
