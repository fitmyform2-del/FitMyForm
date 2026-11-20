'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { compressPdf } from '@/lib/pdf/pdfTools';
import { Minimize2, Download, RefreshCw, ArrowLeft, CheckCircle2, FileText, Sliders, Settings2, RotateCcw } from 'lucide-react';

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<'recommended' | 'extreme' | 'less' | 'custom'>('recommended');
  const [targetKB, setTargetKB] = useState<number>(100);
  const [targetKBStr, setTargetKBStr] = useState<string>('100');
  const [showAdvanced, setShowAdvanced] = useState(false);
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
    const parsed = parseInt(targetKBStr, 10);
    const effectiveKB = isNaN(parsed) || parsed < 10 ? 100 : parsed;
    setTargetKB(effectiveKB);
    setTargetKBStr(String(effectiveKB));
    setIsProcessing(true);
    try {
      const res = await compressPdf(file, level, effectiveKB);
      setResult(res);
    } catch (err) {
      console.error('Compress error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link href="/pdf-tools" className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-bold">
          <ArrowLeft className="w-4 h-4" /> All PDF Tools
        </Link>

        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Minimize2 className="w-3.5 h-3.5 text-blue-400" />
            <span>PDF Compression</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Compress <span className="text-blue-400">PDF</span> File
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Reduce PDF document file size for competitive exams and online portal uploads with 100% browser privacy.
          </p>
        </div>

        <div className="fmf-panel p-6 sm:p-8 space-y-6">
          {!file ? (
            <div className="fmf-dropzone rounded-3xl p-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="text-xl font-black text-white">Select PDF to Compress</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">Upload certificates, marksheets, or identity proofs (PDF format)</p>
              <input type="file" accept="application/pdf" onChange={handleFileChange} id="pdf-compress-input" className="hidden" />
              <label
                htmlFor="pdf-compress-input"
                className="fmf-btn-primary inline-flex items-center gap-2 px-8 py-3.5 text-sm font-black cursor-pointer shadow-lg"
              >
                <span>Select PDF File</span>
              </label>
            </div>
          ) : !result ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-7 h-7 text-blue-400" />
                  <div>
                    <h4 className="font-bold text-white text-sm">{file.name}</h4>
                    <p className="text-slate-400">Original Size: <strong className="text-emerald-400">{(file.size / 1024).toFixed(1)} KB</strong></p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="fmf-btn-secondary px-3.5 py-1.5 text-xs font-bold"
                >
                  Change File
                </button>
              </div>

              {/* Compression presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-400" /> Compression Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'recommended', title: 'Recommended', desc: 'Best balance of quality and file size' },
                    { id: 'extreme', title: 'Extreme Compression', desc: 'Smallest possible file size' },
                    { id: 'custom', title: 'Target Size KB', desc: 'Specify exact KB limit' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setLevel(preset.id as any)}
                      className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                        level === preset.id
                          ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg'
                          : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="font-bold text-sm text-white">{preset.title}</div>
                      <div className="text-[11px] text-slate-400 mt-1">{preset.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Options Accordion */}
              <div className="border-t border-white/[0.08] pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-xs font-bold text-blue-400 hover:text-blue-300 py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Advanced options</span>
                  </span>
                  <span>{showAdvanced ? '▲' : '▼'}</span>
                </button>

                {(showAdvanced || level === 'custom') && (
                  <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2 text-xs mt-3 animate-fade-in">
                    <label className="text-xs font-bold text-slate-300">Target Maximum KB Size</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={targetKBStr}
                      onChange={(e) => setTargetKBStr(e.target.value.replace(/\D/g, ''))}
                      onBlur={() => {
                        const parsed = parseInt(targetKBStr, 10);
                        const v = isNaN(parsed) || parsed < 10 ? 100 : parsed;
                        setTargetKB(v);
                        setTargetKBStr(String(v));
                      }}
                      placeholder="e.g. 100"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={handleCompress}
                disabled={isProcessing}
                className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Compressing PDF...</span>
                  </>
                ) : (
                  <>
                    <Minimize2 className="w-4 h-4" />
                    <span>Compress PDF Now</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="p-8 bg-emerald-950/40 border border-emerald-500/30 rounded-3xl text-center space-y-4 animate-fade-in">
              <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" /> Compressed to {result.sizeKB} KB!
              </div>
              <p className="text-xs text-slate-300">
                Reduced by{' '}
                <strong className="text-emerald-400 font-bold">
                  {(100 - (result.sizeKB / (file.size / 1024)) * 100).toFixed(0)}%
                </strong>
              </p>
              <div className="space-y-3 pt-2">
                <a
                  href={URL.createObjectURL(result.blob)}
                  download={`compressed_${file.name}`}
                  className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Compressed PDF</span>
                </a>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="fmf-btn-secondary px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Compress Again</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
