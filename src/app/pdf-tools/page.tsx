'use client';

import React from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { PdfToolsGrid } from '@/components/pdf/PdfToolsGrid';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { ShieldCheck, Sparkles, FileStack, CheckCircle2, Lock } from 'lucide-react';

export default function PdfToolsMainPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>100% Client-Side PDF Suite</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Every PDF Tool You Need, <br className="hidden sm:inline" />
            <span className="text-blue-400">100% Private & Free</span>
          </h1>

          <p className="text-slate-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Process documents securely inside your browser. No file uploads to servers, zero logs, and instant downloads.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-300">
            <div className="flex items-center gap-2 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero Server Uploads</span>
            </div>
            <div className="flex items-center gap-2 text-blue-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>No Watermarks</span>
            </div>
            <div className="flex items-center gap-2 text-purple-400">
              <Lock className="w-4 h-4" />
              <span>End-to-End Privacy</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              <FileStack className="w-5 h-5 text-blue-400" />
              <span>All PDF Functionalities</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">18 Client Tools</span>
          </div>

          <PdfToolsGrid />
        </div>

        <SeoContentSection
          title="Why Choose FitMyForm Client-Side PDF Tools?"
          description="Most online PDF conversion tools upload confidential documents (Aadhaar cards, certificates) to external servers. FitMyForm uses HTML5 Canvas and pdf-lib to process all PDF modifications directly in device RAM with zero network uploads."
          faqs={[
            {
              question: 'Are my PDF files uploaded to any server?',
              answer: 'No. FitMyForm is a 100% browser-side application. Files never leave your computer or phone.'
            },
            {
              question: 'Can I merge multiple PDFs into one document?',
              answer: 'Yes! Use our Merge PDF tool to combine multiple PDF documents in seconds.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
