'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { blurRegionsCanvas, BlurBox } from '@/lib/image/editorTools';
import { EyeOff, Download, RefreshCw, CheckCircle2, Plus, Trash2 } from 'lucide-react';

export default function BlurFaceClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [boxes, setBoxes] = useState<BlurBox[]>([
    { x: 50, y: 50, width: 150, height: 150, type: 'pixelate', intensity: 12 }
  ]);
  const [blurredResultUrl, setBlurredResultUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setBlurredResultUrl(null);
  };

  const addBlurBox = () => {
    setBoxes([...boxes, { x: 80 + boxes.length * 20, y: 80 + boxes.length * 20, width: 140, height: 140, type: 'pixelate', intensity: 12 }]);
  };

  const removeBlurBox = (idx: number) => {
    setBoxes(boxes.filter((_, i) => i !== idx));
  };

  const processBlur = async () => {
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

      const canvas = blurRegionsCanvas(img, boxes);
      canvas.toBlob((blob) => {
        if (blob) {
          if (blurredResultUrl) URL.revokeObjectURL(blurredResultUrl);
          setBlurredResultUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, uploadedFile.file.type || 'image/jpeg', 0.95);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    let active = true;
    if (uploadedFile) {
      setTimeout(() => {
        if (active) processBlur();
      }, 0);
    }
    return () => {
      active = false;
    };
  }, [uploadedFile, boxes]);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <EyeOff className="w-4 h-4 text-indigo-400" />
            <span>Client-Side Privacy Censor Tool</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Blur Face & <span className="gradient-text">Sensitive Data</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Censor faces, license plates, Aadhaar numbers, and confidential details in photos with pixelate or gaussian blur boxes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {!uploadedFile ? (
              <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
            ) : (
              <div className="space-y-6 bg-[#0d121e] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">Blur Region Box Configurations</h3>
                  <button onClick={addBlurBox} className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1">
                    <Plus className="w-4 h-4" /> Add Blur Box
                  </button>
                </div>

                <div className="space-y-4">
                  {boxes.map((box, idx) => (
                    <div key={idx} className="p-4 bg-white/[0.02] border border-white/10 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-indigo-400">Blur Zone #{idx + 1}</span>
                        {boxes.length > 1 && (
                          <button onClick={() => removeBlurBox(idx)} className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-bold">
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">Blur Mode</label>
                          <select
                            value={box.type}
                            onChange={(e) => {
                              const newBoxes = [...boxes];
                              newBoxes[idx].type = e.target.value as BlurBox['type'];
                              setBoxes(newBoxes);
                            }}
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-bold"
                          >
                            <option value="pixelate">Pixelate Blocks</option>
                            <option value="gaussian">Gaussian Blur</option>
                          </select>
                        </div>
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">Blur Intensity</label>
                          <input
                            type="range"
                            min="4"
                            max="30"
                            value={box.intensity}
                            onChange={(e) => {
                              const newBoxes = [...boxes];
                              newBoxes[idx].intensity = Number(e.target.value);
                              setBoxes(newBoxes);
                            }}
                            className="w-full accent-indigo-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="font-bold text-slate-300 block mb-1">Position X / Y</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={box.x}
                              onChange={(e) => {
                                const newBoxes = [...boxes];
                                newBoxes[idx].x = Number(e.target.value);
                                setBoxes(newBoxes);
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono"
                            />
                            <input
                              type="number"
                              value={box.y}
                              onChange={(e) => {
                                const newBoxes = [...boxes];
                                newBoxes[idx].y = Number(e.target.value);
                                setBoxes(newBoxes);
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-bold text-slate-300 block mb-1">Width / Height</label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={box.width}
                              onChange={(e) => {
                                const newBoxes = [...boxes];
                                newBoxes[idx].width = Number(e.target.value);
                                setBoxes(newBoxes);
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono"
                            />
                            <input
                              type="number"
                              value={box.height}
                              onChange={(e) => {
                                const newBoxes = [...boxes];
                                newBoxes[idx].height = Number(e.target.value);
                                setBoxes(newBoxes);
                              }}
                              className="w-full px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white font-mono"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Censored Output Preview</span>
            </h2>

            {blurredResultUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
                <div className="p-2 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px]">
                  <img src={blurredResultUrl} alt="Censored Result" className="max-h-[350px] w-auto object-contain rounded-lg" />
                </div>

                <a
                  href={blurredResultUrl}
                  download={`censored-${uploadedFile?.name || 'photo.jpg'}`}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Censored Photo</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <EyeOff className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">Censor Preview</h4>
                <p className="text-xs text-slate-400">Upload your photo on the left to configure blur zone position and size.</p>
              </div>
            )}
          </div>
        </div>

        <SeoContentSection
          title="Protect Personal Information & Blur Faces in Photos"
          description="FitMyForm's privacy blur tool allows you to censor face photos, license plates, serial numbers, and sensitive text before sharing images online."
          faqs={[
            {
              question: 'Are my blurred photos saved on any server?',
              answer: 'No! All pixelation and gaussian blur functions run 100% inside your web browser.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
