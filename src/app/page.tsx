'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { HeroSection } from '@/components/hero/HeroSection';
import { InteractiveCropper } from '@/components/editor/InteractiveCropper';
import { RecentDocuments } from '@/components/dashboard/RecentDocuments';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { PresetSelectorModal } from '@/components/presets/PresetSelectorModal';
import { HomeToolGrid } from '@/components/home/HomeToolGrid';
import { HomeExamWorkspace } from '@/components/home/HomeExamWorkspace';
import { EXAM_PRESETS } from '@/config/presets';
import { UploadedFile, DocumentRequirements, ProcessingResult, CropRect } from '@/types/document';
import { loadImage, renderToCanvas } from '@/lib/image/resizer';
import { compressCanvasToTargetSize } from '@/lib/compression/iterativeCompressor';
import { processPdfFile } from '@/lib/pdf/pdfProcessor';
import { saveRecentItem } from '@/lib/storage/sessionStore';
import { Sparkles, Search, RefreshCw, UploadCloud } from 'lucide-react';

export default function HomePage() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [requirements, setRequirements] = useState<DocumentRequirements>({
    documentType: 'photo',
    width: 200,
    height: 230,
    format: 'JPG',
    minSizeKB: 20,
    maxSizeKB: 50,
    bgColor: '#FFFFFF',
    cropMode: 'fill'
  });

  const [presetNotice, setPresetNotice] = useState<string | null>(null);
  const [cropRect, setCropRect] = useState<CropRect | undefined>(undefined);
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingResult, setProcessingResult] = useState<ProcessingResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setProcessingResult(null);
    setErrorMsg(null);
  };

  const handleClearFile = () => {
    setUploadedFile(null);
    setProcessingResult(null);
    setCropRect(undefined);
    setErrorMsg(null);
  };

  const handleApplyPreset = (docSpec: any, examName: string) => {
    setRequirements({
      documentType: docSpec.documentType || 'photo',
      width: docSpec.width || 200,
      height: docSpec.height || 230,
      minWidth: docSpec.minWidth,
      maxWidth: docSpec.maxWidth,
      minHeight: docSpec.minHeight,
      maxHeight: docSpec.maxHeight,
      format: docSpec.format[0] || 'JPG',
      minSizeKB: docSpec.minSizeKB || 20,
      maxSizeKB: docSpec.maxSizeKB || 50,
      dpi: docSpec.dpi || 200,
      bgColor: docSpec.bgColor || '#FFFFFF',
      cropMode: docSpec.defaultCropMode || 'fill'
    });
    setPresetNotice(`${examName} - ${docSpec.title}`);
  };

  const handleQuickPresetSelect = (presetId: string) => {
    const preset = EXAM_PRESETS.find((p) => p.id === presetId);
    if (preset) {
      const doc = preset.documents.photo || preset.documents.signature || Object.values(preset.documents)[0];
      if (doc) handleApplyPreset(doc, preset.name);
    }
  };

  const handleProcessDocument = async () => {
    if (!uploadedFile) {
      setErrorMsg('Please upload a photo or document first.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    try {
      if (uploadedFile.isPdf || requirements.format === 'PDF') {
        const result = await processPdfFile(uploadedFile.file, requirements);
        setProcessingResult(result);
        saveRecentItem({
          fileName: result.fileName,
          documentType: requirements.documentType,
          originalSizeKB: uploadedFile.originalSizeKB,
          processedSizeKB: result.fileSizeKB,
          format: result.format,
          dimensions: 'PDF Doc'
        });
      } else {
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
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during document processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white overflow-x-hidden">
      <Navbar onSelectPresetDoc={(doc, examName) => handleApplyPreset(doc, examName)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-12 sm:space-y-16 pb-28 md:pb-6">
        <HeroSection
          onOpenPresetModal={() => setIsPresetModalOpen(true)}
          onQuickPresetSelect={handleQuickPresetSelect}
        />

        <HomeToolGrid />

        <HomeExamWorkspace
          uploadedFile={uploadedFile}
          requirements={requirements}
          presetNotice={presetNotice}
          isProcessing={isProcessing}
          processingResult={processingResult}
          errorMsg={errorMsg}
          onFileUpload={handleFileUpload}
          onClearFile={handleClearFile}
          onRequirementsChange={setRequirements}
          onOpenManualCropper={() => setIsCropperOpen(true)}
          onProcessDocument={handleProcessDocument}
        />

        <RecentDocuments />

        <SeoContentSection
          title="Complete Image Editing & Exam Document Formatting Guide"
          description="FitMyForm is an all-in-one free web application providing all features of iLoveIMG alongside specialized exam document resizers. Compress images to KB limits, crop photos visually, convert formats (PNG, WEBP, JPG), upscale low resolution photos, watermark sensitive documents, remove backgrounds, generate memes, and blur faces with 100% browser privacy."
          faqs={[
            {
              question: 'Are all iLoveIMG features completely free on FitMyForm?',
              answer: 'Yes, 100% free with unlimited usage. You can compress, resize, crop, rotate, watermark, upscale, remove background, generate memes, convert formats, and edit photos without paying or registering.'
            },
            {
              question: 'Are my images uploaded to external servers?',
              answer: 'No! All processing happens directly inside your web browser using HTML5 Canvas APIs. Your files never leave your computer or phone.'
            },
            {
              question: 'How do I resize a passport photo to 200 x 230 px and 20–50 KB for SSC exams?',
              answer: 'Use the SSC Passport Photo preset or select Width: 200 px, Height: 230 px, Min size: 20 KB, Max size: 50 KB, Format: JPG. Click Process & Format Document Now for an instant result.'
            }
          ]}
        />
      </main>

      {/* Mobile Floating Action Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 md:hidden w-[90%] max-w-[400px] bg-slate-800 p-2 rounded-2xl shadow-xl flex items-center justify-between gap-2 border border-slate-700">
        <button
          onClick={() => setIsPresetModalOpen(true)}
          className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Search className="w-4 h-4 text-indigo-400" />
          <span>Exams</span>
        </button>

        <button
          onClick={handleProcessDocument}
          disabled={!uploadedFile || isProcessing}
          className={`flex-[1.5] py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all ${
            !uploadedFile
              ? 'bg-slate-700 text-slate-400 border border-slate-600 cursor-not-allowed'
              : isProcessing
              ? 'bg-indigo-600 opacity-80 text-white cursor-wait'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white'
          }`}
        >
          {isProcessing ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : uploadedFile ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Format Now</span>
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              <span>Select Photo</span>
            </>
          )}
        </button>
      </div>

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

      <PresetSelectorModal
        isOpen={isPresetModalOpen}
        onClose={() => setIsPresetModalOpen(false)}
        onSelectRequirement={(docSpec, exam) => {
          handleApplyPreset(docSpec, exam.name);
          setIsPresetModalOpen(false);
        }}
      />
    </div>
  );
}
