import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'PDF to Text Converter Free - Extract Text from PDF Online | FitMyForm',
  description: 'Extract readable, copyable text from PDF files online for free. Export clean text and markdown without uploading documents to external cloud servers.',
  route: '/pdf-tools/pdf-to-text',
  keywords: ['pdf to text converter', 'extract text from pdf online', 'convert pdf to txt free', 'copy text from pdf', 'pdf text extractor browser']
});

export default function PdfToTextLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
