'use client';

import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { Crop, Download, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';
import { CropControls } from './_components/CropControls';

export default function CropImageClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [cropBox, setCropBox] = useState({ x: 10, y: 10, width: 80, height: 80 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedResultUrl, setCroppedResultUrl] = useState<string | null>(null);
  const [croppedDimensions, setCroppedDimensions] = useState<{ width: number; height: number } | null>(null);

  const imgRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setCroppedResultUrl(null);
    setCroppedDimensions(null);
  };

  const handleAspectChange = (ratio: number | null) => {
    setAspectRatio(ratio);
    if (ratio !== null) {
      const newHeight = Math.min(90, cropBox.width / ratio);
      setCropBox((prev) => ({ ...prev, height: newHeight }));
    }
  };

  const executeCrop = () => {
    if (!uploadedFile || !imgRef.current) return;
    setIsProcessing(true);

    const img = imgRef.current;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;

    const actualX = (cropBox.x / 100) * img.naturalWidth;
    const actualY = (cropBox.y / 100) * img.naturalHeight;
    const actualW = (cropBox.width / 100) * img.naturalWidth;
    const actualH = (cropBox.height / 100) * img.naturalHeight;

    canvas.width = actualW;
    canvas.height = actualH;

    ctx.drawImage(
      img,
      actualX, actualY, actualW, actualH,
      0, 0, actualW, actualH
    );

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        setCroppedResultUrl(url);
        setCroppedDimensions({ width: Math.round(actualW), height: Math.round(actualH) });
      }
      setIsProcessing(false);
    }, uploadedFile.file.type || 'image/jpeg', 0.95);
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Header Title */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Crop className="w-4 h-4 text-indigo-400" />
            <span>Client-Side Visual Cropper</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Crop <span className="gradient-text">IMAGE</span> Online
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Crop JPG, PNG, WEBP, or GIF images with ease. Select pre-set aspect ratios (1:1, 16:9, 4:3) or crop custom pixel bounds with 100% privacy.
          </p>
        </div>

        {/* Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Upload & Crop Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {!uploadedFile ? (
              <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
            ) : (
              <div className="space-y-6 bg-[#0d121e] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crop className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-extrabold text-white text-sm">Visual Image Cropper Workspace</h3>
                  </div>
                  <button
                    onClick={() => {
                      setUploadedFile(null);
                      setCroppedResultUrl(null);
                    }}
                    className="text-xs text-rose-400 hover:underline font-bold min-h-[44px]"
                  >
                    Change Photo
                  </button>
                </div>

                <CropControls
                  aspectRatio={aspectRatio}
                  cropBox={cropBox}
                  onAspectChange={handleAspectChange}
                  onCropBoxChange={setCropBox}
                />

                {/* Visual Image Preview Container */}
                <div className="relative overflow-hidden rounded-2xl bg-black/40 border border-white/10 p-2 flex items-center justify-center min-h-[300px] select-none">
                  <img
                    ref={imgRef}
                    src={uploadedFile.previewUrl}
                    alt="Source Crop"
                    className="max-h-[450px] w-auto object-contain rounded-lg"
                  />
                </div>

                {/* Action CTA */}
                <button
                  onClick={executeCrop}
                  disabled={isProcessing}
                  className="w-full py-4 min-h-[48px] rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Cropping Image...</span>
                    </>
                  ) : (
                    <>
                      <Crop className="w-4 h-4" />
                      <span>Crop Selected Region</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Download & Output (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cropped Output Result</span>
            </h2>

            {croppedResultUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl animate-fade-in">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>Cropped Dimensions</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {croppedDimensions?.width} × {croppedDimensions?.height} px
                    </span>
                  </div>
                  <div className="p-2 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center min-h-[220px]">
                    <img src={croppedResultUrl} alt="Cropped Result" className="max-h-[300px] w-auto object-contain rounded-lg" />
                  </div>
                </div>

                <a
                  href={croppedResultUrl}
                  download={`cropped-${uploadedFile?.name || 'image.jpg'}`}
                  className="w-full py-4 min-h-[48px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Cropped Image</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <Crop className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">No Cropped Image Yet</h4>
                <p className="text-xs text-slate-400">Upload your photo on the left, adjust aspect ratio or crop box, then click Crop Selected Region.</p>
              </div>
            )}
          </div>
        </div>

        <SeoContentSection
          title="Free Online Visual Image Cropper"
          description="Crop your images visually directly in your browser. Maintain aspect ratio locks for passport photos, social media stories, or custom application form specs with zero server upload."
          faqs={[
            {
              question: 'How do I crop an image to 1:1 square for Instagram or profile photo?',
              answer: 'Select the 1:1 Square aspect ratio preset, adjust crop box bounds, and click Crop Selected Region.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
