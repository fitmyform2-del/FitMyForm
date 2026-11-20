'use client';

import React from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { DropzoneUpload } from '@/components/upload/DropzoneUpload';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { Smile } from 'lucide-react';
import { MemeTemplatesBar } from './_components/MemeTemplatesBar';
import { MemeStage } from './_components/MemeStage';
import { MemeControls } from './_components/MemeControls';
import { useMemeState } from './_components/useMemeState';

export default function MemeGeneratorClient() {
  const {
    uploadedFile,
    setUploadedFile,
    layout,
    setLayout,
    texts,
    stickers,
    setStickers,
    overlayImages,
    slots,
    imageSettings,
    setImageSettings,
    exportSettings,
    setExportSettings,
    memeResultUrl,
    isRendering,
    isCopied,
    loadPreset,
    handleAddImageToSlot,
    handleSwapSlots,
    handleCycleViralCaptions,
    handleAddCustomImage,
    handleUpdateImage,
    handleRemoveImage,
    handleAddText,
    handleUpdateText,
    handleRemoveText,
    handleAddSticker,
    handleDownload,
    handleCopyClipboard,
    handleResetAll
  } = useMemeState();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Smile className="w-3.5 h-3.5 text-amber-400" />
            <span>Meme Studio Pro</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Meme Generator <span className="text-amber-400">Online</span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-slate-300">
            Create viral custom memes with classic captions, modern headers, stickers, and deep fry filters. 100% free & watermark-free.
          </p>
        </div>

        {/* 1-Click Templates Bar */}
        <MemeTemplatesBar
          onSelectTemplate={loadPreset}
          onRandomCaption={(top, bottom) => {
            handleUpdateText('1', { text: top });
            handleUpdateText('2', { text: bottom });
          }}
        />

        {!uploadedFile ? (
          <div className="max-w-2xl mx-auto">
            <DropzoneUpload
              uploadedFile={uploadedFile}
              onFileUpload={setUploadedFile}
              onClearFile={() => setUploadedFile(null)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <MemeStage
                uploadedFile={uploadedFile}
                memeResultUrl={memeResultUrl}
                slots={slots}
                overlayImages={overlayImages}
                texts={texts}
                isRendering={isRendering}
                onAddImageToSlot={handleAddImageToSlot}
                onRemoveImage={handleRemoveImage}
                onSwapSlots={handleSwapSlots}
                onUpdateTextPosition={(id, x, y) => handleUpdateText(id, { xPercent: x, yPercent: y })}
                onChangeImage={() => setUploadedFile(null)}
                onResetAll={handleResetAll}
              />
            </div>

            <div className="lg:col-span-5">
              <MemeControls
                texts={texts}
                onUpdateText={handleUpdateText}
                onAddText={handleAddText}
                onRemoveText={handleRemoveText}
                slots={slots}
                overlayImages={overlayImages}
                onAddImageToSlot={handleAddImageToSlot}
                onAddCustomImage={handleAddCustomImage}
                onUpdateImage={handleUpdateImage}
                onRemoveImage={handleRemoveImage}
                onSwapSlots={handleSwapSlots}
                onCycleViralCaptions={handleCycleViralCaptions}
                layout={layout}
                onChangeLayout={setLayout}
                stickers={stickers}
                onAddSticker={handleAddSticker}
                onUpdateSticker={(id, upd) =>
                  setStickers((prev) => prev.map((s) => (s.id === id ? { ...s, ...upd } : s)))
                }
                onRemoveSticker={(id) => setStickers((prev) => prev.filter((s) => s.id !== id))}
                onClearStickers={() => setStickers([])}
                imageSettings={imageSettings}
                onUpdateImageSettings={(upd) => setImageSettings((prev) => ({ ...prev, ...upd }))}
                onResetImageSettings={() =>
                  setImageSettings({
                    filter: 'none',
                    brightness: 100,
                    contrast: 100,
                    saturation: 100,
                    rotation: 0,
                    flipHorizontal: false,
                    flipVertical: false,
                    watermarkText: 'FitMyForm Meme Studio',
                    showWatermark: false
                  })
                }
                exportSettings={exportSettings}
                onChangeExportSettings={(upd) => setExportSettings((prev) => ({ ...prev, ...upd }))}
                onDownload={handleDownload}
                onCopyClipboard={handleCopyClipboard}
                isCopied={isCopied}
                canExport={Boolean(uploadedFile)}
              />
            </div>
          </div>
        )}

        <SeoContentSection
          title="Free Online Meme Generator with Pro Studio Features"
          description="Design memes effortlessly. Pick viral meme templates or upload your own images with Impact fonts, Twitter-style headers, stickers, deep fried effects, and instant clipboard copy."
          faqs={[
            {
              question: 'Are memes watermarked by FitMyForm?',
              answer: 'No! All memes generated in Meme Studio Pro are 100% watermark-free by default, with an optional toggle to add your own custom creator tag.'
            },
            {
              question: 'Can I add multiple images and photos to a template?',
              answer: 'Yes! Popular templates provide dedicated slots (like the Drake Dislike / Like panels or Trade Offer boxes) to upload photos directly into position, plus you can upload custom floating images anywhere on the canvas.'
            },
            {
              question: 'Can I copy the meme directly without downloading?',
              answer: 'Yes! Click "Copy to Clipboard" to paste your meme directly into WhatsApp, Telegram, Discord, Twitter, or Slack.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
