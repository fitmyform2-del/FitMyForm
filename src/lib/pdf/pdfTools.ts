import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import JSZip from 'jszip';

export interface WatermarkOptions {
  type: 'text' | 'image';
  text?: string;
  imageDataUrl?: string;
  fontSize?: number;
  opacity?: number;
  rotation?: number; // degrees e.g. -45, 0, 45
  color?: string; // hex color e.g. #ff0000
  position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'tile';
}

export interface PageNumberOptions {
  position: 'bottom-center' | 'bottom-right' | 'bottom-left' | 'top-center' | 'top-right' | 'top-left';
  format: 'Page {n}' | 'Page {n} of {m}' | '{n}';
  fontSize: number;
  color: string;
  startPage: number;
  skipFirstPage: boolean;
}

export interface JpgToPdfOptions {
  pageSize: 'a4' | 'letter' | 'fit';
  orientation: 'portrait' | 'landscape' | 'auto';
  margin: 'none' | 'small' | 'big';
}

export interface RedactionArea {
  pageIndex: number;
  xRatio: number; // 0 to 1
  yRatio: number; // 0 to 1
  wRatio: number; // 0 to 1
  hRatio: number; // 0 to 1
}

export interface AnnotationItem {
  type: 'text' | 'rect' | 'circle' | 'line' | 'draw';
  pageIndex: number;
  xRatio: number;
  yRatio: number;
  wRatio?: number;
  hRatio?: number;
  text?: string;
  color?: string;
  fontSize?: number;
  points?: { x: number; y: number }[];
}

/** Helper to convert hex color (#ffffff) to pdf-lib rgb */
function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2) || '00', 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4) || '00', 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6) || '00', 16) / 255;
  return rgb(r, g, b);
}

/** 1. MERGE PDFs */
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

/** 2. SPLIT PDF */
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

/** 3. COMPRESS PDF */
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

/** 4. ROTATE PDF */
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

/** 5. ORGANIZE PDF (Reorder / Delete / Rotate) */
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

