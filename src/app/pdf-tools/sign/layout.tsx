import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Sign PDF Online Free - Draw & Add Digital Signature to PDF | FitMyForm',
  description: 'Sign PDF documents online for free. Draw, type, or upload your signature and stamp it onto PDF pages with exact placement and 100% browser privacy.',
  route: '/pdf-tools/sign',
  keywords: ['sign pdf online free', 'add signature to pdf', 'draw signature on pdf', 'electronic signature free', 'sign documents in browser']
});

export default function SignPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
