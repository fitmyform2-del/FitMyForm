'use client';

import React from 'react';

interface DimensionInputsProps {
  width?: number;
  height?: number;
  onWidthChange: (val: number) => void;
  onHeightChange: (val: number) => void;
}

export function DimensionInputs({ width, height, onWidthChange, onHeightChange }: DimensionInputsProps) {
  return (
    <div className="space-y-3 pt-3 border-t border-white/10">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Target Dimensions (Pixels):
        </label>
        <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
          {width || 0} × {height || 0} px
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Width (px)</span>
          <input
            type="number"
            value={width || ''}
            onChange={(e) => onWidthChange(Number(e.target.value))}
            placeholder="e.g. 200"
            className="w-full min-h-[44px] bg-[#080b11] text-white px-3.5 py-2.5 rounded-xl border border-white/15 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">Height (px)</span>
          <input
            type="number"
            value={height || ''}
            onChange={(e) => onHeightChange(Number(e.target.value))}
            placeholder="e.g. 230"
            className="w-full min-h-[44px] bg-[#080b11] text-white px-3.5 py-2.5 rounded-xl border border-white/15 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Dimension Quick Preset Chips */}
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        <span className="text-slate-400 font-semibold self-center mr-1">Presets:</span>
        {[
          { label: '200 × 230 (SSC/Bank Photo)', w: 200, h: 230 },
          { label: '140 × 60 (Standard Sig)', w: 140, h: 60 },
          { label: '350 × 350 (UPSC)', w: 350, h: 350 },
          { label: '350 × 450 (RRB/Passport)', w: 350, h: 450 },
          { label: '240 × 240 (Thumb Print)', w: 240, h: 240 }
        ].map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              onWidthChange(preset.w);
              onHeightChange(preset.h);
            }}
            className="bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-300 font-medium px-2.5 py-1.5 min-h-[36px] rounded-lg transition-all"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
