import type { ExamPreset } from '@/types/presets';

export const STATE_EXAM_PRESETS: ExamPreset[] = [
  {
    id: 'uppsc',
    name: 'UPPSC (OTR / PCS / RO-ARO)',
    category: 'state',
    organization: 'Uttar Pradesh Public Service Commission',
    description: 'Official UPPSC OTR and PCS portal photo & signature dimensions.',
    documents: {
      photo: {
        title: 'UPPSC Photo (5 × 6 cm)',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 394,
        height: 472,
        dpi: 200,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '5.0 × 6.0 cm (~394×472 px @ 200 DPI), 20–50 KB JPG.'
      },
      signature: {
        title: 'UPPSC Signature (6 × 3 cm)',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 30,
        width: 472,
        height: 236,
        dpi: 200,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '6.0 × 3.0 cm (~472×236 px @ 200 DPI), 10–30 KB JPG. Black ink full signature.'
      }
    }
  },
  {
    id: 'upsssc-pet',
    name: 'UPSSSC PET & UP Subordinate Exams',
    category: 'state',
    organization: 'UP Subordinate Services Selection Commission',
    description: 'Photo & combined English + Hindi signature guidelines for UPSSSC PET, Lekhpal & VDO.',
    documents: {
      photo: {
        title: 'UPSSSC Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 413,
        height: 531,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '3.5 × 4.5 cm (413×531 px), 20–50 KB JPG on white/light background.'
      },
      signature: {
        title: 'UPSSSC Signature (Eng + Hindi)',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 5,
        maxSizeKB: 30,
        width: 413,
        height: 177,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '3.5 × 1.5 cm (413×177 px), 5–30 KB JPG. Write full name in Hindi below running signature.'
      }
    }
  },
  {
    id: 'up-police',
    name: 'UP Police (Constable / SI / OTR)',
    category: 'state',
    organization: 'UPPRPB (uppbpb.gov.in)',
    description: 'Official UP Police Constable, Sub-Inspector & Radio Operator upload dimensions.',
    documents: {
      photo: {
        title: 'UP Police Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 200,
        height: 230,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '200 × 230 px, 20–50 KB JPG, plain white or light-grey background.'
      },
      signature: {
        title: 'UP Police Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 5,
        maxSizeKB: 20,
        width: 140,
        height: 60,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '140 × 60 px, strictly 5–20 KB JPG, black ink on white paper.'
      }
    }
  },
  {
    id: 'bpsc',
    name: 'BPSC (Bihar CCE / Teacher TRE)',
    category: 'state',
    organization: 'Bihar Public Service Commission',
    description: 'BPSC OAMS dual English & Hindi signature specs and photo fallback dimensions.',
    documents: {
      signature: {
        title: 'BPSC Signature (English / Hindi)',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 5,
        maxSizeKB: 15,
        width: 220,
        height: 100,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '220 × 100 px, strictly under 15 KB JPG. Upload English & Hindi signatures separately.'
      },
      photo: {
        title: 'BPSC Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 200,
        height: 230,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '20–50 KB JPG (200×230 px). Note: Recent BPSC CCE/TRE cycles also capture live webcam photo.'
      }
    }
  },
  {
    id: 'bssc-bihar',
    name: 'BSSC (Bihar SSC / Bihar Police)',
    category: 'state',
    organization: 'Bihar Staff Selection Commission / CSBC',
    description: 'Photo & signature upload specs for BSSC Inter/Graduate Level & Bihar Police.',
    documents: {
      photo: {
        title: 'BSSC Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 200,
        height: 230,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '20–50 KB JPG (200×230 px) with plain light/white background.'
      },
      signature: {
        title: 'BSSC Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 50,
        width: 276,
        height: 118,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '276 × 118 px, 10–50 KB JPG on plain white paper.'
      }
    }
  },
  {
    id: 'mppsc',
    name: 'MPPSC & MPESB (Madhya Pradesh)',
    category: 'state',
    organization: 'Madhya Pradesh Public Service Commission',
    description: 'MPPSC State Services & MPESB photo (with Name & Date strip) and signature specs.',
    documents: {
      photo: {
        title: 'MPPSC Photo (Name & Date)',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 25,
        maxSizeKB: 200,
        width: 275,
        height: 354,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '3.5 × 4.5 cm (275×354 px), 25–200 KB JPG. Enable Photo Stamp in Advanced Options for Name & Date.'
      },
      signature: {
        title: 'MPPSC Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 25,
        maxSizeKB: 200,
        width: 275,
        height: 118,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '3.5 × 1.5 cm (275×118 px), 25–200 KB JPG.'
      }
    }
  },
  {
    id: 'rpsc',
    name: 'RPSC & RSMSSB (Rajasthan SSO)',
    category: 'state',
    organization: 'Rajasthan Public Service Commission (sso.rajasthan.gov.in)',
    description: 'Rajasthan SSO OTR specs for RAS, RPSC 1st/2nd Grade, Patwari & RSMSSB exams.',
    documents: {
      photo: {
        title: 'RPSC / SSO Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 50,
        maxSizeKB: 100,
        width: 350,
        height: 450,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '350 × 450 px, 50–100 KB JPG on plain light/white background.'
      },
      signature: {
        title: 'RPSC / SSO Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 280,
        height: 120,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '280 × 120 px, 20–50 KB JPG, black/dark blue ballpoint pen.'
      }
    }
  },
  {
    id: 'mpsc',
    name: 'MPSC (Maharashtra PSC)',
    category: 'state',
    organization: 'Maharashtra Public Service Commission (mpsconline.gov.in)',
    description: 'Official MPSC Rajyaseva & Combined Group B/C upload rules.',
    documents: {
      photo: {
        title: 'MPSC Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 50,
        width: 275,
        height: 354,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '3.5 × 4.5 cm (275×354 px), strictly under 50 KB JPEG. Keep filename short (e.g. photo.jpg).'
      },
      signature: {
        title: 'MPSC Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 50,
        width: 275,
        height: 118,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '3.5 × 1.5 cm (275×118 px), strictly under 50 KB JPEG.'
      }
    }
  },
  {
    id: 'wbpsc',
    name: 'WBPSC (West Bengal PSC / WBCS)',
    category: 'state',
    organization: 'West Bengal Public Service Commission',
    description: 'WBCS, Clerkship, Food SI & WBPSC portal photo and signature dimensions.',
    documents: {
      photo: {
        title: 'WBPSC Passport Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 100,
        width: 138,
        height: 177,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '138 × 177 px (3.5 × 4.5 cm), 20–100 KB JPG on light/white background.'
      },
      signature: {
        title: 'WBPSC Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 20,
        width: 138,
        height: 59,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '138 × 59 px (3.5 × 1.5 cm), 10–20 KB JPG, black/blue ink on white paper.'
      }
    }
  },
  {
    id: 'tnpsc',
    name: 'TNPSC (Tamil Nadu Group 1 / 2 / 4 OTR)',
    category: 'state',
    organization: 'Tamil Nadu Public Service Commission',
    description: 'TNPSC OTR photo (with Name & Date strip) and signature dimensions.',
    documents: {
      photo: {
        title: 'TNPSC Photo (Name & Date)',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 20,
        maxSizeKB: 50,
        width: 240,
        height: 320,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '240 × 320 px, 20–50 KB JPG. Must include white Name & Date strip at bottom.'
      },
      signature: {
        title: 'TNPSC Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 20,
        width: 350,
        height: 120,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '350 × 120 px, 10–20 KB JPG on white paper.'
      }
    }
  },
  {
    id: 'kpsc-kerala',
    name: 'Kerala PSC (Thulasi Portal)',
    category: 'state',
    organization: 'Kerala Public Service Commission',
    description: 'Strict Kerala PSC Thulasi profile photo (150×200 px) & signature (150×100 px) rules.',
    documents: {
      photo: {
        title: 'Kerala PSC Photo (Name & Date)',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 30,
        width: 150,
        height: 200,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: 'Exact 150 × 200 px, strictly under 30 KB JPG. Candidate Name & Photo Date required at bottom.'
      },
      signature: {
        title: 'Kerala PSC Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 5,
        maxSizeKB: 30,
        width: 150,
        height: 100,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: 'Exact 150 × 100 px, strictly under 30 KB JPG on plain white paper.'
      }
    }
  },
  {
    id: 'gpsc-gujarat',
    name: 'GPSC & GSSSB (Gujarat OJAS)',
    category: 'state',
    organization: 'Gujarat Public Service Commission / OJAS',
    description: 'Photo & signature upload specifications for GPSC and Gujarat OJAS portals.',
    documents: {
      photo: {
        title: 'GPSC / OJAS Photo',
        documentType: 'photo',
        format: ['JPG', 'JPEG'],
        minSizeKB: 10,
        maxSizeKB: 100,
        width: 350,
        height: 350,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fill',
        notes: '5 × 5 cm / 350×350 px, 10–100 KB JPG on plain light background.'
      },
      signature: {
        title: 'GPSC / OJAS Signature',
        documentType: 'signature',
        format: ['JPG', 'JPEG'],
        minSizeKB: 5,
        maxSizeKB: 30,
        width: 280,
        height: 120,
        bgColor: '#FFFFFF',
        defaultCropMode: 'fit',
        notes: '5–30 KB JPG, dark blue/black ink on plain white paper.'
      }
    }
  }
];
