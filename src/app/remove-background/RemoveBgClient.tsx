'use client';

import React, { useState, useRef } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { removeBackgroundCanvas } from '@/lib/image/editorTools';
import { Eraser, Pipette } from 'lucide-react';
import { RemoveBgControls } from './_components/RemoveBgControls';

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
  const sourceImgRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
    setResultUrl(null);
    setSeedPoint(undefined);
    const orig = new Image();
    orig.crossOrigin = 'anonymous';
    orig.onload = () => {
      sourceImgRef.current = orig;
    };
    orig.src = file.previewUrl;
  };

  const processBgRemoval = (overrideColor?: string, overrideSeed?: { x: number; y: number }) => {
    if (!uploadedFile) return;
    setIsProcessing(true);

    const runWithImg = (img: HTMLImageElement) => {
      const activeColor = overrideColor || targetColor;
      const activeSeed = overrideSeed || seedPoint;
      const canvas = removeBackgroundCanvas(img, activeColor, tolerance, replacementColor, mode, activeSeed);
      canvas.toBlob((blob) => {
        if (blob) {
          setResultUrl((prev) => {
            if (prev) URL.revokeObjectURL(prev);
            return URL.createObjectURL(blob);
          });
        }
        setIsProcessing(false);
      }, replacementColor === 'transparent' ? 'image/png' : 'image/jpeg', 0.95);
    };

    if (sourceImgRef.current && sourceImgRef.current.complete) {
      runWithImg(sourceImgRef.current);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      sourceImgRef.current = img;
      runWithImg(img);
    };
    img.src = uploadedFile.previewUrl;
  };

  const handleEyedropperClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!imgRef.current) return;
    const displayImg = imgRef.current;
    const sampleSource = sourceImgRef.current || displayImg;
    const rect = displayImg.getBoundingClientRect();
    const scaleX = sampleSource.naturalWidth / rect.width;
    const scaleY = sampleSource.naturalHeight / rect.height;
    const natX = Math.max(0, Math.min(sampleSource.naturalWidth - 1, Math.round((e.clientX - rect.left) * scaleX)));
    const natY = Math.max(0, Math.min(sampleSource.naturalHeight - 1, Math.round((e.clientY - rect.top) * scaleY)));

    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(sampleSource, natX, natY, 1, 1, 0, 0, 1, 1);
    const p = ctx.getImageData(0, 0, 1, 1).data;
    const sampledHex = `#${[p[0], p[1], p[2]].map((x) => x.toString(16).padStart(2, '0')).join('')}`;

    setTargetColor(sampledHex);
    setSeedPoint({ x: natX, y: natY });
    processBgRemoval(sampledHex, { x: natX, y: natY });
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Eraser className="w-3.5 h-3.5 text-blue-400" />
            <span>Smart Background Cutout</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Remove <span className="text-blue-400">Background</span> Online
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300">
            Click on any photo background to erase it into transparent PNG or replace with white or exam-compliant blue.
          </p>
        </div>

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Interactive Image Stage (7 cols) */}
            <div className="lg:col-span-7 fmf-panel p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Pipette className="w-3.5 h-3.5 text-blue-400" /> Click photo to pick background color
                </span>
                <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold py-1 cursor-pointer">
                  Change Image
                </button>
              </div>

              <div className="p-4 checkerboard-bg rounded-2xl border border-white/10 flex items-center justify-center min-h-[340px] overflow-hidden cursor-crosshair">
                <img
                  ref={imgRef}
                  src={resultUrl || uploadedFile.previewUrl}
                  alt="Source"
                  onClick={handleEyedropperClick}
                  className="max-h-[380px] w-auto object-contain rounded-lg"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
                <span>Color Selected: <strong className="text-blue-400 font-bold">{targetColor}</strong></span>
                <span>Output: <strong className="text-emerald-400 font-bold">{replacementColor === 'transparent' ? 'Transparent PNG' : 'Solid Color'}</strong></span>
              </div>
            </div>

            {/* Sidebar Settings (5 cols) */}
            <div className="lg:col-span-5">
              <RemoveBgControls
                replacementColor={replacementColor}
                tolerance={tolerance}
                mode={mode}
                resultUrl={resultUrl}
                uploadedFileName={uploadedFile.name}
                isProcessing={isProcessing}
                onReplacementColorChange={setReplacementColor}
                onToleranceChange={setTolerance}
                onModeChange={setMode}
                onProcessBgRemoval={() => processBgRemoval()}
                onResetResult={() => setResultUrl(null)}
              />
            </div>
          </div>
        )}

        <SeoContentSection
          title="Free Online Transparent Background Eraser"
          description="Erase solid backgrounds or replace passport backdrops with white or light blue compliant colors with 100% browser privacy."
          faqs={[
            {
              question: 'How do I erase a white background without erasing white shirts?',
              answer: 'Contiguous mode only erases from the edges inwards, protecting enclosed white shirts and teeth.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
