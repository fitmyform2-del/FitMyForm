import React from 'react';
import { Metadata } from 'next';
import HomePage from '../page';

export const metadata: Metadata = {
  title: 'CTET Photo Resizer (10-100 KB) & Signature Formatter (3-30 KB) | FitMyForm',
  description: 'Resize passport photo and signature for CTET online application portal. 3.5cm x 4.5cm dimensions, 10–100 KB JPG format.',
  keywords: ['ctet photo resizer', 'ctet signature format 3-30 kb', 'ctet photo size 10-100 kb']
};

export default function CtetPhotoResizerPage() {
  return <HomePage />;
}
