import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Protect PDF Online Free - Password Encrypt PDF Files | FitMyForm',
  description: 'Protect PDF files with strong password encryption online for free. Prevent unauthorized viewing, editing, or copying with 100% private in-browser encryption.',
  route: '/pdf-tools/protect',
  keywords: ['protect pdf with password', 'encrypt pdf online', 'password protect pdf free', 'secure pdf document', 'set password on pdf']
});

export default function ProtectPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
