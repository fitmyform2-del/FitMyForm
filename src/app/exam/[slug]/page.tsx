import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EXAM_PRESETS } from '@/config/presets';
import ExamPresetClient from './ExamPresetClient';

interface ExamPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return EXAM_PRESETS.map((exam) => ({ slug: exam.id }));
}

export async function generateMetadata({ params }: ExamPageProps): Promise<Metadata> {
  const { slug } = await params;
  const exam = EXAM_PRESETS.find((e) => e.id === slug);
  if (!exam) {
    return { title: 'Exam Preset Not Found | FitMyForm' };
  }

  const photoDoc = exam.documents.photo || Object.values(exam.documents).find(Boolean);
  const specSummary = photoDoc
    ? `${photoDoc.width && photoDoc.height ? `${photoDoc.width}×${photoDoc.height} px, ` : ''}${photoDoc.minSizeKB}–${photoDoc.maxSizeKB} KB ${photoDoc.format[0] || 'JPG'}`
    : 'Official Portal Specs';

  return {
    title: `${exam.name} Photo & Signature Resizer (${specSummary}) | FitMyForm`,
    description: `Format ${exam.name} (${exam.organization}) photo, signature, and documents to official 2025–2026 dimensions and KB limits (${specSummary}). 100% free & private client-side resizer.`,
    alternates: { canonical: `/exam/${exam.id}` }
  };
}

export default async function ExamPresetPage({ params }: ExamPageProps) {
  const { slug } = await params;
  const exam = EXAM_PRESETS.find((e) => e.id === slug);
  if (!exam) {
    notFound();
  }

  return <ExamPresetClient exam={exam} />;
}
