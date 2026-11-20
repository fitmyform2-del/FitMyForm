'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { renderPdfAllPagesToDataUrls, extractPdfTextByPage, RenderedPdfPage } from '@/lib/pdf/pdfjsLoader';
import { Columns, Upload, ArrowLeft, FileText, CheckCircle2, RefreshCw, ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

interface ComparedPdf {
  file: File;
  pages: RenderedPdfPage[];
  texts: string[];
}

export default function ComparePdfPage() {
  const [fileA, setFileA] = useState<File | null>(null);
  const [fileB, setFileB] = useState<File | null>(null);
  const [dataA, setDataA] = useState<ComparedPdf | null>(null);
  const [dataB, setDataB] = useState<ComparedPdf | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [activePage, setActivePage] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCompare = async () => {
    if (!fileA || !fileB) return;
    setIsComparing(true);
    setErrorMsg(null);
    setActivePage(0);
    try {
      const [pagesA, textsA, pagesB, textsB] = await Promise.all([
        renderPdfAllPagesToDataUrls(fileA, { scale: 1.25, quality: 0.85, maxPages: 25 }),
        extractPdfTextByPage(fileA),
        renderPdfAllPagesToDataUrls(fileB, { scale: 1.25, quality: 0.85, maxPages: 25 }),
        extractPdfTextByPage(fileB)
      ]);
      setDataA({ file: fileA, pages: pagesA, texts: textsA.map((t) => t.text) });
      setDataB({ file: fileB, pages: pagesB, texts: textsB.map((t) => t.text) });
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to compare these PDFs.');
    } finally {
      setIsComparing(false);
    }
  };

  const maxPages = Math.max(dataA?.pages.length || 0, dataB?.pages.length || 0);
  const textA = dataA?.texts[activePage]?.trim() || '';
  const textB = dataB?.texts[activePage]?.trim() || '';
  const pageTextsMatch = textA === textB;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        <Link href="/pdf-tools" className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to All PDF Tools
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 mx-auto">
            <Columns className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Compare PDF Files</h1>
          <p className="text-xs text-slate-400">Visually inspect two PDF documents side-by-side page by page and detect text differences.</p>
        </div>

        <div className="fmf-panel p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">Document A (Original)</span>
              {!fileA ? (
                <div className="fmf-dropzone rounded-2xl p-6 text-center space-y-2">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-300">Select Document A</p>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFileA(e.target.files[0]);
                        setDataA(null);
                      }
                    }}
                    id="pdf-a-input"
                    className="hidden"
                  />
                  <label htmlFor="pdf-a-input" className="inline-block px-4 py-2 fmf-btn-secondary text-xs font-bold cursor-pointer">
                    Choose File A
                  </label>
                </div>
              ) : (
                <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" /> {fileA.name}
                    </div>
                    <p className="text-slate-400 mt-0.5">{(fileA.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button type="button" onClick={() => { setFileA(null); setDataA(null); }} className="text-rose-400 font-bold cursor-pointer">
                    Change
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Document B (Modified)</span>
              {!fileB ? (
                <div className="fmf-dropzone rounded-2xl p-6 text-center space-y-2">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-300">Select Document B</p>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setFileB(e.target.files[0]);
                        setDataB(null);
                      }
                    }}
                    id="pdf-b-input"
                    className="hidden"
                  />
                  <label htmlFor="pdf-b-input" className="inline-block px-4 py-2 fmf-btn-secondary text-xs font-bold cursor-pointer">
                    Choose File B
                  </label>
                </div>
              ) : (
                <div className="bg-black/40 border border-white/10 p-4 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-emerald-400" /> {fileB.name}
                    </div>
                    <p className="text-slate-400 mt-0.5">{(fileB.size / 1024).toFixed(1)} KB</p>
                  </div>
                  <button type="button" onClick={() => { setFileB(null); setDataB(null); }} className="text-rose-400 font-bold cursor-pointer">
                    Change
                  </button>
                </div>
              )}
            </div>
          </div>

          {fileA && fileB && (
            <button
              type="button"
              onClick={handleCompare}
              disabled={isComparing}
              className="w-full py-4 fmf-btn-primary font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isComparing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Columns className="w-5 h-5" />}
              <span>{isComparing ? 'Rendering & Comparing Pages...' : 'Compare Documents Side-by-Side'}</span>
            </button>
          )}

          {errorMsg && <p className="text-xs text-rose-400 font-bold">{errorMsg}</p>}

          {dataA && dataB && maxPages > 0 && (
            <div className="space-y-6 pt-4 border-t border-white/10 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs">
                  {pageTextsMatch ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Page {activePage + 1} Text Identical
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" /> Page {activePage + 1} Differences Detected
                    </span>
                  )}
                  <span className="text-slate-400 font-mono">
                    Pages: {dataA.pages.length} vs {dataB.pages.length}
                  </span>
                </div>

                {maxPages > 1 && (
                  <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 rounded-xl px-2 py-1 text-xs">
                    <button
                      type="button"
                      disabled={activePage === 0}
                      onClick={() => setActivePage((p) => Math.max(0, p - 1))}
                      className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-mono font-bold px-2">
                      Page {activePage + 1} / {maxPages}
                    </span>
                    <button
                      type="button"
                      disabled={activePage >= maxPages - 1}
                      onClick={() => setActivePage((p) => Math.min(maxPages - 1, p + 1))}
                      className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-blue-500/30 rounded-2xl p-3 space-y-2">
                  <div className="text-xs font-bold text-blue-300">Document A — Page {activePage + 1}</div>
                  {dataA.pages[activePage] ? (
                    <img src={dataA.pages[activePage].dataUrl} alt="Doc A" className="w-full h-auto rounded bg-white" />
                  ) : (
                    <div className="py-16 text-center text-xs text-slate-500">No page {activePage + 1} in Document A</div>
                  )}
                </div>

                <div className="bg-black/40 border border-emerald-500/30 rounded-2xl p-3 space-y-2">
                  <div className="text-xs font-bold text-emerald-300">Document B — Page {activePage + 1}</div>
                  {dataB.pages[activePage] ? (
                    <img src={dataB.pages[activePage].dataUrl} alt="Doc B" className="w-full h-auto rounded bg-white" />
                  ) : (
                    <div className="py-16 text-center text-xs text-slate-500">No page {activePage + 1} in Document B</div>
                  )}
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
