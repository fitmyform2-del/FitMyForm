import { ExamPreset } from '@/types/presets';

export const STATE_AND_OTHER_PRESETS: ExamPreset[] = [
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
