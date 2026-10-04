import React from 'react';
import { Metadata } from 'next';
import { FocusedToolPage } from '@/components/tool/FocusedToolPage';

export const metadata: Metadata = {
  title: 'SSC Photo Resizer (200x230 px, 20-50 KB) & Signature Maker (140x60, 10-20 KB) | FitMyForm',
  description: 'Official SSC photo resizer for CGL, CHSL, MTS, and GD forms. Resize photo to 200x230 pixels (20–50 KB) and signature to 140x60 pixels (10–20 KB) instantly.',
  keywords: ['ssc photo resizer 200x230', 'ssc cgl photo size 20-50 kb', 'ssc signature resizer 140x60', 'ssc online photo converter']
};

export default function SscPhotoResizerPage() {
  return (
    <FocusedToolPage
      config={{
        title: 'SSC Photo Resizer (200×230 px, 20–50 KB)',
        badge: 'SSC CGL / CHSL / MTS / GD',
        description: 'Auto-format your passport photo to exact SSC specifications: 200 × 230 pixels, 20 KB to 50 KB JPG with clean white background.',
        defaultRequirements: {
          documentType: 'photo',
          width: 200,
          height: 230,
          format: 'JPG',
          minSizeKB: 20,
          maxSizeKB: 50,
          bgColor: '#FFFFFF',
          cropMode: 'fill'
        },
        seoTitle: 'Official SSC Photo Resizer Specifications Guide',
        seoDescription: 'Accurately format passport photos and signatures for Staff Selection Commission application portals.',
        faqs: [
          {
            question: 'What are the official photo requirements for SSC CGL & CHSL 2025-2026?',
            answer: 'SSC requires photos to be 200 x 230 pixels, between 20 KB and 50 KB, in JPG format, with a light/white background and both ears visible.'
          },
          {
            question: 'How do I resize my photo for SSC without losing clarity?',
            answer: 'Upload your photo above. FitMyForm uses iterative canvas scaling to preserve facial clarity while keeping the file strictly under 50 KB.'
          }
        ]
      }}
    />
  );
}
