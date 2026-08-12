import type { Metadata } from 'next';
import CropImageClient from './CropImageClient';

export const metadata: Metadata = {
  title: 'Free Online Image Cropper - Crop JPG, PNG, GIF with Visual Selector',
  description: 'Crop images online for free. Select square 1:1, 16:9, 4:3 aspect ratios or crop custom pixel dimensions visually in browser with 100% privacy.',
  keywords: [
    'crop image online',
    'crop photo free',
    'visual image cropper',
    'crop png online',
    'crop jpg',
    'aspect ratio cropper'
  ],
  alternates: {
    canonical: '/crop-image'
  },
  openGraph: {
    title: 'Free Online Image Cropper - FitMyForm',
    description: 'Crop JPG, PNG, or GIF images easily with visual aspect ratio selectors and precise pixel dimensions. 100% client-side privacy.',
    url: 'https://fitmyform.com/crop-image',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function CropImagePage() {
  return <CropImageClient />;
}
