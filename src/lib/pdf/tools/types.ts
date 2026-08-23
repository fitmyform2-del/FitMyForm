import { rgb } from 'pdf-lib';

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

/** Helper to convert hex color (#ffffff) to pdf-lib rgb */
export function hexToRgb(hex: string) {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.substring(0, 2) || '00', 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4) || '00', 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6) || '00', 16) / 255;
  return rgb(r, g, b);
}
