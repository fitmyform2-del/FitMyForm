import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'HTML to PDF Converter Free - Convert Text & Markdown to PDF | FitMyForm',
  description: 'Convert styled HTML, plain text, or markdown into print-ready PDF documents instantly. Free, no signup, and 100% client-side processing.',
  route: '/pdf-tools/html-to-pdf',
  keywords: ['html to pdf converter', 'text to pdf online free', 'markdown to pdf', 'convert html to pdf browser', 'create pdf from text']
});

export default function HtmlToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
