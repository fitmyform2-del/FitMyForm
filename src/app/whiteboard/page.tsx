import type { Metadata } from 'next';
import WhiteboardClient from './WhiteboardClient';

export const metadata: Metadata = {
  title: 'Free Interactive Offline Whiteboard - Digital Teaching Studio | FitMyForm',
  description: 'Full-featured offline interactive whiteboard for teachers, students and creators. Freehand drawing, math formulas, rulers, protractors, timers, dice roller, and multi-page PDF export with 100% browser privacy.',
  keywords: [
    'offline whiteboard',
    'interactive digital whiteboard',
    'free online whiteboard for teaching',
    'whiteboard chat offline',
    'classroom timer and dice whiteboard',
    'math manipulatives whiteboard'
  ],
  alternates: {
    canonical: '/whiteboard'
  },
  openGraph: {
    title: 'Free Interactive Offline Whiteboard - FitMyForm',
    description: 'Feature-rich digital whiteboard with drawing, math symbols, sticky notes, classroom manipulatives, interactive widgets, and multi-page PDF export.',
    url: 'https://fitmyform.com/whiteboard',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function WhiteboardPage() {
  return <WhiteboardClient />;
}
