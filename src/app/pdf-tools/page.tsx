'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { PdfToolsGrid } from '@/components/pdf/PdfToolsGrid';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { ShieldCheck, Sparkles, FileStack, CheckCircle2, Lock } from 'lucide-react';

export default function PdfToolsMainPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Header Hero Banner */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-800/60 text-blue-300 text-xs font-semibold shadow-lg">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>100% Client-Side Browser PDF Suite</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Every PDF Tool You Need, <br className="hidden sm:inline" />
            <span className="gradient-text">100% Private & Free</span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
            Select a PDF functionality below to process your documents securely directly inside your web browser. 
            No file uploads to servers, zero logs, and instant downloads.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs font-medium text-gray-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero Server Uploads</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>No Watermarks Added</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-purple-400" />
              <span>End-to-End Privacy</span>
            </div>
          </div>
        </div>

        {/* Central Functionality List Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileStack className="w-5 h-5 text-blue-400" />
              <span>All PDF Functionalities</span>
            </h2>
            <span className="text-xs text-gray-400 font-medium">18 Tools Available</span>
          </div>

          <PdfToolsGrid />
        </div>

        {/* Educational SEO & Privacy Guarantees */}
        <SeoContentSection
          title="Why Choose FitMyForm Client-Side PDF Tools?"
          description="Most online PDF conversion tools upload your confidential documents (such as Aadhaar card, PAN card, bank statements, certificates, and signatures) to external cloud servers. FitMyForm uses HTML5 APIs, JavaScript WebAssembly, and pdf-lib to process all PDF modifications directly in your device RAM without transmitting byte data over the internet."
          faqs={[
            {
              question: 'Are my PDF files uploaded to any server?',
              answer: 'No. FitMyForm is a 100% browser-side application. Your files never leave your computer or phone.'
            },
            {
              question: 'Can I merge multiple PDFs into one document?',
              answer: 'Yes! Use our Merge PDF tool to drop multiple PDF files, reorder pages as needed, and combine them into a single file.'
            },
            {
              question: 'How do I compress a PDF for government exam forms?',
              answer: 'Click on the Compress PDF tool, select your desired file size or compression level, and FitMyForm will optimize object streams and embedded images.'
            },
            {
              question: 'Is it free to sign or watermark PDFs?',
              answer: 'Yes, 100% free with unlimited usage and zero hidden subscription fees.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
