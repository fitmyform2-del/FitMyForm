import type { Metadata } from 'next';
import RotateImageClient from './RotateImageClient';

export const metadata: Metadata = {
  title: 'Rotate Image Online Free - Rotate JPG, PNG, GIF 90 Degrees',
  description: 'Rotate images online for free. Rotate JPG, PNG, WEBP photos 90° clockwise, counter-clockwise, or flip horizontally & vertically with 100% browser privacy.',
  keywords: [
    'rotate image online',
    'rotate photo 90 degrees',
    'flip image horizontal vertical',
    'batch image rotator',
    'rotate png free'
  ],
  alternates: {
    canonical: '/rotate-image'
  },
  openGraph: {
    title: 'Rotate Image Online Free - FitMyForm',
    description: 'Rotate JPG, PNG, or GIF photos clockwise, counter-clockwise, or 180 degrees instantly in browser.',
    url: 'https://fitmyform.com/rotate-image',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function RotateImagePage() {
  return <RotateImageClient />;
}
