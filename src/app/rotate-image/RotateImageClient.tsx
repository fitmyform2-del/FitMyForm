'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { rotateAndFlipCanvas } from '@/lib/image/editorTools';
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Download, CheckCircle2, Settings2 } from 'lucide-react';

export default function RotateImageClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [angle, setAngle] = useState<number>(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [outputFormat, setOutputFormat] = useState<'image/jpeg' | 'image/png' | 'image/webp'>('image/jpeg');
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(null);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    applyTransformation(0, false, false, outputFormat, file);
  };

  const applyTransformation = (newAngle: number, newFlipH: boolean, newFlipV: boolean, fmt = outputFormat, targetFile?: UploadedFile) => {
    const file = targetFile || uploadedFile;
    if (!file) return;
    setAngle(newAngle);
    setFlipH(newFlipH);
    setFlipV(newFlipV);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = rotateAndFlipCanvas(img, newAngle, newFlipH, newFlipV);
      canvas.toBlob((blob) => {
        if (blob) {
          if (rotatedUrl) URL.revokeObjectURL(rotatedUrl);
          setRotatedUrl(URL.createObjectURL(blob));
        }
      }, fmt, 0.95);
    };
    img.src = file.previewUrl;
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <RotateCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Image Orientation</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Rotate <span className="text-blue-400">IMAGE</span> Online
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300">
            Rotate JPG, PNG, or WEBP photos 90° clockwise, counter-clockwise, or flip horizontally & vertically.
          </p>
        </div>

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Image Stage (7 cols) */}
            <div className="lg:col-span-7 fmf-panel p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Image Stage</span>
                <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold py-1 cursor-pointer">
                  Change Photo
                </button>
              </div>

              <div className="p-4 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center min-h-[340px] overflow-hidden">
                <img
                  src={rotatedUrl || uploadedFile.previewUrl}
                  alt="Rotated Preview"
                  className="max-h-[380px] w-auto object-contain rounded-lg transition-transform duration-300"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                <span>Current Angle: <strong className="text-blue-400 font-bold">{angle}°</strong></span>
                <span>Flipped: <strong className="text-emerald-400 font-bold">{flipH ? 'H ' : ''}{flipV ? 'V' : ''}{!flipH && !flipV ? 'None' : ''}</strong></span>
              </div>
            </div>

            {/* Rotation Controls Sidebar (5 cols) */}
            <div className="lg:col-span-5 fmf-panel p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-extrabold text-white text-sm">Rotation Options</h3>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Orientation Tool</span>
              </div>

              {/* 4 Big Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => applyTransformation((angle + 90) % 360, flipH, flipV)}
                  className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-white flex flex-col items-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCw className="w-6 h-6 text-blue-400" />
                  <span>Rotate Right 90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTransformation((angle + 270) % 360, flipH, flipV)}
                  className="p-4 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-white flex flex-col items-center gap-2 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-6 h-6 text-blue-400" />
                  <span>Rotate Left 90°</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTransformation(angle, !flipH, flipV)}
                  className={`p-4 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    flipH ? 'bg-blue-600/30 border-blue-400 text-white' : 'bg-white/[0.04] border-white/10 text-slate-200'
                  }`}
                >
                  <FlipHorizontal className="w-6 h-6 text-cyan-400" />
                  <span>Flip Horizontal</span>
                </button>
                <button
                  type="button"
                  onClick={() => applyTransformation(angle, flipH, !flipV)}
                  className={`p-4 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    flipV ? 'bg-blue-600/30 border-blue-400 text-white' : 'bg-white/[0.04] border-white/10 text-slate-200'
                  }`}
                >
                  <FlipVertical className="w-6 h-6 text-cyan-400" />
                  <span>Flip Vertical</span>
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
                    <label className="text-slate-400 font-bold uppercase text-[10px] block">Output Format</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'JPG', val: 'image/jpeg' },
                        { label: 'PNG', val: 'image/png' },
                        { label: 'WEBP', val: 'image/webp' }
                      ].map((fmt) => (
                        <button
                          key={fmt.label}
                          type="button"
                          onClick={() => {
                            setOutputFormat(fmt.val as any);
                            applyTransformation(angle, flipH, flipV, fmt.val as any);
                          }}
                          className={`py-1.5 rounded-lg border text-xs font-bold ${
                            outputFormat === fmt.val ? 'bg-blue-600 border-blue-400 text-white' : 'border-white/10 text-slate-400'
                          }`}
                        >
                          {fmt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Download Button */}
              {rotatedUrl ? (
                <a
                  href={rotatedUrl}
                  download={`rotated-${uploadedFile.name}`}
                  className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Rotated IMAGE</span>
                </a>
              ) : (
                <button
                  type="button"
                  onClick={() => applyTransformation(90, flipH, flipV)}
                  className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCw className="w-4 h-4" />
                  <span>Rotate 90° & Download</span>
                </button>
              )}
            </div>
          </div>
        )}

        <SeoContentSection
          title="Rotate & Flip Photos Online with High Resolution Output"
          description="Photos taken from mobile phones often upload sideways or upside down due to EXIF orientation. FitMyForm fixes orientation and flips images instantly with 100% browser privacy."
          faqs={[
            {
              question: 'Why did my photo upload sideways?',
              answer: 'Smartphones store camera angles in EXIF headers which some form websites ignore. Rotating and saving your image here fixes the orientation permanently.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
