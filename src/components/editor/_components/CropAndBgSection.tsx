'use client';

import React from 'react';
import { Crop, Palette } from 'lucide-react';
import { CropMode } from '@/types/document';

const CROP_MODES: { mode: CropMode; label: string }[] = [
  { mode: 'fill', label: 'Fill Padding' },
  { mode: 'center', label: 'Center Crop' },
  { mode: 'stretch', label: 'Stretch Exact' },
  { mode: 'manual', label: 'Visual Manual Crop' }
];

const BG_COLORS = [
  { color: '#FFFFFF', label: 'White' },
  { color: '#F3F4F6', label: 'Light Gray' },
  { color: '#000000', label: 'Black' }
];

interface CropAndBgSectionProps {
  cropMode: CropMode;
  bgColor?: string;
  onCropModeChange: (mode: CropMode) => void;
  onBgColorChange: (color: string) => void;
  onOpenManualCropper: () => void;
}

export function CropAndBgSection({
  cropMode,
  bgColor = '#FFFFFF',
  onCropModeChange,
  onBgColorChange,
  onOpenManualCropper
}: CropAndBgSectionProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block flex items-center justify-between">
          <span>Aspect Ratio & Crop Mode:</span>
          {cropMode === 'manual' && (
            <span className="text-[10px] text-emerald-400 font-bold">Visual Crop Active</span>
          )}
        </label>
        <div className="grid grid-cols-2 gap-2">
          {CROP_MODES.map((item) => (
            <button
              key={item.mode}
              type="button"
              onClick={() => {
                onCropModeChange(item.mode);
                if (item.mode === 'manual') onOpenManualCropper();
              }}
              className={`py-2.5 px-3 min-h-[44px] rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                cropMode === item.mode
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white'
              }`}
            >
              <Crop className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-indigo-400" />
          <span>Background Color (For Padding):</span>
        </label>
        <div className="flex items-center gap-2">
          {BG_COLORS.map((c) => (
            <button
              key={c.color}
              type="button"
              onClick={() => onBgColorChange(c.color)}
              className={`flex-1 py-2 min-h-[44px] rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                bgColor === c.color
                  ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm'
                  : 'border-white/10 bg-white/[0.04] text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full border border-slate-600 shadow-sm" style={{ backgroundColor: c.color }} />
              <span>{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
