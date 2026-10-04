import React from 'react';
import { Metadata } from 'next';
import { FocusedToolPage } from '@/components/tool/FocusedToolPage';

export const metadata: Metadata = {
  title: 'Passport Photo Resizer for Online Forms (200x230, 350x450, 20-50 KB) | FitMyForm',
  description: 'Resize passport photos to exact dimensions (200x230 px, 350x450 px) and compressed file size (20 KB to 50 KB JPG) for SSC, UPSC, Banking, and College application forms.',
  keywords: ['passport photo resizer', 'ssc photo resizer 20-50 kb', '200x230 photo resizer', 'upsc photo resizer 350x350', 'online photo converter jpg']
};

export default function PhotoResizerPage() {
  return (
    <FocusedToolPage
      config={{
        title: 'Passport Photo Resizer',
        badge: 'Official Portal Specs',
        description: 'Resize your passport photo to exact pixel dimensions (200×230 px or 350×450 px) and compress to 20–50 KB JPG with 100% in-browser privacy.',
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
        seoTitle: 'How to Resize Passport Photo for Online Forms',
        seoDescription: 'Guide to resizing passport photographs to 200x230 px and 20-50 KB JPG for competitive exams and online application forms.',
        faqs: [
          {
            question: 'What is the standard passport photo size for online forms?',
            answer: 'Most Indian exam portals (SSC, IBPS, State PSCs) require 200x230 pixels, with a file size strictly between 20 KB and 50 KB in JPG format.'
          },
          {
            question: 'Are my photos uploaded to any server?',
            answer: 'No. All processing runs 100% in your device web browser via HTML5 Canvas. Your photos never leave your device.'
          }
        ]
      }}
    />
  );
}
