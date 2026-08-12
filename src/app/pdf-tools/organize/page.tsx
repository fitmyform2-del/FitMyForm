'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { organizePdf } from '@/lib/pdf/pdfTools';
import { LayoutGrid, Upload, Download, RefreshCw, ArrowLeft, CheckCircle2, FileText, RotateCw, Trash2, MoveUp, MoveDown } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function OrganizePdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [pageOrder, setPageOrder] = useState<number[]>([]);
  const [rotations, setRotations] = useState<Record<number, number>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setResultUrl(null);
      try {
        const buffer = await selected.arrayBuffer();
        const pdf = await PDFDocument.load(buffer, { ignoreEncryption: true });
        const count = pdf.getPageCount();
        setPageCount(count);
        setPageOrder(Array.from({ length: count }, (_, i) => i));
        setRotations({});
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleMove = (idx: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? idx - 1 : idx + 1;
    if (target < 0 || target >= pageOrder.length) return;
    const newOrder = [...pageOrder];
    const tmp = newOrder[idx];
    newOrder[idx] = newOrder[target];
    newOrder[target] = tmp;
    setPageOrder(newOrder);
  };

  const handleRotatePage = (pageIdx: number) => {
    setRotations((prev) => ({
      ...prev,
      [pageIdx]: ((prev[pageIdx] || 0) + 90) % 360,
    }));
  };

  const handleDeletePage = (idx: number) => {
    setPageOrder((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleOrganize = async () => {
    if (!file || pageOrder.length === 0) return;
    setIsProcessing(true);
    try {
      const blob = await organizePdf(file, pageOrder, rotations);
      setResultUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Organize error:', err);
    } finally {
      setIsProcessing(false);
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
            <LayoutGrid className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Organize & Reorder PDF Pages</h1>
          <p className="text-xs text-gray-400">Reorder pages, delete unwanted pages, or rotate individual pages in your PDF.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6">
          {!file ? (
            <div className="border-2 border-dashed border-gray-800 hover:border-blue-500/60 rounded-2xl p-8 text-center space-y-3 bg-gray-950/50">
              <Upload className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="text-sm font-bold text-gray-300">Upload PDF to Organize</p>
              <input type="file" accept="application/pdf" onChange={handleFileChange} id="pdf-org-input" className="hidden" />
              <label
                htmlFor="pdf-org-input"
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
                    <p className="text-gray-400">{pageCount} total pages</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-xs font-bold"
                >
                  Change File
                </button>
              </div>

              {/* Page Grid / List */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-gray-400">Page Arrangement ({pageOrder.length} Pages)</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pageOrder.map((origIdx, currentIdx) => (
                    <div
                      key={currentIdx}
                      className="bg-gray-950 border border-gray-800 rounded-xl p-3 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded bg-blue-950 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                          {currentIdx + 1}
                        </span>
                        <span className="font-bold text-gray-300">Page {origIdx + 1}</span>
                        {rotations[origIdx] ? (
                          <span className="text-[10px] text-amber-400">({rotations[origIdx]}°)</span>
                        ) : null}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleRotatePage(origIdx)}
                          className="p-1.5 text-gray-400 hover:text-blue-400"
                          title="Rotate 90°"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(currentIdx, 'up')}
                          disabled={currentIdx === 0}
                          className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          <MoveUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMove(currentIdx, 'down')}
                          disabled={currentIdx === pageOrder.length - 1}
                          className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          <MoveDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePage(currentIdx)}
                          className="p-1.5 text-red-400 hover:bg-red-950/50 rounded"
                          title="Delete Page"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleOrganize}
                disabled={isProcessing || pageOrder.length === 0}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <LayoutGrid className="w-5 h-5" />}
                <span>Save Organized PDF</span>
              </button>

              {resultUrl && (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Organized PDF Saved!
                  </div>
                  <a
                    href={resultUrl}
                    download={`organized_${file.name}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs rounded-xl shadow-lg"
                  >
                    <Download className="w-4 h-4" /> Download PDF File
                  </a>
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
