import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Free Online PDF Tools - Merge, Split, Compress & Sign PDF | FitMyForm',
  description: 'Complete 100% private, client-side PDF utility suite. Merge, split, compress, sign, password protect, unlock, rotate, watermark, and convert PDF documents in your browser with zero server uploads.',
  keywords: [
    'free pdf tools',
    'merge pdf online free',
    'compress pdf in browser',
    'split pdf pages',
    'sign pdf free',
    'protect pdf password',
    'unlock pdf',
    'client side pdf tools',
    'pdf to jpg converter',
    'jpg to pdf free'
  ],
  alternates: {
    canonical: '/pdf-tools'
  },
  openGraph: {
    title: 'Free Online PDF Tools - 100% Client-Side Privacy | FitMyForm',
    description: 'Process documents securely inside your browser. No file uploads to servers, zero logs, and instant downloads.',
    url: 'https://fitmyform.com/pdf-tools',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function PdfToolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
