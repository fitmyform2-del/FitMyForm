'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { rotateAndFlipCanvas } from '@/lib/image/editorTools';
import { Crop, Download, CheckCircle2, RotateCcw, Upload } from 'lucide-react';
import { CropStage } from './_components/CropStage';
import { CropSidebar } from './_components/CropSidebar';
import { CropBox } from './_components/cropMath';

export default function CropImageClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [workingUrl, setWorkingUrl] = useState<string | null>(null);
  const [naturalDim, setNaturalDim] = useState({ width: 0, height: 0 });
  const [cropBox, setCropBox] = useState<CropBox>({ x: 0, y: 0, width: 300, height: 300 });
  const [aspectRatio, setAspectRatio] = useState<number | null>(null);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [quality, setQuality] = useState(0.92);
  const [exportWidth, setExportWidth] = useState<number | null>(null);
  const [exportHeight, setExportHeight] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [croppedResult, setCroppedResult] = useState<{ url: string; width: number; height: number; sizeKB: number } | null>(null);

  const activeImageUrl = workingUrl || uploadedFile?.previewUrl || '';

  const handleImageLoaded = (dim: { width: number; height: number }) => {
    setNaturalDim(dim);
    const w = Math.round(dim.width * 0.85);
    const h = aspectRatio ? Math.min(dim.height, Math.round(w / aspectRatio)) : Math.round(dim.height * 0.85);
    const finalW = aspectRatio ? Math.min(dim.width, Math.round(h * aspectRatio)) : w;
    setCropBox({
      width: Math.max(30, finalW),
      height: Math.max(30, h),
      x: Math.max(0, Math.round((dim.width - finalW) / 2)),
      y: Math.max(0, Math.round((dim.height - h) / 2))
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
    setCropBox({ x, y, width: Math.max(30, w), height: Math.max(30, h) });
  };

  const handleCenterCrop = () => {
    if (naturalDim.width === 0) return;
    setCropBox((prev) => ({
      ...prev,
      x: Math.max(0, Math.round((naturalDim.width - prev.width) / 2)),
      y: Math.max(0, Math.round((naturalDim.height - prev.height) / 2))
    }));
  };

  const handleSelectFull = () => {
    if (naturalDim.width === 0) return;
    if (!aspectRatio) {
      setCropBox({ x: 0, y: 0, width: naturalDim.width, height: naturalDim.height });
      return;
    }
    let w = naturalDim.width;
    let h = Math.round(w / aspectRatio);
    if (h > naturalDim.height) {
      h = naturalDim.height;
      w = Math.round(h * aspectRatio);
    }
    setCropBox({
      x: Math.round((naturalDim.width - w) / 2),
      y: Math.round((naturalDim.height - h) / 2),
      width: w,
      height: h
    });
  };

  const transformWorkingImage = (angle: number, flipH: boolean, flipV: boolean) => {
    if (!activeImageUrl) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = rotateAndFlipCanvas(img, (angle + 360) % 360, flipH, flipV);
      canvas.toBlob((blob) => {
        if (!blob) return;
        setWorkingUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return URL.createObjectURL(blob);
        });
      }, 'image/png');
    };
    img.src = activeImageUrl;
  };

  const executeCrop = () => {
    if (!uploadedFile || !activeImageUrl || naturalDim.width === 0) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const outW = exportWidth && exportWidth >= 10 ? exportWidth : cropBox.width;
      const outH = exportHeight && exportHeight >= 10 ? exportHeight : cropBox.height;

      const canvas = document.createElement('canvas');
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      if (outputFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, outW, outH);
      }
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      ctx.drawImage(img, cropBox.x, cropBox.y, cropBox.width, cropBox.height, 0, 0, outW, outH);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            if (croppedResult?.url) URL.revokeObjectURL(croppedResult.url);
            setCroppedResult({
              url: URL.createObjectURL(blob),
              width: outW,
              height: outH,
              sizeKB: Number((blob.size / 1024).toFixed(1))
            });
          }
          setIsProcessing(false);
        },
        outputFormat,
        quality
      );
    };
    img.src = activeImageUrl;
  };

  const outExt = outputFormat === 'image/png' ? 'png' : outputFormat === 'image/webp' ? 'webp' : 'jpg';

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Crop className="w-3.5 h-3.5 text-blue-400" />
            <span>Studio Visual Cropper</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Crop <span className="text-blue-400">IMAGE</span> Online
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300">
            Precision visual cropper with Passport & Signature aspect ratios, face alignment guide, rotation, and optional pixel resize.
          </p>
        </div>

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <DropzoneUpload
              uploadedFile={uploadedFile}
              onFileUpload={(f) => {
                setUploadedFile(f);
                setWorkingUrl(null);
                setCroppedResult(null);
              }}
              onClearFile={() => {
                setUploadedFile(null);
                setWorkingUrl(null);
                setCroppedResult(null);
              }}
            />
          </div>
        ) : !croppedResult ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7">
              <CropStage
                imageUrl={activeImageUrl}
                cropBox={cropBox}
                aspectRatio={aspectRatio}
                naturalWidth={naturalDim.width}
                naturalHeight={naturalDim.height}
                onCropBoxChange={setCropBox}
                onImageLoaded={handleImageLoaded}
                onRotate={(delta) => transformWorkingImage(delta, false, false)}
                onFlip={(axis) => transformWorkingImage(0, axis === 'h', axis === 'v')}
                onCenterCrop={handleCenterCrop}
                onSelectFull={handleSelectFull}
                onChangeImage={() => {
                  setUploadedFile(null);
                  setWorkingUrl(null);
                  setCroppedResult(null);
                }}
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
                exportWidth={exportWidth}
                exportHeight={exportHeight}
                isProcessing={isProcessing}
                onAspectChange={handleAspectChange}
                onCropBoxChange={setCropBox}
                onOutputFormatChange={setOutputFormat}
                onQualityChange={setQuality}
                onExportDimChange={(w, h) => {
                  setExportWidth(w);
                  setExportHeight(h);
                }}
                onExecuteCrop={executeCrop}
              />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto fmf-panel-elevated p-6 sm:p-8 space-y-6 text-center animate-fade-in">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>Image Cropped Successfully</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
              <div className="rounded-2xl bg-black/40 border border-white/10 p-3.5 space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase">
                  <span>Original</span>
                  <span className="font-mono text-slate-300">{uploadedFile.originalSizeKB} KB</span>
                </div>
                <div className="aspect-square max-h-52 rounded-xl bg-[#080b11] border border-white/10 flex items-center justify-center p-2 overflow-hidden">
                  <img src={uploadedFile.previewUrl} alt="Original" className="max-h-full max-w-full object-contain rounded" />
                </div>
                <div className="text-[11px] font-mono text-slate-400 text-center">
                  {uploadedFile.width} × {uploadedFile.height} px
                </div>
              </div>

              <div className="rounded-2xl bg-black/40 border-2 border-emerald-500/40 p-3.5 space-y-2">
                <div className="flex justify-between text-[11px] font-bold text-emerald-400 uppercase">
                  <span>Cropped Output</span>
                  <span className="font-mono text-emerald-300">{croppedResult.sizeKB} KB</span>
                </div>
                <div className="aspect-square max-h-52 rounded-xl checkerboard-bg border border-white/10 flex items-center justify-center p-2 overflow-hidden">
                  <img src={croppedResult.url} alt="Cropped Result" className="max-h-full max-w-full object-contain rounded shadow-md" />
                </div>
                <div className="text-[11px] font-mono text-blue-300 text-center font-bold">
                  {croppedResult.width} × {croppedResult.height} px • {outExt.toUpperCase()}
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={croppedResult.url}
                download={`cropped-${uploadedFile.name.replace(/\.[^/.]+$/, '')}.${outExt}`}
                className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/30"
              >
                <Download className="w-5 h-5" />
                <span>Download Cropped {outExt.toUpperCase()} ({croppedResult.width}×{croppedResult.height} px)</span>
              </a>

              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setCroppedResult(null)}
                  className="fmf-btn-secondary px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Adjust Crop</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCroppedResult(null);
                    setWorkingUrl(null);
                    setUploadedFile(null);
                  }}
                  className="fmf-btn-secondary px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Another Image</span>
                </button>
              </div>
            </div>
          </div>
        )}

        <SeoContentSection
          title="Free Online Visual Image Cropper"
          description="Crop your images visually directly in your browser. Maintain aspect ratio locks for passport photos, signatures, social media, or custom pixel dimensions with zero server upload."
          faqs={[
            {
              question: 'How do I crop an image visually?',
              answer: 'Drag the frame or pull the corner brackets and edge handles directly over your photo. Use Rotate/Flip or the Passport Face Guide in the bottom toolbar for exact framing.'
            },
            {
              question: 'Can I crop and resize to exact exam pixels at the same time?',
              answer: 'Yes! Enable "Resize output to exact pixels" in the inspector sidebar to export your cropped area at exact dimensions like 200×230 px or 140×60 px.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
