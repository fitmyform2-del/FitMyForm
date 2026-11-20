import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Unlock PDF Online Free - Remove PDF Password & Restrictions | FitMyForm',
  description: 'Unlock password-protected PDF files online for free. Remove owner and user passwords to produce an unrestricted, easily viewable PDF with 100% privacy.',
  route: '/pdf-tools/unlock',
  keywords: ['unlock pdf online', 'remove password from pdf', 'unlock protected pdf free', 'decrypt pdf in browser', 'remove pdf restrictions']
});

export default function UnlockPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
