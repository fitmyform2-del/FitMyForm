'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
import { PresetSelectorModal } from '@/components/presets/PresetSelectorModal';

import { IMAGE_TOOLS, TOOL_CATEGORIES } from '@/config/imageToolsConfig';
import { EXAM_PRESETS } from '@/config/presets';
import {
  UploadedFile,
  DocumentRequirements,
  ProcessingResult,
  CropRect
} from '@/types/document';

import { loadImage, renderToCanvas } from '@/lib/image/resizer';
import { compressCanvasToTargetSize } from '@/lib/compression/iterativeCompressor';
import { processPdfFile } from '@/lib/pdf/pdfProcessor';
import { saveRecentItem } from '@/lib/storage/sessionStore';

import {
  Sparkles,
  ArrowRight,
  RefreshCw,
  SlidersHorizontal,
  AlertCircle,
  CheckCircle2,
  Search,
  Minimize2,
  Maximize2,
  Crop,
  FileImage,
  Repeat,
  Wand2,
  Eraser,
  Shield,
  Smile,
  RotateCw,
  Code,
  EyeOff,
  Image as ImageIcon
} from 'lucide-react';

export default function HomePage() {
  // Tool Grid State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Exam Form Workspace State
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

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Minimize2': return <Minimize2 className="w-6 h-6 text-emerald-400" />;
      case 'Maximize2': return <Maximize2 className="w-6 h-6 text-cyan-400" />;
      case 'Crop': return <Crop className="w-6 h-6 text-indigo-400" />;
      case 'FileImage': return <FileImage className="w-6 h-6 text-amber-400" />;
      case 'Repeat': return <Repeat className="w-6 h-6 text-cyan-400" />;
      case 'Wand2': return <Wand2 className="w-6 h-6 text-pink-400" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-emerald-400" />;
      case 'Eraser': return <Eraser className="w-6 h-6 text-indigo-400" />;
      case 'Shield': return <Shield className="w-6 h-6 text-blue-400" />;
      case 'Smile': return <Smile className="w-6 h-6 text-amber-400" />;
      case 'RotateCw': return <RotateCw className="w-6 h-6 text-cyan-400" />;
      case 'Code': return <Code className="w-6 h-6 text-purple-400" />;
      case 'EyeOff': return <EyeOff className="w-6 h-6 text-rose-400" />;
      default: return <ImageIcon className="w-6 h-6 text-indigo-400" />;
    }
  };

  const filteredTools = IMAGE_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

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
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      {/* Top Navigation Header */}
      <Navbar onSelectPresetDoc={(doc, examName) => handleApplyPreset(doc, examName)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16">
        {/* Hero Section */}
        <HeroSection
          onOpenPresetModal={() => setIsPresetModalOpen(true)}
          onQuickPresetSelect={handleQuickPresetSelect}
        />

        {/* --- iLoveIMG Feature Tools Grid Section --- */}
        <section className="space-y-8 pt-4">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Complete iLoveIMG Feature Suite</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Every Tool You Need to <span className="gradient-text">Edit Images</span> Online
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              100% free, browser-based image editor and converter suite. Modify photos instantly with zero server uploads and zero quality loss.
            </p>
          </div>

          {/* Filter Bar & Search Input */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#0d121e] border border-white/10 p-3 rounded-2xl shadow-xl">
            {/* Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {TOOL_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                      : 'bg-white/[0.03] hover:bg-white/[0.08] text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Instant Search Bar */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tools (crop, bg, watermark...)"
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Tools Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredTools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.route}
                className="group relative bg-[#0d121e] hover:bg-[#121827] border border-white/10 hover:border-indigo-500/50 p-5 rounded-3xl transition-all duration-300 shadow-xl hover:shadow-2xl flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                      {getToolIcon(tool.iconName)}
                    </div>
                    {tool.badge && (
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                      <span>{tool.name}</span>
                      <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="capitalize font-semibold text-slate-400">{tool.category}</span>
                  <span className="text-indigo-400 font-bold group-hover:underline">Open Tool →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* --- Exam & Student Form Specification Resizer Workspace --- */}
        <section className="space-y-8 pt-8 border-t border-white/10">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Exam Photo & Document Specification Workspace
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Format passport photos & signatures to exact KB limits and pixel dimensions for SSC, UPSC, IBPS, RRB, CTET forms.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Upload & Specifications (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Step 1: Upload Source Document */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs text-indigo-300 font-mono font-bold shadow-sm">
                      1
                    </span>
                    <span>Upload Source Document File</span>
                  </h2>
                  {uploadedFile && (
                    <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> File Selected
                    </span>
                  )}
                </div>
                <DropzoneUpload
                  uploadedFile={uploadedFile}
                  onFileUpload={handleFileUpload}
                  onClearFile={handleClearFile}
                />
              </div>

              {/* Step 2: Form Specifications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-xs text-indigo-300 font-mono font-bold shadow-sm">
                      2
                    </span>
                    <span>Form Specifications & Exam Requirements</span>
                  </h2>
                </div>
                <RequirementsForm
                  requirements={requirements}
                  onChange={(reqs) => setRequirements(reqs)}
                  onOpenManualCropper={() => setIsCropperOpen(true)}
                  presetNotice={presetNotice}
                />
              </div>

              {/* Process Action CTA Button */}
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 rounded-3xl blur-md opacity-70 group-hover:opacity-100 transition duration-300 pointer-events-none" />
                <button
                  onClick={handleProcessDocument}
                  disabled={!uploadedFile || isProcessing}
                  className={`relative w-full py-4 sm:py-5 rounded-3xl font-black text-base flex items-center justify-center gap-3 transition-all shadow-2xl ${
                    !uploadedFile
                      ? 'bg-[#0d121e] text-slate-500 cursor-not-allowed border border-white/10 opacity-70'
                      : isProcessing
                      ? 'bg-indigo-700 text-white cursor-wait animate-pulse'
                      : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer'
                  }`}
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Processing Canvas & Compress Engine...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 text-amber-300" />
                      <span>Process & Format Document Now</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

              {errorMsg && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Right Column: Live Output & Verification (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-xs text-emerald-300 font-mono font-bold shadow-sm">
                  3
                </span>
                <span>Live Verification & Download</span>
              </h2>

              {processingResult && uploadedFile ? (
                <div className="space-y-6 animate-fade-in">
                  <ImageComparisonPreview
                    uploadedFile={uploadedFile}
                    processingResult={processingResult}
                    onOptimizeAgain={handleProcessDocument}
                  />
                  <ValidationChecklist
                    result={processingResult}
                    requirements={requirements}
                    onOptimizeAgain={handleProcessDocument}
                  />
                </div>
              ) : (
                <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-4 shadow-xl backdrop-blur-2xl">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto text-indigo-400 shadow-inner">
                    <SlidersHorizontal className="w-7 h-7" />
                  </div>
                  <h4 className="font-extrabold text-white text-base">Live Preview Will Appear Here</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
                    Upload your document on the left, adjust specifications or pick an exam preset, and click <strong className="text-indigo-400">Process & Format Document Now</strong>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Local History Drawer */}
        <RecentDocuments />

        {/* Educational SEO & FAQ Section */}
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
