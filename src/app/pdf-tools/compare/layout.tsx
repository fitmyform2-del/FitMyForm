import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Compare PDF Online Free - Find Differences Between Two PDFs | FitMyForm',
  description: 'Compare two PDF documents side-by-side to spot added, removed, or modified content. Free visual PDF diff tool with 100% browser privacy.',
  route: '/pdf-tools/compare',
  keywords: ['compare pdf online', 'pdf diff tool free', 'find differences in pdf', 'compare two pdf files', 'pdf version comparison']
});

export default function ComparePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
