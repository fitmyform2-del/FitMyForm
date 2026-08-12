'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SignaturePadModal } from '@/components/pdf/SignaturePadModal';
import { signPdfMultiField, SignField } from '@/lib/pdf/pdfTools';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import {
  PenTool,
  Upload,
  Download,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  FileText,
  Plus,
  Trash2,
  Calendar,
  User,
  Type,
  CheckSquare,
  ShieldCheck,
  Award
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
                  className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-extrabold text-xs rounded-2xl cursor-pointer shadow-xl"
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
                    className="px-3 py-1.5 rounded-xl bg-white/[0.04] text-slate-400 hover:text-white text-xs font-bold border border-white/10"
                  >
                    Change File
                  </button>
                </div>

                {/* Signature Creator & Field Palette */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-300">My Saved Signature</span>
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      {activeSignatureUrl ? 'Change Signature' : 'Create Signature'}
                    </button>
                  </div>

                  {activeSignatureUrl ? (
                    <div className="bg-white p-3 rounded-2xl flex items-center justify-center h-20 border border-white/20">
                      <img src={activeSignatureUrl} alt="Signature Preview" className="max-h-full object-contain" />
                    </div>
                  ) : (
                    <div className="p-4 border-2 border-dashed border-white/10 rounded-2xl text-center text-xs text-slate-500">
                      Click &quot;Create Signature&quot; to draw, type calligraphy name, or upload signature PNG image.
                    </div>
                  )}

                  {/* Add Field Buttons Toolbar */}
                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-300 block">Add e-Sign Fields to PDF:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      <button
                        onClick={() => addField('signature', activeSignatureUrl || undefined)}
                        className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-indigo-600/30 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5"
                      >
                        <PenTool className="w-3.5 h-3.5 text-indigo-400" /> Signature
                      </button>
                      <button
                        onClick={() => addField('name', 'John Doe')}
                        className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-indigo-600/30 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5"
                      >
                        <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name
                      </button>
                      <button
                        onClick={() => addField('date', new Date().toISOString().split('T')[0])}
                        className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-indigo-600/30 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5"
                      >
                        <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Date Signed
                      </button>
                      <button
                        onClick={() => addField('checkbox')}
                        className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-indigo-600/30 border border-white/10 text-xs font-bold text-slate-200 flex items-center gap-1.5"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-amber-400" /> Checkbox
                      </button>
                    </div>
                  </div>
                </div>

                {/* Added Fields Manager List */}
                {fields.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-400 font-mono">Placed Fields ({fields.length})</span>
                    </div>

                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {fields.map((f, idx) => (
                        <div key={f.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between text-xs gap-3">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-lg bg-indigo-500/20 text-indigo-300 font-mono text-[10px] font-bold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="font-bold text-white capitalize">{f.type}</span>
                            <span className="text-slate-400 font-mono text-[10px]">Page {f.pageIndex + 1}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={f.value || ''}
                              onChange={(e) => updateFieldPos(f.id, 'value', e.target.value)}
                              placeholder="Value..."
                              className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 text-white font-bold text-xs w-32 focus:outline-none"
                            />
                            <button
                              onClick={() => removeField(f.id)}
                              className="p-1 text-rose-400 hover:bg-rose-500/20 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Audit Trail Option */}
                <div className="flex items-center justify-between p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Append e-Sign Audit Trail Certificate</h5>
                      <p className="text-[11px] text-slate-400">Adds UTC timestamp, document hash, and legal verification seal.</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={appendAuditTrail}
                    onChange={(e) => setAppendAuditTrail(e.target.checked)}
                    className="w-5 h-5 accent-emerald-500 cursor-pointer"
                  />
                </div>

                {/* Process Button */}
                <button
                  onClick={handleApplySignature}
                  disabled={isProcessing}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-black text-sm rounded-2xl shadow-xl flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <PenTool className="w-5 h-5" />}
                  <span>Stamp e-Signatures & Generate PDF</span>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: PDF Download & Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Signed PDF Output</span>
            </h2>

            {signedUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 text-center space-y-6 shadow-2xl backdrop-blur-2xl">
                <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
                  <Award className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-white text-base">Legally Binding Signed PDF Ready!</h4>
                  <p className="text-xs text-slate-400">Your PDF includes embedded signatures and audit trail certificate.</p>
                </div>
                <a
                  href={signedUrl}
                  download={`signed_${file?.name || 'document.pdf'}`}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Signed PDF</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <PenTool className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">e-Sign Preview</h4>
                <p className="text-xs text-slate-400">Upload your PDF contract on the left, add signature fields, and click Stamp e-Signatures.</p>
              </div>
            )}
          </div>
        </div>

        <SeoContentSection
          title="Legally Binding Electronic Signatures with 100% Client-Side Privacy"
          description="FitMyForm's iLoveSign PDF e-Sign suite allows businesses, real estate agents, legal teams, and individuals to e-sign agreements securely inside browser RAM. Electronic signatures comply with EU eIDAS, US ESIGN Act, and Indian IT Act 2000."
          faqs={[
            {
              question: 'Are e-signatures legally binding on FitMyForm?',
              answer: 'Yes. Electronic signatures created with FitMyForm meet Simple Electronic Signature (SES) standards under eIDAS (EU), ESIGN Act (US), and Information Technology Act 2000 (India).'
            },
            {
              question: 'Are my confidential contracts uploaded to any cloud server?',
              answer: 'No! All PDF modifications and signature embeddings are executed 100% locally inside your web browser using HTML5 Canvas and JavaScript WebAssembly.'
            }
          ]}
        />
      </main>

      <Footer />

      <SignaturePadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveSignature={(dataUrl) => setActiveSignatureUrl(dataUrl)}
      />
    </div>
  );
}
