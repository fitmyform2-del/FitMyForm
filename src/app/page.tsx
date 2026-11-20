import React from 'react';
import type { Metadata } from 'next';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { HeroSection } from '@/components/hero/HeroSection';
import { HomeToolGrid } from '@/components/home/HomeToolGrid';
import { HomeExamShowcase } from '@/components/home/HomeExamShowcase';
import { RecentDocuments } from '@/components/dashboard/RecentDocuments';
import { SeoContentSection } from '@/components/seo/SeoContentSection';

export const metadata: Metadata = {
  title: 'FitMyForm - Exact Photo, Signature & Document Resizer for Online Exams',
  description: 'Free client-side document resizer & target KB compressor for Indian competitive exams (SSC CGL/CHSL, UPSC, IBPS, RRB, CTET). Resize photo to 200x230 px & 20-50 KB JPG, edit images & merge PDFs with 100% browser privacy.',
  keywords: [
    'FitMyForm',
    'student document resizer',
    'ssc photo resizer 20-50 kb',
    'signature resizer 140x60',
    'upsc photo resizer 350x350',
    'online exam photo converter',
    'image compressor to target kb',
    'free pdf tools',
    'passport size photo maker online',
    'client side document resizer'
  ],
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'FitMyForm - Student Document Resizer & Formatter',
    description: 'Format passport photos & signatures to exact pixel dimensions & KB limits for SSC, UPSC, Banking, & State online forms. 100% Client-Side Privacy.',
    url: 'https://fitmyform.com',
    siteName: 'FitMyForm',
    type: 'website'
  }
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12 sm:space-y-16">
        {/* Hero Section */}
        <HeroSection />

        {/* The Iconic Tool Grid */}
        <HomeToolGrid />

        {/* Featured Exam Specifications Hub */}
        <HomeExamShowcase />

        {/* Recent Session Storage */}
        <RecentDocuments />

        {/* Comprehensive SEO Content & FAQs with JSON-LD */}
        <SeoContentSection
          title="Complete Image Editing & Exam Document Formatting Guide"
          description="FitMyForm is a 100% free, private online application providing professional image editing alongside specialized online exam document resizers. Compress images to exact KB limits, crop photos visually, convert formats (PNG, WEBP, JPG), upscale low resolution photos, watermark documents, and format passport photos & signatures with zero server uploads."
          faqs={[
            {
              question: 'Are all features on FitMyForm completely free?',
              answer: 'Yes, 100% free with unlimited usage. You can compress, resize, crop, rotate, watermark, upscale, remove background, generate memes, convert formats, and edit photos without paying or registering.'
            },
            {
              question: 'Are my photos or documents uploaded to servers?',
              answer: 'No! All processing executes entirely inside your device web browser via HTML5 Canvas and WebAssembly. Your photos and sensitive documents never touch any cloud server.'
            },
            {
              question: 'How do I resize a passport photo to 200 x 230 px and 20–50 KB for SSC exams?',
              answer: 'Select the SSC Photo Resizer tool from the grid above, upload your photo, and click Format Document Now. The file will be calibrated and ready for direct upload.'
            },
            {
              question: 'How do I combine or compress PDF files on FitMyForm?',
              answer: 'Go to the PDF Tools section to merge, split, compress, or sign PDF documents. All PDF modifications happen client-side in your browser for absolute data confidentiality.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
