import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Split PDF Online Free - Extract Pages from PDF in Browser | FitMyForm',
  description: 'Split PDF files into individual pages or extract custom page ranges (e.g. 1-5, 8-10) for free. 100% client-side privacy without uploading your files.',
  route: '/pdf-tools/split',
  keywords: ['split pdf online', 'extract pages from pdf', 'separate pdf pages free', 'split pdf by page range', 'free pdf splitter']
});

export default function SplitPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
