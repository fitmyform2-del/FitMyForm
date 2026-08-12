'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { upscaleImageCanvas } from '@/lib/image/editorTools';
import { Sparkles, Download, RefreshCw, CheckCircle2, ArrowRight, Layers } from 'lucide-react';

export default function UpscaleImageClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [scaleFactor, setScaleFactor] = useState<2 | 4>(2);
  const [sharpen, setSharpen] = useState<number>(0.3);
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
      setOriginalDimensions({ w: img.width, h: img.height });
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
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>HD Image Resolution Upscaler</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Upscale <span className="gradient-text">IMAGE</span> Online
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Enlarge your photos and graphics 2x or 4x with bicubic canvas interpolation and edge sharpening for maximum visual clarity.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {!uploadedFile ? (
              <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
            ) : (
              <div className="space-y-6 bg-[#0d121e] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">Upscale Scale Factor Settings</h3>
                  <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold">
                    Change Image
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setScaleFactor(2)}
                    className={`py-4 rounded-2xl border text-center transition-all ${
                      scaleFactor === 2
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl'
                        : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="text-2xl font-black">2x Scale</div>
                    <div className="text-xs text-indigo-200 font-bold mt-1">Double Resolution (200%)</div>
                  </button>
                  <button
                    onClick={() => setScaleFactor(4)}
                    className={`py-4 rounded-2xl border text-center transition-all ${
                      scaleFactor === 4
                        ? 'bg-indigo-600 text-white border-indigo-400 shadow-xl'
                        : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                    }`}
                  >
                    <div className="text-2xl font-black">4x Scale</div>
                    <div className="text-xs text-indigo-200 font-bold mt-1">Quadruple HD (400%)</div>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Edge Sharpening Filter</span>
                    <span>{Math.round(sharpen * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="0.8"
                    step="0.1"
                    value={sharpen}
                    onChange={(e) => setSharpen(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <button
                  onClick={processUpscale}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-600 hover:from-emerald-400 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing HD Upscaling...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Upscale Photo Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>HD Upscaled Result</span>
            </h2>

            {upscaledUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Original Resolution</span>
                    <span className="font-mono font-bold text-slate-400">{originalDimensions?.w} × {originalDimensions?.h} px</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Upscaled Resolution</span>
                    <span className="font-mono">{upscaledDimensions?.w} × {upscaledDimensions?.h} px</span>
                  </div>
                </div>

                <div className="p-2 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px]">
                  <img src={upscaledUrl} alt="Upscaled Result" className="max-h-[350px] w-auto object-contain rounded-lg" />
                </div>

                <a
                  href={upscaledUrl}
                  download={`upscaled-${scaleFactor}x-${uploadedFile?.name || 'photo.jpg'}`}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download High-Res Image</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <Layers className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">Upscale Preview</h4>
                <p className="text-xs text-slate-400">Upload your image on the left and click Upscale Photo Now to increase pixel resolution.</p>
              </div>
            )}
          </div>
        </div>

        <SeoContentSection
          title="Enlarge Low Resolution Photos without Pixelation"
          description="FitMyForm's image upscaler uses client-side canvas bicubic sampling and edge sharpening algorithms to scale low-resolution images 2x or 4x."
          faqs={[
            {
              question: 'How does 4x upscaling work?',
              answer: 'It multiplies image width and height by 4 (increasing total pixel count 16x) and applies bicubic smoothing to prevent blocky artifacts.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
