'use client';

import React, { useState, useCallback } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { HeroSection } from '@/components/hero/HeroSection';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { RequirementsForm } from '@/components/editor/RequirementsForm';
import { InteractiveCropper } from '@/components/editor/InteractiveCropper';
import { ImageComparisonPreview } from '@/components/preview/ImageComparisonPreview';
import { ValidationChecklist } from '@/components/validation/ValidationChecklist';
import { RecentDocuments } from '@/components/dashboard/RecentDocuments';
import { SeoContentSection } from '@/components/seo/SeoContentSection';

import {
  UploadedFile,
  DocumentRequirements,
  ProcessingResult,
  CropRect
} from '@/types/document';
import { EXAM_PRESETS } from '@/config/presets';
import { loadImage, renderToCanvas } from '@/lib/image/resizer';
import { compressCanvasToTargetSize } from '@/lib/compression/iterativeCompressor';
import { processPdfFile } from '@/lib/pdf/pdfProcessor';
import { saveRecentItem } from '@/lib/storage/sessionStore';
import { PresetSelectorModal } from '@/components/presets/PresetSelectorModal';

import { Sparkles, ArrowRight, RefreshCw, CheckCircle2, SlidersHorizontal, AlertCircle } from 'lucide-react';

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
      if (doc) {
        handleApplyPreset(doc, preset.name);
      }
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
        const result = await compressCanvasToTargetSize(
          canvas,
          requirements,
          uploadedFile.name
        );
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
      console.error('Processing error:', err);
      setErrorMsg(err.message || 'An error occurred during document processing.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar onSelectPresetDoc={(doc, examName) => handleApplyPreset(doc, examName)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
        {/* Hero Banner */}
        <HeroSection
          onOpenPresetModal={() => setIsPresetModalOpen(true)}
          onQuickPresetSelect={handleQuickPresetSelect}
        />

        {/* Main Processing Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload & Specifications (7 Cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Step 1: Upload Document */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-900 border border-blue-700 flex items-center justify-center text-xs text-white">1</span>
                Upload Source File
              </h2>
              <DropzoneUpload
                uploadedFile={uploadedFile}
                onFileUpload={handleFileUpload}
                onClearFile={handleClearFile}
              />
            </div>

            {/* Step 2: Requirements & Specifications Form */}
            <div className="space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-900 border border-blue-700 flex items-center justify-center text-xs text-white">2</span>
                Form Specifications
              </h2>
              <RequirementsForm
                requirements={requirements}
                onChange={(reqs) => setRequirements(reqs)}
                onOpenManualCropper={() => setIsCropperOpen(true)}
                presetNotice={presetNotice}
              />
            </div>

            {/* Process Action Button */}
            <button
              onClick={handleProcessDocument}
              disabled={!uploadedFile || isProcessing}
              className={`w-full py-4 rounded-2xl font-extrabold text-base flex items-center justify-center gap-2.5 transition-all shadow-xl ${
                !uploadedFile
                  ? 'bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-800'
                  : isProcessing
                  ? 'bg-blue-700 text-white cursor-wait animate-pulse'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 hover:from-blue-500 hover:to-emerald-400 text-white shadow-blue-600/30 transform hover:scale-[1.01]'
              }`}
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Processing & Precision Compressing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>Process & Format Document Now</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-4 bg-red-950/80 border border-red-800 rounded-xl text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Right Column: Live Result & Preview (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-900 border border-emerald-700 flex items-center justify-center text-xs text-white">3</span>
              Live Result & Verification
            </h2>

            {processingResult && uploadedFile ? (
              <div className="space-y-6 animate-fade-in">
                {/* Result Comparison */}
                <ImageComparisonPreview
                  uploadedFile={uploadedFile}
                  processingResult={processingResult}
                  onOptimizeAgain={handleProcessDocument}
                />

                {/* Pre-Download Compliance Verification Checklist */}
                <ValidationChecklist
                  result={processingResult}
                  requirements={requirements}
                  onOptimizeAgain={handleProcessDocument}
                />
              </div>
            ) : (
              <div className="bg-gray-900/50 border border-gray-800 border-dashed rounded-2xl p-10 text-center text-gray-500 space-y-3">
                <div className="w-12 h-12 rounded-xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto text-gray-400">
                  <SlidersHorizontal className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-gray-300 text-sm">Preview Will Appear Here</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Upload your document on the left, adjust specifications, and click <strong>Process & Format Document Now</strong>.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Local History Section */}
        <RecentDocuments />

        {/* Educational SEO & FAQ Section */}
        <SeoContentSection
          title="Student Guide: Resizing Photos & Documents for Government Forms"
          description="Filing online application forms for SSC CGL, UPSC, IBPS, RRB Railway, CTET, or state competitive exams requires strict adherence to photo size, pixel dimensions, and JPG format limits. FitMyForm is a 100% free, browser-based tool built specifically for Indian students to format documents securely without third-party server uploads."
          faqs={[
            {
              question: 'Is it safe to upload sensitive documents like Aadhaar card, photo, and signature on FitMyForm?',
              answer: 'Yes, 100% safe. FitMyForm processes all images and PDFs entirely inside your web browser using client-side JavaScript HTML5 Canvas and Blob APIs. Your files are never sent or stored on any server.'
            },
            {
              question: 'How do I resize a passport photo to 200 x 230 pixels and 20–50 KB for SSC?',
              answer: 'Simply click "SSC Passport Photo" preset or select Width: 200 px, Height: 230 px, Min KB: 20, Max KB: 50, Format: JPG. Upload your photo and click Process. FitMyForm will iteratively adjust quality to ensure your file falls exactly within 20 to 50 KB.'
            },
            {
              question: 'Why does my signature image get rejected on online portals?',
              answer: 'Online portals reject signatures if they exceed KB limits (usually max 20 KB), have wrong aspect ratio (standard is 140x60 px), or contain colored background clutter. FitMyForm automatically trims borders and pads white background.'
            },
            {
              question: 'Does FitMyForm work on mobile phones?',
              answer: 'Yes! FitMyForm works on all Android and iOS smartphones. You can take a photo directly from your camera or select an image from gallery.'
            }
          ]}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Visual Cropper Modal */}
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

      {/* Exam Presets Search Modal */}
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
