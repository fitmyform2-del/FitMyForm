import React from 'react';
import { Metadata } from 'next';
import { FocusedToolPage } from '@/components/tool/FocusedToolPage';

export const metadata: Metadata = {
  title: 'Online Signature Resizer & Formatter (140x60, 10-20 KB) | FitMyForm',
  description: 'Format & resize signature images to official dimensions (140x60 px) and strict file size (10 KB to 20 KB JPG) with white background padding for SSC, IBPS, & Railway forms.',
  keywords: ['signature resizer 10-20 kb', '140x60 signature resizer', 'ssc signature resizer', 'signature image converter', 'online signature formatter']
};

export default function SignatureResizerPage() {
  return (
    <FocusedToolPage
      config={{
        title: 'Online Signature Resizer (140×60 px, 10–20 KB)',
        badge: 'SSC / IBPS / RRB Standards',
        description: 'Resize signature scans or photos to exact official dimensions (140 × 60 px) and file size (10–20 KB JPG) with clean background padding.',
        defaultRequirements: {
          documentType: 'signature',
          width: 140,
          height: 60,
          format: 'JPG',
          minSizeKB: 10,
          maxSizeKB: 20,
          bgColor: '#FFFFFF',
          cropMode: 'fill'
        },
        seoTitle: 'How to Resize Signature for Online Applications',
        seoDescription: 'Accurately crop, resize, and compress signature images to 140x60 pixels and 10 to 20 KB for online examination applications.',
        faqs: [
          {
            question: 'What is the required signature dimension for SSC and IBPS?',
            answer: 'Official dimension is 140 x 60 pixels, with a file size strictly between 10 KB and 20 KB in JPG/JPEG format.'
          },
          {
            question: 'What if my signature photo has a dark or grey background?',
            answer: 'Use the Visual Crop tool after uploading to isolate the signature, and our formatter will pad with clean white background.'
          }
        ]
      }}
    />
  );
}
