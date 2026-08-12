import type { Metadata } from 'next';
import PhotoEditorClient from './PhotoEditorClient';

export const metadata: Metadata = {
  title: 'Free Online Photo Editor - Edit Photos with Filters, Text & FX',
  description: 'Edit your photos online for free. Adjust brightness, contrast, hue, apply retro & vintage filters, add custom text and stickers with 100% privacy.',
  keywords: [
    'online photo editor free',
    'photo filter maker',
    'add text to photo online',
    'edit pictures in browser',
    'free image editor'
  ],
  alternates: {
    canonical: '/photo-editor'
  },
  openGraph: {
    title: 'Free Online Photo Editor - FitMyForm',
    description: 'Comprehensive browser photo editor with filters, color adjustments, brightness, contrast, crop, and instant download.',
    url: 'https://fitmyform.com/photo-editor',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function PhotoEditorPage() {
  return <PhotoEditorClient />;
}
