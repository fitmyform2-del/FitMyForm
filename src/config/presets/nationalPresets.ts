import type { ExamPreset } from '@/types/presets';

export const NATIONAL_EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'ssc-cgl',
    name: 'SSC (CGL / CHSL / MTS / GD / CPO / JE)',
    category: 'national',
    organization: 'Staff Selection Commission (ssc.gov.in)',
    description: 'Official 2025–2026 specifications for SSC online application forms.',
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
        notes: '3.5 × 4.5 cm (200×230 px), plain white background, no caps/glasses. Note: ssc.gov.in also uses live webcam capture.'
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
        defaultCropMode: 'fit',
        notes: '4.0–6.0 × 2.0 cm, strictly 10–20 KB JPG. Black/blue ink on white paper; running hand (NO ALL CAPS).'
      }
    }
  },
  {
    id: 'upsc-civil-services',
    name: 'UPSC (CSE / IAS / NDA / CDS / CAPF / EPFO)',
    category: 'national',
    organization: 'Union Public Service Commission (upsconline.nic.in)',
    description: 'Official OTR & exam specifications for UPSC Civil Services, NDA, CDS, and EPFO.',
    documents: {
      photo: {
        title: 'UPSC Photograph (with Name & Date)',
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
        notes: 'Square 350×350 to 1000×1000 px, 20–300 KB. Face 75% of frame; Candidate Name & Photo Date mandatory at bottom.'
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
        defaultCropMode: 'fit',
        notes: '350×350 to 1000×1000 px, 20–300 KB JPG. Black/dark blue ink on white paper (CSE requires triple signature vertically).'
      },
      idProof: {
        title: 'UPSC Photo ID Proof (Aadhaar / PAN / Voter)',
        documentType: 'aadhaar',
        format: ['PDF'],
        minSizeKB: 20,
        maxSizeKB: 300,
        notes: 'Clear PDF scan strictly between 20 KB and 300 KB.'
      }
    }
  },
  {
    id: 'rrb-railway',
    name: 'Railway RRB (NTPC / Group D / ALP / JE / RPF)',
    category: 'railway',
    organization: 'Railway Recruitment Board (rrbapply.gov.in)',
    description: 'Updated 2025–2026 RRB portal specifications for NTPC, ALP, Group D, JE & RPF.',
    documents: {
      signature: {
        title: 'RRB Signature (30–49 KB)',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 30,
        maxSizeKB: 49,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: 'Updated rrbapply.gov.in rule: strictly 30–49 KB JPG, min 140×60 px (35×20 mm), black ink in running hand (no block letters).'
      },
      photo: {
        title: 'RRB Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 30,
        maxSizeKB: 70,
        width: 350,
        height: 450,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '35 × 45 mm (350×450 px), plain white background. Note: New rrbapply.gov.in cycles use live webcam photo capture.'
      },
      certificate: {
        title: 'RRB SC / ST / EWS Certificate (PDF)',
        documentType: 'certificate',
        format: ['PDF'],
        minSizeKB: 50,
        maxSizeKB: 300,
        notes: 'PDF scan under 300 KB for fee concession / category verification.'
      }
    }
  },
  {
    id: 'afcat-defence',
    name: 'AFCAT (Indian Air Force)',
    category: 'national',
    organization: 'Indian Air Force / C-DAC',
    description: 'Official C-DAC AFCAT photo, signature, and thumb impression upload rules.',
    documents: {
      photo: {
        title: 'AFCAT Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 100,
        maxSizeKB: 200,
        width: 350,
        height: 450,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Strictly 100–200 KB JPG on light/white background (save as Passport Photograph.jpg).'
      },
      signature: {
        title: 'AFCAT Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 80,
        maxSizeKB: 150,
        width: 280,
        height: 100,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '80–150 KB JPG on white paper (save as Signature.jpg).'
      },
      thumb: {
        title: 'AFCAT Thumb Impression',
        documentType: 'thumb',
        format: ['JPG', 'JPEG'],
        minSizeKB: 50,
        maxSizeKB: 100,
        width: 240,
        height: 240,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: 'Left thumb (men) / Right thumb (women), 50–100 KB JPG (save as Thumb Impression.jpg).'
      }
    }
  },
  {
    id: 'agniveer-defence',
    name: 'Agniveer (Indian Army / Navy / Air Force)',
    category: 'national',
    organization: 'Join Indian Army / Agnipath Scheme',
    description: 'Document formatting rules for Indian Army, Navy, and Air Force Agniveer forms.',
    documents: {
      photo: {
        title: 'Agniveer Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 50,
        width: 200,
        height: 230,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '10–50 KB JPG, plain light/white background, recent front-facing portrait.'
      },
      signature: {
        title: 'Agniveer Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 5,
        maxSizeKB: 20,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '5–20 KB JPG, black/blue ink on plain white paper.'
      }
    }
  }
];
