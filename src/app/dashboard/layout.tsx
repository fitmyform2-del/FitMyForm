import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Recent Documents | FitMyForm',
  description: 'Your locally stored recent document history on FitMyForm.',
  robots: {
    index: false,
    follow: true
  }
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