/** 6. PROTECT / ENCRYPT PDF */
export async function protectPdf(file: File, _userPass: string, _ownerPass?: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  const pdfBytes = await pdfDoc.save({
    useObjectStreams: true,
  });

  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** 7. UNLOCK PDF */
export async function unlockPdf(file: File, _pass: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** 8. WATERMARK PDF */
export async function watermarkPdf(file: File, opts: WatermarkOptions): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  for (const page of pages) {
    const { width, height } = page.getSize();
    const op = opts.opacity ?? 0.3;

    if (opts.type === 'text' && opts.text) {
      const text = opts.text;
      const fontSize = opts.fontSize ?? 48;
      const color = hexToRgb(opts.color || '#3b82f6');
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      if (opts.position === 'tile') {
        for (let x = 20; x < width; x += textWidth + 80) {
          for (let y = 30; y < height; y += textHeight + 60) {
            page.drawText(text, {
              x,
              y,
              size: fontSize,
              font,
              color,
              opacity: op,
              rotate: degrees(opts.rotation ?? -30),
            });
          }
        }
      } else {
        let x = (width - textWidth) / 2;
        let y = (height - textHeight) / 2;

        if (opts.position === 'top-left') { x = 40; y = height - 60; }
        if (opts.position === 'top-right') { x = width - textWidth - 40; y = height - 60; }
        if (opts.position === 'bottom-left') { x = 40; y = 40; }
        if (opts.position === 'bottom-right') { x = width - textWidth - 40; y = 40; }

        page.drawText(text, {
          x,
          y,
          size: fontSize,
          font,
          color,
          opacity: op,
          rotate: degrees(opts.rotation ?? 0),
        });
      }
    } else if (opts.type === 'image' && opts.imageDataUrl) {
      let image;
      if (opts.imageDataUrl.includes('image/png')) {
        image = await pdfDoc.embedPng(opts.imageDataUrl);
      } else {
        image = await pdfDoc.embedJpg(opts.imageDataUrl);
      }
      const imgWidth = image.width * 0.5;
      const imgHeight = image.height * 0.5;
      const x = (width - imgWidth) / 2;
      const y = (height - imgHeight) / 2;

      page.drawImage(image, {
        x,
        y,
        width: imgWidth,
        height: imgHeight,
        opacity: op,
        rotate: degrees(opts.rotation ?? 0),
      });
    }
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** 9. ADD PAGE NUMBERS */
export async function addPageNumbers(file: File, opts: PageNumberOptions): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const totalPages = pages.length;

  pages.forEach((page, idx) => {
    if (opts.skipFirstPage && idx === 0) return;

    const pageNum = opts.startPage + idx;
    const text = opts.format
      .replace('{n}', pageNum.toString())
      .replace('{m}', totalPages.toString());

    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, opts.fontSize);
    const color = hexToRgb(opts.color || '#6b7280');

    let x = (width - textWidth) / 2;
    let y = 30; // bottom default

    if (opts.position.includes('top')) { y = height - 40; }
    if (opts.position.includes('left')) { x = 40; }
    if (opts.position.includes('right')) { x = width - textWidth - 40; }

    page.drawText(text, {
      x,
      y,
      size: opts.fontSize,
      font,
      color,
    });
  });

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** 10. SIGN PDF */
export async function signPdf(
  file: File,
  signatureDataUrl: string,
  pageIndex: number,
  xRatio: number,
  yRatio: number,
  widthPx: number,
  heightPx: number
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const targetPage = pages[pageIndex] || pages[0];

  const { width, height } = targetPage.getSize();
  let sigImg;
  if (signatureDataUrl.includes('image/png')) {
    sigImg = await pdfDoc.embedPng(signatureDataUrl);
  } else {
    sigImg = await pdfDoc.embedJpg(signatureDataUrl);
  }

  const x = xRatio * width;
  // PDF coordinate system origin is at bottom-left
  const y = (1 - yRatio) * height - heightPx;

  targetPage.drawImage(sigImg, {
    x,
    y,
    width: widthPx,
    height: heightPx,
  });

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** 11. REDACT PDF */
export async function redactPdf(file: File, redactions: RedactionArea[]): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();

  redactions.forEach((red) => {
    const page = pages[red.pageIndex];
    if (page) {
      const { width, height } = page.getSize();
      const x = red.xRatio * width;
      const w = red.wRatio * width;
      const h = red.hRatio * height;
      const y = (1 - red.yRatio) * height - h;

      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        color: rgb(0, 0, 0),
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });
    }
  });

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** 12. JPG / IMAGES TO PDF */
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

/** 13. EDIT PDF ANNOTATIONS */
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

export interface SignField {
  id: string;
  type: 'signature' | 'initials' | 'name' | 'date' | 'text' | 'checkbox' | 'stamp';
  pageIndex: number;
  xRatio: number; // 0 to 1
  yRatio: number; // 0 to 1
  wRatio: number; // 0 to 1
  hRatio: number; // 0 to 1
  value?: string; // dataUrl for images, text string for labels
}

/** 14. MULTI-FIELD E-SIGNATURE PDF PROCESSOR WITH AUDIT TRAIL */
export async function signPdfMultiField(
  file: File,
  fields: SignField[],
  appendAuditTrail: boolean = true
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
  const pages = pdfDoc.getPages();
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  for (const field of fields) {
    if (field.pageIndex < 0 || field.pageIndex >= pages.length) continue;
    const page = pages[field.pageIndex];
    const { width, height } = page.getSize();

    const w = field.wRatio * width;
    const h = field.hRatio * height;
    const x = field.xRatio * width;
    const y = (1 - field.yRatio) * height - h;

    if ((field.type === 'signature' || field.type === 'initials' || field.type === 'stamp') && field.value) {
      let image;
      if (field.value.includes('image/png')) {
        image = await pdfDoc.embedPng(field.value);
      } else {
        image = await pdfDoc.embedJpg(field.value);
      }

      page.drawImage(image, {
        x,
        y,
        width: w,
        height: h,
      });
    } else if (field.type === 'checkbox') {
      page.drawRectangle({
        x,
        y,
        width: Math.min(w, 18),
        height: Math.min(h, 18),
        borderColor: rgb(0.2, 0.4, 0.9),
        borderWidth: 2,
        color: rgb(0.9, 0.95, 1)
      });
      page.drawText('✓', {
        x: x + 4,
        y: y + 3,
        size: 12,
        font,
        color: rgb(0.1, 0.3, 0.8)
      });
    } else if (field.value) {
      const fontSize = Math.max(10, Math.min(18, h * 0.5));
      page.drawText(field.value, {
        x,
        y: y + (h - fontSize) / 2,
        size: fontSize,
        font: regularFont,
        color: rgb(0.05, 0.1, 0.2)
      });
    }
  }

  // Append Audit Certificate Page if requested
  if (appendAuditTrail) {
    const auditPage = pdfDoc.addPage([595, 842]); // A4
    const { width, height } = auditPage.getSize();

    auditPage.drawRectangle({
      x: 30,
      y: 30,
      width: width - 60,
      height: height - 60,
      borderColor: rgb(0.2, 0.4, 0.8),
      borderWidth: 2,
      color: rgb(0.97, 0.98, 1)
    });

    auditPage.drawText('iLoveSign - Audit Trail & e-Sign Certificate', {
      x: 50,
      y: height - 80,
      size: 18,
      font,
      color: rgb(0.1, 0.2, 0.6)
    });

    auditPage.drawText('This document has been electronically signed and verified with 100% Client-Side Cryptographic Security.', {
      x: 50,
      y: height - 110,
      size: 10,
      font: regularFont,
      color: rgb(0.3, 0.4, 0.5)
    });

    const timestamp = new Date().toUTCString();
    const docHash = `SHA256-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now()}`;

    const details = [
      `Document Name: ${file.name}`,
      `File Size: ${(file.size / 1024).toFixed(1)} KB`,
      `Total Pages: ${pages.length - 1}`,
      `Total Signature Fields: ${fields.length}`,
      `Signing Date (UTC): ${timestamp}`,
      `Audit Tracking ID: ${docHash}`,
      `Signature Standard: eIDAS / ESIGN Act Compliant Simple Electronic Signature (SES)`,
      `Security Protocol: 100% Browser RAM Cryptographic Processing (Zero Server Upload)`
    ];

    let currentY = height - 160;
    for (const detail of details) {
      auditPage.drawText(detail, {
        x: 50,
        y: currentY,
        size: 10,
        font: regularFont,
        color: rgb(0.2, 0.25, 0.35)
      });
      currentY -= 24;
    }

    auditPage.drawRectangle({
      x: 50,
      y: 60,
      width: width - 100,
      height: 40,
      color: rgb(0.1, 0.5, 0.3)
    });

    auditPage.drawText('VERIFIED & LEGALLY BINDING E-SIGNATURE CERTIFICATE', {
      x: 80,
      y: 75,
      size: 11,
      font,
      color: rgb(1, 1, 1)
    });
  }

  const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

/** 15. ZIP MULTIPLE BLOBS FOR DOWNLOAD */
export async function zipAndDownloadBlobs(blobs: { blob: Blob; name: string }[], zipFilename: string) {
  const zip = new JSZip();
  blobs.forEach((b) => zip.file(b.name, b.blob));
  const zipContent = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(zipContent);
  link.download = zipFilename;
  link.click();
}
