'use client';

import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { removeBackgroundCanvas } from '@/lib/image/editorTools';
import { Eraser, RefreshCw, ArrowRight, Palette, Pipette } from 'lucide-react';
import { RemoveBgPreviewCard } from './_components/RemoveBgPreviewCard';

export default function RemoveBgClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [targetColor, setTargetColor] = useState('#FFFFFF');
  const [tolerance, setTolerance] = useState(24);
  const [replacementColor, setReplacementColor] = useState<string | 'transparent'>('transparent');
  const [mode, setMode] = useState<'contiguous' | 'global'>('contiguous');
  const [seedPoint, setSeedPoint] = useState<{ x: number; y: number } | undefined>();
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const imgRef = useRef<HTMLImageElement>(null);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setResultUrl(null);
    setSeedPoint(undefined);
  };

  const processBgRemoval = (overrideColor?: string, overrideSeed?: { x: number; y: number }) => {
    if (!uploadedFile) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const activeColor = overrideColor || targetColor;
      const activeSeed = overrideSeed || seedPoint;
      const canvas = removeBackgroundCanvas(img, activeColor, tolerance, replacementColor, mode, activeSeed);
      canvas.toBlob((blob) => {
        if (blob) {
          if (resultUrl) URL.revokeObjectURL(resultUrl);
          setResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, replacementColor === 'transparent' ? 'image/png' : 'image/jpeg', 0.95);
    };
    img.src = uploadedFile.previewUrl;
  };

  const handleEyedropperClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imgRef.current) return;
    const img = imgRef.current;
    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / img.clientWidth;
    const scaleY = img.naturalHeight / img.clientHeight;
    const natX = Math.round((e.clientX - rect.left) * scaleX);
    const natY = Math.round((e.clientY - rect.top) * scaleY);

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, natX, natY, 1, 1, 0, 0, 1, 1);
    const p = ctx.getImageData(0, 0, 1, 1).data;
    const sampledHex = `#${[p[0], p[1], p[2]].map(x => x.toString(16).padStart(2, '0')).join('')}`;

    setTargetColor(sampledHex);
    setSeedPoint({ x: natX, y: natY });
    processBgRemoval(sampledHex, { x: natX, y: natY });
  };

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Eraser className="w-4 h-4 text-indigo-400" />
            <span>Smart Contiguous Edge Cutout</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Remove <span className="gradient-text">Background</span> Online
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Click on any background to erase it instantly. Smart edge detection preserves white shirts, teeth, and clothes without transparent holes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {!uploadedFile ? (
              <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
            ) : (
              <div className="space-y-6 bg-[#0d121e] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">Background Removal Controls</h3>
                  <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold min-h-[44px]">
                    Change Photo
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 font-bold text-indigo-400">
                      <Pipette className="w-4 h-4" /> Click photo to sample background color
                    </span>
                    <span className="font-mono text-slate-400">Selected: {targetColor}</span>
                  </div>
                  <div className="p-2 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px] overflow-hidden cursor-crosshair">
                    <img
                      ref={imgRef}
                      src={uploadedFile.previewUrl}
                      alt="Source for Sampling"
                      onClick={handleEyedropperClick}
                      className="max-h-[380px] w-auto object-contain rounded-lg hover:brightness-105 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-bold text-slate-300">
                        <span>Tolerance Sensitivity</span>
                        <span>{tolerance}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="60"
                        value={tolerance}
                        onChange={(e) => setTolerance(Number(e.target.value))}
                        className="w-full min-h-[44px] accent-indigo-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 block">Protection Mode</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setMode('contiguous')}
                          className={`px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold border transition-all ${
                            mode === 'contiguous' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-white/[0.04] text-slate-300 border-white/10'
                          }`}
                        >
                          Smart Edge
                        </button>
                        <button
                          type="button"
                          onClick={() => setMode('global')}
                          className={`px-3 py-2 min-h-[44px] rounded-xl text-xs font-bold border transition-all ${
                            mode === 'global' ? 'bg-indigo-600 text-white border-indigo-400 shadow-md' : 'bg-white/[0.04] text-slate-300 border-white/10'
                          }`}
                        >
                          All Pixels
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-emerald-400" /> Replacement Background Color
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {[
                        { label: 'Transparent', val: 'transparent' },
                        { label: 'White (#FFF)', val: '#FFFFFF' },
                        { label: 'Blue (#0088FF)', val: '#0088FF' },
                        { label: 'Gray (#F0F2F5)', val: '#F0F2F5' }
                      ].map((bg) => (
                        <button
                          key={bg.label}
                          type="button"
                          onClick={() => setReplacementColor(bg.val)}
                          className={`px-3 py-2.5 min-h-[44px] rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                            replacementColor === bg.val ? 'bg-emerald-600 text-white border-emerald-400 shadow-md' : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                          }`}
                        >
                          {bg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => processBgRemoval()}
                  disabled={isProcessing}
                  className="w-full py-4 min-h-[48px] rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Removing Background...</span>
                    </>
                  ) : (
                    <>
                      <Eraser className="w-4 h-4" />
                      <span>Remove Background Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <RemoveBgPreviewCard resultUrl={resultUrl} fileName={uploadedFile?.name} />
          </div>
        </div>

        <SeoContentSection
          title="Make Image Background Transparent or Change Passport Background Color"
          description="Online government exam forms often require passport photos with a clean, solid white background. FitMyForm's background remover cuts out background noise and replaces it with pure white or transparent PNG."
          faqs={[
            {
              question: 'How do I change my passport photo background to plain white?',
              answer: 'Upload your photo, click on the background area to sample its color, choose "White (#FFF)" as Replacement Background, and click Remove Background Now.'
            },
            {
              question: 'Will it erase my white shirt or teeth?',
              answer: 'No! Smart Edge Protection mode seeds from the borders and stops at clothing and facial boundaries, keeping your white clothes and eyes 100% solid.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
