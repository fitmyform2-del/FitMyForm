import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'PDF to JPG Converter Free - Extract Pages as High-Res Images | FitMyForm',
  description: 'Convert PDF pages into high-resolution JPG images online for free. Extract all pages or embedded images with crisp clarity and 100% browser privacy.',
  route: '/pdf-tools/pdf-to-jpg',
  keywords: ['pdf to jpg converter', 'convert pdf to image free', 'save pdf as jpg', 'pdf to picture high resolution', 'extract images from pdf']
});

export default function PdfToJpgLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
