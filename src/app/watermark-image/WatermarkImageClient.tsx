'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { watermarkImageCanvas, WatermarkOptions } from '@/lib/image/editorTools';
import { Shield, Download, RefreshCw, CheckCircle2, Type, Sliders } from 'lucide-react';

export default function WatermarkImageClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);

  const [options, setOptions] = useState<WatermarkOptions>({
    type: 'text',
    text: 'CONFIDENTIAL',
    opacity: 0.5,
    rotation: -30,
    fontSize: 48,
    fontColor: '#ffffff',
    position: 'tile'
  });

  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setWatermarkedUrl(null);
  };

  const generateWatermark = async () => {
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

      const canvas = await watermarkImageCanvas(img, options);
      canvas.toBlob((blob) => {
        if (blob) {
          if (watermarkedUrl) URL.revokeObjectURL(watermarkedUrl);
          setWatermarkedUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, uploadedFile.file.type || 'image/jpeg', 0.95);
    } catch (err) {
      console.error(err);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    let active = true;
    if (uploadedFile) {
      setTimeout(() => {
        if (active) {
          generateWatermark();
        }
      }, 0);
    }
    return () => {
      active = false;
    };
  }, [uploadedFile, options]);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-4 h-4 text-indigo-400" />
            <span>Client-Side Photo Protection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Watermark <span className="gradient-text">IMAGE</span> Online
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Stamp custom text or PNG logo watermark over your images in seconds. Control transparency, typography, font size, angle, and repeat tiling.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {!uploadedFile ? (
              <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
            ) : (
              <div className="space-y-6 bg-[#0d121e] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">Watermark Configuration Settings</h3>
                  <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold">
                    Change Image
                  </button>
                </div>

                {/* Watermark Text Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Type className="w-4 h-4 text-indigo-400" /> Watermark Text
                  </label>
                  <input
                    type="text"
                    value={options.text || ''}
                    onChange={(e) => setOptions({ ...options, text: e.target.value })}
                    placeholder="e.g. SAMPLE / FOR SSC EXAM ONLY"
                    className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white text-sm focus:outline-none focus:border-indigo-500 font-bold"
                  />
                </div>

                {/* Controls Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Opacity</span>
                      <span>{Math.round(options.opacity * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.05"
                      value={options.opacity}
                      onChange={(e) => setOptions({ ...options, opacity: Number(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Rotation Angle</span>
                      <span>{options.rotation}°</span>
                    </div>
                    <input
                      type="range"
                      min="-90"
                      max="90"
                      value={options.rotation}
                      onChange={(e) => setOptions({ ...options, rotation: Number(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Font Size</span>
                      <span>{options.fontSize} px</span>
                    </div>
                    <input
                      type="range"
                      min="16"
                      max="120"
                      value={options.fontSize}
                      onChange={(e) => setOptions({ ...options, fontSize: Number(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 block">Position Placement</label>
                    <select
                      value={options.position}
                      onChange={(e) => setOptions({ ...options, position: e.target.value as WatermarkOptions['position'] })}
                      className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white text-xs font-bold focus:outline-none"
                    >
                      <option value="tile">Repeat Tile Grid</option>
                      <option value="center">Center</option>
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-xs font-bold text-slate-300">Font Color:</label>
                  <input
                    type="color"
                    value={options.fontColor}
                    onChange={(e) => setOptions({ ...options, fontColor: e.target.value })}
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Watermarked Result Preview</span>
            </h2>

            {watermarkedUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
                <div className="p-2 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px]">
                  <img src={watermarkedUrl} alt="Watermarked Output" className="max-h-[350px] w-auto object-contain rounded-lg" />
                </div>

                <a
                  href={watermarkedUrl}
                  download={`watermarked-${uploadedFile?.name || 'photo.jpg'}`}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Watermarked Photo</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <Shield className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">Watermark Preview</h4>
                <p className="text-xs text-slate-400">Upload your photo on the left to apply live custom text watermarking.</p>
              </div>
            )}
          </div>
        </div>

        <SeoContentSection
          title="Protect Your Photos and Documents with Custom Watermarks"
          description="Watermarking images prevents unauthorized copying and protects sensitive document submissions (Aadhaar cards, exam forms, certificates) by stamping usage notes such as 'FOR EXAM APPLICATION ONLY'."
          faqs={[
            {
              question: 'Why should I watermark documents before submitting online?',
              answer: 'Watermarking sensitive document photos prevents identity theft and unauthorized reuse on unverified portals.'
            },
            {
              question: 'Is my watermark stored on any server?',
              answer: 'No. All watermark rendering happens in your web browser memory using HTML5 Canvas APIs.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
