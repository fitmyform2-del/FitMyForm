'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { applyFiltersCanvas, FilterOptions } from '@/lib/image/editorTools';
import { Wand2, Download, RefreshCw, CheckCircle2, Sliders, Sun, Contrast, Palette } from 'lucide-react';

export default function PhotoEditorClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [filters, setFilters] = useState<FilterOptions>({
    brightness: 100,
    contrast: 100,
    saturate: 100,
    grayscale: 0,
    sepia: 0,
    invert: 0,
    blur: 0,
    hueRotate: 0
  });

  const [editedUrl, setEditedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setEditedUrl(null);
  };

  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'grayscale':
        setFilters({ ...filters, grayscale: 100, sepia: 0, saturate: 100 });
        break;
      case 'sepia':
        setFilters({ ...filters, sepia: 100, grayscale: 0, saturate: 120 });
        break;
      case 'vintage':
        setFilters({ ...filters, sepia: 40, contrast: 120, brightness: 105, saturate: 85 });
        break;
      case 'vivid':
        setFilters({ ...filters, saturate: 160, contrast: 115, brightness: 105 });
        break;
      case 'reset':
        setFilters({
          brightness: 100,
          contrast: 100,
          saturate: 100,
          grayscale: 0,
          sepia: 0,
          invert: 0,
          blur: 0,
          hueRotate: 0
        });
        break;
    }
  };

  const updateCanvas = async () => {
    if (!uploadedFile) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = applyFiltersCanvas(img, filters);
      canvas.toBlob((blob) => {
        if (blob) {
          if (editedUrl) URL.revokeObjectURL(editedUrl);
          setEditedUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, uploadedFile.file.type || 'image/jpeg', 0.95);
    };
    img.src = uploadedFile.previewUrl;
  };

  useEffect(() => {
    let active = true;
    if (uploadedFile) {
      setTimeout(() => {
        if (active) updateCanvas();
      }, 0);
    }
    return () => {
      active = false;
    };
  }, [uploadedFile, filters]);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Wand2 className="w-4 h-4 text-indigo-400" />
            <span>Full-Featured Photo Editor</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Photo <span className="gradient-text">Editor</span> Online
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Enhance your pictures with filters, brightness, contrast, saturation, hue adjustments, and retro presets with 100% privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {!uploadedFile ? (
              <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
            ) : (
              <div className="space-y-6 bg-[#0d121e] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-indigo-400" /> Filter Presets & Sliders
                  </h3>
                  <button onClick={() => applyPreset('reset')} className="text-xs text-rose-400 hover:underline font-bold">
                    Reset All Filters
                  </button>
                </div>

                {/* Preset buttons */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Normal / Original', name: 'reset' },
                    { label: 'Grayscale', name: 'grayscale' },
                    { label: 'Sepia Warmth', name: 'sepia' },
                    { label: 'Vintage Retro', name: 'vintage' },
                    { label: 'Vivid Colors', name: 'vivid' }
                  ].map((p) => (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p.name)}
                      className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-indigo-600/30 border border-white/10 text-xs font-bold text-slate-200 transition-all"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                {/* Sliders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Brightness</span>
                      <span>{filters.brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={filters.brightness}
                      onChange={(e) => setFilters({ ...filters, brightness: Number(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Contrast</span>
                      <span>{filters.contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={filters.contrast}
                      onChange={(e) => setFilters({ ...filters, contrast: Number(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Saturation</span>
                      <span>{filters.saturate}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={filters.saturate}
                      onChange={(e) => setFilters({ ...filters, saturate: Number(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Hue Rotate</span>
                      <span>{filters.hueRotate}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={filters.hueRotate}
                      onChange={(e) => setFilters({ ...filters, hueRotate: Number(e.target.value) })}
                      className="w-full accent-indigo-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Edited Photo Output</span>
            </h2>

            {editedUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
                <div className="p-2 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px]">
                  <img src={editedUrl} alt="Edited Output" className="max-h-[350px] w-auto object-contain rounded-lg" />
                </div>

                <a
                  href={editedUrl}
                  download={`edited-${uploadedFile?.name || 'photo.jpg'}`}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Edited Photo</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <Wand2 className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">Edited Preview</h4>
                <p className="text-xs text-slate-400">Upload your photo to apply filters and adjust brightness & contrast.</p>
              </div>
            )}
          </div>
        </div>

        <SeoContentSection
          title="Free Online Photo Filters & Color Adjustments"
          description="FitMyForm's online photo editor brings studio color correction, brightness boost, contrast sharpening, and vintage sepia filters directly to your web browser."
          faqs={[
            {
              question: 'Does editing photos slow down my browser?',
              answer: 'No! FitMyForm uses CSS hardware acceleration and HTML5 Canvas for real-time filter previews.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
