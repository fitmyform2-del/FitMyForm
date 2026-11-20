'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { compressPdf } from '@/lib/pdf/pdfTools';
import { Minimize2, Download, RefreshCw, ArrowLeft, CheckCircle2, FileText, Sliders, Settings2, RotateCcw, AlertCircle } from 'lucide-react';

type CompressionLevel = 'recommended' | 'extreme' | 'less' | 'custom';

function CompressPdfInner() {
  const searchParams = useSearchParams();
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<CompressionLevel>('recommended');
  const [targetKBStr, setTargetKBStr] = useState<string>('200');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<{ url: string; sizeKB: number } | null>(null);

  // Pre-fill target KB when coming from an exam PDF preset
  useEffect(() => {
    const paramKB = searchParams.get('targetKB');
    if (paramKB) {
      const parsed = parseInt(paramKB, 10);
      if (!isNaN(parsed) && parsed >= 10) {
        setLevel('custom');
        setTargetKBStr(String(parsed));
        setShowAdvanced(true);
      }
    }
  }, [searchParams]);

  // Revoke object URL on unmount / change
  useEffect(() => {
    return () => {
      if (result?.url) URL.revokeObjectURL(result.url);
    };
  }, [result]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult(null);
      setErrorMsg(null);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    const parsed = parseInt(targetKBStr, 10);
    const effectiveKB = isNaN(parsed) || parsed < 10 ? 200 : parsed;
    setTargetKBStr(String(effectiveKB));
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const res = await compressPdf(file, level, effectiveKB);
      if (result?.url) URL.revokeObjectURL(result.url);
      setResult({ url: URL.createObjectURL(res.blob), sizeKB: res.sizeKB });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not compress this PDF file.';
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const origKB = file ? Number((file.size / 1024).toFixed(1)) : 0;
  const reductionPct = file && result ? Math.round(((origKB - result.sizeKB) / Math.max(0.1, origKB)) * 100) : 0;

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
            Reduce PDF file size using real client-side page optimization and image compression for exam & job portals.
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
                    <p className="text-slate-400">Original Size: <strong className="text-emerald-400">{origKB} KB</strong></p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="fmf-btn-secondary px-3.5 py-1.5 text-xs font-bold cursor-pointer"
                >
                  Change File
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-blue-400" /> Compression Level
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {(
                    [
                      { id: 'less', title: 'Lossless', desc: 'Keep text selectable' },
                      { id: 'recommended', title: 'Recommended', desc: 'Balanced clarity & size' },
                      { id: 'extreme', title: 'Extreme', desc: 'Smallest possible file' },
                      { id: 'custom', title: 'Target KB', desc: 'Fit under exact KB limit' }
                    ] as const
                  ).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setLevel(preset.id)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
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

              <div className="border-t border-white/[0.08] pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-xs font-bold text-blue-400 hover:text-blue-300 py-1 cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Target Maximum KB Limit</span>
                  </span>
                  <span>{showAdvanced || level === 'custom' ? '▲' : '▼'}</span>
                </button>

                {(showAdvanced || level === 'custom') && (
                  <div className="bg-black/40 p-4 rounded-xl border border-white/10 space-y-2 text-xs mt-3 animate-fade-in">
                    <label className="text-xs font-bold text-slate-300">Target Maximum Size (KB)</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={targetKBStr}
                      onChange={(e) => {
                        setTargetKBStr(e.target.value.replace(/\D/g, ''));
                        if (level !== 'custom') setLevel('custom');
                      }}
                      placeholder="e.g. 200"
                      className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

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
                <CheckCircle2 className="w-5 h-5" /> Output Size: {result.sizeKB} KB (from {origKB} KB)
              </div>
              <p className="text-xs text-slate-300">
                {reductionPct > 0 ? (
                  <>
                    Reduced by <strong className="text-emerald-400 font-bold">{reductionPct}%</strong>
                  </>
                ) : (
                  <span>This PDF is already highly optimized — kept the smallest valid size.</span>
                )}
              </p>
              <div className="space-y-3 pt-2">
                <a
                  href={result.url}
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
                  <span>Try Different Compression Level</span>
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

export default function CompressPdfPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0f19]" />}>
      <CompressPdfInner />
    </Suspense>
  );
}
