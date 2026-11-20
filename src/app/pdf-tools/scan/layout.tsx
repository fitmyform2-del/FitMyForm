import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Scan to PDF Online Free - Camera Document Scanner | FitMyForm',
  description: 'Scan physical documents with your phone or webcam, apply high-contrast scan filters, and save as a clean PDF. Free and 100% private in your browser.',
  route: '/pdf-tools/scan',
  keywords: ['scan to pdf online', 'camera document scanner', 'webcam scan pdf free', 'phone scanner pdf', 'scan documents browser']
});

export default function ScanPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
