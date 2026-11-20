import { PDFDocument } from 'pdf-lib';
import { loadPdfDocument, renderPdfPageToCanvas } from '../pdfjsLoader';

async function buildRasterizedPdf(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pdfJsDoc: any,
  scale: number,
  jpegQuality: number,
  title: string
): Promise<Blob> {
  const outPdf = await PDFDocument.create();
  outPdf.setTitle(title);
  outPdf.setProducer('FitMyForm PDF Compressor');

  for (let i = 1; i <= pdfJsDoc.numPages; i++) {
    const page = await pdfJsDoc.getPage(i);
    const origViewport = page.getViewport({ scale: 1 });
    const canvas = await renderPdfPageToCanvas(pdfJsDoc, i, scale);

    const jpegBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('Failed to encode PDF page'))),
        'image/jpeg',
        jpegQuality
      );
    });
    const jpegBytes = await jpegBlob.arrayBuffer();
    const embeddedImg = await outPdf.embedJpg(jpegBytes);
    const outPage = outPdf.addPage([origViewport.width, origViewport.height]);
    outPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: origViewport.width,
      height: origViewport.height
    });
  }

  const pdfBytes = await outPdf.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** COMPRESS PDF (lossless object-stream optimization + real visual JPEG re-compression) */
export async function compressPdf(
  file: File,
  quality: 'extreme' | 'recommended' | 'less' | 'custom',
  targetKB?: number
): Promise<{ blob: Blob; sizeKB: number }> {
  const title = file.name.replace(/\.pdf$/i, '');
  const arrayBuffer = await file.arrayBuffer();

  // 1. Lossless optimization via pdf-lib
  const srcDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const losslessPdf = await PDFDocument.create();
  const copiedPages = await losslessPdf.copyPages(srcDoc, srcDoc.getPageIndices());
  copiedPages.forEach((p) => losslessPdf.addPage(p));
  losslessPdf.setTitle(title);
  losslessPdf.setProducer('FitMyForm PDF Compressor');

  const losslessBytes = await losslessPdf.save({ useObjectStreams: true });
  let bestBlob: Blob =
    losslessBytes.byteLength < file.size
      ? new Blob([losslessBytes.buffer as ArrayBuffer], { type: 'application/pdf' })
      : new Blob([arrayBuffer], { type: 'application/pdf' });

  if (quality === 'less') {
    return {
      blob: bestBlob,
      sizeKB: Number((bestBlob.size / 1024).toFixed(2))
    };
  }

  // 2. Visual compression using pdf.js page rasterization + JPEG re-encoding
  try {
    const pdfJsDoc = await loadPdfDocument(arrayBuffer);

    if (quality === 'recommended') {
      const candidate = await buildRasterizedPdf(pdfJsDoc, 1.35, 0.72, title);
      if (candidate.size < bestBlob.size) bestBlob = candidate;
    } else if (quality === 'extreme') {
      const candidate = await buildRasterizedPdf(pdfJsDoc, 1.0, 0.45, title);
      if (candidate.size < bestBlob.size) bestBlob = candidate;
    } else if (quality === 'custom' && targetKB && targetKB > 0) {
      const targetBytes = targetKB * 1024;
      if (bestBlob.size > targetBytes) {
        // Try progressively stronger compression profiles until <= targetBytes
        const profiles: [number, number][] = [
          [1.5, 0.78],
          [1.3, 0.65],
          [1.15, 0.52],
          [1.0, 0.4],
          [0.85, 0.3],
          [0.7, 0.22]
        ];
        let smallest = bestBlob;
        for (const [scale, q] of profiles) {
          const candidate = await buildRasterizedPdf(pdfJsDoc, scale, q, title);
          if (candidate.size < smallest.size) {
            smallest = candidate;
          }
          if (candidate.size <= targetBytes) {
            smallest = candidate;
            break;
          }
        }
        bestBlob = smallest;
      }
    }
  } catch (err) {
    console.warn('Raster compression fallback to lossless optimization:', err);
  }

  const sizeKB = Number((bestBlob.size / 1024).toFixed(2));
  return { blob: bestBlob, sizeKB };
}
