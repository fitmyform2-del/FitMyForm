'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Package,
  ArrowRight,
  FileText,
  CheckCircle2,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { InteractiveCropper } from '@/components/editor/InteractiveCropper';
import { PreUploadAuditCard } from '@/components/validation/PreUploadAuditCard';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { LiveResizeStage } from '@/components/tool/_components/LiveResizeStage';
import { ToolSpecsSidebar } from '@/components/tool/_components/ToolSpecsSidebar';
import { ToolResultView } from '@/components/tool/_components/ToolResultView';
import { ExamPreset, SingleDocSpec } from '@/types/presets';
import { UploadedFile, DocumentRequirements, ProcessingResult, CropRect } from '@/types/document';
import { loadImage, renderToCanvas } from '@/lib/image/resizer';
import { compressCanvasToTargetSize } from '@/lib/compression/iterativeCompressor';
import { saveRecentItem } from '@/lib/storage/sessionStore';

function docSpecToReqs(spec: SingleDocSpec): DocumentRequirements {
  const firstFmt = spec.format[0] || 'JPG';
  const isSig = spec.documentType === 'signature';
  return {
    documentType: spec.documentType,
    width: spec.width || 200,
    height: spec.height || 230,
    minWidth: spec.minWidth,
    maxWidth: spec.maxWidth,
    minHeight: spec.minHeight,
    maxHeight: spec.maxHeight,
    format: firstFmt === 'JPEG' ? 'JPG' : firstFmt,
    minSizeKB: spec.minSizeKB,
    maxSizeKB: spec.maxSizeKB,
    dpi: spec.dpi || 200,
    bgColor: spec.bgColor || '#FFFFFF',
    cropMode: isSig ? 'fit' : spec.defaultCropMode || 'fill',
    signatureFilter: isSig
      ? { enabled: true, whitenBackground: true, inkBoost: true, threshold: 175 }
      : undefined
  };
}

