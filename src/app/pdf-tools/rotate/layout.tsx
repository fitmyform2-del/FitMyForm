import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Rotate PDF Pages Online Free - Turn PDF 90, 180, 270 Degrees | FitMyForm',
  description: 'Rotate PDF pages clockwise or counter-clockwise online for free. Fix upside-down scanned pages or adjust specific page orientation with 100% browser privacy.',
  route: '/pdf-tools/rotate',
  keywords: ['rotate pdf online free', 'rotate pdf 90 degrees', 'turn pdf pages permanently', 'fix upside down pdf', 'pdf orientation rotator']
});

export default function RotatePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
