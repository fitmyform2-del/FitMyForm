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
    default:
      return 'image/jpeg';
  }
}

/**
 * Appends safe metadata padding bytes to a JPEG Blob to reach a requested minimum byte size.
 * Safe for JPEG standard image viewers and exam upload portals.
 */
function padBlobToMinSize(blob: Blob, targetMinBytes: number): Blob {
  if (blob.size >= targetMinBytes) {
    return blob;
  }
  const paddingNeeded = targetMinBytes - blob.size;
  // Create dummy comment buffer (or zero byte padding array)
  const dummyBytes = new Uint8Array(paddingNeeded);
  return new Blob([blob, dummyBytes.buffer as ArrayBuffer], { type: blob.type });
}

export async function compressCanvasToTargetSize(
  canvas: HTMLCanvasElement,
  reqs: DocumentRequirements,
  originalFileName: string
): Promise<ProcessingResult> {
  const mimeType = getMimeType(reqs.format);
  const minBytes = Math.max(1024, reqs.minSizeKB * 1024);
  const maxBytes = reqs.maxSizeKB * 1024;

  let bestBlob: Blob | null = null;
  let bestQualityUsed = 0.9;
  let currentCanvas = canvas;

  if (mimeType === 'image/jpeg' || mimeType === 'image/webp') {
    let qLow = 0.01;
    let qHigh = 1.0;
    let bestFitBlob: Blob | null = null;
    let closestBelowMax: { blob: Blob; quality: number; size: number } | null = null;

    // Binary search over quality parameter (10 iterations)
    for (let i = 0; i < 12; i++) {
      const qMid = Number(((qLow + qHigh) / 2).toFixed(4));
      const blob = await canvasToBlob(currentCanvas, mimeType, qMid);
      const size = blob.size;

      if (size <= maxBytes) {
        if (!closestBelowMax || size > closestBelowMax.size) {
          closestBelowMax = { blob, quality: qMid, size };
        }
      }

      if (size >= minBytes && size <= maxBytes) {
        bestFitBlob = blob;
        bestQualityUsed = qMid;
        // Optimal fit achieved!
        break;
      }

      if (size > maxBytes) {
        qHigh = qMid - 0.01;
      } else {
        qLow = qMid + 0.01;
      }

      if (qLow > qHigh) break;
    }

    if (bestFitBlob) {
      bestBlob = bestFitBlob;
    } else if (closestBelowMax) {
      // Best quality below max bytes limit
      bestBlob = closestBelowMax.blob;
      bestQualityUsed = closestBelowMax.quality;

      // If size is still under minBytes, apply safe padding
      if (bestBlob.size < minBytes) {
        bestBlob = padBlobToMinSize(bestBlob, minBytes);
      }
    } else {
      // Even at 0.01 quality, size exceeds maxBytes (e.g. extremely large pixel dimensions)
      // Iteratively downscale canvas slightly to fit within maxBytes
      let scaleFactor = 0.85;
      let scaledCanvas = currentCanvas;
      while (scaleFactor >= 0.3) {
        const sw = Math.round(currentCanvas.width * scaleFactor);
        const sh = Math.round(currentCanvas.height * scaleFactor);
        const tmp = document.createElement('canvas');
        tmp.width = sw;
        tmp.height = sh;
        const ctx = tmp.getContext('2d');
        if (ctx) {
          ctx.drawImage(currentCanvas, 0, 0, sw, sh);
          const trialBlob = await canvasToBlob(tmp, mimeType, 0.5);
          if (trialBlob.size <= maxBytes) {
            bestBlob = trialBlob;
            scaledCanvas = tmp;
            break;
          }
        }
        scaleFactor -= 0.15;
      }

      if (!bestBlob) {
        bestBlob = await canvasToBlob(currentCanvas, mimeType, 0.05);
      }
    }
  } else {
    // PNG format (lossless)
    bestBlob = await canvasToBlob(currentCanvas, 'image/png');

    if (bestBlob.size < minBytes) {
      bestBlob = padBlobToMinSize(bestBlob, minBytes);
    }
  }

  // Format file extension
  const ext = reqs.format.toLowerCase() === 'jpeg' ? 'jpg' : reqs.format.toLowerCase();
  const nameWithoutExt = originalFileName.replace(/\.[^/.]+$/, '');
  const outFileName = `${nameWithoutExt}_fitmyform.${ext}`;

  const previewUrl = URL.createObjectURL(bestBlob);
  const fileSizeKB = Number((bestBlob.size / 1024).toFixed(2));
  const finalW = currentCanvas.width;
  const finalH = currentCanvas.height;
  const aspectRatio = Number((finalW / finalH).toFixed(2));

  // Run validation checks
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
