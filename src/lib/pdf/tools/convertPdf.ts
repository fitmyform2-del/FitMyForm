import { PDFDocument, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';
import { JpgToPdfOptions, AnnotationItem, hexToRgb } from './types';

/** JPG / IMAGES TO PDF */
export async function imagesToPdf(files: File[], opts: JpgToPdfOptions): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    let img;
    if (file.type.includes('png')) {
      img = await pdfDoc.embedPng(arrayBuffer);
    } else {
      img = await pdfDoc.embedJpg(arrayBuffer);
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
      height: drawH,
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
      const x = ann.xRatio * width;
      const y = (1 - ann.yRatio) * height;
      page.drawText(ann.text, {
        x,
        y,
        size: ann.fontSize || 16,
        font,
        color,
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
        borderWidth: 2,
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
  const link = document.createElement('a');
  link.href = URL.createObjectURL(zipContent);
  link.download = zipFilename;
  link.click();
}
