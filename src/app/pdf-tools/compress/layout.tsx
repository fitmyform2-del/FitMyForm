import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Compress PDF Online Free - Reduce PDF File Size in KB | FitMyForm',
  description: 'Compress PDF files online for free to meet strict KB upload limits for job applications, exams, and portals. 100% private in-browser compression.',
  route: '/pdf-tools/compress',
  keywords: ['compress pdf online', 'reduce pdf size in kb', 'compress pdf to 100kb', 'shrink pdf free', 'free pdf compressor browser']
});

export default function CompressPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
