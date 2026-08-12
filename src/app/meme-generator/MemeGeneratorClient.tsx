'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { UploadedFile } from '@/types/document';
import { renderMemeCanvas } from '@/lib/image/editorTools';
import { Smile, Download, Type, CheckCircle2, Image as ImageIcon } from 'lucide-react';

const MEME_TEMPLATES = [
  { name: 'Drake Hotline Bling', url: 'https://imgflip.com/s/meme/Drake-Hotline-Bling.jpg' },
  { name: 'Distracted Boyfriend', url: 'https://imgflip.com/s/meme/Distracted-Boyfriend.jpg' },
  { name: 'Two Buttons', url: 'https://imgflip.com/s/meme/Two-Buttons.jpg' },
  { name: 'Change My Mind', url: 'https://imgflip.com/s/meme/Change-My-Mind.jpg' },
  { name: 'Buff Doge vs Cheems', url: 'https://imgflip.com/s/meme/Buff-Doge-vs-Cheems.png' }
];

export default function MemeGeneratorClient() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [topText, setTopText] = useState('WHEN YOU FINALLY RESIZE');
  const [bottomText, setBottomText] = useState('YOUR EXAM PHOTO IN 1 CLICK');
  const [fontSizeRatio, setFontSizeRatio] = useState(0.08);
  const [memeResultUrl, setMemeResultUrl] = useState<string | null>(null);

  const handleFileUpload = (file: UploadedFile) => {
    setUploadedFile(file);
  };

  const loadTemplate = async (templateUrl: string, name: string) => {
    try {
      const resp = await fetch(templateUrl);
      const blob = await resp.blob();
      const file = new File([blob], `${name.toLowerCase().replace(/\s+/g, '-')}.jpg`, { type: 'image/jpeg' });
      setUploadedFile({
        id: `template-${Date.now()}`,
        file,
        type: 'image/jpeg',
        previewUrl: URL.createObjectURL(blob),
        name: file.name,
        originalSizeKB: Math.round(blob.size / 1024),
        isPdf: false
      });
    } catch (e) {
      console.error(e);
    }
  };

  const updateMemeCanvas = async () => {
    if (!uploadedFile) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = renderMemeCanvas(img, topText, bottomText, fontSizeRatio);
      canvas.toBlob((blob) => {
        if (blob) {
          if (memeResultUrl) URL.revokeObjectURL(memeResultUrl);
          setMemeResultUrl(URL.createObjectURL(blob));
        }
      }, 'image/jpeg', 0.95);
    };
    img.src = uploadedFile.previewUrl;
  };

  useEffect(() => {
    let active = true;
    if (uploadedFile) {
      setTimeout(() => {
        if (active) updateMemeCanvas();
      }, 0);
    }
    return () => {
      active = false;
    };
  }, [uploadedFile, topText, bottomText, fontSizeRatio]);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Smile className="w-4 h-4 text-indigo-400" />
            <span>Client-Side Meme Generator</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            Meme Generator <span className="gradient-text">Online</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Create hilarious custom memes in seconds. Caption classic meme templates or upload your own pictures with high-impact text.
          </p>
        </div>

        {/* Template Selector Strip */}
        <div className="bg-[#0d121e] border border-white/10 p-4 rounded-3xl space-y-3 shadow-xl">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-indigo-400" /> Popular Meme Templates
          </label>
          <div className="flex flex-wrap gap-3">
            {MEME_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.name}
                onClick={() => loadTemplate(tmpl.url, tmpl.name)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-indigo-600/30 border border-white/10 hover:border-indigo-500 text-xs font-bold text-slate-200 transition-all flex items-center gap-2"
              >
                <span>{tmpl.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            {!uploadedFile ? (
              <DropzoneUpload uploadedFile={uploadedFile} onFileUpload={handleFileUpload} onClearFile={() => setUploadedFile(null)} />
            ) : (
              <div className="space-y-6 bg-[#0d121e] border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-white text-sm">Meme Caption Inputs</h3>
                  <button onClick={() => setUploadedFile(null)} className="text-xs text-rose-400 hover:underline font-bold">
                    Upload Different Photo
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-indigo-400" /> Top Meme Text
                    </label>
                    <input
                      type="text"
                      value={topText}
                      onChange={(e) => setTopText(e.target.value)}
                      placeholder="TOP TEXT..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white font-black text-sm uppercase focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Type className="w-4 h-4 text-indigo-400" /> Bottom Meme Text
                    </label>
                    <input
                      type="text"
                      value={bottomText}
                      onChange={(e) => setBottomText(e.target.value)}
                      placeholder="BOTTOM TEXT..."
                      className="w-full px-4 py-3 rounded-2xl bg-white/[0.04] border border-white/10 text-white font-black text-sm uppercase focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-300">
                      <span>Font Size Scale</span>
                      <span>{Math.round(fontSizeRatio * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0.04"
                      max="0.15"
                      step="0.01"
                      value={fontSizeRatio}
                      onChange={(e) => setFontSizeRatio(Number(e.target.value))}
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
              <span>Live Meme Preview</span>
            </h2>

            {memeResultUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
                <div className="p-2 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px]">
                  <img src={memeResultUrl} alt="Meme Result" className="max-h-[360px] w-auto object-contain rounded-lg" />
                </div>

                <a
                  href={memeResultUrl}
                  download={`meme-${uploadedFile?.name || 'custom.jpg'}`}
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Meme</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <Smile className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">Select or Upload Image</h4>
                <p className="text-xs text-slate-400">Choose a template above or upload a photo to generate your meme.</p>
              </div>
            )}
          </div>
        </div>

        <SeoContentSection
          title="Create Memes Online with Classic Impact Typography"
          description="FitMyForm's meme generator makes it easy to caption viral memes or custom photos with traditional Impact font and black outline stroke."
          faqs={[
            {
              question: 'How do I add custom text to my own photo to make a meme?',
              answer: 'Upload your image in the Dropzone, type your top text and bottom text in the boxes, and click Download Meme.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
