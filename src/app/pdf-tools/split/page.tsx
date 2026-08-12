'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { splitPdf, zipAndDownloadBlobs } from '@/lib/pdf/pdfTools';
import { Scissors, Upload, Download, RefreshCw, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [splitBlobs, setSplitBlobs] = useState<Blob[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setSplitBlobs([]);
    }
  };

  const handleSplit = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const results = await splitPdf(file, [{ start: startPage, end: endPage }]);
      setSplitBlobs(results);
    } catch (err) {
      console.error('Split error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAll = async () => {
    if (splitBlobs.length === 1) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(splitBlobs[0]);
      link.download = `split_p${startPage}-${endPage}_${file?.name || 'doc.pdf'}`;
      link.click();
    } else {
      const items = splitBlobs.map((b, i) => ({ blob: b, name: `split_part_${i + 1}.pdf` }));
      await zipAndDownloadBlobs(items, 'split_pdfs.zip');
    }
  };

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

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6">
          {!file ? (
            <div className="border-2 border-dashed border-gray-800 hover:border-blue-500/60 rounded-2xl p-8 text-center space-y-3 transition-colors bg-gray-950/50">
              <Upload className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="text-sm font-bold text-gray-300">Upload PDF to Split</p>
              <input type="file" accept="application/pdf" onChange={handleFileChange} id="pdf-split-input" className="hidden" />
              <label
                htmlFor="pdf-split-input"
                className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-lg shadow-blue-600/30"
              >
                Choose PDF File
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <div>
                    <h4 className="font-bold text-white">{file.name}</h4>
                    <p className="text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-xs font-bold"
                >
                  Change File
                </button>
              </div>

              {/* Split Settings */}
              <div className="grid grid-cols-2 gap-4 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">From Page</label>
                  <input
                    type="number"
                    min={1}
                    value={startPage}
                    onChange={(e) => setStartPage(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">To Page</label>
                  <input
                    type="number"
                    min={startPage}
                    value={endPage}
                    onChange={(e) => setEndPage(Math.max(startPage, parseInt(e.target.value) || startPage))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <button
                onClick={handleSplit}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Scissors className="w-5 h-5" />}
                <span>Extract Pages {startPage} to {endPage}</span>
              </button>

              {splitBlobs.length > 0 && (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Pages Extracted Successfully!
                  </div>
                  <button
                    onClick={handleDownloadAll}
                    className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs rounded-xl shadow-lg"
                  >
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
