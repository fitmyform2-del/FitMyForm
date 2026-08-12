import type { Metadata } from 'next';
import JpgToImageClient from './JpgToImageClient';

export const metadata: Metadata = {
  title: 'Convert JPG to PNG, WEBP & GIF Online Free',
  description: 'Convert JPG photos to transparent PNG, optimized WEBP, or animated GIF format. Fast browser processing with zero upload delay.',
  keywords: [
    'jpg to png converter',
    'convert jpg to webp',
    'jpg to gif maker',
    'convert jpeg to png online'
  ],
  alternates: {
    canonical: '/jpg-to-image'
  },
  openGraph: {
    title: 'Convert JPG to PNG & WEBP Online Free - FitMyForm',
    description: 'Convert JPG images to PNG, WEBP, or GIF format instantly in browser memory.',
    url: 'https://fitmyform.com/jpg-to-image',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function JpgToImagePage() {
  return <JpgToImageClient />;
}
