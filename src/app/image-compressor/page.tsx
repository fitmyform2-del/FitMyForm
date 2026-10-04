import React from 'react';
import { Metadata } from 'next';
import { FocusedToolPage } from '@/components/tool/FocusedToolPage';

export const metadata: Metadata = {
  title: 'Image Compressor to Target KB (20 KB, 50 KB, 100 KB, 200 KB) | FitMyForm',
  description: 'Compress images to exact target file sizes (20–50 KB, 50–100 KB, 100–200 KB) for online form uploads without losing clarity. 100% client-side privacy.',
  keywords: ['image compressor 20 kb', 'compress image to 50 kb', 'online target kb compressor', 'photo compression for exam form', 'reduce photo kb size']
};

export default function ImageCompressorPage() {
  return (
    <FocusedToolPage
      config={{
        title: 'Compress Image to Target KB',
        badge: 'Exact KB Control',
        description: 'Compress JPG, PNG, WEBP images to exact KB limits (e.g. 20–50 KB, 50–100 KB, 100–200 KB) without losing quality.',
        defaultRequirements: {
          documentType: 'other',
          width: 800,
          height: 800,
          format: 'JPG',
          minSizeKB: 20,
          maxSizeKB: 50,
          bgColor: '#FFFFFF',
          cropMode: 'fill'
        },
        seoTitle: 'Compress Images to Exact KB Limits Online',
        seoDescription: 'Free online image compressor with precise file size controls for portals that enforce strict maximum upload sizes.',
        faqs: [
          {
            question: 'How do I compress an image to under 50 KB?',
            answer: 'Upload your image, set Max File Size to 50 KB, and click Format Document Now. The iterative compressor automatically tunes compression quality.'
          },
          {
            question: 'Does compressing reduce image dimensions?',
            answer: 'You can choose to keep original aspect ratio or define new target dimensions while optimizing file size.'
          }
        ]
      }}
    />
  );
}
