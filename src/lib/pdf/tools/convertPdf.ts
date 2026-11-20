import { PDFDocument, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { JpgToPdfOptions, AnnotationItem, hexToRgb } from './types';
import { sanitizeWinAnsi } from '../pdfjsLoader';

/** Convert any browser-readable image file (WEBP, GIF, SVG, BMP, etc.) into JPEG bytes via Canvas */
async function rasterizeImageFileToJpeg(file: File): Promise<ArrayBuffer> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error(`Unsupported or corrupted image: ${file.name}`));
      el.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth || img.width;
    canvas.height = img.naturalHeight || img.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Failed to encode image'))), 'image/jpeg', 0.92);
    });
    return blob.arrayBuffer();
  } finally {
    URL.revokeObjectURL(url);
  }
}

/** JPG / IMAGES TO PDF */
export async function imagesToPdf(files: File[], opts: JpgToPdfOptions): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    let img;
    const lowerType = file.type.toLowerCase();
    const lowerName = file.name.toLowerCase();

    if (lowerType === 'image/png' || lowerName.endsWith('.png')) {
      try {
        img = await pdfDoc.embedPng(await file.arrayBuffer());
      } catch {
        img = await pdfDoc.embedJpg(await rasterizeImageFileToJpeg(file));
      }
    } else if (lowerType === 'image/jpeg' || lowerType === 'image/jpg' || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg')) {
      try {
        img = await pdfDoc.embedJpg(await file.arrayBuffer());
      } catch {
        img = await pdfDoc.embedJpg(await rasterizeImageFileToJpeg(file));
      }
    } else {
      // WEBP, GIF, BMP, SVG -> normalize cleanly via canvas
      img = await pdfDoc.embedJpg(await rasterizeImageFileToJpeg(file));
    }

    let pageW = 595.28; // A4 portrait width in points
    let pageH = 841.89; // A4 portrait height in points

    if (opts.pageSize === 'letter') {
      pageW = 612;
      pageH = 792;
    } else if (opts.pageSize === 'fit') {
      pageW = img.width;
      pageH = img.height;
    }

    if (opts.orientation === 'landscape' || (opts.orientation === 'auto' && img.width > img.height)) {
      if (opts.pageSize !== 'fit') {
        const tmp = pageW;
        pageW = pageH;
        pageH = tmp;
      }
    }

    const page = pdfDoc.addPage([pageW, pageH]);

    let margin = 0;
    if (opts.margin === 'small') margin = 20;
    if (opts.margin === 'big') margin = 50;

    const maxW = pageW - margin * 2;
    const maxH = pageH - margin * 2;

    const scale = Math.min(maxW / img.width, maxH / img.height, 1);
    const drawW = img.width * scale;
    const drawH = img.height * scale;

    const x = margin + (maxW - drawW) / 2;
    const y = margin + (maxH - drawH) / 2;

    page.drawImage(img, {
      x,
      y,
      width: drawW,
      height: drawH
    });
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** EDIT PDF ANNOTATIONS */
export async function editPdf(file: File, annotations: AnnotationItem[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  annotations.forEach((ann) => {
    const page = pages[ann.pageIndex];
    if (!page) return;

    const { width, height } = page.getSize();
    const color = hexToRgb(ann.color || '#3b82f6');

    if (ann.type === 'text' && ann.text) {
      const size = ann.fontSize || 16;
      const x = ann.xRatio * width;
      const y = (1 - ann.yRatio) * height - size;
      page.drawText(sanitizeWinAnsi(ann.text), {
        x,
        y: Math.max(4, y),
        size,
        font,
        color
      });
    } else if (ann.type === 'rect' && ann.wRatio && ann.hRatio) {
      const w = ann.wRatio * width;
      const h = ann.hRatio * height;
      const x = ann.xRatio * width;
      const y = (1 - ann.yRatio) * height - h;
      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        borderColor: color,
        borderWidth: 2
      });
    }
  });

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** ZIP MULTIPLE BLOBS FOR DOWNLOAD */
export async function zipAndDownloadBlobs(blobs: { blob: Blob; name: string }[], zipFilename: string) {
  const zip = new JSZip();
  blobs.forEach((b) => zip.file(b.name, b.blob));
  const zipContent = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(zipContent);
  const link = document.createElement('a');
  link.href = url;
  link.download = zipFilename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 5000);
}
