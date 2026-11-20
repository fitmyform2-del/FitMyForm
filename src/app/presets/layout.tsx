import { createToolMetadata } from '@/config/seoMetadataHelper';

export const metadata = createToolMetadata({
  title: 'Exam Photo & Signature Size Requirements - SSC, UPSC, IBPS, RRB, NEET Presets | FitMyForm',
  description: 'Complete directory of official photo, signature, and thumb impression size requirements for SSC, UPSC, IBPS, RRB, NEET, JEE, CTET, UPTET and state exams. One-click resize to exact pixels and KB.',
  route: '/presets',
  keywords: [
    'exam photo size requirements',
    'ssc photo size 2026',
    'upsc photo signature size',
    'ibps photo size kb',
    'rrb photo size',
    'neet photo size',
    'ctet photo signature size',
    'government exam document size list'
  ]
});

export default function PresetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
