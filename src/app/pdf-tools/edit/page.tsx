'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { editPdf, AnnotationItem } from '@/lib/pdf/pdfTools';
import { renderPdfAllPagesToDataUrls, RenderedPdfPage } from '@/lib/pdf/pdfjsLoader';
import { FileText, Upload, Download, RefreshCw, ArrowLeft, CheckCircle2, Plus, Trash2, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

export default function EditPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPdfPage[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [activeColor, setActiveColor] = useState('#1d4ed8');
  const [activeFontSize, setActiveFontSize] = useState(16);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setAnnotations([]);
    setSelectedIdx(null);
    setEditedUrl(null);
    setCurrentPage(0);
    setErrorMsg(null);
    setIsLoadingPages(true);
    try {
      const rendered = await renderPdfAllPagesToDataUrls(selected, { scale: 1.4, quality: 0.88 });
      setPages(rendered);
    } catch {
      setPages([]);
      setErrorMsg('Could not render PDF preview.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const handleAddAnnotation = (xRatio = 0.12, yRatio = 0.15) => {
    const nextIdx = annotations.length;
    setAnnotations((prev) => [
      ...prev,
      {
        type: 'text',
        pageIndex: currentPage,
        xRatio,
        yRatio,
        text: 'Type annotation text',
        color: activeColor,
        fontSize: activeFontSize
      }
    ]);
    setSelectedIdx(nextIdx);
    setEditedUrl(null);
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const xRatio = Math.max(0.02, Math.min(0.92, (e.clientX - rect.left) / rect.width));
    const yRatio = Math.max(0.02, Math.min(0.94, (e.clientY - rect.top) / rect.height));

    if (selectedIdx !== null && annotations[selectedIdx]) {
      setAnnotations((prev) =>
        prev.map((a, idx) => (idx === selectedIdx ? { ...a, pageIndex: currentPage, xRatio, yRatio } : a))
      );
      setEditedUrl(null);
    } else {
      handleAddAnnotation(xRatio, yRatio);
    }
  };

  const handleSaveEdit = async () => {
    if (!file || annotations.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const blob = await editPdf(file, annotations);
      if (editedUrl) URL.revokeObjectURL(editedUrl);
      setEditedUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Failed to export edited PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  const currentPageData = pages[currentPage];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-8 space-y-8">
        <Link href="/pdf-tools" className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to All PDF Tools
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Edit & Annotate PDF</h1>
          <p className="text-xs text-slate-400">Click anywhere on a PDF page to add or reposition text annotations with custom color and font size.</p>
        </div>

        {!file ? (
          <div className="max-w-2xl mx-auto fmf-panel p-6">
            <div className="fmf-dropzone rounded-2xl p-8 text-center space-y-3">
              <Upload className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="text-sm font-bold text-slate-200">Upload PDF to Edit</p>
              <input type="file" accept="application/pdf" onChange={handleFileChange} id="pdf-edit-input" className="hidden" />
              <label htmlFor="pdf-edit-input" className="inline-block px-5 py-2.5 fmf-btn-primary text-xs font-extrabold cursor-pointer">
                Choose PDF File
              </label>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Live Page Canvas */}
            <div className="lg:col-span-7 fmf-panel p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3 text-xs">
                <span className="font-bold text-white truncate max-w-[200px]">{file.name}</span>
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
                      setAnnotations([]);
                    }}
                    className="px-3 py-1.5 rounded-lg fmf-btn-secondary text-xs font-bold cursor-pointer"
                  >
                    Change File
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                {selectedIdx !== null
                  ? `Click anywhere on the page to move Annotation #${selectedIdx + 1}.`
                  : 'Click anywhere on the page to place a new text annotation.'}
              </p>

              {isLoadingPages ? (
                <div className="py-20 text-center text-xs text-slate-400 animate-pulse">Rendering PDF preview...</div>
              ) : currentPageData ? (
                <div
                  ref={stageRef}
                  onClick={handleStageClick}
                  className="relative w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-white/20 cursor-crosshair select-none"
                >
                  <img src={currentPageData.dataUrl} alt={`Page ${currentPage + 1}`} className="w-full h-auto block pointer-events-none" />
                  {annotations.map((ann, idx) =>
                    ann.pageIndex === currentPage ? (
                      <div
                        key={idx}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setSelectedIdx(idx);
                        }}
                        style={{
                          left: `${ann.xRatio * 100}%`,
                          top: `${ann.yRatio * 100}%`,
                          color: ann.color || '#1d4ed8',
                          fontSize: `${Math.max(10, (ann.fontSize || 16) * 0.85)}px`
                        }}
                        className={`absolute font-bold px-1.5 py-0.5 rounded border cursor-pointer ${
                          selectedIdx === idx ? 'border-blue-500 bg-blue-500/15' : 'border-transparent hover:border-blue-400/50'
                        }`}
                      >
                        {ann.text}
                      </div>
                    ) : null
                  )}
                </div>
              ) : null}
            </div>

            {/* Right: Annotation Controls */}
            <div className="lg:col-span-5 fmf-panel p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-white">Annotations ({annotations.length})</span>
                <button
                  type="button"
                  onClick={() => handleAddAnnotation()}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Text
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Text Color</label>
                  <input
                    type="color"
                    value={activeColor}
                    onChange={(e) => {
                      const c = e.target.value;
                      setActiveColor(c);
                      if (selectedIdx !== null) {
                        setAnnotations((prev) => prev.map((a, i) => (i === selectedIdx ? { ...a, color: c } : a)));
                      }
                    }}
                    className="w-full h-9 rounded-xl bg-black/40 border border-white/10 p-1 cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Font Size ({activeFontSize}pt)</label>
                  <input
                    type="range"
                    min={10}
                    max={36}
                    value={activeFontSize}
                    onChange={(e) => {
                      const sz = Number(e.target.value);
                      setActiveFontSize(sz);
                      if (selectedIdx !== null) {
                        setAnnotations((prev) => prev.map((a, i) => (i === selectedIdx ? { ...a, fontSize: sz } : a)));
                      }
                    }}
                    className="w-full accent-blue-500 mt-2"
                  />
                </div>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto">
                {annotations.map((ann, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedIdx(idx);
                      setCurrentPage(ann.pageIndex);
                    }}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer ${
                      selectedIdx === idx ? 'bg-blue-500/15 border-blue-500/50' : 'bg-black/40 border-white/10'
                    }`}
                  >
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">P{ann.pageIndex + 1}</span>
                    <input
                      type="text"
                      value={ann.text || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAnnotations((prev) => prev.map((a, i) => (i === idx ? { ...a, text: val } : a)));
                        setEditedUrl(null);
                      }}
                      className="bg-black/50 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white flex-1 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={(ev) => {
                        ev.stopPropagation();
                        setAnnotations((prev) => prev.filter((_, i) => i !== idx));
                        setSelectedIdx(null);
                        setEditedUrl(null);
                      }}
                      className="p-1 text-rose-400 hover:bg-rose-950/50 rounded shrink-0 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {errorMsg && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveEdit}
                disabled={isProcessing || annotations.length === 0}
                className="w-full py-4 fmf-btn-primary disabled:opacity-40 font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                <span>Export Edited PDF</span>
              </button>

              {editedUrl && (
                <div className="p-5 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-center space-y-3 animate-fade-in">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4" /> PDF Annotations Exported!
                  </div>
                  <a
                    href={editedUrl}
                    download={`edited_${file.name}`}
                    className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg"
                  >
                    <Download className="w-4 h-4" /> Download Edited PDF
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
