export type DocumentType =
  | 'photo'
  | 'signature'
  | 'thumb'
  | 'declaration'
  | 'aadhaar'
  | 'marksheet'
  | 'certificate'
  | 'other';

export type FileFormat = 'JPG' | 'JPEG' | 'PNG' | 'PDF' | 'WEBP';

export type CropMode = 'fit' | 'fill' | 'center' | 'manual' | 'stretch';

export interface DocumentRequirements {
  documentType: DocumentType;
  width?: number; // target width in px
  height?: number; // target height in px
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatio?: number; // width / height
  format: FileFormat;
  minSizeKB: number; // e.g. 20
  maxSizeKB: number; // e.g. 50
  dpi?: number; // e.g. 200 or 300
  bgColor?: string; // e.g. '#FFFFFF'
  cropMode: CropMode;
}

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  originalSizeKB: number;
  type: string;
  width?: number;
  height?: number;
  aspectRatio?: number;
  previewUrl: string;
  isPdf: boolean;
  pdfPageCount?: number;
}

export interface ProcessingResult {
  blob: Blob;
  previewUrl: string;
  fileName: string;
  fileSizeKB: number;
  format: FileFormat;
  width: number;
  height: number;
  aspectRatio: number;
  qualityUsed?: number;
  isValid: boolean;
  validationErrors: string[];
  processedAt: string;
}

export interface CropRect {
  x: number; // percentage or px offset
  y: number;
  width: number;
  height: number;
  zoom: number;
  rotation: number;
}

export interface RecentItem {
  id: string;
  fileName: string;
  documentType: DocumentType;
  originalSizeKB: number;
  processedSizeKB: number;
  format: FileFormat;
  dimensions: string;
  timestamp: string;
  downloadUrl?: string;
}
