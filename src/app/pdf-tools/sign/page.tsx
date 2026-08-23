'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SignaturePadModal } from '@/components/pdf/SignaturePadModal';
import { signPdfMultiField, SignField } from '@/lib/pdf/pdfTools';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { SignFieldPalette } from './_components/SignFieldPalette';
import {
  PenTool,
  Upload,
  Download,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  FileText
} from 'lucide-react';

export default function SignPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [activeSignatureUrl, setActiveSignatureUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [fields, setFields] = useState<SignField[]>([]);
  const [appendAuditTrail, setAppendAuditTrail] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setSignedUrl(null);
      setFields([]);
    }
  };

  const addField = (type: SignField['type'], defaultValue?: string) => {
    const newField: SignField = {
      id: `field-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type,
      pageIndex: currentPageIndex,
      xRatio: 0.35,
      yRatio: 0.45,
      wRatio: type === 'signature' || type === 'stamp' ? 0.3 : 0.25,
      hRatio: type === 'signature' || type === 'stamp' ? 0.1 : 0.05,
      value: defaultValue || (type === 'signature' ? activeSignatureUrl || undefined : type === 'date' ? new Date().toISOString().split('T')[0] : type === 'name' ? 'John Doe' : 'Custom Text')
    };
    setFields([...fields, newField]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter((f) => f.id !== id));
  };

  const updateFieldPos = (id: string, key: keyof SignField, val: any) => {
    setFields(fields.map((f) => (f.id === id ? { ...f, [key]: val } : f)));
  };

  const handleApplySignature = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const blob = await signPdfMultiField(file, fields, appendAuditTrail);
      setSignedUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Sign error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <Link href="/pdf-tools" className="inline-flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to PDF Tools Hub
        </Link>

        {/* Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <PenTool className="w-4 h-4 text-indigo-400" />
            <span>iLoveSign PDF e-Sign Workspace</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            e-Sign <span className="gradient-text">PDF</span> Documents
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Fill, sign, and place signature boxes, dates, initials, and audit trail certificates onto PDF documents with 100% browser privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload & Field Placement Toolbar (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {!file ? (
              <div className="border-2 border-dashed border-white/10 hover:border-indigo-500/60 rounded-3xl p-10 text-center space-y-4 bg-[#0d121e] shadow-2xl backdrop-blur-2xl">
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
              <div className="space-y-6 bg-[#0d121e] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-3">
                    <FileText className="w-6 h-6 text-indigo-400" />
                    <div>
                      <h4 className="font-bold text-white text-sm">{file.name}</h4>
                      <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setFile(null)}
                    className="px-3 py-1.5 min-h-[44px] rounded-xl bg-white/[0.04] text-slate-400 hover:text-white text-xs font-bold border border-white/10 cursor-pointer"
                  >
                    Change File
                  </button>
                </div>

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

                <button
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
                      <span>Embedding Signatures & Generating Audit Certificate...</span>
                    </>
                  ) : (
                    <>
                      <PenTool className="w-4 h-4" />
                      <span>Sign PDF & Generate Certificate</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Output & Download (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Signed PDF Document Result</span>
            </h2>

            {signedUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl animate-fade-in">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> PDF e-Signed Successfully!
                  </h4>
                  <p className="text-xs text-slate-300">
                    Audit trail certificate attached to final PDF document page. 100% Client-Side Cryptographic execution.
                  </p>
                </div>

                <a
                  href={signedUrl}
                  download={`signed-${file?.name || 'document.pdf'}`}
                  className="w-full py-4 min-h-[48px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Signed PDF</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <PenTool className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">No Signed PDF Generated Yet</h4>
                <p className="text-xs text-slate-400">Upload PDF, place signature and text fields, then click &quot;Sign PDF & Generate Certificate&quot;.</p>
              </div>
            )}
          </div>
        </div>

        <SeoContentSection
          title="iLoveSign Client-Side Free PDF e-Signature Tool"
          description="Sign PDF contracts, agreements, NDAs, and forms with full eIDAS & ESIGN Act compliance directly in your browser. Generate cryptographic audit trail certificates without server uploads."
          faqs={[
            {
              question: 'Are my signatures stored on a server?',
              answer: 'No! All signature embedding and PDF re-encoding are executed locally inside your web browser memory.'
            }
          ]}
        />
      </main>

      <Footer />

      {/* Signature Draw / Type / Upload Modal */}
      {isModalOpen && (
        <SignaturePadModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaveSignature={(dataUrl) => {
            setActiveSignatureUrl(dataUrl);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}
