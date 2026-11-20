'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { InteractiveCropper } from '@/components/editor/InteractiveCropper';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { PreUploadAuditCard } from '@/components/validation/PreUploadAuditCard';
import { UploadedFile, DocumentRequirements, ProcessingResult, CropRect } from '@/types/document';
import { SingleDocSpec } from '@/types/presets';
import { EXAM_PRESETS } from '@/config/presets';
import { loadImage, renderToCanvas } from '@/lib/image/resizer';
import { compressCanvasToTargetSize } from '@/lib/compression/iterativeCompressor';
import { saveRecentItem } from '@/lib/storage/sessionStore';
import { Sparkles, CheckCircle2, ShieldCheck, Layers, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LiveResizeStage } from './_components/LiveResizeStage';
import { ToolSpecsSidebar } from './_components/ToolSpecsSidebar';
import { ToolResultView } from './_components/ToolResultView';

export interface FocusedToolConfig {
  title: string;
  badge?: string;
  description: string;
  defaultRequirements: DocumentRequirements;
  /** When true (e.g. Image Compressor), adopt the uploaded image's original width & height to avoid cropping */
  preserveDimensionsOnUpload?: boolean;
  /** When true (e.g. Signature Resizer), expand advanced options by default */
  defaultShowAdvanced?: boolean;
  seoTitle: string;
  seoDescription: string;
  faqs?: { question: string; answer: string }[];
}

function specToRequirements(docSpec: SingleDocSpec, prev: DocumentRequirements): DocumentRequirements {
  const firstFormat = docSpec.format[0] || 'JPG';
  const isSig = docSpec.documentType === 'signature';
  return {
    ...prev,
    documentType: docSpec.documentType,
    width: docSpec.width ?? prev.width,
    height: docSpec.height ?? prev.height,
    minWidth: docSpec.minWidth,
    maxWidth: docSpec.maxWidth,
    minHeight: docSpec.minHeight,
    maxHeight: docSpec.maxHeight,
    format: firstFormat === 'JPEG' ? 'JPG' : firstFormat,
    minSizeKB: docSpec.minSizeKB,
    maxSizeKB: docSpec.maxSizeKB,
    dpi: docSpec.dpi,
    bgColor: docSpec.bgColor || '#FFFFFF',
    cropMode: isSig ? 'fit' : docSpec.defaultCropMode || 'fill'
  };
}

function FocusedToolInner({ config }: { config: FocusedToolConfig }) {
  const searchParams = useSearchParams();
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [requirements, setRequirements] = useState<DocumentRequirements>(config.defaultRequirements);
  const [activePresetInfo, setActivePresetInfo] = useState<{ label: string; notes?: string } | null>(null);
  const [cropRect, setCropRect] = useState<CropRect | undefined>(undefined);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const applyPresetSpec = useCallback((docSpec: SingleDocSpec, examName: string) => {
    setRequirements((prev) => specToRequirements(docSpec, prev));
    setActivePresetInfo({ label: `${examName} — ${docSpec.title}`, notes: docSpec.notes });
    setProcessingResult(null);
    setCropRect(undefined);
    setErrorMsg(null);
  }, []);

  // Read ?preset=<examId>&doc=<docKey> from URL when navigated from Presets / Navbar / Exam Showcase
  useEffect(() => {
    const presetId = searchParams.get('preset');
    const docKey = searchParams.get('doc') || 'photo';
    if (!presetId) return;

    const matchedExam = EXAM_PRESETS.find((e) => e.id === presetId);
    if (!matchedExam) return;

    const docSpec = matchedExam.documents[docKey] || Object.values(matchedExam.documents).find(Boolean);
    if (docSpec) {
      applyPresetSpec(docSpec, matchedExam.name);
    }
  }, [searchParams, applyPresetSpec]);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setProcessingResult(null);
    setCropRect(undefined);
    setErrorMsg(null);

    if (config.preserveDimensionsOnUpload && !activePresetInfo && file.width && file.height) {
      setRequirements((prev) => ({
        ...prev,
        width: file.width,
        height: file.height,
        cropMode: 'fit'
      }));
    }
  };

  const handleProcess = async (overrideReqs?: DocumentRequirements) => {
    if (!uploadedFile) return;
    const effectiveReqs = overrideReqs || requirements;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const sourceImg = await loadImage(uploadedFile.previewUrl);
      const canvas = renderToCanvas(sourceImg, effectiveReqs, cropRect);
      const result = await compressCanvasToTargetSize(canvas, effectiveReqs, uploadedFile.name);
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
      const msg = err instanceof Error ? err.message : 'Error processing document.';
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar onSelectPresetDoc={applyPresetSpec} />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          {config.badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{config.badge}</span>
            </div>
          )}
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            {activePresetInfo ? activePresetInfo.label : config.title}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            {activePresetInfo?.notes || config.description}
          </p>
        </div>

        {/* Active Exam Preset Banner */}
        {activePresetInfo && (
          <div className="max-w-3xl mx-auto bg-indigo-500/10 border border-indigo-500/30 rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs animate-fade-in">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <span className="font-bold text-white">Active Exam Preset: {activePresetInfo.label}</span>
                <span className="block sm:inline sm:ml-2 font-mono text-emerald-400">
                  {requirements.width}×{requirements.height} px • {requirements.minSizeKB}–{requirements.maxSizeKB} KB {requirements.format}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setActivePresetInfo(null);
                setRequirements(config.defaultRequirements);
              }}
              className="text-slate-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer font-semibold"
            >
              <X className="w-3.5 h-3.5" /> Reset Preset
            </button>
          </div>
        )}

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <DropzoneUpload
              uploadedFile={uploadedFile}
              onFileUpload={handleFileUpload}
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
                defaultLockAspect={Boolean(config.preserveDimensionsOnUpload && !activePresetInfo)}
                defaultShowAdvanced={Boolean(config.defaultShowAdvanced)}
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

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
          <div className="p-4 rounded-2xl fmf-card space-y-1">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Zero Server Uploads
            </span>
            <p className="text-slate-400 text-[11px]">All processing runs entirely in your browser memory.</p>
          </div>
          <div className="p-4 rounded-2xl fmf-card space-y-1">
            <span className="text-blue-400 font-bold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Exact Pixel Dimensions
            </span>
            <p className="text-slate-400 text-[11px]">Formatted to official portal specifications.</p>
          </div>
          <div className="p-4 rounded-2xl fmf-card space-y-1">
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

export function FocusedToolPage({ config }: { config: FocusedToolConfig }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0b0f19]" />}>
      <FocusedToolInner config={config} />
    </Suspense>
  );
}
