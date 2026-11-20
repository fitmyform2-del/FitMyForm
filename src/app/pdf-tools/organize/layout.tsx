import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Organize PDF Online Free - Reorder, Delete & Rearrange PDF Pages | FitMyForm',
  description: 'Reorder, delete, and rearrange PDF pages visually with an interactive page grid. Free, fast, and 100% private in-browser PDF organizer.',
  route: '/pdf-tools/organize',
  keywords: ['organize pdf pages', 'reorder pdf pages online', 'delete pages from pdf', 'rearrange pdf free', 'sort pdf pages']
});

export default function OrganizePdfLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
