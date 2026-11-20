import type { ExamPreset } from '@/types/presets';

export const TEACHING_EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'ctet',
    name: 'CTET (Central Teacher Eligibility Test)',
    category: 'teaching',
    organization: 'CBSE / CTET (ctet.nic.in)',
    description: 'Official CBSE specifications for CTET Paper 1 & Paper 2 registrations.',
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
        notes: '3.5 × 4.5 cm (350×450 px), 10–100 KB JPG on plain white/light background.'
      },
      signature: {
        title: 'CTET Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 3,
        maxSizeKB: 30,
        width: 350,
        height: 150,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '3.5 × 1.5 cm (350×150 px), strictly 3–30 KB JPG in running handwriting.'
      }
    }
  },
  {
    id: 'uptet',
    name: 'UPTET & Super TET (Uttar Pradesh)',
    category: 'teaching',
    organization: 'UP Pariksha Regulatory Authority',
    description: 'Photo and signature formatting for UPTET & UP Primary/Junior Teacher exams.',
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
        notes: '3.5 × 4.5 cm (200×230 px), 20–50 KB JPG with plain white/light background.'
      },
      signature: {
        title: 'UPTET Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 20,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '10–20 KB JPG, dark blue or black ink on white paper.'
      }
    }
  },
  {
    id: 'dsssb',
    name: 'DSSSB (Delhi PRT / TGT / PGT / LDC)',
    category: 'teaching',
    organization: 'Delhi Subordinate Services Selection Board (dsssbonline.nic.in)',
    description: 'Strict OARS portal rules: 5×7" postcard photo, signature, and left/right thumb impressions.',
    documents: {
      photo: {
        title: 'DSSSB Postcard Photo (5×7 inch)',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 50,
        maxSizeKB: 300,
        width: 480,
        height: 672,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Exact 480 × 672 px (5×7 inch), 50–300 KB JPG showing upper half of body, face & shoulders on white background.'
      },
      signature: {
        title: 'DSSSB Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 40,
        width: 140,
        height: 110,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: 'Exact 140 × 110 px, 10–40 KB JPG on white paper.'
      },
      thumb: {
        title: 'DSSSB Left / Right Thumb Impression',
        documentType: 'thumb',
        format: ['JPG', 'JPEG'],
        minSizeKB: 5,
        maxSizeKB: 40,
        width: 110,
        height: 140,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: 'Exact 110 × 140 px, 5–40 KB JPG (upload left & right thumb separately on OARS).'
      }
    }
  },
  {
    id: 'kvs-nvs',
    name: 'KVS / NVS / EMRS Teaching Recruitment',
    category: 'teaching',
    organization: 'Kendriya Vidyalaya / Navodaya Vidyalaya Samiti',
    description: 'Photo & signature upload specs for KVS, NVS, and EMRS teaching & non-teaching posts.',
    documents: {
      photo: {
        title: 'KVS / NVS Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 200,
        width: 200,
        height: 230,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '3.5 × 4.5 cm (200×230 px), 10–200 KB JPG on plain white background.'
      },
      signature: {
        title: 'KVS / NVS Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 4,
        maxSizeKB: 30,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '140 × 60 px, 4–30 KB JPG, black ink on white paper in running hand.'
      }
    }
  },
  {
    id: 'reet',
    name: 'REET (Rajasthan Teacher Eligibility)',
    category: 'teaching',
    organization: 'BSER Ajmer / Rajasthan Education Board',
    description: 'Official REET Level 1 & Level 2 photo, signature, and thumb impression specs.',
    documents: {
      photo: {
        title: 'REET Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 240,
        height: 320,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '3.5 × 4.5 cm (240×320 px), 20–50 KB JPG.'
      },
      signature: {
        title: 'REET Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 20,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '10–20 KB JPG, black/blue ink on plain white paper.'
      },
      thumb: {
        title: 'REET Thumb Impression',
        documentType: 'thumb',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 240,
        height: 240,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '20–50 KB JPG, clear smudge-free thumb impression on white paper.'
      }
    }
  }
];
