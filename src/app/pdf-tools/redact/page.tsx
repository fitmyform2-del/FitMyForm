'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { redactPdf, RedactionArea } from '@/lib/pdf/pdfTools';
import { renderPdfAllPagesToDataUrls, RenderedPdfPage } from '@/lib/pdf/pdfjsLoader';
import { EyeOff, Upload, Download, RefreshCw, ArrowLeft, CheckCircle2, FileText, Trash2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export default function RedactPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPdfPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [redactions, setRedactions] = useState<RedactionArea[]>([]);
  const [draftBox, setDraftBox] = useState<{ startX: number; startY: number; curX: number; curY: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [redactedUrl, setRedactedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setRedactions([]);
    setRedactedUrl(null);
    setCurrentPage(0);
    setErrorMsg(null);
    setIsLoadingPages(true);
    try {
      const rendered = await renderPdfAllPagesToDataUrls(selected, { scale: 1.4, quality: 0.88 });
      setPages(rendered);
    } catch {
      setPages([]);
      setErrorMsg('Failed to render PDF preview. Make sure the file is not encrypted.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const getRelPoint = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = stageRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const pt = getRelPoint(e);
    setDraftBox({ startX: pt.x, startY: pt.y, curX: pt.x, curY: pt.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draftBox || !stageRef.current) return;
    const pt = getRelPoint(e);
    setDraftBox((prev) => (prev ? { ...prev, curX: pt.x, curY: pt.y } : null));
  };

  const handleMouseUp = () => {
    if (!draftBox) return;
    const xRatio = Math.min(draftBox.startX, draftBox.curX);
    const yRatio = Math.min(draftBox.startY, draftBox.curY);
    const wRatio = Math.abs(draftBox.curX - draftBox.startX);
    const hRatio = Math.abs(draftBox.curY - draftBox.startY);
    if (wRatio > 0.015 && hRatio > 0.01) {
      setRedactions((prev) => [...prev, { pageIndex: currentPage, xRatio, yRatio, wRatio, hRatio }]);
      setRedactedUrl(null);
    }
    setDraftBox(null);
  };

  const handleApplyRedaction = async () => {
    if (!file || redactions.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const blob = await redactPdf(file, redactions);
      if (redactedUrl) URL.revokeObjectURL(redactedUrl);
      setRedactedUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to burn redactions into PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentPageData = pages[currentPage];
  const pageRedactions = redactions.map((r, idx) => ({ ...r, globalIdx: idx })).filter((r) => r.pageIndex === currentPage);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        <Link href="/pdf-tools" className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to All PDF Tools
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 mx-auto">
            <EyeOff className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Redact Sensitive PDF Info</h1>
          <p className="text-xs text-slate-400">
            Click & drag directly over Aadhaar numbers, phone numbers, or text to permanently flatten and erase them from the PDF.
          </p>
        </div>

        {!file ? (
          <div className="max-w-2xl mx-auto fmf-panel p-6">
            <div className="fmf-dropzone rounded-2xl p-8 text-center space-y-3">
              <Upload className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="text-sm font-bold text-slate-200">Upload PDF to Redact</p>
              <input type="file" accept="application/pdf" onChange={handleFileChange} id="pdf-redact-input" className="hidden" />
              <label htmlFor="pdf-redact-input" className="inline-block px-5 py-2.5 fmf-btn-primary text-xs font-extrabold cursor-pointer">
                Choose PDF File
              </label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Visual Page Canvas */}
            <div className="lg:col-span-8 fmf-panel p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <span className="font-bold text-white truncate max-w-[200px]">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  {pages.length > 1 && (
                    <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1">
                      <button
                        type="button"
                        disabled={currentPage === 0}
                        onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                        className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-mono font-bold px-1">
                        Page {currentPage + 1} / {pages.length}
                      </span>
                      <button
                        type="button"
                        disabled={currentPage >= pages.length - 1}
                        onClick={() => setCurrentPage((p) => Math.min(pages.length - 1, p + 1))}
                        className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPages([]);
                      setRedactions([]);
                    }}
                    className="px-3 py-1.5 rounded-lg fmf-btn-secondary text-xs font-bold cursor-pointer"
                  >
                    Change File
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-amber-300">
                Click and drag anywhere on the PDF page below to draw a permanent blackout box.
              </p>

              {isLoadingPages ? (
                <div className="py-20 text-center text-xs text-slate-400 animate-pulse">Rendering PDF pages...</div>
              ) : currentPageData ? (
                <div
                  ref={stageRef}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  className="relative w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-white/20 cursor-crosshair select-none"
                >
                  <img src={currentPageData.dataUrl} alt={`Page ${currentPage + 1}`} className="w-full h-auto block pointer-events-none" />

                  {pageRedactions.map((red) => (
                    <div
                      key={red.globalIdx}
                      style={{
                        left: `${red.xRatio * 100}%`,
                        top: `${red.yRatio * 100}%`,
                        width: `${red.wRatio * 100}%`,
                        height: `${red.hRatio * 100}%`
                      }}
                      className="absolute bg-black border border-rose-500/80"
                    />
                  ))}

                  {draftBox && (
                    <div
                      style={{
                        left: `${Math.min(draftBox.startX, draftBox.curX) * 100}%`,
                        top: `${Math.min(draftBox.startY, draftBox.curY) * 100}%`,
                        width: `${Math.abs(draftBox.curX - draftBox.startX) * 100}%`,
                        height: `${Math.abs(draftBox.curY - draftBox.startY) * 100}%`
                      }}
                      className="absolute bg-black/75 border-2 border-dashed border-rose-400 pointer-events-none"
                    />
                  )}
                </div>
              ) : null}
            </div>

            {/* Sidebar Controls */}
            <div className="lg:col-span-4 fmf-panel p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-white">Redaction Boxes ({redactions.length})</span>
                {redactions.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setRedactions([]);
                      setRedactedUrl(null);
                    }}
                    className="text-[11px] text-rose-400 hover:underline font-bold cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {redactions.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">
                  No redaction boxes yet. Drag across any sensitive area on the preview to mask it.
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {redactions.map((red, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/10 text-xs">
                      <button
                        type="button"
                        onClick={() => setCurrentPage(red.pageIndex)}
                        className="font-bold text-slate-200 hover:text-blue-400 cursor-pointer"
                      >
                        Box #{idx + 1} • Page {red.pageIndex + 1}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRedactions((prev) => prev.filter((_, i) => i !== idx));
                          setRedactedUrl(null);
                        }}
                        className="p-1 text-rose-400 hover:bg-rose-950/50 rounded cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleApplyRedaction}
                disabled={isProcessing || redactions.length === 0}
                className="w-full py-4 fmf-btn-primary disabled:opacity-40 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <EyeOff className="w-5 h-5" />}
                <span>Burn Permanent Redactions</span>
              </button>

              {redactedUrl && (
                <div className="p-5 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-center space-y-3 animate-fade-in">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> Underlying Text Permanently Removed!
                  </div>
                  <a
                    href={redactedUrl}
                    download={`redacted_${file.name}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg"
                  >
                    <Download className="w-4 h-4" /> Download Redacted PDF
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
