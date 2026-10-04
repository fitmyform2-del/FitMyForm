'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { blurRegionsCanvas, BlurBox } from '@/lib/image/editorTools';
import { EyeOff, Sparkles, RefreshCw } from 'lucide-react';
import { BlurCanvasEditor } from './_components/BlurCanvasEditor';
import { BlurControlsPanel } from './_components/BlurControlsPanel';
import { BlurDownloadCard } from './_components/BlurDownloadCard';

export default function BlurFaceClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [boxes, setBoxes] = useState<BlurBox[]>([]);
  const [selectedBoxIndex, setSelectedBoxIndex] = useState<number | null>(null);
  const [activeMode, setActiveMode] = useState<BlurBox['type']>('pixelate');
  const [activeIntensity, setActiveIntensity] = useState<number>(14);
  const [blurredResultUrl, setBlurredResultUrl] = useState<string | null>(null);
  const [isProcessing, startTransition] = useTransition();

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    // Intelligent default face box
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const defaultFaceW = Math.round(img.naturalWidth * 0.28);
      const defaultFaceH = Math.round(img.naturalHeight * 0.28);
      const defaultX = Math.round((img.naturalWidth - defaultFaceW) / 2);
      const defaultY = Math.round((img.naturalHeight - defaultFaceH) * 0.25);

      setBoxes([
        {
          x: defaultX,
          y: defaultY,
          width: defaultFaceW,
          height: defaultFaceH,
          type: 'pixelate',
          intensity: 14
        }
      ]);
      setSelectedBoxIndex(0);
    };
    img.src = file.previewUrl;
  };

  const handleAddPreset = (type: 'face' | 'aadhaar') => {
    if (!uploadedFile) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;

      if (type === 'face') {
        const bw = Math.round(w * 0.28);
        const bh = Math.round(h * 0.28);
        const bx = Math.round((w - bw) / 2);
        const by = Math.round((h - bh) * 0.25);
        setBoxes((prev) => [...prev, { x: bx, y: by, width: bw, height: bh, type: 'pixelate', intensity: 14 }]);
      } else {
        // Aadhaar number censor bar
        const bw = Math.round(w * 0.6);
        const bh = Math.round(h * 0.08);
        const bx = Math.round((w - bw) / 2);
        const by = Math.round(h * 0.7);
        setBoxes((prev) => [...prev, { x: bx, y: by, width: bw, height: bh, type: 'censor', intensity: 1 }]);
      }
      setSelectedBoxIndex(boxes.length);
    };
    img.src = uploadedFile.previewUrl;
  };

  const handleUpdateActiveBox = (partial: Partial<BlurBox>) => {
    if (selectedBoxIndex === null) return;
    setBoxes((prev) => {
      const copy = [...prev];
      if (copy[selectedBoxIndex]) {
        copy[selectedBoxIndex] = { ...copy[selectedBoxIndex], ...partial };
      }
      return copy;
    });
  };

  // Recompute blurred canvas whenever boxes or file change
  useEffect(() => {
    let isCurrent = true;
    if (!uploadedFile) {
      setBlurredResultUrl(null);
      return;
    }

    const timer = setTimeout(() => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        if (!isCurrent) return;
        startTransition(() => {
          const canvas = blurRegionsCanvas(img, boxes);
          canvas.toBlob((blob) => {
            if (blob && isCurrent) {
              setBlurredResultUrl((prevUrl) => {
                if (prevUrl) URL.revokeObjectURL(prevUrl);
                return URL.createObjectURL(blob);
              });
            }
          }, uploadedFile.file.type || 'image/jpeg', 0.95);
        });
      };
      img.src = uploadedFile.previewUrl;
    }, 150);

    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [uploadedFile, boxes]);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Header */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <EyeOff className="w-4 h-4 text-indigo-400" />
            <span>Interactive Privacy Redaction</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Blur Face & <span className="gradient-text">Censor Data</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Click & drag to blur faces, hide Aadhaar numbers, and censor confidential details with pixelate, gaussian blur, or black redaction bars.
          </p>
        </div>

        {/* Upload or Editor Workspace */}
        {!uploadedFile ? (
          <div className="max-w-3xl mx-auto">
            <DropzoneUpload
              uploadedFile={uploadedFile}
              onFileUpload={handleFileUpload}
              onClearFile={() => setUploadedFile(null)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Visual Canvas (Left Column) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-white text-sm">Visual Photo Editor</h3>
                <button
                  type="button"
                  onClick={() => setUploadedFile(null)}
                  className="text-xs text-rose-400 hover:underline font-bold min-h-[44px] cursor-pointer"
                >
                  Upload Another Photo
                </button>
              </div>

              <BlurCanvasEditor
                imageSrc={uploadedFile.previewUrl}
                boxes={boxes}
                selectedBoxIndex={selectedBoxIndex}
                activeMode={activeMode}
                activeIntensity={activeIntensity}
                onSelectBox={setSelectedBoxIndex}
                onAddBox={(newBox) => {
                  setBoxes((prev) => [...prev, newBox]);
                  setSelectedBoxIndex(boxes.length);
                }}
                onRemoveBox={(idx) => {
                  setBoxes((prev) => prev.filter((_, i) => i !== idx));
                  setSelectedBoxIndex(null);
                }}
              />
            </div>

            {/* Sidebar Controls + Download Preview (Right Column) */}
            <div className="lg:col-span-5 space-y-6">
              <BlurControlsPanel
                boxes={boxes}
                selectedBoxIndex={selectedBoxIndex}
                activeMode={activeMode}
                activeIntensity={activeIntensity}
                onSetMode={setActiveMode}
                onSetIntensity={setActiveIntensity}
                onSelectBox={setSelectedBoxIndex}
                onRemoveBox={(idx) => {
                  setBoxes((prev) => prev.filter((_, i) => i !== idx));
                  setSelectedBoxIndex(null);
                }}
                onClearBoxes={() => {
                  setBoxes([]);
                  setSelectedBoxIndex(null);
                }}
                onAddPreset={handleAddPreset}
                onUpdateActiveBox={handleUpdateActiveBox}
              />

              <BlurDownloadCard
                blurredUrl={blurredResultUrl}
                fileName={uploadedFile.name}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        )}

        <SeoContentSection
          title="Protect Personal Information & Blur Faces in Photos Online"
          description="FitMyForm's privacy blur tool allows you to visually censor faces, license plates, Aadhaar numbers, and confidential details directly in your browser."
          faqs={[
            {
              question: 'How do I blur a face or sensitive number?',
              answer: 'Upload your photo, then simply click and drag your mouse or finger across the face or text you want to conceal. Choose between pixelate, gaussian blur, or black redaction bar.'
            },
            {
              question: 'Is my photo private and secure?',
              answer: 'Yes, 100%. All face blurring, pixelation, and censor bar applications happen locally in your web browser using HTML5 Canvas. Your photo is never transmitted to any external server.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
