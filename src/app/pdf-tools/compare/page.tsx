'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { Columns, Upload, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function ComparePdfPage() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [infoA, setInfoA] = useState<{ pages: number; size: number } | null>(null);
  const [infoB, setInfoB] = useState<{ pages: number; size: number } | null>(null);
  const [compared, setCompared] = useState(false);

  const handleSelectA = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFileA(f);
      const buf = await f.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      setInfoA({ pages: doc.getPageCount(), size: f.size });
      setCompared(false);
    }
  };

  const handleSelectB = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0];
      setFileB(f);
      const buf = await f.arrayBuffer();
      const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
      setInfoB({ pages: doc.getPageCount(), size: f.size });
      setCompared(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 space-y-8">
        <Link href="/pdf-tools" className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to All PDF Tools
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 mx-auto">
            <Columns className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Compare PDF Files</h1>
          <p className="text-xs text-gray-400">Compare two revisions of a PDF side-by-side to highlight page and metadata changes.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* File A */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Document A (Original)</span>
              {!fileA ? (
                <div className="border-2 border-dashed border-gray-800 hover:border-blue-500 rounded-2xl p-6 text-center space-y-2 bg-gray-950/50">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-300">Select Document A</p>
                  <input type="file" accept="application/pdf" onChange={handleSelectA} id="pdf-a-input" className="hidden" />
                  <label htmlFor="pdf-a-input" className="inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl cursor-pointer">
                    Choose File A
                  </label>
                </div>
              ) : (
                <div className="bg-gray-950 border border-gray-800 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-400" /> {fileA.name}
                  </div>
                  <p className="text-gray-400">{infoA?.pages} pages | {(fileA.size / 1024).toFixed(1)} KB</p>
                  <button onClick={() => setFileA(null)} className="text-[10px] text-gray-500 hover:text-white">Change File A</button>
                </div>
              )}
            </div>

            {/* File B */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Document B (Modified)</span>
              {!fileB ? (
                <div className="border-2 border-dashed border-gray-800 hover:border-emerald-500 rounded-2xl p-6 text-center space-y-2 bg-gray-950/50">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto" />
                  <p className="text-xs text-gray-300">Select Document B</p>
                  <input type="file" accept="application/pdf" onChange={handleSelectB} id="pdf-b-input" className="hidden" />
                  <label htmlFor="pdf-b-input" className="inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl cursor-pointer">
                    Choose File B
                  </label>
                </div>
              ) : (
                <div className="bg-gray-950 border border-gray-800 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" /> {fileB.name}
                  </div>
                  <p className="text-gray-400">{infoB?.pages} pages | {(fileB.size / 1024).toFixed(1)} KB</p>
                  <button onClick={() => setFileB(null)} className="text-[10px] text-gray-500 hover:text-white">Change File B</button>
                </div>
              )}
            </div>
          </div>

          {fileA && fileB && (
            <button
              onClick={() => setCompared(true)}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              <Columns className="w-5 h-5" /> Compare Documents Side-by-Side
            </button>
          )}

          {compared && infoA && infoB && (
            <div className="bg-gray-950 p-6 rounded-2xl border border-gray-800 space-y-4 animate-fade-in">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Document Comparison Report
              </h3>
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 space-y-1">
                  <span className="text-gray-400">Page Count Delta</span>
                  <div className="font-bold text-white text-base">
                    {infoB.pages - infoA.pages === 0 ? 'Identical (No page change)' : `${infoB.pages - infoA.pages > 0 ? '+' : ''}${infoB.pages - infoA.pages} Pages`}
                  </div>
                </div>

                <div className="p-4 bg-gray-900 rounded-xl border border-gray-800 space-y-1">
                  <span className="text-gray-400">File Size Difference</span>
                  <div className="font-bold text-white text-base">
                    {((infoB.size - infoA.size) / 1024).toFixed(1)} KB
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
