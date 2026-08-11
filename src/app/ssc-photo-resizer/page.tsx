import React from 'react';
import { Metadata } from 'next';
import HomePage from '../page';

export const metadata: Metadata = {
  title: 'SSC Photo Resizer (200x230 px, 20-50 KB) & Signature Maker (140x60, 10-20 KB) | FitMyForm',
  description: 'Official SSC photo resizer for CGL, CHSL, MTS, and GD forms. Resize photo to 200x230 pixels (20–50 KB) and signature to 140x60 pixels (10–20 KB) instantly.',
  keywords: ['ssc photo resizer 200x230', 'ssc cgl photo size 20-50 kb', 'ssc signature resizer 140x60', 'ssc online photo converter']
};

export default function SscPhotoResizerPage() {
  return <HomePage />;
}
