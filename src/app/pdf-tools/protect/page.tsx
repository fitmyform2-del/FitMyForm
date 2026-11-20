'use client';

import React from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { Lock, ArrowLeft, ShieldAlert, EyeOff, Stamp } from 'lucide-react';

export default function ProtectPdfPage() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-12 space-y-8">
        <Link href="/pdf-tools" className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to All PDF Tools
        </Link>

        <div className="fmf-panel p-8 text-center space-y-5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
            <ShieldAlert className="w-7 h-7" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
            <Lock className="w-6 h-6 text-amber-400" />
            <span>PDF Password Encryption Unavailable Offline</span>
          </h1>

          <p className="text-sm text-slate-300 leading-relaxed max-w-xl mx-auto">
            Because FitMyForm processes 100% of files inside your browser with zero server uploads, standard AES-256 PDF password encryption is not currently supported by our in-browser PDF writer. Rather than giving you an unencrypted file, we disabled this tool to keep your security honest.
          </p>

          <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-left text-xs text-slate-300 space-y-1.5">
            <p className="font-bold text-white">Recommended ways to password-protect a PDF locally:</p>
            <p>• <strong>macOS:</strong> Open PDF in Preview → File → Export → Permissions → Require Password to Open.</p>
            <p>• <strong>Windows / Linux:</strong> Use LibreOffice Draw or <code className="text-blue-300">qpdf --encrypt</code> locally.</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/pdf-tools/redact"
              className="fmf-btn-primary px-5 py-3 text-xs font-bold inline-flex items-center gap-2"
            >
              <EyeOff className="w-4 h-4" /> Permanently Redact Sensitive Info
            </Link>
            <Link
              href="/pdf-tools/watermark"
              className="fmf-btn-secondary px-5 py-3 text-xs font-bold inline-flex items-center gap-2"
            >
              <Stamp className="w-4 h-4" /> Add Watermark to PDF
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
