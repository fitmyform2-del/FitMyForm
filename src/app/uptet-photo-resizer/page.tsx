import React from 'react';
import { Metadata } from 'next';
import HomePage from '../page';

export const metadata: Metadata = {
  title: 'UPTET Photo & Signature Resizer (20-50 KB JPG) | FitMyForm',
  description: 'Resize passport photograph and signature for UPTET and UP Police recruitment forms to exact dimensions and KB limits.',
  keywords: ['uptet photo resizer', 'uptet signature resizer 5-20 kb', 'up police photo resizer']
};

export default function UptetPhotoResizerPage() {
  return <HomePage />;
}
