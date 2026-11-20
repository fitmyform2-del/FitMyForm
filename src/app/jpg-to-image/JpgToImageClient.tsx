'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { Repeat, Download, RefreshCw, CheckCircle2, ArrowRight, Settings2, RotateCcw } from 'lucide-react';

export default function JpgToImageClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'webp'>('png');
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

  const convertJpgToFormat = () => {
    if (!uploadedFile) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const mimeType = targetFormat === 'png' ? 'image/png' : 'image/webp';

      canvas.toBlob((blob) => {
        if (blob) {
          if (convertedUrl) URL.revokeObjectURL(convertedUrl);
          setConvertedUrl(URL.createObjectURL(blob));
          setConvertedSizeKB(Number((blob.size / 1024).toFixed(1)));
        }
        setIsProcessing(false);
      }, mimeType, quality);
    };
    img.src = uploadedFile.previewUrl;
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Repeat className="w-3.5 h-3.5 text-cyan-400" />
            <span>Format Exporter</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Convert from <span className="text-cyan-400">JPG</span> Online
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300">
            Convert JPG images into transparent PNG, web-optimized WEBP, or GIF format in seconds.
          </p>
        </div>

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
          </div>
        ) : !convertedUrl ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Image Preview (7 cols) */}
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
                <span>Original Format: <strong className="text-slate-400 uppercase">JPG / JPEG</strong></span>
                <span>Original Size: <strong className="text-emerald-400 font-bold">{uploadedFile.originalSizeKB} KB</strong></span>
              </div>
            </div>

            {/* Target Options (5 cols) */}
            <div className="lg:col-span-5 fmf-panel p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-extrabold text-white text-sm">Target Format</h3>
                <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">Format Converter</span>
              </div>

              {/* Simple Format Choices */}
              <div className="grid grid-cols-2 gap-3">
                {(
                  [
                    { format: 'png', label: 'PNG', desc: 'Lossless crisp quality' },
                    { format: 'webp', label: 'WEBP', desc: 'Modern small web format' }
                  ] as const
                ).map((item) => (
                  <button
                    key={item.format}
                    type="button"
                    onClick={() => setTargetFormat(item.format)}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      targetFormat === item.format
                        ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                        : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="font-black text-sm uppercase">{item.label}</div>
                    <div className="text-[10px] text-slate-300/80 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>

              {/* Advanced Options Accordion */}
              <div className="border-t border-white/[0.08] pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="w-full flex items-center justify-between text-xs font-bold text-blue-400 hover:text-blue-300 py-1"
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
                        <span>Quality (WEBP)</span>
                        <span>{Math.round(quality * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0.5"
                        max="1"
                        step="0.05"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full accent-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={convertJpgToFormat}
                disabled={isProcessing}
                className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Converting Format...</span>
                  </>
                ) : (
                  <>
                    <Repeat className="w-4 h-4 text-cyan-300" />
                    <span>Convert to {targetFormat.toUpperCase()}</span>
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
              <span>Converted to {targetFormat.toUpperCase()} Successfully</span>
            </div>

            <div className="relative aspect-square max-h-72 mx-auto rounded-2xl bg-black/50 border border-emerald-500/40 flex items-center justify-center p-3">
              <img src={convertedUrl} alt="Converted Result" className="max-h-full max-w-full object-contain rounded-lg" />
            </div>

            <div className="flex justify-center gap-4 text-xs font-mono text-slate-300">
              <span>Original: <strong className="text-slate-400">{uploadedFile.originalSizeKB} KB</strong></span>
              <span>➔</span>
              <span>{targetFormat.toUpperCase()} Output: <strong className="text-emerald-400 font-bold">{convertedSizeKB} KB</strong></span>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={convertedUrl}
                download={`converted-${uploadedFile.name.replace(/\.[^/.]+$/, '')}.${targetFormat}`}
                className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5" />
                <span>Download {targetFormat.toUpperCase()} Image</span>
              </a>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setConvertedUrl(null)}
                  className="fmf-btn-secondary px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Change Format</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConvertedUrl(null);
                    setUploadedFile(null);
                  }}
                  className="fmf-btn-secondary px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Upload Another Image</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <SeoContentSection
          title="Convert JPG to PNG, WEBP & GIF Online Free"
          description="Convert JPG images to modern web formats like WEBP or lossless PNG without uploading files to any external server."
          faqs={[
            {
              question: 'Why convert JPG to PNG?',
              answer: 'PNG supports lossless compression, preserving text clarity and sharpness when editing graphics.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
