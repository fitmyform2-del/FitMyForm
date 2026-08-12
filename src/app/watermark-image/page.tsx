import type { Metadata } from 'next';
import WatermarkImageClient from './WatermarkImageClient';

export const metadata: Metadata = {
  title: 'Watermark Image Online Free - Add Text & Logo to Photos',
  description: 'Watermark photos online for free. Protect copyright by adding custom text, PNG logos, opacity, font styling, and tiled watermarks with client-side privacy.',
  keywords: [
    'watermark image online',
    'add watermark to photo',
    'logo watermark maker',
    'protect photo copyright',
    'text watermark creator'
  ],
  alternates: {
    canonical: '/watermark-image'
  },
  openGraph: {
    title: 'Watermark Image Online Free - FitMyForm',
    description: 'Stamp custom text or PNG logo watermark onto photos with adjustable opacity, angle rotation, and tiling pattern.',
    url: 'https://fitmyform.com/watermark-image',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function WatermarkImagePage() {
  return <WatermarkImageClient />;
}
