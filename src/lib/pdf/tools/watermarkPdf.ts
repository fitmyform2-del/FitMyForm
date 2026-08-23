import { PDFDocument, StandardFonts, degrees } from 'pdf-lib';
import { WatermarkOptions, PageNumberOptions, hexToRgb } from './types';

/** WATERMARK PDF */
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

/** ADD PAGE NUMBERS */
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
