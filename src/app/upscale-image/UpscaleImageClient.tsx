'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { upscaleImageCanvas } from '@/lib/image/editorTools';
import { Sparkles, Download, RefreshCw, CheckCircle2, ArrowRight, Settings2 } from 'lucide-react';

export default function UpscaleImageClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [scaleFactor, setScaleFactor] = useState<2 | 4>(2);
  const [sharpen, setSharpen] = useState<number>(0.3);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [upscaledUrl, setUpscaledUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalDimensions, setOriginalDimensions] = useState<{ w: number; h: number } | null>(null);
  const [upscaledDimensions, setUpscaledDimensions] = useState<{ w: number; h: number } | null>(null);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setUpscaledUrl(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setOriginalDimensions({ w: img.naturalWidth || img.width, h: img.naturalHeight || img.height });
    };
    img.src = file.previewUrl;
  };

  const processUpscale = async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = uploadedFile.previewUrl;
      });

      const canvas = upscaleImageCanvas(img, scaleFactor, sharpen);
      setUpscaledDimensions({ w: canvas.width, h: canvas.height });

      canvas.toBlob((blob) => {
        if (blob) {
          if (upscaledUrl) URL.revokeObjectURL(upscaledUrl);
          setUpscaledUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/jpeg', 0.95);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Upscaler</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Upscale <span className="text-blue-400">IMAGE</span> Online
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300">
            Enlarge low-resolution images 2x or 4x with bicubic interpolation and edge sharpening.
          </p>
        </div>

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Image Preview Stage (7 cols) */}
            <div className="lg:col-span-7 fmf-panel p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Image Stage</span>
                <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold py-1 cursor-pointer">
                  Change Image
                </button>
              </div>

              <div className="p-4 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center min-h-[340px] overflow-hidden">
                <img
                  src={upscaledUrl || uploadedFile.previewUrl}
                  alt="Preview"
                  className="max-h-[380px] w-auto object-contain rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                <span>Original: <strong className="text-slate-400">{originalDimensions?.w} × {originalDimensions?.h} px</strong></span>
                <span>Upscaled Target: <strong className="text-blue-400 font-bold">{(originalDimensions?.w || 0) * scaleFactor} × {(originalDimensions?.h || 0) * scaleFactor} px</strong></span>
              </div>
            </div>

            {/* Upscale Options Sidebar (5 cols) */}
            <div className="lg:col-span-5 fmf-panel p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-extrabold text-white text-sm">Upscale Multiplier</h3>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">AI Upscale</span>
              </div>

              {/* Simple Mode: 2x or 4x Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setScaleFactor(2)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    scaleFactor === 2
                      ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg'
                      : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="font-black text-2xl text-blue-400">2×</div>
                  <div className="text-xs font-bold mt-1">High Definition</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Double Dimensions</div>
                </button>

                <button
                  type="button"
                  onClick={() => setScaleFactor(4)}
                  className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                    scaleFactor === 4
                      ? 'bg-blue-600/30 border-blue-400 text-white shadow-lg'
                      : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                  }`}
                >
                  <div className="font-black text-2xl text-purple-400">4×</div>
                  <div className="text-xs font-bold mt-1">Ultra HD 4K</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Quadruple Dimensions</div>
                </button>
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
                  <div className="space-y-2 pt-3 text-xs animate-fade-in">
                    <div className="flex justify-between text-slate-300 font-bold mb-1">
                      <span>Edge Sharpening Intensity</span>
                      <span>{Math.round(sharpen * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={sharpen}
                      onChange={(e) => setSharpen(Number(e.target.value))}
                      className="w-full accent-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Action Button */}
              {!upscaledUrl ? (
                <button
                  type="button"
                  onClick={processUpscale}
                  disabled={isProcessing}
                  className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Upscaling Image...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>Upscale IMAGE</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              ) : (
                <a
                  href={upscaledUrl}
                  download={`upscaled-${scaleFactor}x-${uploadedFile.name}`}
                  className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Upscaled ({upscaledDimensions?.w}×{upscaledDimensions?.h} px)</span>
                </a>
              )}
            </div>
          </div>
        )}

        <SeoContentSection
          title="Enlarge Photos with High Resolution Detail"
          description="Enlarge low resolution scans or photos without pixelation using client-side bicubic interpolation and edge convolution."
          faqs={[
            {
              question: 'Will upscaling a photo make it clearer for form verification?',
              answer: 'Yes! Upscaling enlarges pixel dimensions and sharpens edges, preventing rejection due to low resolution.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
