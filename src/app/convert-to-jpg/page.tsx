import type { Metadata } from 'next';
import ConvertToJpgClient from './ConvertToJpgClient';

export const metadata: Metadata = {
  title: 'Convert PNG, WEBP, HEIC, GIF to JPG Online Free',
  description: 'Convert any image format to high quality JPG. Bulk convert PNG, WEBP, GIF, SVG, and HEIC files to JPG format instantly with client-side privacy.',
  keywords: [
    'convert to jpg',
    'png to jpg converter',
    'webp to jpg online',
    'heic to jpg converter',
    'convert image to jpeg'
  ],
  alternates: {
    canonical: '/convert-to-jpg'
  },
  openGraph: {
    title: 'Convert to JPG Online Free - FitMyForm',
    description: 'Turn PNG, WEBP, GIF, HEIC, and SVG images into high quality JPG format with fast browser processing.',
    url: 'https://fitmyform.com/convert-to-jpg',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function ConvertToJpgPage() {
  return <ConvertToJpgClient />;
}
