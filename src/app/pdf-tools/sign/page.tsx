'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SignaturePadModal } from '@/components/pdf/SignaturePadModal';
import { signPdfMultiField, SignField } from '@/lib/pdf/pdfTools';
import { renderPdfAllPagesToDataUrls, RenderedPdfPage } from '@/lib/pdf/pdfjsLoader';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { SignFieldPalette } from './_components/SignFieldPalette';
import {
  PenTool,
  Upload,
  Download,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  FileText,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

export default function SignPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<RenderedPdfPage[]>([]);
  const [isLoadingPages, setIsLoadingPages] = useState(false);
  const [activeSignatureUrl, setActiveSignatureUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [fields, setFields] = useState<SignField[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [appendAuditTrail, setAppendAuditTrail] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setFile(selected);
    setSignedUrl(null);
    setFields([]);
    setSelectedFieldId(null);
    setCurrentPageIndex(0);
    setErrorMsg(null);
    setIsLoadingPages(true);
    try {
      const rendered = await renderPdfAllPagesToDataUrls(selected, { scale: 1.4, quality: 0.88 });
      setPages(rendered);
    } catch {
      setPages([]);
      setErrorMsg('Could not render PDF preview. You can still place fields or check if the file is password-protected.');
    } finally {
      setIsLoadingPages(false);
    }
  };

  const addField = (type: SignField['type'], defaultValue?: string) => {
    if (type === 'signature' && !defaultValue && !activeSignatureUrl) {
      setIsModalOpen(true);
      return;
    }
    const id = `field-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newField: SignField = {
      id,
      type,
      pageIndex: currentPageIndex,
      xRatio: 0.3,
      yRatio: 0.5,
      wRatio: type === 'signature' || type === 'stamp' ? 0.28 : type === 'checkbox' ? 0.05 : 0.28,
      hRatio: type === 'signature' || type === 'stamp' ? 0.09 : type === 'checkbox' ? 0.04 : 0.045,
      value:
        defaultValue ||
        (type === 'signature'
          ? activeSignatureUrl || undefined
          : type === 'date'
          ? new Date().toISOString().split('T')[0]
          : type === 'name'
          ? 'Full Name'
          : type === 'checkbox'
          ? 'Checked'
          : 'Text')
    };
    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(id);
    setSignedUrl(null);
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
    setSignedUrl(null);
  };

  const updateFieldPos = (id: string, key: keyof SignField, val: string | number | undefined) => {
    setFields((prev) => prev.map((f) => (f.id === id ? { ...f, [key]: val } : f)));
    setSignedUrl(null);
  };

  const handleStageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current || !selectedFieldId) return;
    const rect = stageRef.current.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) / rect.width;
    const clickY = (e.clientY - rect.top) / rect.height;

    setFields((prev) =>
      prev.map((f) => {
        if (f.id !== selectedFieldId) return f;
        const xRatio = Math.max(0, Math.min(1 - f.wRatio, clickX - f.wRatio / 2));
        const yRatio = Math.max(0, Math.min(1 - f.hRatio, clickY - f.hRatio / 2));
        return { ...f, pageIndex: currentPageIndex, xRatio, yRatio };
      })
    );
    setSignedUrl(null);
  };

  const handleApplySignature = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const blob = await signPdfMultiField(file, fields, appendAuditTrail);
      if (signedUrl) URL.revokeObjectURL(signedUrl);
      setSignedUrl(URL.createObjectURL(blob));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign PDF.';
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const currentPageData = pages[currentPageIndex];
  const fieldsOnPage = fields.filter((f) => f.pageIndex === currentPageIndex);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <Link href="/pdf-tools" className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to PDF Tools Hub
        </Link>

        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <PenTool className="w-4 h-4 text-indigo-400" />
            <span>Visual PDF e-Sign Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            e-Sign <span className="gradient-text">PDF</span> Documents
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Draw or type your signature, click anywhere on any PDF page to place it visually, and export with a SHA-256 audit summary.
          </p>
        </div>

        {!file ? (
          <div className="max-w-2xl mx-auto border-2 border-dashed border-white/15 hover:border-indigo-500/60 rounded-3xl p-10 text-center space-y-4 bg-[#0d121e] shadow-2xl">
            <Upload className="w-10 h-10 text-indigo-400 mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-white">Upload PDF Document to e-Sign</h3>
              <p className="text-xs text-slate-400 mt-1">Select contract, agreement, NDA, or form file</p>
            </div>
            <input type="file" accept="application/pdf" onChange={handleFileChange} id="pdf-sign-input" className="hidden" />
            <label
              htmlFor="pdf-sign-input"
              className="inline-block px-6 py-3 min-h-[44px] bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-extrabold text-xs rounded-2xl cursor-pointer shadow-xl"
            >
              Choose PDF Document
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Visual Interactive PDF Page Preview (7 cols) */}
            <div className="lg:col-span-7 fmf-panel p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-xs">
                  <FileText className="w-4 h-4 text-indigo-400" />
                  <span className="font-bold text-white truncate max-w-[200px]">{file.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  {pages.length > 1 && (
                    <div className="flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl px-2 py-1 text-xs">
                      <button
                        type="button"
                        disabled={currentPageIndex === 0}
                        onClick={() => setCurrentPageIndex((p) => Math.max(0, p - 1))}
                        className="p-1 text-slate-300 hover:text-white disabled:opacity-30 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="font-mono font-bold px-1.5">
                        Page {currentPageIndex + 1} / {pages.length}
                      </span>
                      <button
                        type="button"
                        disabled={currentPageIndex >= pages.length - 1}
                        onClick={() => setCurrentPageIndex((p) => Math.min(pages.length - 1, p + 1))}
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
                      setFields([]);
                      setSignedUrl(null);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] text-rose-300 hover:text-white text-xs font-bold border border-white/10 cursor-pointer"
                  >
                    Change PDF
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                {selectedFieldId
                  ? 'Tip: Click anywhere on the PDF page below to move the selected field there.'
                  : 'Add a Signature, Name, Date, or Checkbox on the right, then click on the page to position it.'}
              </p>

              {isLoadingPages ? (
                <div className="py-20 text-center text-xs text-slate-400 animate-pulse">
                  Rendering PDF preview...
                </div>
              ) : currentPageData ? (
                <div
                  ref={stageRef}
                  onClick={handleStageClick}
                  className="relative w-full bg-white rounded-xl overflow-hidden shadow-2xl border border-white/20 cursor-crosshair select-none"
                >
                  <img
                    src={currentPageData.dataUrl}
                    alt={`Page ${currentPageIndex + 1}`}
                    className="w-full h-auto block pointer-events-none"
                  />

                  {fieldsOnPage.map((f) => {
                    const isSelected = f.id === selectedFieldId;
                    return (
                      <div
                        key={f.id}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setSelectedFieldId(f.id);
                        }}
                        style={{
                          left: `${f.xRatio * 100}%`,
                          top: `${f.yRatio * 100}%`,
                          width: `${f.wRatio * 100}%`,
                          height: `${f.hRatio * 100}%`
                        }}
                        className={`absolute flex items-center justify-center rounded border-2 px-1 transition-shadow cursor-pointer ${
                          isSelected
                            ? 'border-blue-500 bg-blue-500/15 ring-2 ring-blue-400/50'
                            : 'border-emerald-500/80 bg-emerald-500/10'
                        }`}
                      >
                        {f.type === 'signature' && f.value ? (
                          <img src={f.value} alt="Signature" className="max-w-full max-h-full object-contain pointer-events-none" />
                        ) : f.type === 'checkbox' ? (
                          <span className="text-blue-700 font-black text-sm">✓</span>
                        ) : (
                          <span className="text-slate-900 font-bold text-xs truncate">{f.value}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 text-center text-xs text-slate-400 bg-black/40 rounded-2xl border border-white/10">
                  Preview unavailable for this PDF.
                </div>
              )}
            </div>

            {/* Right: Field Controls & Export (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0d121e] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
                <SignFieldPalette
                  activeSignatureUrl={activeSignatureUrl}
                  fields={fields}
                  appendAuditTrail={appendAuditTrail}
                  onOpenModal={() => setIsModalOpen(true)}
                  onAddField={addField}
                  onRemoveField={removeField}
                  onUpdateField={updateFieldPos}
                  onAuditTrailChange={setAppendAuditTrail}
                />

                {errorMsg && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleApplySignature}
                  disabled={isProcessing || fields.length === 0}
                  className={`w-full py-4 min-h-[48px] rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl ${
                    fields.length === 0
                      ? 'bg-white/5 text-slate-500 border border-white/10 cursor-not-allowed'
                      : isProcessing
                      ? 'bg-indigo-700 text-white cursor-wait animate-pulse'
                      : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white cursor-pointer'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Signing PDF...</span>
                    </>
                  ) : (
                    <>
                      <PenTool className="w-4 h-4" />
                      <span>Sign PDF & Export</span>
                    </>
                  )}
                </button>

                {signedUrl && (
                  <div className="p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-3 animate-fade-in">
                    <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                      <CheckCircle2 className="w-4 h-4" /> PDF Signed Successfully!
                    </div>
                    <a
                      href={signedUrl}
                      download={`signed-${file.name}`}
                      className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Signed PDF</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <SeoContentSection
          title="Free Client-Side PDF e-Signature Tool"
          description="Sign PDF contracts, agreements, NDAs, and forms directly in your browser with visual placement and SHA-256 document hash summaries."
          faqs={[
            {
              question: 'Are my signatures stored on a server?',
              answer: 'No! All signature embedding and PDF generation run locally inside your web browser memory.'
            }
          ]}
        />
      </main>

      <Footer />

      {isModalOpen && (
        <SignaturePadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaveSignature={(dataUrl) => {
            setActiveSignatureUrl(dataUrl);
            setIsModalOpen(false);
            // Automatically drop signature onto current page if none placed yet
            if (!fields.some((f) => f.type === 'signature')) {
              addField('signature', dataUrl);
            }
          }}
        />
      )}
    </div>
  );
}
