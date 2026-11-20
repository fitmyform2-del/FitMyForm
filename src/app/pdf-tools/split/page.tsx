'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { splitPdf, zipAndDownloadBlobs } from '@/lib/pdf/pdfTools';
import { Scissors, Upload, Download, RefreshCw, ArrowLeft, CheckCircle2, FileText, Layers } from 'lucide-react';
import { VisualPageGrid } from './_components/VisualPageGrid';

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [startPageStr, setStartPageStr] = useState<string>('1');
  const [endPageStr, setEndPageStr] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitBlobs, setSplitBlobs] = useState<Blob[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setSplitBlobs([]);
      try {
        const { PDFDocument } = await import('pdf-lib');
        const buf = await selected.arrayBuffer();
        const doc = await PDFDocument.load(buf, { ignoreEncryption: true });
        const count = doc.getPageCount();
        setTotalPages(count);
        setStartPageStr('1');
        setEndPageStr(String(count));
      } catch {
        setTotalPages(1);
        setStartPageStr('1');
        setEndPageStr('1');
      }
    }
  };

  const getValidRange = () => {
    const parsedStart = parseInt(startPageStr, 10);
    const start = isNaN(parsedStart) ? 1 : Math.max(1, Math.min(totalPages, parsedStart));
    const parsedEnd = parseInt(endPageStr, 10);
    const end = isNaN(parsedEnd) ? totalPages : Math.max(start, Math.min(totalPages, parsedEnd));
    return { start, end };
  };

  const handleStartBlur = () => {
    const { start, end } = getValidRange();
    setStartPageStr(String(start));
    if (parseInt(endPageStr, 10) < start) setEndPageStr(String(end));
  };

  const handleEndBlur = () => {
    const { end } = getValidRange();
    setEndPageStr(String(end));
  };

  const handleSplit = async () => {
    if (!file) return;
    const { start, end } = getValidRange();
    setStartPageStr(String(start));
    setEndPageStr(String(end));
    setIsProcessing(true);
    try {
      const results = await splitPdf(file, [{ start, end }]);
      setSplitBlobs(results);
    } catch (err) {
      console.error('Split error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    const { start, end } = getValidRange();
    if (splitBlobs.length === 1) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(splitBlobs[0]);
      link.download = `split_p${start}-${end}_${file?.name || 'doc.pdf'}`;
      link.click();
    } else {
      const items = splitBlobs.map((b, i) => ({ blob: b, name: `split_part_${i + 1}.pdf` }));
      await zipAndDownloadBlobs(items, 'split_pdfs.zip');
    }
  };

  const validRange = getValidRange();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        <Link href="/pdf-tools" className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to All PDF Tools
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 mx-auto">
            <Scissors className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Split PDF Document</h1>
          <p className="text-xs text-gray-400">Extract specific page ranges or split a PDF into separate files.</p>
        </div>

        <div className="fmf-panel p-6 space-y-6">
          {!file ? (
            <div className="fmf-dropzone rounded-2xl p-8 text-center space-y-3 transition-colors">
              <Upload className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="text-sm font-bold text-gray-300">Upload PDF to Split</p>
              <input type="file" accept="application/pdf" onChange={handleFileChange} id="pdf-split-input" className="hidden" />
              <label htmlFor="pdf-split-input" className="inline-block px-5 py-2.5 fmf-btn-primary font-extrabold text-xs rounded-xl cursor-pointer">
                Choose PDF File
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <div>
                    <h4 className="font-bold text-white">{file.name}</h4>
                    <p className="text-gray-400">{(file.size / 1024).toFixed(1)} KB • <span className="text-blue-400 font-bold">{totalPages} Total Pages</span></p>
                  </div>
                </div>
                <button type="button" onClick={() => setFile(null)} className="px-3 py-1.5 rounded-lg fmf-btn-secondary text-xs font-bold cursor-pointer">
                  Change File
                </button>
              </div>

              {/* Split Settings */}
              <div className="space-y-4 bg-black/40 p-5 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-blue-400" /> Page Range to Extract
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">Pages 1 to {totalPages}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">From Page</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={startPageStr}
                      onChange={(e) => setStartPageStr(e.target.value.replace(/\D/g, ''))}
                      onBlur={handleStartBlur}
                      placeholder="1"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-400 mb-1">To Page</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={endPageStr}
                      onChange={(e) => setEndPageStr(e.target.value.replace(/\D/g, ''))}
                      onBlur={handleEndBlur}
                      placeholder={String(totalPages)}
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Quick Selection Presets */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 self-center">Presets:</span>
                  {[
                    { label: `All (1–${totalPages})`, s: 1, e: totalPages },
                    { label: 'Page 1', s: 1, e: 1 },
                    ...(totalPages >= 2 ? [{ label: 'Page 2', s: 2, e: 2 }] : []),
                    ...(totalPages >= 2 ? [{ label: 'First 2 (1–2)', s: 1, e: 2 }] : [])
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => {
                        setStartPageStr(String(preset.s));
                        setEndPageStr(String(preset.e));
                      }}
                      className="px-2 py-1 text-xs font-semibold rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Visual Thumbnail Page Selector Grid */}
                <VisualPageGrid
                  totalPages={totalPages}
                  startPage={validRange.start}
                  endPage={validRange.end}
                  onRangeSelect={(s, e) => {
                    setStartPageStr(String(s));
                    setEndPageStr(String(e));
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleSplit}
                disabled={isProcessing}
                className="w-full py-4 fmf-btn-primary font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
                <span>Extract Pages {startPageStr || '1'} to {endPageStr || totalPages}</span>
              </button>

              {splitBlobs.length > 0 && (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Pages Extracted Successfully!
                  </div>
                  <button type="button" onClick={handleDownloadAll} className="px-6 py-3 fmf-btn-primary font-black text-xs rounded-xl shadow-lg cursor-pointer">
                    <Download className="w-4 h-4 inline mr-2" /> Download Extracted PDF
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
