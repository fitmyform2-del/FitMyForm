import React from 'react';
import { Metadata } from 'next';
import HomePage from '../page';

export const metadata: Metadata = {
  title: 'Client-Side PDF Compressor & Size Reducer (< 500 KB / < 1 MB) | FitMyForm',
  description: 'Reduce PDF document file size for online form uploads entirely in your browser. 100% private - your certificates never touch a cloud server.',
  keywords: ['pdf size reducer for online form', 'compress pdf to 300 kb', 'pdf compressor browser only', 'aadhaar pdf resizer']
};

export default function PdfCompressorPage() {
  return <HomePage />;
}
