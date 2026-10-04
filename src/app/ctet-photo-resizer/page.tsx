import React from 'react';
import { Metadata } from 'next';
import { FocusedToolPage } from '@/components/tool/FocusedToolPage';

export const metadata: Metadata = {
  title: 'CTET Photo Resizer (10-100 KB) & Signature Formatter (3-30 KB) | FitMyForm',
  description: 'Resize passport photo and signature for CTET online application portal. 3.5cm x 4.5cm dimensions, 10–100 KB JPG format.',
  keywords: ['ctet photo resizer', 'ctet signature format 3-30 kb', 'ctet photo size 10-100 kb']
};

export default function CtetPhotoResizerPage() {
  return (
    <FocusedToolPage
      config={{
        title: 'CTET Photo & Signature Resizer',
        badge: 'CBSE CTET 2025-2026',
        description: 'Format passport photograph (10–100 KB JPG) and signature (3–30 KB JPG) according to official CBSE CTET guidelines.',
        defaultRequirements: {
          documentType: 'photo',
          width: 240,
          height: 320,
          format: 'JPG',
          minSizeKB: 10,
          maxSizeKB: 100,
          bgColor: '#FFFFFF',
          cropMode: 'fill'
        },
        seoTitle: 'Official CTET Photo & Signature Resizer Guide',
        seoDescription: 'Accurately format documents for Central Teacher Eligibility Test (CTET) with zero server uploads.',
        faqs: [
          {
            question: 'What is the required photo size for CTET?',
            answer: 'CTET requires photos between 10 KB and 100 KB in JPG format with dimensions around 3.5cm x 4.5cm.'
          },
          {
            question: 'What is the signature requirement for CTET?',
            answer: 'Signatures must be strictly between 3 KB and 30 KB in JPG format on white background.'
          }
        ]
      }}
    />
  );
}
