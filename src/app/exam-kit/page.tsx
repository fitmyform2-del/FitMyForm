import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import ExamKitClient from './ExamKitClient';

export const metadata: Metadata = {
  title: 'All-in-One Exam Document Kit (Photo + Signature + Thumb + Declaration ZIP) | FitMyForm',
  description:
    'Upload and format all required exam documents (Passport Photo, Signature, Left Thumb Impression, Handwritten Declaration) in one place and download a ready-to-upload ZIP bundle for SSC, UPSC, IBPS, NEET, JEE, RRB & 40+ portals.',
  alternates: { canonical: '/exam-kit' }
};

export default function ExamKitPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0b0f19] text-slate-300 flex items-center justify-center text-sm">
          Loading Exam Document Kit...
        </div>
      }
    >
      <ExamKitClient />
    </Suspense>
  );
}
