import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Add Page Numbers to PDF Online Free | FitMyForm',
  description: 'Insert page numbers into PDF headers or footers with custom position, format, margins, and font size. Free and 100% private in your browser.',
  route: '/pdf-tools/page-numbers',
  keywords: ['add page numbers to pdf', 'number pdf pages online', 'pdf page numbering free', 'insert page numbers pdf', 'pdf footer numbers']
});

export default function PageNumbersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
