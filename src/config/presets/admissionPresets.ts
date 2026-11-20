import type { ExamPreset } from '@/types/presets';

export const ADMISSION_EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'nta-neet-jee',
    name: 'NTA NEET UG (Medical Entrance)',
    category: 'admission',
    organization: 'National Testing Agency (exams.nta.ac.in)',
    description: 'Complete NEET UG upload specs: passport photo, 4×6 postcard photo, signature, fingers & thumb, and PDFs.',
    documents: {
      photo: {
        title: 'NEET Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 200,
        width: 350,
        height: 450,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '3.5 × 4.5 cm (350×450 px), 10–200 KB JPG. White background, 80% face with ears visible.'
      },
      postcard: {
        title: 'NEET Postcard Photo (4×6 inch)',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 200,
        width: 1200,
        height: 1800,
        dpi: 300,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '4 × 6 inch postcard photo (1200×1800 px), 10–200 KB JPG. Must match passport photo.'
      },
      signature: {
        title: 'NEET Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 4,
        maxSizeKB: 50,
        width: 350,
        height: 150,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '4–50 KB JPG (safe target 10–30 KB). Black ink running handwriting on white paper (no block letters).'
      },
      thumb: {
        title: 'NEET Left & Right Fingers & Thumb',
        documentType: 'thumb',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 200,
        width: 400,
        height: 200,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '10–200 KB JPG, blue/black ink pad impressions of all fingers & thumbs on white paper.'
      },
      certificate: {
        title: 'NEET Category / PwD / Class 10 PDF',
        documentType: 'certificate',
        format: ['PDF'],
        minSizeKB: 50,
        maxSizeKB: 300,
        notes: 'Clear PDF scan strictly between 50 KB and 300 KB.'
      }
    }
  },
  {
    id: 'nta-jee-main',
    name: 'NTA JEE Main (Engineering Entrance)',
    category: 'admission',
    organization: 'National Testing Agency (jeemain.nta.nic.in)',
    description: 'Official NTA specifications for JEE Main B.E./B.Tech & B.Arch registrations.',
    documents: {
      photo: {
        title: 'JEE Main Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 200,
        width: 350,
        height: 450,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '10–200 KB JPG, white background, 80% face without mask, ears clearly visible.'
      },
      signature: {
        title: 'JEE Main Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 4,
        maxSizeKB: 50,
        width: 350,
        height: 150,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '4–50 KB JPG, black ink running hand on white paper.'
      },
      certificate: {
        title: 'Category / PwD Certificate (PDF)',
        documentType: 'certificate',
        format: ['PDF'],
        minSizeKB: 50,
        maxSizeKB: 300,
        notes: 'PDF scan between 50 KB and 300 KB.'
      }
    }
  },
  {
    id: 'nta-cuet',
    name: 'NTA CUET (UG / PG University Admission)',
    category: 'admission',
    organization: 'National Testing Agency (exams.nta.ac.in)',
    description: 'Document formatting guidelines for Common University Entrance Test UG & PG.',
    documents: {
      photo: {
        title: 'CUET Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 200,
        width: 350,
        height: 450,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '10–200 KB JPG, white background, 80% face coverage.'
      },
      signature: {
        title: 'CUET Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 4,
        maxSizeKB: 30,
        width: 350,
        height: 150,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '4–30 KB JPG, black ink on white paper in running handwriting.'
      },
      certificate: {
        title: 'CUET Category / EWS Certificate (PDF)',
        documentType: 'certificate',
        format: ['PDF'],
        minSizeKB: 50,
        maxSizeKB: 300,
        notes: 'PDF scan between 50 KB and 300 KB.'
      }
    }
  },
  {
    id: 'nta-ugc-net',
    name: 'NTA UGC NET / CSIR NET',
    category: 'admission',
    organization: 'National Testing Agency',
    description: 'Photo & signature upload specs for UGC NET and CSIR NET JRF exams.',
    documents: {
      photo: {
        title: 'UGC NET Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 200,
        width: 350,
        height: 450,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '10–200 KB JPG, plain white background, 80% face coverage.'
      },
      signature: {
        title: 'UGC NET Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 4,
        maxSizeKB: 30,
        width: 350,
        height: 150,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '4–30 KB JPG, running handwriting with black ink on white paper.'
      }
    }
  },
  {
    id: 'gate-exam',
    name: 'GATE (IIT / IISc Engineering & Science)',
    category: 'admission',
    organization: 'IIT / IISc GOAPS Portal',
    description: 'Strict GOAPS pixel & aspect-ratio rules for GATE photo, signature, and ID proof.',
    documents: {
      photo: {
        title: 'GATE Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 5,
        maxSizeKB: 600,
        width: 400,
        height: 520,
        minWidth: 200,
        maxWidth: 530,
        minHeight: 260,
        maxHeight: 690,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '200×260 to 530×690 px (3.5×4.5 cm), 5–600 KB JPG, plain white background, face 60–70%.'
      },
      signature: {
        title: 'GATE Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 5,
        maxSizeKB: 200,
        width: 420,
        height: 140,
        minWidth: 250,
        maxWidth: 580,
        minHeight: 80,
        maxHeight: 180,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '250×80 to 580×180 px (~3:1 ratio), 5–200 KB JPG, dark blue/black ink on white paper.'
      },
      idProof: {
        title: 'GATE Photo ID / Category PDF',
        documentType: 'aadhaar',
        format: ['PDF'],
        minSizeKB: 10,
        maxSizeKB: 600,
        notes: 'PDF scan between 10 KB and 600 KB.'
      }
    }
  },
  {
    id: 'cat-iim',
    name: 'CAT (IIM MBA Admission)',
    category: 'admission',
    organization: 'Indian Institutes of Management (iimcat.ac.in)',
    description: 'Official CAT portal photo and signature dimensions for IIM admissions.',
    documents: {
      photo: {
        title: 'CAT Photograph (Square)',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 30,
        maxSizeKB: 1000,
        width: 1200,
        height: 1200,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'High-res square photo (~1200×1200 px), up to 1 MB JPG, plain white/off-white background.'
      },
      signature: {
        title: 'CAT Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 80,
        width: 480,
        height: 210,
        dpi: 150,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '80 × 35 mm at 150+ DPI, strictly under 80 KB JPG on white unlined paper.'
      }
    }
  },
  {
    id: 'clat-law',
    name: 'CLAT (National Law Universities)',
    category: 'admission',
    organization: 'Consortium of NLUs',
    description: 'Document formatting specifications for CLAT UG & PG law admissions.',
    documents: {
      photo: {
        title: 'CLAT Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 500,
        width: 200,
        height: 230,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '3.5 × 4.5 cm (200×230 px), 20–500 KB JPG on plain white/light background.'
      },
      signature: {
        title: 'CLAT Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 100,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '3.5 × 1.5 cm (140×60 px), 10–100 KB JPG on plain white paper.'
      }
    }
  }
];
