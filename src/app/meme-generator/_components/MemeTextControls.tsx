'use client';

import React, { useState } from 'react';
import { MemeText, MEME_FONTS, TEXT_STYLE_PRESETS, TextStylePreset } from './memeTypes';
import { Plus, Trash2, AlignLeft, AlignCenter, AlignRight, Sparkles } from 'lucide-react';

interface MemeTextControlsProps {
  texts: MemeText[];
  onUpdateText: (id: string, updates: Partial<MemeText>) => void;
  onAddText: () => void;
  onRemoveText: (id: string) => void;
  onCycleViralCaptions?: () => void;
}

const COLOR_SWATCHES = ['#FFFFFF', '#FACC15', '#000000', '#EF4444', '#38BDF8', '#4ADE80'];

export function MemeTextControls({
  texts,
  onUpdateText,
  onAddText,
  onRemoveText,
  onCycleViralCaptions
}: MemeTextControlsProps) {
  const [activeTextId, setActiveTextId] = useState<string>(texts[0]?.id || '');
  const activeItem = texts.find((t) => t.id === activeTextId) || texts[0];

  const applyPreset = (p: TextStylePreset) => {
    if (!activeItem) return;
    onUpdateText(activeItem.id, {
      fontFamily: p.fontFamily,
      color: p.color,
      strokeColor: p.strokeColor,
      strokeWidth: p.strokeWidth,
      shadow: p.shadow,
      isUppercase: p.isUppercase
    });
  };

  return (
    <div className="space-y-3.5">
      {/* Top Action Row: Viral Captions & Add Layer */}
      <div className="flex items-center justify-between gap-2">
        {onCycleViralCaptions && (
          <button
            type="button"
            onClick={onCycleViralCaptions}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>🔥 Viral Captions</span>
          </button>
        )}
        <button
          type="button"
          onClick={onAddText}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Layer</span>
        </button>
      </div>

      {/* Layer selector tabs */}
      <div className="flex flex-wrap gap-1.5">
        {texts.map((item, idx) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setActiveTextId(item.id)}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeItem?.id === item.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white/5 hover:bg-white/10 text-slate-300'
            }`}
          >
            {idx === 0 ? 'Top' : idx === 1 ? 'Bottom' : `#${idx + 1}`}
          </button>
        ))}
      </div>

      {activeItem && (
        <div className="space-y-3 p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-300">Caption Text</label>
              {texts.length > 2 && (
                <button type="button" onClick={() => onRemoveText(activeItem.id)} className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer">
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              )}
            </div>
            <textarea
              rows={2}
              value={activeItem.text}
              onChange={(e) => onUpdateText(activeItem.id, { text: e.target.value })}
              placeholder="Type caption..."
              className="w-full px-3 py-2 rounded-xl bg-black/50 border border-white/10 text-white font-bold text-sm focus:border-blue-500 focus:outline-none resize-none"
            />
          </div>

          {/* Quick Style Presets in 1 click */}
          <div>
            <label className="text-[11px] font-semibold text-slate-400 block mb-1">1-Click Style Preset</label>
            <div className="flex flex-wrap gap-1">
              {TEXT_STYLE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-2 py-1 rounded-md bg-white/[0.04] hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-slate-200 cursor-pointer"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Font & Uppercase */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Font</label>
              <select
                value={activeItem.fontFamily}
                onChange={(e) => onUpdateText(activeItem.id, { fontFamily: e.target.value })}
                className="w-full px-2 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-white focus:outline-none"
              >
                {MEME_FONTS.map((f) => (<option key={f.id} value={f.id}>{f.name}</option>))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Casing</label>
              <button
                type="button"
                onClick={() => onUpdateText(activeItem.id, { isUppercase: !activeItem.isUppercase })}
                className={`w-full py-1.5 px-2 rounded-lg text-xs font-bold border transition-all cursor-pointer ${
                  activeItem.isUppercase ? 'bg-blue-600/20 border-blue-500/50 text-blue-300' : 'bg-white/5 border-white/10 text-slate-300'
                }`}
              >
                {activeItem.isUppercase ? 'ALL CAPS' : 'Normal Case'}
              </button>
            </div>
          </div>

          {/* Color & Outline */}
          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/5">
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Color</label>
              <div className="flex items-center gap-1">
                {COLOR_SWATCHES.map((hex) => (
                  <button
                    key={hex}
                    type="button"
                    onClick={() => onUpdateText(activeItem.id, { color: hex })}
                    style={{ backgroundColor: hex }}
                    className={`w-4 h-4 rounded-full border cursor-pointer ${activeItem.color === hex ? 'scale-125 border-blue-400 ring-2 ring-blue-500/50' : 'border-white/20'}`}
                  />
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400 block mb-1">Outline</label>
              <button
                type="button"
                onClick={() => onUpdateText(activeItem.id, { strokeColor: activeItem.strokeColor === 'transparent' ? '#000000' : 'transparent' })}
                className={`px-2 py-0.5 rounded text-[11px] font-bold border cursor-pointer ${
                  activeItem.strokeColor !== 'transparent' ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-white/5 border-white/10 text-slate-400'
                }`}
              >
                {activeItem.strokeColor !== 'transparent' ? 'Stroke ON' : 'Stroke OFF'}
              </button>
            </div>
          </div>

          {/* Size & Alignment */}
          <div className="flex items-center justify-between pt-1 border-t border-white/5">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Size:</span>
              <button
                type="button"
                onClick={() => onUpdateText(activeItem.id, { fontSizeRatio: Math.max(0.04, activeItem.fontSizeRatio - 0.01) })}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => onUpdateText(activeItem.id, { fontSizeRatio: Math.min(0.16, activeItem.fontSizeRatio + 0.01) })}
                className="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer"
              >
                A+
              </button>
              <span className="text-slate-300 ml-1">{Math.round(activeItem.fontSizeRatio * 1000)}%</span>
            </div>

            <div className="inline-flex rounded-lg bg-black/40 p-0.5 border border-white/10">
              {(['left', 'center', 'right'] as const).map((aln) => (
                <button
                  key={aln}
                  type="button"
                  onClick={() => onUpdateText(activeItem.id, { align: aln })}
                  className={`p-1 rounded transition-all cursor-pointer ${activeItem.align === aln ? 'bg-blue-600 text-white' : 'text-slate-400'}`}
                >
                  {aln === 'left' && <AlignLeft className="w-3 h-3" />}
                  {aln === 'center' && <AlignCenter className="w-3 h-3" />}
                  {aln === 'right' && <AlignRight className="w-3 h-3" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
