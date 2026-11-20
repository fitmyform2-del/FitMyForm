import type { ExamPreset } from '@/types/presets';

const STANDARD_BANKING_DOCS = (prefix: string): ExamPreset['documents'] => ({
  photo: {
    title: `${prefix} Passport Photo`,
    documentType: 'photo',
    format: ['JPG', 'JPEG'],
    minSizeKB: 20,
    maxSizeKB: 50,
    width: 200,
    height: 230,
    dpi: 200,
    bgColor: '#FFFFFF',
    defaultCropMode: 'fill',
    notes: '200 × 230 px (4.5 × 3.5 cm), strictly 20–50 KB JPG on light/white background.'
  },
  signature: {
    title: `${prefix} Signature`,
    documentType: 'signature',
    format: ['JPG', 'JPEG'],
    minSizeKB: 10,
    maxSizeKB: 20,
    width: 140,
    height: 60,
    dpi: 200,
    bgColor: '#FFFFFF',
    defaultCropMode: 'fit',
    notes: '140 × 60 px, strictly 10–20 KB JPG. Black ink on white paper; NO ALL CAPS.'
  },
  thumb: {
    title: `${prefix} Left Thumb Impression`,
    documentType: 'thumb',
    format: ['JPG', 'JPEG'],
    minSizeKB: 20,
    maxSizeKB: 50,
    width: 240,
    height: 240,
    dpi: 200,
    bgColor: '#FFFFFF',
    defaultCropMode: 'fit',
    notes: '240 × 240 px (3 × 3 cm), 20–50 KB JPG, black or blue ink on white paper.'
  },
  declaration: {
    title: `${prefix} Handwritten Declaration`,
    documentType: 'declaration',
    format: ['JPG', 'JPEG'],
    minSizeKB: 50,
    maxSizeKB: 100,
    width: 800,
    height: 400,
    dpi: 200,
    bgColor: '#FFFFFF',
    defaultCropMode: 'fit',
    notes: '800 × 400 px (10 × 5 cm), 50–100 KB JPG. Written in English with black ink on white paper (NO ALL CAPS).'
  }
});

export const BANKING_EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'ibps-banking',
    name: 'IBPS (PO / Clerk / SO / RRB)',
    category: 'banking',
    organization: 'Institute of Banking Personnel Selection (ibps.in)',
    description: 'Official IBPS photo, signature, left thumb impression, and handwritten declaration specs.',
    documents: STANDARD_BANKING_DOCS('IBPS')
  },
  {
    id: 'sbi-banking',
    name: 'SBI (PO / Clerk / CBO / SO)',
    category: 'banking',
    organization: 'State Bank of India (sbi.co.in)',
    description: 'Standard SBI recruitment specs for Probationary Officer, Junior Associate & CBO.',
    documents: STANDARD_BANKING_DOCS('SBI')
  },
  {
    id: 'rbi-grade-b',
    name: 'RBI (Grade B Officer / Assistant)',
    category: 'banking',
    organization: 'Reserve Bank of India (rbi.org.in)',
    description: 'Official RBI recruitment upload specs (photo, signature, thumb & declaration).',
    documents: STANDARD_BANKING_DOCS('RBI')
  },
  {
    id: 'lic-insurance',
    name: 'LIC (AAO / ADO / Assistant) & NIACL',
    category: 'banking',
    organization: 'Life Insurance Corporation / Public Sector Insurance',
    description: 'Insurance sector recruitment upload specs for LIC, NIACL, NICL, and UIIC.',
    documents: STANDARD_BANKING_DOCS('LIC')
  },
  {
    id: 'nabard-sebi',
    name: 'NABARD & SEBI Grade A / B',
    category: 'banking',
    organization: 'NABARD / Securities and Exchange Board of India',
    description: 'Regulatory body recruitment specs for NABARD, SEBI, IRDAI & PFRDA.',
    documents: STANDARD_BANKING_DOCS('NABARD / SEBI')
  }
];
