import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Redact PDF Online Free - Permanently Black Out Sensitive Text | FitMyForm',
  description: 'Permanently redact Aadhaar numbers, signatures, and confidential text from PDFs with irreversible black boxes. Free and 100% private in-browser redaction.',
  route: '/pdf-tools/redact',
  keywords: ['redact pdf online free', 'black out text in pdf', 'remove sensitive info pdf', 'pdf redaction tool', 'hide aadhaar number pdf']
});

export default function RedactPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
