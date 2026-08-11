import { DocumentType, FileFormat, CropMode } from './document';

export interface SingleDocSpec {
  title: string;
  documentType: DocumentType;
  format: FileFormat[];
  minSizeKB: number;
  maxSizeKB: number;
  width?: number;
  height?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  aspectRatioLabel?: string;
  dpi?: number;
  bgColor?: string;
  defaultCropMode?: CropMode;
  notes?: string;
}

export interface ExamPreset {
  id: string;
  name: string;
  category: 'national' | 'state' | 'banking' | 'railway' | 'teaching' | 'admission' | 'other';
  organization: string;
  description: string;
  documents: {
    photo?: SingleDocSpec;
    signature?: SingleDocSpec;
    thumb?: SingleDocSpec;
    declaration?: SingleDocSpec;
    certificate?: SingleDocSpec;
    idProof?: SingleDocSpec;
    [key: string]: SingleDocSpec | undefined;
  };
  officialLink?: string;
}
