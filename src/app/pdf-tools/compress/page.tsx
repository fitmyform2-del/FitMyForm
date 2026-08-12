'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { compressPdf } from '@/lib/pdf/pdfTools';
import { Minimize2, Upload, Download, RefreshCw, ArrowLeft, CheckCircle2, FileText, Sliders } from 'lucide-react';

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<'recommended' | 'extreme' | 'less' | 'custom'>('recommended');
  const [targetKB, setTargetKB] = useState<number>(100);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ blob: Blob; sizeKB: number } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const res = await compressPdf(file, level, targetKB);
      setResult(res);
    } catch (err) {
      console.error('Compress error:', err);
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
            <Minimize2 className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Compress PDF File</h1>
          <p className="text-xs text-gray-400">Reduce PDF file size for competitive exams and online portal uploads.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6">
          {!file ? (
            <div className="border-2 border-dashed border-gray-800 hover:border-blue-500/60 rounded-2xl p-8 text-center space-y-3 transition-colors bg-gray-950/50">
              <Upload className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="text-sm font-bold text-gray-300">Upload PDF to Compress</p>
              <input type="file" accept="application/pdf" onChange={handleFileChange} id="pdf-compress-input" className="hidden" />
              <label
                htmlFor="pdf-compress-input"
                className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-lg shadow-blue-600/30"
              >
                Select PDF Document
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <div>
                    <h4 className="font-bold text-white">{file.name}</h4>
                    <p className="text-gray-400">Original Size: {(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-xs font-bold"
                >
                  Change File
                </button>
              </div>

              {/* Compression presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-400" /> Compression Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'recommended', title: 'Recommended', desc: 'Good quality, high compression' },
                    { id: 'extreme', title: 'Extreme', desc: 'Maximum compression, lower quality' },
                    { id: 'custom', title: 'Target Size KB', desc: 'Specify exact KB limit' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => setLevel(preset.id as any)}
                      className={`p-3.5 rounded-xl border text-left transition-all ${
                        level === preset.id
                          ? 'bg-blue-950/80 border-blue-500 text-white shadow-lg'
                          : 'bg-gray-950 border-gray-800 text-gray-400 hover:border-gray-700'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{preset.title}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {level === 'custom' && (
                <div className="bg-gray-950 p-4 rounded-xl border border-gray-800 space-y-2">
                  <label className="text-xs font-bold text-gray-400">Target Maximum KB Size</label>
                  <input
                    type="number"
                    value={targetKB}
                    onChange={(e) => setTargetKB(Number(e.target.value))}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                  />
                </div>
              )}

              <button
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Minimize2 className="w-5 h-5" />}
                <span>Compress PDF Now</span>
              </button>

              {result && (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Compressed to {result.sizeKB} KB!
                  </div>
                  <p className="text-xs text-gray-300">
                    Reduced by{' '}
                    <span className="font-bold text-emerald-400">
                      {(100 - (result.sizeKB / (file.size / 1024)) * 100).toFixed(0)}%
                    </span>
                  </p>
                  <a
                    href={URL.createObjectURL(result.blob)}
                    download={`compressed_${file.name}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs rounded-xl shadow-lg"
                  >
                    <Download className="w-4 h-4" /> Download Compressed PDF
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
