import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'JPG to PDF Converter Free - Convert Images to PDF in Browser | FitMyForm',
  description: 'Convert JPG, PNG, and WEBP images into clean PDF documents for free. Choose page orientation, margins, and paper sizes (A4, Letter) with 100% browser privacy.',
  route: '/pdf-tools/jpg-to-pdf',
  keywords: ['jpg to pdf converter', 'convert image to pdf free', 'png to pdf online', 'photos to pdf document', 'combine images to pdf']
});

export default function JpgToPdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
