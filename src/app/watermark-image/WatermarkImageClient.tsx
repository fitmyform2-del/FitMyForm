'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { watermarkImageCanvas, WatermarkOptions } from '@/lib/image/editorTools';
import { Shield, Download, Type, Settings2 } from 'lucide-react';

export default function WatermarkImageClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [options, setOptions] = useState<WatermarkOptions>({
    type: 'text',
    text: 'FOR EXAM USE ONLY',
    opacity: 0.5,
    rotation: -30,
    fontSize: 44,
    fontColor: '#ffffff',
    position: 'tile'
  });
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);

  const generateWatermark = useCallback(async () => {
    if (!uploadedFile) return;
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
          setWatermarkedUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(blob);
          });
        }
      }, uploadedFile.file.type || 'image/jpeg', 0.95);
    } catch (err) {
      console.error('Watermark error:', err);
    }
  }, [uploadedFile, options]);

  useEffect(() => {
    if (!uploadedFile) return;
    const timer = setTimeout(() => {
      generateWatermark();
    }, 180);
    return () => clearTimeout(timer);
  }, [uploadedFile, generateWatermark]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5 text-blue-400" />
            <span>Watermark Protection</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Watermark <span className="text-blue-400">IMAGE</span> Online
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300">
            Stamp custom text or repeated security tiles over photos with custom opacity, angle, and size.
          </p>
        </div>

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={setUploadedFile} onClearFile={() => setUploadedFile(null)} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Live Preview (7 cols) */}
            <div className="lg:col-span-7 fmf-panel p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Preview</span>
                <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold py-1 cursor-pointer">
                  Change Photo
                </button>
              </div>

              <div className="p-4 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center min-h-[340px] overflow-hidden">
                <img
                  src={watermarkedUrl || uploadedFile.previewUrl}
                  alt="Watermarked Preview"
                  className="max-h-[400px] w-auto object-contain rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Sidebar Controls (5 cols) */}
            <div className="lg:col-span-5 fmf-panel p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <h3 className="font-extrabold text-white text-sm">Watermark Options</h3>
                <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Watermark Studio</span>
              </div>

              {/* Simple: Text Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Type className="w-4 h-4 text-blue-400" /> Watermark Text
                </label>
                <input
                  type="text"
                  value={options.text || ''}
                  onChange={(e) => setOptions({ ...options, text: e.target.value })}
                  placeholder="e.g. FOR APPLICATION ONLY"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-sm font-bold focus:border-blue-500 focus:outline-none"
                />
              </div>

              {/* Simple: Position preset */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">Position</label>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { label: 'Tile Repeat', pos: 'tile' },
                      { label: 'Center', pos: 'center' },
                      { label: 'Bottom Right', pos: 'bottom-right' }
                    ] as const
                  ).map((p) => (
                    <button
                      key={p.pos}
                      type="button"
                      onClick={() => setOptions({ ...options, position: p.pos })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        options.position === p.pos
                          ? 'bg-blue-600 border-blue-400 text-white'
                          : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Simple: Opacity slider */}
              <div className="space-y-1 bg-white/[0.03] p-3 rounded-xl border border-white/10">
                <div className="flex justify-between text-xs font-bold text-slate-300">
                  <span>Transparency</span>
                  <span>{Math.round((options.opacity || 0.5) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.05"
                  value={options.opacity}
                  onChange={(e) => setOptions({ ...options, opacity: Number(e.target.value) })}
                  className="w-full accent-blue-500"
                />
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
                  <div className="space-y-3 pt-3 text-xs animate-fade-in">
                    <div>
                      <div className="flex justify-between text-slate-300 font-bold mb-1">
                        <span>Font Size</span>
                        <span>{options.fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min="20"
                        max="90"
                        value={options.fontSize}
                        onChange={(e) => setOptions({ ...options, fontSize: Number(e.target.value) })}
                        className="w-full accent-blue-500"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-slate-300 font-bold mb-1">
                        <span>Angle</span>
                        <span>{options.rotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-90"
                        max="90"
                        value={options.rotation}
                        onChange={(e) => setOptions({ ...options, rotation: Number(e.target.value) })}
                        className="w-full accent-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              {watermarkedUrl && (
                <a
                  href={watermarkedUrl}
                  download={`watermarked-${uploadedFile.name}`}
                  className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Watermarked IMAGE</span>
                </a>
              )}
            </div>
          </div>
        )}

        <SeoContentSection
          title="Free Online Photo Watermark Protection"
          description="Protect identity proofs, photographs, and certificates from misuse by stamping custom text watermarks directly in your browser."
          faqs={[
            {
              question: 'Why should I watermark documents before submitting online?',
              answer: 'Watermarking identity proofs with text like "For SSC Application Only" prevents unauthorized misuse or re-upload to other portals.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
