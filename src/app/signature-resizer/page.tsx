import React from 'react';
import { Metadata } from 'next';
import HomePage from '../page';

export const metadata: Metadata = {
  title: 'Online Signature Resizer & Formatter (140x60, 10-20 KB) | FitMyForm',
  description: 'Format & resize signature images to official dimensions (140x60 px) and strict file size (10 KB to 20 KB JPG) with white background padding for SSC, IBPS, & Railway forms.',
  keywords: ['signature resizer 10-20 kb', '140x60 signature resizer', 'ssc signature resizer', 'signature image converter', 'online signature formatter']
};

export default function SignatureResizerPage() {
  return <HomePage />;
}
