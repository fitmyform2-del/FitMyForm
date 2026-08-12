'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { removeBackgroundCanvas } from '@/lib/image/editorTools';
import { Eraser, Download, RefreshCw, CheckCircle2, ArrowRight, Palette } from 'lucide-react';

export default function RemoveBgClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [targetColor, setTargetColor] = useState('#FFFFFF');
  const [tolerance, setTolerance] = useState(25);
  const [replacementColor, setReplacementColor] = useState<string | 'transparent'>('transparent');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setResultUrl(null);
  };

  const processBgRemoval = () => {
    if (!uploadedFile) return;
    setIsProcessing(true);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = removeBackgroundCanvas(img, targetColor, tolerance, replacementColor);
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

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Eraser className="w-4 h-4 text-indigo-400" />
            <span>Client-Side Background Removal</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Remove <span className="gradient-text">Background</span> Online
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Quickly erase background colors from passport photos or graphics. Export transparent PNG cutouts or replace with solid white/blue background for official forms.
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
                  <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold">
                    Change Photo
                  </button>
                </div>

                <div className="space-y-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">Target Background Color to Remove:</label>
                    <input
                      type="color"
                      value={targetColor}
                      onChange={(e) => setTargetColor(e.target.value)}
                      className="w-9 h-9 rounded-lg bg-transparent cursor-pointer border-0"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Color Tolerance Sensitivity</span>
                      <span>{tolerance}%</span>
                    </div>
                    <input
                      type="range"
                      min="5"
                      max="70"
                      value={tolerance}
                      onChange={(e) => setTolerance(Number(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Palette className="w-4 h-4 text-emerald-400" /> Replacement Background Color
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Transparent PNG', val: 'transparent' },
                        { label: 'Solid White (#FFF)', val: '#FFFFFF' },
                        { label: 'Solid Blue (#0088FF)', val: '#0088FF' },
                        { label: 'Solid Light Gray', val: '#F0F2F5' }
                      ].map((bg) => (
                        <button
                          key={bg.label}
                          onClick={() => setReplacementColor(bg.val)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                            replacementColor === bg.val
                              ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                              : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
                          }`}
                        >
                          {bg.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={processBgRemoval}
                  disabled={isProcessing}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
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
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Background Cutout Output</span>
            </h2>

            {resultUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
                <div className="p-2 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px]">
                  <img src={resultUrl} alt="Background Cutout Result" className="max-h-[350px] w-auto object-contain rounded-lg" />
                </div>

                <a
                  href={resultUrl}
                  download={`cutout-${uploadedFile?.name || 'photo.png'}`}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Cutout Image</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <Eraser className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">Cutout Preview</h4>
                <p className="text-xs text-slate-400">Upload your photo on the left and click Remove Background Now.</p>
              </div>
            )}
          </div>
        </div>

        <SeoContentSection
          title="Make Image Background Transparent or Change Passport Background Color"
          description="Online government exam forms (SSC, Railway, IBPS) often require passport photos with a clean, solid white background. FitMyForm's background remover lets you cut out background noise and replace it with pure white or transparent PNG."
          faqs={[
            {
              question: 'How do I change my passport photo background to plain white?',
              answer: 'Upload your photo, choose Target Background Color (or adjust tolerance), select "Solid White (#FFF)" as Replacement Background Color, and click Remove Background Now.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
