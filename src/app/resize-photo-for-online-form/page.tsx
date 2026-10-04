import React from 'react';
import { Metadata } from 'next';
import { FocusedToolPage } from '@/components/tool/FocusedToolPage';

export const metadata: Metadata = {
  title: 'Resize Photo & Signature for Online Application Forms | FitMyForm',
  description: 'Resize, crop, and compress passport photos and signatures to exact pixel dimensions (200x230, 140x60) and file limits (20-50 KB) for government forms.',
  keywords: ['how to resize photo for online form', 'resize image for exam form online', 'passport photo dimensions for indian exams']
};

export default function ResizePhotoGuidePage() {
  return (
    <FocusedToolPage
      config={{
        title: 'Online Application Form Photo Resizer',
        badge: 'Universal Form Resizer',
        description: 'Universal photo and signature formatter for all online application portals (SSC, UPSC, Banking, State PSCs, Colleges).',
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
        seoTitle: 'How to Format Photos for Online Application Forms',
        seoDescription: 'Step-by-step tool and guide to format documents for online job and exam applications in India.',
        faqs: [
          {
            question: 'Why do application portals reject uploaded photos?',
            answer: 'Portals reject files that exceed maximum file size limits (e.g. 50 KB) or do not match the required aspect ratio and pixel dimensions.'
          }
        ]
      }}
    />
  );
}
