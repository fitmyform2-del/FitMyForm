'use client';

import React, { useState } from 'react';
import {
  MemeText,
  MemeSticker,
  MemeLayoutMode,
  MemeImageSettings,
  MemeExportSettings,
  MemeImageOverlay,
  TemplateSlot
} from './memeTypes';
import { MemeTextControls } from './MemeTextControls';
import { MemeImageControls } from './MemeImageControls';
import { MemeLayoutControls } from './MemeLayoutControls';
import { MemeStickerControls } from './MemeStickerControls';
import { MemeFilterControls } from './MemeFilterControls';
import { Type, Image as ImageIcon, LayoutTemplate, Smile, Sliders, Download, Copy, Check } from 'lucide-react';

interface MemeControlsProps {
  texts: MemeText[];
  onUpdateText: (id: string, updates: Partial<MemeText>) => void;
  onAddText: () => void;
  onRemoveText: (id: string) => void;
  slots: TemplateSlot[];
  overlayImages: MemeImageOverlay[];
  onAddImageToSlot: (slot: TemplateSlot, file: File) => void;
  onAddCustomImage: (file: File) => void;
  onUpdateImage: (id: string, updates: Partial<MemeImageOverlay>) => void;
  onRemoveImage: (id: string) => void;
  onSwapSlots?: () => void;
  onCycleViralCaptions?: () => void;
  layout: MemeLayoutMode;
  onChangeLayout: (layout: MemeLayoutMode) => void;
  stickers: MemeSticker[];
  onAddSticker: (emoji: string) => void;
  onUpdateSticker: (id: string, updates: Partial<MemeSticker>) => void;
  onRemoveSticker: (id: string) => void;
  onClearStickers: () => void;
  imageSettings: MemeImageSettings;
  onUpdateImageSettings: (updates: Partial<MemeImageSettings>) => void;
  onResetImageSettings: () => void;
  exportSettings: MemeExportSettings;
  onChangeExportSettings: (updates: Partial<MemeExportSettings>) => void;
  onDownload: () => void;
  onCopyClipboard: () => void;
  isCopied: boolean;
  canExport: boolean;
}

type TabKey = 'text' | 'images' | 'layout' | 'stickers' | 'fx';

export function MemeControls({
  texts,
  onUpdateText,
  onAddText,
  onRemoveText,
  slots,
  overlayImages,
  onAddImageToSlot,
  onAddCustomImage,
  onUpdateImage,
  onRemoveImage,
  onSwapSlots,
  onCycleViralCaptions,
  layout,
  onChangeLayout,
  stickers,
  onAddSticker,
  onUpdateSticker,
  onRemoveSticker,
  onClearStickers,
  imageSettings,
  onUpdateImageSettings,
  onResetImageSettings,
  exportSettings,
  onChangeExportSettings,
  onDownload,
  onCopyClipboard,
  isCopied,
  canExport
}: MemeControlsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>(slots.length > 0 ? 'images' : 'text');

  return (
    <div className="fmf-panel p-5 space-y-5">
      {/* Tab Navigation */}
      <div className="grid grid-cols-5 gap-1 p-1 rounded-xl bg-black/40 border border-white/5">
        <button
          type="button"
          onClick={() => setActiveTab('images')}
          className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer relative ${
            activeTab === 'images' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Images</span>
          {slots.length > 0 && (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 absolute top-1.5 right-1.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'text' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Text</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('layout')}
          className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'layout' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutTemplate className="w-3.5 h-3.5" />
          <span>Layout</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stickers')}
          className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'stickers' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>Stickers</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('fx')}
          className={`py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer ${
            activeTab === 'fx' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Effects</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[260px]">
        {activeTab === 'images' && (
          <MemeImageControls
            slots={slots}
            overlayImages={overlayImages}
            onAddImageToSlot={onAddImageToSlot}
            onAddCustomImage={onAddCustomImage}
            onUpdateImage={onUpdateImage}
            onRemoveImage={onRemoveImage}
            onSwapSlots={onSwapSlots}
          />
        )}

        {activeTab === 'text' && (
          <MemeTextControls
            texts={texts}
            onUpdateText={onUpdateText}
            onAddText={onAddText}
            onRemoveText={onRemoveText}
            onCycleViralCaptions={onCycleViralCaptions}
          />
        )}

        {activeTab === 'layout' && (
          <MemeLayoutControls layout={layout} onChangeLayout={onChangeLayout} />
        )}

        {activeTab === 'stickers' && (
          <MemeStickerControls
            stickers={stickers}
            onAddSticker={onAddSticker}
            onUpdateSticker={onUpdateSticker}
            onRemoveSticker={onRemoveSticker}
            onClearStickers={onClearStickers}
          />
        )}

        {activeTab === 'fx' && (
          <MemeFilterControls
            settings={imageSettings}
            onUpdateSettings={onUpdateImageSettings}
            onResetSettings={onResetImageSettings}
          />
        )}
      </div>

      {/* Export & Action Footer */}
      <div className="pt-4 border-t border-white/[0.08] space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-300">Export Format</span>
          <div className="inline-flex rounded-lg bg-black/40 p-0.5 border border-white/10">
            {(['image/jpeg', 'image/png', 'image/webp'] as const).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => onChangeExportSettings({ format: fmt })}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                  exportSettings.format === fmt ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                {fmt === 'image/jpeg' ? 'JPG' : fmt === 'image/png' ? 'PNG' : 'WEBP'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            disabled={!canExport}
            onClick={onCopyClipboard}
            className="py-3 px-3 rounded-xl bg-white/[0.05] hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-300" />}
            <span>{isCopied ? 'Copied Image!' : 'Copy to Clipboard'}</span>
          </button>

          <button
            type="button"
            disabled={!canExport}
            onClick={onDownload}
            className="fmf-btn-primary py-3 px-4 text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>Download Meme</span>
          </button>
        </div>
      </div>
    </div>
  );
}
