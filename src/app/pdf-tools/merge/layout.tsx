import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Merge PDF Online Free - Combine PDF Files in Browser | FitMyForm',
  description: 'Merge PDF files online for free. Combine multiple PDF documents into one PDF with drag-and-drop reordering. 100% private and client-side with zero server uploads.',
  route: '/pdf-tools/merge',
  keywords: ['merge pdf online', 'combine pdf free', 'merge pdf in browser', 'join pdf files', 'free pdf merger no limit']
});

export default function MergePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
