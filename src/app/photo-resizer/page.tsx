import React from 'react';
import { Metadata } from 'next';
import HomePage from '../page';

export const metadata: Metadata = {
  title: 'Passport Photo Resizer for Online Forms (200x230, 350x450, 20-50 KB) | FitMyForm',
  description: 'Resize passport photos to exact dimensions (200x230 px, 350x450 px) and compressed file size (20 KB to 50 KB JPG) for SSC, UPSC, Banking, and College application forms.',
  keywords: ['passport photo resizer', 'ssc photo resizer 20-50 kb', '200x230 photo resizer', 'upsc photo resizer 350x350', 'online photo converter jpg']
};

export default function PhotoResizerPage() {
  return <HomePage />;
}
