'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { FileImage, Download, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export default function ConvertToJpgClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [quality, setQuality] = useState(0.9);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setConvertedUrl(null);
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
        }
        setIsProcessing(false);
      }, 'image/jpeg', quality);
    };
    img.src = uploadedFile.previewUrl;
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <FileImage className="w-4 h-4 text-amber-400" />
            <span>Fast Format Converter</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Convert to <span className="gradient-text">JPG</span> Online
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Turn PNG, WEBP, GIF, HEIC, or SVG format images to JPG in bulk with crisp clarity and adjustable quality.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {!uploadedFile ? (
              <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
            ) : (
              <div className="space-y-6 bg-[#0d121e] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">JPG Output Settings</h3>
                  <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold">
                    Change Image
                  </button>
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>JPEG Quality</span>
                    <span>{Math.round(quality * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.05"
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-indigo-500"
                  />
                </div>

                <button
                  onClick={convertToJpg}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Converting to JPG...</span>
                    </>
                  ) : (
                    <>
                      <FileImage className="w-4 h-4" />
                      <span>Convert Image to JPG</span>
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
              <span>Converted JPG Result</span>
            </h2>

            {convertedUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
                <div className="p-2 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px]">
                  <img src={convertedUrl} alt="Converted JPG Result" className="max-h-[350px] w-auto object-contain rounded-lg" />
                </div>

                <a
                  href={convertedUrl}
                  download={`converted-${uploadedFile?.name.replace(/\.[^/.]+$/, '') || 'image'}.jpg`}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download JPG Image</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <FileImage className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">JPG Preview</h4>
                <p className="text-xs text-slate-400">Upload any PNG, WEBP, or GIF image to convert to JPG format.</p>
              </div>
            )}
          </div>
        </div>

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
