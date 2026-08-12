import type { Metadata } from 'next';
import UpscaleImageClient from './UpscaleImageClient';

export const metadata: Metadata = {
  title: 'Upscale Image Online Free - Enlarge Photos 2x 4x High Resolution',
  description: 'Upscale images online for free. Increase image resolution 2x or 4x with bicubic sharpening interpolation without losing clarity in browser.',
  keywords: [
    'upscale image online',
    'enlarge photo 4k',
    'image upscaler free',
    'increase image resolution',
    'photo sharpener'
  ],
  alternates: {
    canonical: '/upscale-image'
  },
  openGraph: {
    title: 'Upscale Image Online Free - FitMyForm',
    description: 'Enlarge JPG and PNG images by 200% or 400% with high-definition sharpness and bicubic canvas interpolation.',
    url: 'https://fitmyform.com/upscale-image',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function UpscaleImagePage() {
  return <UpscaleImageClient />;
}
