import type { Metadata } from 'next';
import RemoveBgClient from './RemoveBgClient';

export const metadata: Metadata = {
  title: 'Free Background Remover - Remove Image Background Online',
  description: 'Remove background from image online for free. Cut out subject and make background transparent PNG or solid color with 100% client-side browser privacy.',
  keywords: [
    'remove background from image',
    'transparent background maker',
    'bg remover online',
    'image cutout tool free',
    'white background photo'
  ],
  alternates: {
    canonical: '/remove-background'
  },
  openGraph: {
    title: 'Free Background Remover - FitMyForm',
    description: 'Instantly cut out background from photos and export high-definition transparent PNG files directly in browser memory.',
    url: 'https://fitmyform.com/remove-background',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function RemoveBgPage() {
  return <RemoveBgClient />;
}
