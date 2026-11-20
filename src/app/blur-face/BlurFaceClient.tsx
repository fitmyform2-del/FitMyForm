'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { blurRegionsCanvas, BlurBox } from '@/lib/image/editorTools';
import { EyeOff } from 'lucide-react';
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
    setBlurredResultUrl(null);
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

  const handleClearFile = () => {
    setUploadedFile(null);
    setBlurredResultUrl(null);
    setBoxes([]);
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

  useEffect(() => {
    if (!uploadedFile) return;

    let isCurrent = true;
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
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <EyeOff className="w-3.5 h-3.5 text-blue-400" />
            <span>Privacy Redaction</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Blur Face & <span className="text-blue-400">Censor Data</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300">
            Click & drag to blur faces, hide Aadhaar numbers, and censor confidential details with pixelate or black bars.
          </p>
        </div>

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <DropzoneUpload
              uploadedFile={uploadedFile}
              onFileUpload={handleFileUpload}
              onClearFile={handleClearFile}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Visual Stage</span>
                <button
                  type="button"
                  onClick={handleClearFile}
                  className="text-xs text-rose-400 hover:underline font-bold py-1 cursor-pointer"
                >
                  Change Image
                </button>
              </div>

              <BlurCanvasEditor
                imageSrc={uploadedFile.previewUrl}
                boxes={boxes}
                selectedBoxIndex={selectedBoxIndex}
                activeMode={activeMode}
                activeIntensity={activeIntensity}
                onSelectBox={setSelectedBoxIndex}
                onAddBox={(box) => {
                  setBoxes((prev) => [...prev, box]);
                  setSelectedBoxIndex(boxes.length);
                }}
                onRemoveBox={(idx) => {
                  setBoxes((prev) => prev.filter((_, i) => i !== idx));
                  if (selectedBoxIndex === idx) setSelectedBoxIndex(null);
                }}
              />
            </div>

            <div className="lg:col-span-5 space-y-6">
              <BlurControlsPanel
                boxes={boxes}
                selectedBoxIndex={selectedBoxIndex}
                activeMode={activeMode}
                activeIntensity={activeIntensity}
                onSetMode={(m) => {
                  setActiveMode(m);
                  handleUpdateActiveBox({ type: m });
                }}
                onSetIntensity={(val) => {
                  setActiveIntensity(val);
                  handleUpdateActiveBox({ intensity: val });
                }}
                onSelectBox={setSelectedBoxIndex}
                onRemoveBox={(idx) => {
                  setBoxes((prev) => prev.filter((_, i) => i !== idx));
                  if (selectedBoxIndex === idx) setSelectedBoxIndex(null);
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
                fileName={`censored-${uploadedFile.name}`}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        )}

        <SeoContentSection
          title="Blur Faces and Censor Private Information Online Free"
          description="Protect sensitive identity proofs and blur faces directly in your browser. All blurring runs using HTML5 Canvas with zero uploads."
          faqs={[
            {
              question: 'How do I mask my Aadhaar card number?',
              answer: 'Click "+ Add Aadhaar Bar" preset to place a black censor rectangle over your 12-digit number.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
