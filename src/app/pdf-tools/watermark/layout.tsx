import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Watermark PDF Online Free - Add Text or Logo Watermark | FitMyForm',
  description: 'Stamp text or logo watermarks on PDF pages with custom opacity, rotation, size, and position. Free, no signup, and 100% client-side privacy.',
  route: '/pdf-tools/watermark',
  keywords: ['watermark pdf online', 'add watermark to pdf free', 'pdf logo watermark', 'stamp text on pdf', 'confidential watermark pdf']
});

export default function WatermarkPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