export default function ExamPresetClient({ exam }: { exam: ExamPreset }) {
  const docEntries = Object.entries(exam.documents).filter(
    (entry): entry is [string, SingleDocSpec] => Boolean(entry[1])
  );
  const defaultEntry = docEntries[0];

  const [activeDocKey, setActiveDocKey] = useState<string>(defaultEntry[0]);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [requirements, setRequirements] = useState<DocumentRequirements>(() =>
    docSpecToReqs(defaultEntry[1])
  );
  const [cropRect, setCropRect] = useState<CropRect | undefined>(undefined);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeDocSpec = exam.documents[activeDocKey] || defaultEntry[1];
  const isPdfOnly = activeDocSpec.format.length === 1 && activeDocSpec.format[0] === 'PDF';

  const handleSwitchTab = (key: string, spec: SingleDocSpec) => {
    setActiveDocKey(key);
    setRequirements(docSpecToReqs(spec));
    setCropRect(undefined);
    setProcessingResult(null);
    setErrorMsg(null);
  };

  const handleProcess = async (overrideReqs?: DocumentRequirements) => {
    if (!uploadedFile) return;
    const effectiveReqs = overrideReqs || requirements;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const sourceImg = await loadImage(uploadedFile.previewUrl);
      const canvas = renderToCanvas(sourceImg, effectiveReqs, cropRect);
      const result = await compressCanvasToTargetSize(
        canvas,
        effectiveReqs,
        `${exam.id}-${activeDocKey}`
      );
      if (processingResult?.previewUrl) {
        URL.revokeObjectURL(processingResult.previewUrl);
      }
      setProcessingResult(result);
      saveRecentItem({
        fileName: result.fileName,
        documentType: effectiveReqs.documentType,
        originalSizeKB: uploadedFile.originalSizeKB,
        processedSizeKB: result.fileSizeKB,
        format: result.format,
        dimensions: `${result.width} × ${result.height} px`
      });
      if (result.isValid) {
        try {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Error formatting document.');
    } finally {
      setIsProcessing(false);
    }
  };

  const faqs = [
    {
      question: `What are the official ${exam.name} photo & signature specifications?`,
      answer: docEntries
        .map(
          ([, d]) =>
            `${d.title}: ${d.width && d.height ? `${d.width}×${d.height} px, ` : ''}${d.minSizeKB}–${d.maxSizeKB} KB (${d.format.join('/')})`
        )
        .join(' | ')
    },
    {
      question: `Can I format all ${exam.name} documents together in one ZIP?`,
      answer: `Yes! Click "Open All-in-One Exam Kit" above to upload your ${exam.name} photo, signature, and supporting documents side by side and export a ready-to-upload ZIP bundle.`
    },
    {
      question: `Is my ${exam.name} photo uploaded to any external server?`,
      answer: 'No. FitMyForm processes every image and PDF 100% client-side inside your web browser using HTML5 Canvas. Your personal photos and signatures never leave your device.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Hero */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{exam.organization} • Verified 2025–2026 Specs</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {exam.name} Resizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {exam.description}
          </p>
        </div>

        {/* Batch Exam Kit Callout */}
        {docEntries.length > 1 && (
          <div className="fmf-panel p-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-indigo-500/30 bg-indigo-950/15">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="text-xs sm:text-sm font-bold text-white">
                  Need to upload all {docEntries.length} {exam.name.split('(')[0].trim()} documents together?
                </div>
                <p className="text-[11px] text-slate-400">
                  Format Photo, Signature & supporting files side-by-side and export one verified ZIP.
                </p>
              </div>
            </div>
            <Link
              href={`/exam-kit?exam=${encodeURIComponent(exam.id)}`}
              className="shrink-0 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <span>Open All-in-One Exam Kit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}

        {/* Document Type Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {docEntries.map(([key, spec]) => {
            const active = activeDocKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleSwitchTab(key, spec)}
                className={`px-4 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  active
                    ? 'bg-blue-600/20 border-blue-400 text-white shadow-md shadow-blue-600/15'
                    : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.07]'
                }`}
              >
                <div className="text-xs font-bold">{spec.title}</div>
                <div className="text-[10px] font-mono text-emerald-400 mt-0.5">
                  {spec.width && spec.height ? `${spec.width}×${spec.height} px • ` : ''}
                  {spec.minSizeKB}–{spec.maxSizeKB} KB {spec.format[0]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Workspace */}
        {isPdfOnly ? (
          <div className="fmf-panel-elevated p-8 text-center space-y-4 max-w-2xl mx-auto">
            <FileText className="w-12 h-12 text-rose-400 mx-auto" />
            <h2 className="text-xl font-black text-white">{activeDocSpec.title}</h2>
            <p className="text-xs sm:text-sm text-slate-300">
              {activeDocSpec.notes || `This portal requires a PDF between ${activeDocSpec.minSizeKB} KB and ${activeDocSpec.maxSizeKB} KB.`}
            </p>
            <Link
              href={`/pdf-tools/compress?targetKB=${activeDocSpec.maxSizeKB}&preset=${encodeURIComponent(exam.id)}&doc=${encodeURIComponent(activeDocKey)}`}
              className="fmf-btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm font-bold"
            >
              <span>Open in PDF Compressor ({activeDocSpec.maxSizeKB} KB)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : !uploadedFile ? (
          <div className="max-w-2xl mx-auto space-y-3">
            {activeDocSpec.notes && (
              <div className="px-4 py-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200 text-center">
                <strong>Portal Rule:</strong> {activeDocSpec.notes}
              </div>
            )}
            <DropzoneUpload
              uploadedFile={uploadedFile}
              onFileUpload={(file) => {
                setUploadedFile(file);
                setProcessingResult(null);
                setCropRect(undefined);
                setErrorMsg(null);
              }}
              onClearFile={() => setUploadedFile(null)}
              allowPdf={false}
            />
          </div>
        ) : !processingResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 space-y-4">
              <LiveResizeStage
                uploadedFile={uploadedFile}
                requirements={requirements}
                cropRect={cropRect}
                onRequirementsChange={setRequirements}
                onCropChange={(rect) => {
                  setCropRect(rect);
                  if (!rect && requirements.cropMode === 'manual') {
                    setRequirements((prev) => ({ ...prev, cropMode: 'fill' }));
                  }
                }}
                onModeSwitchToManual={() => setRequirements((prev) => ({ ...prev, cropMode: 'manual' }))}
                onOpenFullCropper={() => setIsCropperOpen(true)}
                onChangePhoto={() => {
                  setUploadedFile(null);
                  setCropRect(undefined);
                  setProcessingResult(null);
                }}
              />
              <PreUploadAuditCard uploadedFile={uploadedFile} requirements={requirements} />
            </div>

            <div className="lg:col-span-5">
              <ToolSpecsSidebar
                requirements={requirements}
                isProcessing={isProcessing}
                errorMsg={errorMsg}
                sourceAspectRatio={uploadedFile.aspectRatio}
                originalWidth={uploadedFile.width}
                originalHeight={uploadedFile.height}
                defaultShowAdvanced={activeDocSpec.documentType === 'signature'}
                onRequirementsChange={setRequirements}
                onProcess={handleProcess}
              />
            </div>
          </div>
        ) : (
          <ToolResultView
            uploadedFile={uploadedFile}
            requirements={requirements}
            processingResult={processingResult}
            onBackToAdjust={() => setProcessingResult(null)}
            onOptimizeAgain={() => handleProcess()}
            onReset={() => {
              if (processingResult.previewUrl) URL.revokeObjectURL(processingResult.previewUrl);
              setUploadedFile(null);
              setProcessingResult(null);
              setCropRect(undefined);
            }}
          />
        )}

        {/* Official Specification Summary Table */}
        <section className="fmf-panel p-5 sm:p-6 space-y-4">
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Official {exam.name} Document Specifications</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                  <th className="py-2.5 pr-4">Document</th>
                  <th className="py-2.5 pr-4">Dimensions</th>
                  <th className="py-2.5 pr-4">File Size</th>
                  <th className="py-2.5 pr-4">Format</th>
                  <th className="py-2.5">Portal Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {docEntries.map(([key, spec]) => (
                  <tr key={key} className="hover:bg-white/[0.02]">
                    <td className="py-3 pr-4 font-bold text-white whitespace-nowrap">{spec.title}</td>
                    <td className="py-3 pr-4 font-mono text-blue-300 whitespace-nowrap">
                      {spec.width && spec.height ? `${spec.width} × ${spec.height} px` : 'Flexible'}
                    </td>
                    <td className="py-3 pr-4 font-mono text-emerald-400 whitespace-nowrap">
                      {spec.minSizeKB}–{spec.maxSizeKB} KB
                    </td>
                    <td className="py-3 pr-4 font-mono text-slate-200 whitespace-nowrap">
                      {spec.format.join(', ')}
                    </td>
                    <td className="py-3 text-slate-400">{spec.notes || 'Standard portal guidelines'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Privacy Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
          <div className="p-4 rounded-2xl fmf-card space-y-1">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> 100% Browser Private
            </span>
            <p className="text-slate-400 text-[11px]">Zero server uploads — processed in local browser memory.</p>
          </div>
          <div className="p-4 rounded-2xl fmf-card space-y-1">
            <span className="text-blue-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Verified Portal Rules
            </span>
            <p className="text-slate-400 text-[11px]">Pre-calibrated for {exam.organization} specifications.</p>
          </div>
          <div className="p-4 rounded-2xl fmf-card space-y-1">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> White BG & Auto-Trim
            </span>
            <p className="text-slate-400 text-[11px]">Instant white backdrop and signature ink trimming built in.</p>
          </div>
        </div>

        <SeoContentSection
          title={`${exam.name} Photo & Signature Guidelines`}
          description={`Complete formatting tool and official document guidelines for ${exam.name} (${exam.organization}). ${exam.description}`}
          faqs={faqs}
        />
      </main>

      <Footer />

      {uploadedFile && isCropperOpen && (
        <InteractiveCropper
          isOpen={isCropperOpen}
          uploadedFile={uploadedFile}
          requirements={requirements}
          initialCrop={cropRect}
          onClose={() => setIsCropperOpen(false)}
          onApplyCrop={(rect) => {
            setCropRect(rect);
            setRequirements((prev) => ({ ...prev, cropMode: 'manual' }));
          }}
        />
      )}
    </div>
  );
}
