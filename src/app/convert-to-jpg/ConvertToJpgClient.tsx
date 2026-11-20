'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { FileImage, Download, RefreshCw, CheckCircle2, ArrowRight, Settings2, RotateCcw } from 'lucide-react';

export default function ConvertToJpgClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [quality, setQuality] = useState(0.92);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [convertedSizeKB, setConvertedSizeKB] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setConvertedUrl(null);
    setConvertedSizeKB(null);
  };

  const convertToJpg = () => {
    if (!uploadedFile) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (blob) {
          if (convertedUrl) URL.revokeObjectURL(convertedUrl);
          setConvertedUrl(URL.createObjectURL(blob));
          setConvertedSizeKB(Number((blob.size / 1024).toFixed(1)));
        }
        setIsProcessing(false);
      }, 'image/jpeg', quality);
    };
    img.src = uploadedFile.previewUrl;
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <FileImage className="w-3.5 h-3.5 text-amber-400" />
            <span>Format Conversion</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Convert to <span className="text-amber-400">JPG</span> Online
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300">
            Convert PNG, WEBP, GIF, or SVG images to JPG in seconds with adjustable quality and white background padding.
          </p>
        </div>

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
          </div>
        ) : !convertedUrl ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Image Preview Stage (7 cols) */}
            <div className="lg:col-span-7 fmf-panel p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Image Stage</span>
                <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold py-1 cursor-pointer">
                  Change Photo
                </button>
              </div>

              <div className="p-4 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center min-h-[340px] overflow-hidden">
                <img
                  src={uploadedFile.previewUrl}
                  alt="Source"
                  className="max-h-[380px] w-auto object-contain rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                <span>Original Format: <strong className="text-amber-400 uppercase font-bold">{uploadedFile.type.replace('image/', '')}</strong></span>
                <span>Original Size: <strong className="text-emerald-400 font-bold">{uploadedFile.originalSizeKB} KB</strong></span>
              </div>
            </div>

            {/* Conversion Settings (5 cols) */}
            <div className="lg:col-span-5 fmf-panel p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-extrabold text-white text-sm">JPG Options</h3>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">JPG Studio</span>
              </div>

              {/* Simple Quality Presets */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300">Conversion Quality</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Maximum', val: 0.95 },
                    { label: 'Recommended', val: 0.88 },
                    { label: 'Compact', val: 0.75 }
                  ].map((p) => (
                    <button
                      key={p.label}
                      type="button"
                      onClick={() => setQuality(p.val)}
                      className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                        quality === p.val
                          ? 'bg-amber-600 border-amber-400 text-white shadow-md'
                          : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Options Accordion */}
              <div className="border-t border-white/[0.08] pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-xs font-bold text-amber-400 hover:text-amber-300 py-1"
                >
                  <span className="flex items-center gap-1.5">
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Advanced options</span>
                  </span>
                  <span>{showAdvanced ? '▲' : '▼'}</span>
                </button>

                {showAdvanced && (
                  <div className="space-y-3 pt-3 text-xs animate-fade-in">
                    <div>
                      <div className="flex justify-between text-slate-300 font-bold mb-1">
                        <span>Quality Slider</span>
                        <span>{Math.round(quality * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="1"
                        step="0.05"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full accent-amber-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={convertToJpg}
                disabled={isProcessing}
                className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Converting to JPG...</span>
                  </>
                ) : (
                  <>
                    <FileImage className="w-4 h-4 text-amber-300" />
                    <span>Convert to JPG</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Result View */
          <div className="max-w-2xl mx-auto fmf-panel-elevated p-8 space-y-6 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Converted to JPG Successfully</span>
            </div>

            <div className="relative aspect-square max-h-72 mx-auto rounded-2xl bg-black/50 border border-emerald-500/40 flex items-center justify-center p-3">
              <img src={convertedUrl} alt="Converted JPG Result" className="max-h-full max-w-full object-contain rounded-lg" />
            </div>

            <div className="flex justify-center gap-4 text-xs font-mono text-slate-300">
              <span>Original: <strong className="text-slate-400">{uploadedFile.originalSizeKB} KB</strong></span>
              <span>➔</span>
              <span>JPG Output: <strong className="text-emerald-400 font-bold">{convertedSizeKB} KB</strong></span>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={convertedUrl}
                download={`converted-${uploadedFile.name.replace(/\.[^/.]+$/, '')}.jpg`}
                className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download JPG Image</span>
              </a>

              <button
                type="button"
                onClick={() => setConvertedUrl(null)}
                className="fmf-btn-secondary px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Convert Another Image</span>
              </button>
            </div>
          </div>
        )}

        <SeoContentSection
          title="Convert PNG, WEBP & HEIC to JPG for Exam Registration"
          description="Most government exam application portals only accept JPG/JPEG file formats. FitMyForm allows you to convert PNG, WEBP, and HEIC photos to JPG format instantly."
          faqs={[
            {
              question: 'Why does my portal require JPG format instead of PNG?',
              answer: 'JPG is a standard compressed image format supported universally by portal file validation systems.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
