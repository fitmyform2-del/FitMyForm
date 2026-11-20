import { PDFDocument } from 'pdf-lib';
import { WhiteboardPage } from '../types/whiteboard';
import { renderWhiteboard } from './canvasRenderer';

export async function exportPageToImage(
  page: WhiteboardPage,
  format: 'png' | 'jpeg' = 'png',
  quality = 0.95,
  width = 1920,
  height = 1080
): Promise<Blob> {
  const offscreen = document.createElement('canvas');
  offscreen.width = width;
  offscreen.height = height;
  const ctx = offscreen.getContext('2d');
  if (!ctx) throw new Error('Could not create canvas 2D context');

  renderWhiteboard(ctx, page, 1, { x: 0, y: 0 }, [], null, [], width, height);

  return new Promise((resolve, reject) => {
    offscreen.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas export failed'));
      },
      `image/${format}`,
      quality
    );
  });
}

export async function exportPagesToPdf(pages: WhiteboardPage[], boardTitle = 'Whiteboard'): Promise<Blob> {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(boardTitle);
  pdfDoc.setCreator('FitMyForm Offline Whiteboard Studio');

  const width = 1920;
  const height = 1080;

  for (const page of pages) {
    const imgBlob = await exportPageToImage(page, 'png', 0.95, width, height);
    const arrayBuffer = await imgBlob.arrayBuffer();
    const embeddedImg = await pdfDoc.embedPng(arrayBuffer);

    // Standard Landscape A4 / 16:9 Presentation PDF page: 842 x 595 pt
    const pdfPage = pdfDoc.addPage([842, 595]);
    pdfPage.drawImage(embeddedImg, {
      x: 0,
      y: 0,
      width: 842,
      height: 595
    });
  }

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
}

export function exportBoardToJson(pages: WhiteboardPage[], boardTitle: string): void {
  const data = {
    app: 'FitMyForm Whiteboard',
    version: '1.0.0',
    title: boardTitle,
    savedAt: new Date().toISOString(),
    pages
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${boardTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}.wbc`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importBoardFromJson(file: File): Promise<{ title: string; pages: WhiteboardPage[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed && Array.isArray(parsed.pages)) {
          resolve({
            title: parsed.title || 'Imported Whiteboard',
            pages: parsed.pages
          });
        } else {
          reject(new Error('Invalid whiteboard backup file structure'));
        }
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
