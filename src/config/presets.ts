import { ExamPreset } from '@/types/presets';

export const EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'ssc-cgl',
    name: 'SSC (CGL / CHSL / MTS / GD)',
    category: 'national',
    organization: 'Staff Selection Commission',
    description: 'Official specifications for SSC online application forms.',
    documents: {
      photo: {
        title: 'SSC Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 200,
        height: 230,
        dpi: 200,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'White background mandatory. Dimensions 3.5 cm x 4.5 cm (200 x 230 px).'
      },
      signature: {
        title: 'SSC Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 20,
        width: 140,
        height: 60,
        dpi: 200,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Black ink signature on white paper. Dimensions 4.0 cm x 2.0 cm (140 x 60 px).'
      }
    }
  },
  {
    id: 'upsc-civil-services',
    name: 'UPSC (IAS / IPS / NDA / CDS)',
    category: 'national',
    organization: 'Union Public Service Commission',
    description: 'Official dimensions and size requirements for UPSC forms.',
    documents: {
      photo: {
        title: 'UPSC Photograph',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 300,
        width: 350,
        height: 350,
        minWidth: 350,
        maxWidth: 1000,
        minHeight: 350,
        maxHeight: 1000,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Min 350x350 px, Max 1000x1000 px. White background with name and date.'
      },
      signature: {
        title: 'UPSC Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 300,
        width: 350,
        height: 350,
        minWidth: 350,
        maxWidth: 1000,
        minHeight: 350,
        maxHeight: 1000,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Dark ink signature on plain white paper.'
      },
      idProof: {
        title: 'UPSC Photo ID Proof (Aadhaar/Voter)',
        documentType: 'aadhaar',
        format: ['PDF'],
        minSizeKB: 20,
        maxSizeKB: 300,
        notes: 'PDF format only. Size must be between 20 KB and 300 KB.'
      }
    }
  },
  {
    id: 'ibps-banking',
    name: 'Banking (IBPS PO / Clerk / SBI PO)',
    category: 'banking',
    organization: 'Institute of Banking Personnel Selection / SBI',
    description: 'Standard dimensions for all IBPS and SBI recruitment forms.',
    documents: {
      photo: {
        title: 'IBPS Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 200,
        height: 230,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Size 20 KB to 50 KB. 200 x 230 pixels.'
      },
      signature: {
        title: 'IBPS Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 20,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Black ink only. Size 10 KB to 20 KB.'
      },
      thumb: {
        title: 'IBPS Left Thumb Impression',
        documentType: 'thumb',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 240,
        height: 240,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Blue or black ink on white paper. 240 x 240 pixels (3 cm x 3 cm).'
      },
      declaration: {
        title: 'IBPS Handwritten Declaration',
        documentType: 'declaration',
        format: ['JPG', 'JPEG'],
        minSizeKB: 50,
        maxSizeKB: 100,
        width: 800,
        height: 400,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Handwritten statement in English on white paper with black ink. 800 x 400 pixels.'
      }
    }
  },
  {
    id: 'rrb-railway',
    name: 'Railway (RRB NTPC / Group D / ALP)',
    category: 'railway',
    organization: 'Railway Recruitment Board',
    description: 'Photo and signature requirements for Indian Railways RRB online forms.',
    documents: {
      photo: {
        title: 'RRB Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 350,
        height: 450,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Plain light/white background. 35 mm x 45 mm (350 x 450 px).'
      },
      signature: {
        title: 'RRB Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 20,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Running handwriting signature (not in block letters).'
      }
    }
  },
  {
    id: 'nta-neet-jee',
    name: 'NTA (NEET UG / JEE Main / CUET)',
    category: 'national',
    organization: 'National Testing Agency',
    description: 'Document specifications for NTA competitive exams.',
    documents: {
      photo: {
        title: 'NTA Passport Photograph',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 200,
        width: 350,
        height: 450,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'White background. 80% face coverage showing ears clearly.'
      },
      signature: {
        title: 'NTA Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 4,
        maxSizeKB: 30,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Black ink signature on white paper.'
      },
      thumb: {
        title: 'NTA Finger & Thumb Impressions',
        documentType: 'thumb',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 200,
        width: 400,
        height: 200,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Left & Right hand fingers & thumb impressions on white paper.'
      },
      idProof: {
        title: 'Category / PwD / ID Certificate',
        documentType: 'certificate',
        format: ['PDF'],
        minSizeKB: 50,
        maxSizeKB: 300,
        notes: 'Clear scan in PDF format between 50 KB and 300 KB.'
      }
    }
  },
  {
    id: 'uptet',
    name: 'UPTET / UP Police / UP Gov',
    category: 'state',
    organization: 'Uttar Pradesh Exam Authority',
    description: 'Photo and signature formatting for UP state entrance exams.',
    documents: {
      photo: {
        title: 'UPTET Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 200,
        height: 230,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Clear recent photo with white or light gray background.'
      },
      signature: {
        title: 'UPTET Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 5,
        maxSizeKB: 20,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Dark blue or black ink signature.'
      }
    }
  },
  {
    id: 'ctet',
    name: 'CTET (Central Teacher Eligibility Test)',
    category: 'teaching',
    organization: 'CBSE / CTET',
    description: 'Requirements for CTET online application portal.',
    documents: {
      photo: {
        title: 'CTET Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 100,
        width: 350,
        height: 450,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Dimensions 3.5 cm x 4.5 cm (10 KB to 100 KB).'
      },
      signature: {
        title: 'CTET Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 3,
        maxSizeKB: 30,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Dimensions 3.5 cm x 1.5 cm (3 KB to 30 KB).'
      }
    }
  },
  {
    id: 'general-passport',
    name: 'Standard Indian Passport Photo (3.5 x 4.5 cm)',
    category: 'other',
    organization: 'General Universal Preset',
    description: 'Standard passport photo format used by government portals.',
    documents: {
      photo: {
        title: 'Standard Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG', 'PNG'],
        minSizeKB: 20,
        maxSizeKB: 100,
        width: 413,
        height: 531,
        dpi: 300,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Standard 35 x 45 mm at 300 DPI (413 x 531 px).'
      }
    }
  },
  {
    id: 'general-signature',
    name: 'Standard Online Signature (140 x 60 px)',
    category: 'other',
    organization: 'General Universal Preset',
    description: 'Universal online signature requirement for college and job portals.',
    documents: {
      signature: {
        title: 'Standard Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG', 'PNG'],
        minSizeKB: 10,
        maxSizeKB: 50,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '140 x 60 px signature image on clean white background.'
      }
    }
  },
  {
    id: 'pdf-document-standard',
    name: 'PDF Document (< 500 KB / < 1 MB)',
    category: 'other',
    organization: 'General PDF Portal',
    description: 'Standard PDF document requirement for certificate & Aadhaar upload.',
    documents: {
      certificate: {
        title: 'Standard PDF Certificate',
        documentType: 'certificate',
        format: ['PDF'],
        minSizeKB: 50,
        maxSizeKB: 500,
        notes: 'PDF file under 500 KB.'
      }
    }
  }
];

