import type { Metadata } from 'next';
import MemeGeneratorClient from './MemeGeneratorClient';

export const metadata: Metadata = {
  title: 'Free Online Meme Generator - Custom Meme Maker with Text',
  description: 'Create custom memes online for free. Choose popular classic meme templates or upload your own photo with custom Impact text & instant download.',
  keywords: [
    'meme generator free',
    'make meme online',
    'custom meme maker',
    'caption photo meme',
    'classic meme templates'
  ],
  alternates: {
    canonical: '/meme-generator'
  },
  openGraph: {
    title: 'Free Online Meme Generator - FitMyForm',
    description: 'Caption popular meme templates or upload your own photos with classic Impact font and black outline styling.',
    url: 'https://fitmyform.com/meme-generator',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function MemeGeneratorPage() {
  return <MemeGeneratorClient />;
}
