'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { Crop, Download, CheckCircle2, RotateCcw } from 'lucide-react';
import { CropStage } from './_components/CropStage';
import { CropSidebar } from './_components/CropSidebar';
import { CropBox } from './_components/cropMath';

export default function CropImageClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [naturalDim, setNaturalDim] = useState({ width: 0, height: 0 });
  const [cropBox, setCropBox] = useState<CropBox>({ x: 0, y: 0, width: 300, height: 300 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState(0.95);
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedResultUrl, setCroppedResultUrl] = useState<string | null>(null);
  const [resultDim, setResultDim] = useState<{ width: number; height: number } | null>(null);

  const handleImageLoaded = (dim: { width: number; height: number }) => {
    setNaturalDim(dim);
    const w = Math.round(dim.width * 0.85);
    const h = Math.round(dim.height * 0.85);
    setCropBox({
      width: w,
      height: h,
      x: Math.round((dim.width - w) / 2),
      y: Math.round((dim.height - h) / 2),
    });
  };

  const handleAspectChange = (ratio: number | null) => {
    setAspectRatio(ratio);
    if (!ratio || naturalDim.width === 0) return;
    let w = Math.min(cropBox.width, naturalDim.width);
    let h = Math.round(w / ratio);
    if (h > naturalDim.height) {
      h = Math.round(naturalDim.height * 0.9);
      w = Math.round(h * ratio);
    }
    const x = Math.max(0, Math.round((naturalDim.width - w) / 2));
    const y = Math.max(0, Math.round((naturalDim.height - h) / 2));
    setCropBox({ x, y, width: w, height: h });
  };

  const handleCenterCrop = () => {
    if (naturalDim.width === 0) return;
    const x = Math.max(0, Math.round((naturalDim.width - cropBox.width) / 2));
    const y = Math.max(0, Math.round((naturalDim.height - cropBox.height) / 2));
    setCropBox((prev) => ({ ...prev, x, y }));
  };

  const executeCrop = () => {
    if (!uploadedFile || naturalDim.width === 0) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = uploadedFile.previewUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      canvas.width = cropBox.width;
      canvas.height = cropBox.height;

      ctx.drawImage(
        img,
        cropBox.x, cropBox.y, cropBox.width, cropBox.height,
        0, 0, cropBox.width, cropBox.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCroppedResultUrl(URL.createObjectURL(blob));
            setResultDim({ width: cropBox.width, height: cropBox.height });
          }
          setIsProcessing(false);
        },
        outputFormat,
        quality
      );
    };
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Crop className="w-3.5 h-3.5 text-blue-400" />
            <span>Visual Cropper</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Crop <span className="text-blue-400">IMAGE</span> Online
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300">
            Drag to crop JPG, PNG, or WEBP images with preset aspect ratios (1:1, 16:9, Passport 3.5:4.5) with 100% browser privacy.
          </p>
        </div>

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <DropzoneUpload
              uploadedFile={uploadedFile}
              onFileUpload={(f) => {
                setUploadedFile(f);
                setCroppedResultUrl(null);
              }}
              onClearFile={() => setUploadedFile(null)}
            />
          </div>
        ) : !croppedResultUrl ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 fmf-panel p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Image Stage</span>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="text-xs text-rose-400 hover:underline font-bold py-1 cursor-pointer"
                >
                  Change Image
                </button>
              </div>

              <CropStage
                imageUrl={uploadedFile.previewUrl}
                cropBox={cropBox}
                aspectRatio={aspectRatio}
                naturalWidth={naturalDim.width}
                naturalHeight={naturalDim.height}
                onCropBoxChange={setCropBox}
                onImageLoaded={handleImageLoaded}
              />
            </div>

            <div className="lg:col-span-5">
              <CropSidebar
                aspectRatio={aspectRatio}
                cropBox={cropBox}
                naturalWidth={naturalDim.width}
                naturalHeight={naturalDim.height}
                outputFormat={outputFormat}
                quality={quality}
                isProcessing={isProcessing}
                onAspectChange={handleAspectChange}
                onCropBoxChange={setCropBox}
                onOutputFormatChange={setOutputFormat}
                onQualityChange={setQuality}
                onCenterCrop={handleCenterCrop}
                onExecuteCrop={executeCrop}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto fmf-panel-elevated p-8 space-y-6 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Image Cropped Successfully</span>
            </div>
            <div className="relative aspect-square max-h-72 mx-auto rounded-2xl bg-black/50 border border-emerald-500/40 flex items-center justify-center p-3">
              <img src={croppedResultUrl} alt="Cropped Result" className="max-h-full max-w-full object-contain rounded-lg" />
            </div>
            <p className="text-xs font-mono text-slate-300">
              New Dimensions: <strong className="text-emerald-400 font-bold">{resultDim?.width} × {resultDim?.height} px</strong>
            </p>
            <div className="space-y-3 pt-2">
              <a
                href={croppedResultUrl}
                download={`cropped-${uploadedFile?.name || 'image.jpg'}`}
                className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <Download className="w-5 h-5" />
                <span>Download Cropped IMAGE</span>
              </a>
              <button
                type="button"
                onClick={() => setCroppedResultUrl(null)}
                className="fmf-btn-secondary px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Crop Again / Adjust</span>
              </button>
            </div>
          </div>
        )}

        <SeoContentSection
          title="Free Online Visual Image Cropper"
          description="Crop your images visually directly in your browser. Maintain aspect ratio locks for passport photos or custom specs with zero server upload."
          faqs={[
            {
              question: 'How do I crop an image visually?',
              answer: 'Drag the blue crop box directly over your image or resize it using the corner and edge handles. You can also specify exact pixel dimensions in the sidebar.'
            },
            {
              question: 'How do I lock aspect ratios for passport or square photos?',
              answer: 'Click the 1:1 Square or Passport (3.5:4.5) preset in the sidebar. The crop handles will automatically scale proportionally.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