export const DOCUMENT_TYPE_LABELS: Record<string, { label: string; defaultWidth: number; defaultHeight: number; minKB: number; maxKB: number; icon: string }> = {
  photo: { label: 'Passport Photo', defaultWidth: 200, defaultHeight: 230, minKB: 20, maxKB: 50, icon: 'Camera' },
  signature: { label: 'Signature', defaultWidth: 140, defaultHeight: 60, minKB: 10, maxKB: 20, icon: 'PenTool' },
  thumb: { label: 'Thumb Impression', defaultWidth: 240, defaultHeight: 240, minKB: 20, maxKB: 50, icon: 'Fingerprint' },
  declaration: { label: 'Handwritten Declaration', defaultWidth: 800, defaultHeight: 400, minKB: 50, maxKB: 100, icon: 'FileText' },
  aadhaar: { label: 'Aadhaar / ID Card', defaultWidth: 800, defaultHeight: 500, minKB: 50, maxKB: 200, icon: 'CreditCard' },
  marksheet: { label: 'Marksheet / Degree', defaultWidth: 1200, defaultHeight: 1600, minKB: 100, maxKB: 500, icon: 'GraduationCap' },
  certificate: { label: 'Certificate / PwD / Category', defaultWidth: 1200, defaultHeight: 1600, minKB: 50, maxKB: 300, icon: 'Award' },
  other: { label: 'Other Document', defaultWidth: 600, defaultHeight: 600, minKB: 20, maxKB: 200, icon: 'File' }
};
