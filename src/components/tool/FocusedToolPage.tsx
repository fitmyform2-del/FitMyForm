'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { InteractiveCropper } from '@/components/editor/InteractiveCropper';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile, DocumentRequirements, ProcessingResult, CropRect } from '@/types/document';
import { loadImage, renderToCanvas } from '@/lib/image/resizer';
import { compressCanvasToTargetSize } from '@/lib/compression/iterativeCompressor';
import { saveRecentItem } from '@/lib/storage/sessionStore';
import { Sparkles, CheckCircle2, ShieldCheck, Crop } from 'lucide-react';
import confetti from 'canvas-confetti';
import { ToolSpecsSidebar } from './_components/ToolSpecsSidebar';
import { ToolResultView } from './_components/ToolResultView';

export interface FocusedToolConfig {
  title: string;
  badge?: string;
  description: string;
  defaultRequirements: DocumentRequirements;
  seoTitle: string;
  seoDescription: string;
  faqs?: { question: string; answer: string }[];
}

export function FocusedToolPage({ config }: { config: FocusedToolConfig }) {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [requirements, setRequirements] = useState<DocumentRequirements>(config.defaultRequirements);
  const [cropRect, setCropRect] = useState<CropRect | undefined>(undefined);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const sourceImg = await loadImage(uploadedFile.previewUrl);
      const canvas = renderToCanvas(sourceImg, requirements, cropRect);
      const result = await compressCanvasToTargetSize(canvas, requirements, uploadedFile.name);
      setProcessingResult(result);
      saveRecentItem({
        fileName: result.fileName,
        documentType: requirements.documentType,
        originalSizeKB: uploadedFile.originalSizeKB,
        processedSizeKB: result.fileSizeKB,
        format: result.format,
        dimensions: `${result.width} × ${result.height} px`
      });
      try {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      } catch {}
    } catch (err: any) {
      setErrorMsg(err.message || 'Error processing document.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          {config.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{config.badge}</span>
            </div>
          )}
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {config.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            {config.description}
          </p>
        </div>

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto glass-panel-elevated rounded-3xl p-6 sm:p-10 shadow-2xl">
            <DropzoneUpload
              uploadedFile={uploadedFile}
              onFileUpload={(file) => {
                setUploadedFile(file);
                setProcessingResult(null);
                setErrorMsg(null);
              }}
              onClearFile={() => setUploadedFile(null)}
            />
          </div>
        ) : !processingResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-6 glass-panel rounded-3xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Source Document</span>
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-xs text-rose-400 hover:underline font-bold touch-target py-1 cursor-pointer"
                >
                  Change Photo
                </button>
              </div>

              <div className="relative aspect-square max-h-72 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center p-3 overflow-hidden">
                <img src={uploadedFile.previewUrl} alt="Source" className="max-h-full max-w-full object-contain rounded-lg" />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 font-mono pt-1">
                <span>Size: <strong className="text-emerald-400">{uploadedFile.originalSizeKB} KB</strong></span>
                <span>Dimensions: <strong className="text-indigo-300">{uploadedFile.width}×{uploadedFile.height} px</strong></span>
              </div>

              <button
                type="button"
                onClick={() => setIsCropperOpen(true)}
                className="w-full touch-target py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <Crop className="w-4 h-4 text-indigo-400" />
                <span>Visual Crop & Position ✂️</span>
              </button>
            </div>

            <div className="lg:col-span-6">
              <ToolSpecsSidebar
                requirements={requirements}
                isProcessing={isProcessing}
                errorMsg={errorMsg}
                onRequirementsChange={setRequirements}
                onProcess={handleProcess}
              />
            </div>
          </div>
        ) : (
          <ToolResultView
            processingResult={processingResult}
            onReset={() => {
              setUploadedFile(null);
              setProcessingResult(null);
            }}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="p-4 rounded-2xl glass-panel space-y-1">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Zero Server Uploads
            </span>
            <p className="text-slate-400 text-[11px]">All processing runs entirely in your browser memory.</p>
          </div>
          <div className="p-4 rounded-2xl glass-panel space-y-1">
            <span className="text-indigo-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Exact Pixel Dimensions
            </span>
            <p className="text-slate-400 text-[11px]">Formatted to official portal specifications.</p>
          </div>
          <div className="p-4 rounded-2xl glass-panel space-y-1">
            <span className="text-amber-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" /> KB Size Guaranteed
            </span>
            <p className="text-slate-400 text-[11px]">Iterative compression meets strict portal KB bounds.</p>
          </div>
        </div>

        {config.faqs && config.faqs.length > 0 && (
          <SeoContentSection
            title={`${config.title} Guide & FAQs`}
            description={config.seoDescription}
            faqs={config.faqs}
          />
        )}
      </main>

      <Footer />

      {uploadedFile && isCropperOpen && (
        <InteractiveCropper
          isOpen={isCropperOpen}
          uploadedFile={uploadedFile}
          requirements={requirements}
          onClose={() => setIsCropperOpen(false)}
          onApplyCrop={(rect) => {
            setCropRect(rect);
            setRequirements({ ...requirements, cropMode: 'manual' });
          }}
        />
      )}
    </div>
  );
}
