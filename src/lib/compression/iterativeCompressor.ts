import { PDFDocument } from 'pdf-lib';
import { DocumentRequirements, ProcessingResult, FileFormat } from '@/types/document';
import { validateDocumentResult } from '../validation/documentValidator';

export async function canvasToBlob(
  canvas: HTMLCanvasElement,
  mimeType: string,
  quality?: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to generate canvas blob'));
        }
      },
      mimeType,
      quality
    );
  });
}

function getMimeType(format: FileFormat): string {
  switch (format) {
    case 'PNG':
      return 'image/png';
    case 'WEBP':
      return 'image/webp';
    case 'JPG':
    case 'JPEG':
    case 'PDF':
    default:
      return 'image/jpeg';
  }
}

/**
 * Inserts a valid JPEG COM (comment) segment right before the EOI marker (0xFF 0xD9)
 * so the output remains a 100% valid JPEG accepted by strict image parsers and exam portals.
 */
async function padJpegBlobToMinSize(blob: Blob, targetMinBytes: number): Promise<Blob> {
  if (blob.size >= targetMinBytes) return blob;

  const bytes = new Uint8Array(await blob.arrayBuffer());
  // Locate trailing EOI marker (FF D9)
  const eoiIdx = bytes.length - 2;
  if (eoiIdx < 2 || bytes[eoiIdx] !== 0xff || bytes[eoiIdx + 1] !== 0xd9) {
    // Fallback if non-standard
    const extra = new Uint8Array(targetMinBytes - blob.size);
    return new Blob([bytes, extra], { type: blob.type });
  }

  let remaining = targetMinBytes - bytes.length;
  const chunks: Uint8Array[] = [bytes.subarray(0, eoiIdx)];

  // Each JPEG COM segment can hold up to 65533 payload bytes (length field includes 2 length bytes)
  while (remaining > 0) {
    const segOverhead = 4; // FF FE + 2-byte length
    const payloadLen = Math.min(65530, Math.max(1, remaining - segOverhead));
    const segLen = payloadLen + 2;
    const seg = new Uint8Array(2 + segLen);
    seg[0] = 0xff;
    seg[1] = 0xfe; // COM marker
    seg[2] = (segLen >> 8) & 0xff;
    seg[3] = segLen & 0xff;
    seg.fill(0x20, 4); // ASCII spaces inside JPEG comment
    chunks.push(seg);
    remaining -= seg.length;
  }

  chunks.push(bytes.subarray(eoiIdx));
  return new Blob(chunks as BlobPart[], { type: 'image/jpeg' });
}

