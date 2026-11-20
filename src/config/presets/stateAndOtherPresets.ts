import type { ExamPreset } from '@/types/presets';

export const STATE_AND_OTHER_PRESETS: ExamPreset[] = [
  {
    id: 'pan-utiitsl',
    name: 'PAN Card (UTIITSL Portal)',
    category: 'other',
    organization: 'UTIITSL PAN Online Services',
    description: 'Exact UTIITSL square photo (213×213 px <30 KB) and signature (400×200 px <60 KB) specs.',
    documents: {
      photo: {
        title: 'UTIITSL PAN Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 5,
        maxSizeKB: 30,
        width: 213,
        height: 213,
        dpi: 300,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Exact 213 × 213 px (300 DPI), strictly under 30 KB JPG on white background.'
      },
      signature: {
        title: 'UTIITSL PAN Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 5,
        maxSizeKB: 60,
        width: 400,
        height: 200,
        dpi: 600,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '400 × 200 px (600 DPI B&W), strictly under 60 KB JPG.'
      }
    }
  },
  {
    id: 'pan-nsdl',
    name: 'PAN Card (Protean NSDL Portal)',
    category: 'other',
    organization: 'Protean eGov Technologies (NSDL)',
    description: 'Official NSDL Protean PAN application photo (3.5×2.5 cm) and signature (2×4.5 cm) specs.',
    documents: {
      photo: {
        title: 'NSDL PAN Photo (2.5 × 3.5 cm)',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 197,
        height: 276,
        dpi: 200,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '2.5 × 3.5 cm at 200 DPI (197×276 px), 20–50 KB JPG on white background.'
      },
      signature: {
        title: 'NSDL PAN Signature (4.5 × 2.0 cm)',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 50,
        width: 354,
        height: 157,
        dpi: 200,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '4.5 × 2.0 cm at 200 DPI (354×157 px), 10–50 KB JPG.'
      }
    }
  },
  {
    id: 'us-visa-ds160',
    name: 'US Visa (DS-160 / CEAC Portal)',
    category: 'other',
    organization: 'U.S. Department of State',
    description: 'Strict US Visa digital photo specification: 1:1 square, 600×600 to 1200×1200 px, ≤ 240 KB.',
    documents: {
      photo: {
        title: 'US Visa DS-160 Photo (2×2 inch)',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 240,
        width: 600,
        height: 600,
        minWidth: 600,
        maxWidth: 1200,
        minHeight: 600,
        maxHeight: 1200,
        dpi: 300,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Exact 1:1 square (600×600 to 1200×1200 px), ≤ 240 KB JPEG. Plain white background, no glasses, head 50–69%.'
      }
    }
  },
  {
    id: 'general-passport',
    name: 'Indian Passport & Schengen Visa (35×45 mm)',
    category: 'other',
    organization: 'Passport Seva / ICAO Biometric Standard',
    description: 'Standard 35 × 45 mm (300 DPI) biometric passport & Schengen visa photo format.',
    documents: {
      photo: {
        title: 'Biometric Passport / Visa Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 120,
        width: 413,
        height: 531,
        dpi: 300,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '35 × 45 mm at 300 DPI (413×531 px), 20–120 KB JPG. Face 70–80%, plain white/light-grey background, no glasses.'
      }
    }
  },
  {
    id: 'general-signature',
    name: 'Standard Online Signature (140 × 60 px)',
    category: 'other',
    organization: 'Universal College & Job Portal Preset',
    description: 'Universal online signature requirement for college admissions and recruitment portals.',
    documents: {
      signature: {
        title: 'Standard Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG', 'PNG'],
        minSizeKB: 10,
        maxSizeKB: 20,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '140 × 60 px, 10–20 KB signature image on clean white background.'
      }
    }
  },
  {
    id: 'pdf-document-standard',
    name: 'PDF Certificate / Aadhaar (< 300 KB / 500 KB)',
    category: 'other',
    organization: 'General Govt & University PDF Portals',
    description: 'Standard PDF compression targets for marksheets, caste certificates, and ID proofs.',
    documents: {
      certificate: {
        title: 'Exam PDF Certificate (< 300 KB)',
        documentType: 'certificate',
        format: ['PDF'],
        minSizeKB: 20,
        maxSizeKB: 300,
        notes: 'Standard 300 KB cap accepted by UPSC, NTA, SSC, and state portals.'
      },
      idProof: {
        title: 'General PDF Document (< 500 KB)',
        documentType: 'aadhaar',
        format: ['PDF'],
        minSizeKB: 50,
        maxSizeKB: 500,
        notes: 'PDF file strictly under 500 KB.'
      }
    }
  }
];
