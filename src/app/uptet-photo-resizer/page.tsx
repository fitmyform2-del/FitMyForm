import React from 'react';
import { Metadata } from 'next';
import { FocusedToolPage } from '@/components/tool/FocusedToolPage';

export const metadata: Metadata = {
  title: 'UPTET Photo & Signature Resizer (20-50 KB) | FitMyForm',
  description: 'Online photo and signature formatter for UPTET and UP Government competitive exams. 20–50 KB JPG with exact dimensions.',
  keywords: ['uptet photo resizer', 'uptet signature size', 'up police photo resizer', 'up gov form photo resizer']
};

export default function UptetPhotoResizerPage() {
  return (
    <FocusedToolPage
      config={{
        title: 'UPTET Photo & Signature Resizer',
        badge: 'UP Pariksha Regulatory Authority',
        description: 'Resize passport photo to 20–50 KB JPG and signature to 10–20 KB JPG for UPTET, UP Police, and UPSSSC online forms.',
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
        seoTitle: 'UPTET Exam Photo & Signature Guide',
        seoDescription: 'Accurately format photos and signatures for UP State Teacher Eligibility Test and UP Government recruitments.',
        faqs: [
          {
            question: 'What are the photo dimensions for UPTET?',
            answer: 'UPTET requires passport photos between 20 KB and 50 KB in JPG format with white background.'
          }
        ]
      }}
    />
  );
}
