export const DOCUMENT_TYPE_LABELS: Record<
  string,
  { label: string; defaultWidth: number; defaultHeight: number; minKB: number; maxKB: number; icon: string }
> = {
  photo: { label: 'Passport Photo', defaultWidth: 200, defaultHeight: 230, minKB: 20, maxKB: 50, icon: 'Camera' },
  signature: { label: 'Signature', defaultWidth: 140, defaultHeight: 60, minKB: 10, maxKB: 20, icon: 'PenTool' },
  thumb: { label: 'Thumb Impression', defaultWidth: 240, defaultHeight: 240, minKB: 20, maxKB: 50, icon: 'Fingerprint' },
  declaration: { label: 'Handwritten Declaration', defaultWidth: 800, defaultHeight: 400, minKB: 50, maxKB: 100, icon: 'FileText' },
  aadhaar: { label: 'Aadhaar / ID Card', defaultWidth: 800, defaultHeight: 500, minKB: 50, maxKB: 200, icon: 'CreditCard' },
  marksheet: { label: 'Marksheet / Degree', defaultWidth: 1200, defaultHeight: 1600, minKB: 100, maxKB: 500, icon: 'GraduationCap' },
  certificate: { label: 'Certificate / PwD / Category', defaultWidth: 1200, defaultHeight: 1600, minKB: 50, maxKB: 300, icon: 'Award' },
  other: { label: 'Other Document', defaultWidth: 600, defaultHeight: 600, minKB: 20, maxKB: 200, icon: 'File' }
};
