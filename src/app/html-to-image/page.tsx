import type { Metadata } from 'next';
import HtmlToImageClient from './HtmlToImageClient';

export const metadata: Metadata = {
  title: 'HTML to Image Converter - Render HTML CSS Snippet to PNG JPG',
  description: 'Convert HTML code and CSS styling into high quality PNG or JPG images online. Ideal for code snippets, cards, and web graphics with browser privacy.',
  keywords: [
    'html to image converter',
    'render html to png',
    'html to jpg online',
    'code snippet image generator',
    'html canvas renderer'
  ],
  alternates: {
    canonical: '/html-to-image'
  },
  openGraph: {
    title: 'HTML to Image Converter - FitMyForm',
    description: 'Render styled HTML/CSS markup directly to high-resolution PNG or JPG graphics.',
    url: 'https://fitmyform.com/html-to-image',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function HtmlToImagePage() {
  return <HtmlToImageClient />;
}
