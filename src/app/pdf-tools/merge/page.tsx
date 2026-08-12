'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { mergePdfs } from '@/lib/pdf/pdfTools';
import { GitMerge, Upload, MoveUp, MoveDown, Trash2, Download, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mergedBlobUrl, setMergedBlobUrl] = useState<string | null>(null);

  const handleFileAdd = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const added = Array.from(e.target.files).filter((f) => f.type.includes('pdf'));
      setFiles((prev) => [...prev, ...added]);
      setMergedBlobUrl(null);
    }
  };

  const handleRemove = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setMergedBlobUrl(null);
  };

  const handleMove = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= files.length) return;
    const newFiles = [...files];
    const temp = newFiles[idx];
    newFiles[idx] = newFiles[targetIdx];
    newFiles[targetIdx] = temp;
    setFiles(newFiles);
    setMergedBlobUrl(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const blob = await mergePdfs(files);
      const url = URL.createObjectURL(blob);
      setMergedBlobUrl(url);
    } catch (err) {
      console.error('Merge error:', err);
    } finally {
      setIsProcessing(false);
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
            <GitMerge className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Merge PDF Files</h1>
          <p className="text-xs text-gray-400">Combine multiple PDF documents into a single file in your preferred page order.</p>
        </div>

        {/* Dropzone / Upload area */}
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6">
          <div className="border-2 border-dashed border-gray-800 hover:border-blue-500/60 rounded-2xl p-8 text-center space-y-3 transition-colors bg-gray-950/50">
            <Upload className="w-8 h-8 text-blue-400 mx-auto" />
            <p className="text-sm font-bold text-gray-300">Select or Drag PDF files to merge</p>
            <input type="file" accept="application/pdf" multiple onChange={handleFileAdd} id="pdf-merge-input" className="hidden" />
            <label
              htmlFor="pdf-merge-input"
              className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-lg shadow-blue-600/30"
            >
              Choose PDF Files
            </label>
          </div>

          {/* File list */}
          {files.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-gray-400 px-1">
                <span>Selected PDFs ({files.length})</span>
                <span>Drag or use arrows to reorder</span>
              </div>
              <div className="space-y-2">
                {files.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-xl p-3.5 text-xs text-white"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="w-6 h-6 rounded-lg bg-blue-950 text-blue-400 font-bold flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span className="font-bold truncate max-w-xs">{file.name}</span>
                      <span className="text-[10px] text-gray-500">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <MoveUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === files.length - 1}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-white disabled:opacity-30"
                      >
                        <MoveDown className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRemove(idx)}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-950/50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Merge Action Button */}
          {files.length >= 2 && (
            <button
              onClick={handleMerge}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Merging PDFs...
                </>
              ) : (
                <>
                  <GitMerge className="w-5 h-5" /> Merge {files.length} PDFs Now
                </>
              )}
            </button>
          )}

          {/* Download Result */}
          {mergedBlobUrl && (
            <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3 animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" /> PDF Files Successfully Merged!
              </div>
              <a
                href={mergedBlobUrl}
                download="merged_document_fitmyform.pdf"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20"
              >
                <Download className="w-4 h-4" /> Download Merged PDF
              </a>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
