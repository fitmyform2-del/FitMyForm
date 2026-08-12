'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { Repeat, Download, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export default function JpgToImageClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [targetFormat, setTargetFormat] = useState<'png' | 'webp' | 'gif'>('png');
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setConvertedUrl(null);
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

      const mimeType = targetFormat === 'png' ? 'image/png' : targetFormat === 'webp' ? 'image/webp' : 'image/gif';

      canvas.toBlob((blob) => {
        if (blob) {
          if (convertedUrl) URL.revokeObjectURL(convertedUrl);
          setConvertedUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, mimeType, 0.95);
    };
    img.src = uploadedFile.previewUrl;
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Repeat className="w-4 h-4 text-cyan-400" />
            <span>Format Exporter</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Convert from <span className="gradient-text">JPG</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Convert JPG images to PNG, WEBP, or GIF format in seconds with 100% browser privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {!uploadedFile ? (
              <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
            ) : (
              <div className="space-y-6 bg-[#0d121e] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">Target Export Format</h3>
                  <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold">
                    Change Image
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { format: 'png', label: 'PNG Image', desc: 'High Quality Lossless' },
                    { format: 'webp', label: 'WEBP Format', desc: 'Modern Web Optimized' },
                    { format: 'gif', label: 'GIF Image', desc: 'Graphics Interchange' }
                  ].map((item) => (
                    <button
                      key={item.format}
                      onClick={() => setTargetFormat(item.format as any)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        targetFormat === item.format
                          ? 'bg-indigo-600 text-white border-indigo-400 shadow-lg'
                          : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                      }`}
                    >
                      <div className="font-black text-sm uppercase">{item.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                    </button>
                  ))}
                </div>

                <button
                  onClick={convertJpgToFormat}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Converting Format...</span>
                    </>
                  ) : (
                    <>
                      <Repeat className="w-4 h-4" />
                      <span>Convert JPG to {targetFormat.toUpperCase()}</span>
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
              <span>Converted Output</span>
            </h2>

            {convertedUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
                <div className="p-2 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px]">
                  <img src={convertedUrl} alt="Converted Result" className="max-h-[350px] w-auto object-contain rounded-lg" />
                </div>

                <a
                  href={convertedUrl}
                  download={`converted-${uploadedFile?.name.replace(/\.[^/.]+$/, '') || 'image'}.${targetFormat}`}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download {targetFormat.toUpperCase()} Image</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <Repeat className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">Export Preview</h4>
                <p className="text-xs text-slate-400">Upload your JPG photo and select PNG, WEBP, or GIF to convert.</p>
              </div>
            )}
          </div>
        </div>

        <SeoContentSection
          title="Convert JPG Photos to Modern WEBP & Lossless PNG"
          description="FitMyForm's image converter lets you quickly export JPG photos to transparent PNG, high-efficiency WEBP, or GIF images."
          faqs={[
            {
              question: 'Why convert JPG to WEBP?',
              answer: 'WEBP offers up to 30% smaller file size than JPG with identical image quality, making web pages load faster.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
