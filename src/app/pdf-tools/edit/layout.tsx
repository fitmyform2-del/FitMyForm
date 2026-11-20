import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Edit PDF Online Free - Annotate, Draw & Add Text to PDF | FitMyForm',
  description: 'Edit and annotate PDF documents directly in your browser for free. Add text boxes, freehand drawings, arrows, and highlight sections with 100% privacy.',
  route: '/pdf-tools/edit',
  keywords: ['edit pdf online free', 'annotate pdf in browser', 'add text to pdf', 'draw on pdf free', 'free pdf editor no signup']
});

export default function EditPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
