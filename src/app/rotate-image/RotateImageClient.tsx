'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { rotateAndFlipCanvas } from '@/lib/image/editorTools';
import { RotateCw, RotateCcw, FlipHorizontal, FlipVertical, Download, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function RotateImageClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [angle, setAngle] = useState<number>(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [rotatedUrl, setRotatedUrl] = useState<string | null>(null);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setAngle(0);
    setFlipH(false);
    setFlipV(false);
    setRotatedUrl(null);
  };

  const applyTransformation = (newAngle: number, newFlipH: boolean, newFlipV: boolean) => {
    if (!uploadedFile) return;
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
      }, uploadedFile.file.type || 'image/jpeg', 0.95);
    };
    img.src = uploadedFile.previewUrl;
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <RotateCw className="w-4 h-4 text-indigo-400" />
            <span>Client-Side Image Rotator</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Rotate <span className="gradient-text">IMAGE</span> Online
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Rotate JPG, PNG, or WEBP photos 90° clockwise, 90° counter-clockwise, 180°, or flip horizontally & vertically with fast browser processing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {!uploadedFile ? (
              <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
            ) : (
              <div className="space-y-6 bg-[#0d121e] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">Image Rotation & Flip Controls</h3>
                  <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold">
                    Change Image
                  </button>
                </div>

                {/* Controls toolbar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    onClick={() => applyTransformation((angle + 90) % 360, flipH, flipV)}
                    className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-slate-200 flex flex-col items-center gap-2 transition-all"
                  >
                    <RotateCw className="w-5 h-5 text-indigo-400" />
                    <span>Rotate 90° CW</span>
                  </button>
                  <button
                    onClick={() => applyTransformation((angle + 270) % 360, flipH, flipV)}
                    className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-bold text-slate-200 flex flex-col items-center gap-2 transition-all"
                  >
                    <RotateCcw className="w-5 h-5 text-indigo-400" />
                    <span>Rotate 90° CCW</span>
                  </button>
                  <button
                    onClick={() => applyTransformation(angle, !flipH, flipV)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                      flipH ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-white/[0.04] border-white/10 text-slate-200'
                    }`}
                  >
                    <FlipHorizontal className="w-5 h-5 text-cyan-400" />
                    <span>Flip Horizontal</span>
                  </button>
                  <button
                    onClick={() => applyTransformation(angle, flipH, !flipV)}
                    className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${
                      flipV ? 'bg-indigo-600/30 border-indigo-500 text-white' : 'bg-white/[0.04] border-white/10 text-slate-200'
                    }`}
                  >
                    <FlipVertical className="w-5 h-5 text-cyan-400" />
                    <span>Flip Vertical</span>
                  </button>
                </div>

                {/* Preview Box */}
                <div className="p-4 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center min-h-[300px] overflow-hidden">
                  <img
                    src={rotatedUrl || uploadedFile.previewUrl}
                    alt="Rotated Preview"
                    className="max-h-[380px] w-auto object-contain rounded-lg transition-transform duration-300"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Transformed Output Download</span>
            </h2>

            {rotatedUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex justify-between">
                    <span>Rotation Angle</span>
                    <span className="font-mono font-bold text-emerald-400">{angle}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Horizontal Flip</span>
                    <span className="font-mono font-bold text-emerald-400">{flipH ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Vertical Flip</span>
                    <span className="font-mono font-bold text-emerald-400">{flipV ? 'Yes' : 'No'}</span>
                  </div>
                </div>

                <a
                  href={rotatedUrl}
                  download={`rotated-${uploadedFile?.name || 'photo.jpg'}`}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Rotated Image</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <RotateCw className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">Select Rotation Angle</h4>
                <p className="text-xs text-slate-400">Upload your image and click any rotation or flip button to preview live changes.</p>
              </div>
            )}
          </div>
        </div>

        <SeoContentSection
          title="Rotate & Flip Photos Online with High Resolution Output"
          description="Photos taken from mobile phones or DSLR cameras often upload sideways or upside down due to EXIF orientation headers. FitMyForm's image rotator allows you to fix orientation and flip images instantly with 100% browser privacy."
          faqs={[
            {
              question: 'Why did my photo upload sideways?',
              answer: 'Smartphones store camera angle metadata in EXIF headers. Some websites do not parse EXIF data correctly. Rotating and saving your image on FitMyForm fixes the orientation permanently.'
            },
            {
              question: 'Can I flip a photo horizontally for mirror effect?',
              answer: 'Yes! Click "Flip Horizontal" to mirror your photo horizontally or "Flip Vertical" to invert it top-to-bottom.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
