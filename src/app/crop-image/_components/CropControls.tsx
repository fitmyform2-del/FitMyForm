'use client';

import React from 'react';
import { Sliders } from 'lucide-react';

interface CropControlsProps {
  aspectRatio: number | null;
  cropBox: { x: number; y: number; width: number; height: number };
  onAspectChange: (ratio: number | null) => void;
  onCropBoxChange: (box: { x: number; y: number; width: number; height: number }) => void;
}

export function CropControls({
  aspectRatio,
  cropBox,
  onAspectChange,
  onCropBoxChange
}: CropControlsProps) {
  return (
    <div className="space-y-4">
      {/* Aspect Ratio Selector */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Sliders className="w-4 h-4 text-indigo-400" /> Aspect Ratio Presets
        </label>
        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Freeform', ratio: null },
            { label: '1:1 Square', ratio: 1 },
            { label: '16:9 Landscape', ratio: 16 / 9 },
            { label: '4:3 Standard', ratio: 4 / 3 },
            { label: '3:2 Photo', ratio: 3 / 2 },
            { label: '9:16 Story', ratio: 9 / 16 }
          ].map((item) => (
            <button
              key={item.label}
              onClick={() => onAspectChange(item.ratio)}
              className={`px-3 py-1.5 min-h-[44px] rounded-xl text-xs font-bold border transition-all ${
                aspectRatio === item.ratio
                  ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
                  : 'bg-white/[0.04] text-slate-300 border-white/10 hover:bg-white/[0.08]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Range Sliders */}
      <div className="grid grid-cols-2 gap-4 bg-white/[0.02] p-4 rounded-2xl border border-white/5">
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Crop Width</span>
            <span>{cropBox.width}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={cropBox.width}
            onChange={(e) => {
              const w = Number(e.target.value);
              const h = aspectRatio ? Math.min(100, w / aspectRatio) : cropBox.height;
              onCropBoxChange({ ...cropBox, width: w, height: h });
            }}
            className="w-full min-h-[44px] accent-indigo-500"
          />
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-300">
            <span>Crop Height</span>
            <span>{cropBox.height}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="100"
            value={cropBox.height}
            onChange={(e) => {
              const h = Number(e.target.value);
              const w = aspectRatio ? Math.min(100, h * aspectRatio) : cropBox.width;
              onCropBoxChange({ ...cropBox, height: h, width: w });
            }}
            className="w-full min-h-[44px] accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
}
