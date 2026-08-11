import React from 'react';
import { Metadata } from 'next';
import HomePage from '../page';

export const metadata: Metadata = {
  title: 'Image Compressor to Target KB (20 KB, 50 KB, 100 KB, 200 KB) | FitMyForm',
  description: 'Compress images to exact target file sizes (20–50 KB, 50–100 KB, 100–200 KB) for online form uploads without losing clarity. 100% client-side privacy.',
  keywords: ['image compressor 20 kb', 'compress image to 50 kb', 'online target kb compressor', 'photo compression for exam form', 'reduce photo kb size']
};

export default function ImageCompressorPage() {
  return <HomePage />;
}