async function wrapJpegInPdf(jpegBlob: Blob, widthPx: number, heightPx: number, minBytes: number): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  const jpegBytes = await jpegBlob.arrayBuffer();
  const img = await pdfDoc.embedJpg(jpegBytes);
  const page = pdfDoc.addPage([widthPx, heightPx]);
  page.drawImage(img, { x: 0, y: 0, width: widthPx, height: heightPx });
  pdfDoc.setProducer('FitMyForm Client-Side Formatter');

  let pdfBytes = await pdfDoc.save({ useObjectStreams: true });

  // If strictly under minBytes, pad via a valid PDF metadata comment/subject rather than breaking %%EOF
  if (pdfBytes.byteLength < minBytes) {
    const needed = minBytes - pdfBytes.byteLength;
    pdfDoc.setSubject(' '.repeat(Math.min(needed, 200000)));
    pdfBytes = await pdfDoc.save({ useObjectStreams: false });
  }

  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export async function compressCanvasToTargetSize(
  canvas: HTMLCanvasElement,
  reqs: DocumentRequirements,
  originalFileName: string
): Promise<ProcessingResult> {
  const isPdfOutput = reqs.format === 'PDF';
  const mimeType = getMimeType(reqs.format);
  const minBytes = Math.max(0, (reqs.minSizeKB || 0) * 1024);
  const rawMaxBytes = (reqs.maxSizeKB || 500) * 1024;
  // Reserve ~2.5 KB headroom when wrapping JPEG inside a PDF container
  const targetMaxBytes = isPdfOutput ? Math.max(4096, rawMaxBytes - 2560) : rawMaxBytes;

  let bestBlob: Blob | null = null;
  let bestQualityUsed = 0.92;
  let finalW = canvas.width;
  let finalH = canvas.height;

  if (mimeType === 'image/jpeg' || mimeType === 'image/webp') {
    let qLow = 0.05;
    let qHigh = 0.98;
    let bestFitBlob: { blob: Blob; quality: number } | null = null;
    let closestBelowMax: { blob: Blob; quality: number; size: number } | null = null;

    // Binary search over quality parameter — prefer highest quality within [minBytes, targetMaxBytes]
    for (let i = 0; i < 12; i++) {
      const qMid = Number(((qLow + qHigh) / 2).toFixed(4));
      const blob = await canvasToBlob(canvas, mimeType, qMid);
      const size = blob.size;

      if (size <= targetMaxBytes) {
        if (!closestBelowMax || size > closestBelowMax.size) {
          closestBelowMax = { blob, quality: qMid, size };
        }
        if (size >= minBytes) {
          if (!bestFitBlob || qMid > bestFitBlob.quality) {
            bestFitBlob = { blob, quality: qMid };
          }
        }
        // Try higher quality while staying <= targetMaxBytes
        qLow = qMid + 0.005;
      } else {
        qHigh = qMid - 0.005;
      }

      if (qLow > qHigh) break;
    }

    if (bestFitBlob) {
      bestBlob = bestFitBlob.blob;
      bestQualityUsed = bestFitBlob.quality;
    } else if (closestBelowMax) {
      bestBlob = closestBelowMax.blob;
      bestQualityUsed = closestBelowMax.quality;

      if (!isPdfOutput && mimeType === 'image/jpeg' && bestBlob.size < minBytes) {
        bestBlob = await padJpegBlobToMinSize(bestBlob, minBytes);
      }
    } else {
      // Even at q=0.05, size exceeds targetMaxBytes: iteratively downscale canvas
      let scaleFactor = 0.85;
      while (scaleFactor >= 0.25) {
        const sw = Math.max(10, Math.round(canvas.width * scaleFactor));
        const sh = Math.max(10, Math.round(canvas.height * scaleFactor));
        const tmp = document.createElement('canvas');
        tmp.width = sw;
        tmp.height = sh;
        const ctx = tmp.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(canvas, 0, 0, sw, sh);
          const trialBlob = await canvasToBlob(tmp, mimeType, 0.72);
          if (trialBlob.size <= targetMaxBytes) {
            bestBlob = trialBlob;
            finalW = sw;
            finalH = sh;
            bestQualityUsed = 0.72;
            break;
          }
          const lowTrial = await canvasToBlob(tmp, mimeType, 0.35);
          if (lowTrial.size <= targetMaxBytes) {
            bestBlob = lowTrial;
            finalW = sw;
            finalH = sh;
            bestQualityUsed = 0.35;
            break;
          }
        }
        scaleFactor -= 0.15;
      }

      if (!bestBlob) {
        bestBlob = await canvasToBlob(canvas, mimeType, 0.05);
        bestQualityUsed = 0.05;
      }
    }
  } else {
    // PNG format (lossless)
    bestBlob = await canvasToBlob(canvas, 'image/png');
  }

  // Wrap JPEG inside a real PDF if PDF format was requested
  if (isPdfOutput) {
    bestBlob = await wrapJpegInPdf(bestBlob, finalW, finalH, minBytes);
  }

  const ext = reqs.format.toLowerCase() === 'jpeg' ? 'jpg' : reqs.format.toLowerCase();
  const nameWithoutExt = originalFileName.replace(/\.[^/.]+$/, '');
  const outFileName = `${nameWithoutExt}_fitmyform.${ext}`;

  const previewUrl = URL.createObjectURL(bestBlob);
  const fileSizeKB = Number((bestBlob.size / 1024).toFixed(2));
  const aspectRatio = Number((finalW / finalH).toFixed(2));

  const { isValid, validationErrors } = validateDocumentResult({
    fileSizeKB,
    width: finalW,
    height: finalH,
    format: reqs.format,
    requirements: reqs
  });

  return {
    blob: bestBlob,
    previewUrl,
    fileName: outFileName,
    fileSizeKB,
    format: reqs.format,
    width: finalW,
    height: finalH,
    aspectRatio,
    qualityUsed: bestQualityUsed,
    isValid,
    validationErrors,
    processedAt: new Date().toISOString()
  };
}
