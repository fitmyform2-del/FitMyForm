'use client';

import React, { useState, useEffect } from 'react';
import { FileFormat } from '@/types/document';

const FORMATS: FileFormat[] = ['JPG', 'PNG', 'PDF'];
const SIZE_PRESETS = [
  { label: '20–50 KB (SSC Photo)', min: 20, max: 50 },
  { label: '10–20 KB (SSC Sig)', min: 10, max: 20 },
  { label: '50–100 KB (Declaration)', min: 50, max: 100 },
  { label: '20–300 KB (UPSC)', min: 20, max: 300 },
  { label: '50–500 KB (Marksheet)', min: 50, max: 500 }
];

interface SizeAndFormatSectionProps {
  format: FileFormat;
  minSizeKB: number;
  maxSizeKB: number;
  onFormatChange: (fmt: FileFormat) => void;
  onSizeRangeChange: (min: number, max: number) => void;
}

export function SizeAndFormatSection({
  format,
  minSizeKB,
  maxSizeKB,
  onFormatChange,
  onSizeRangeChange
}: SizeAndFormatSectionProps) {
  const [minStr, setMinStr] = useState(String(minSizeKB || 20));
  const [maxStr, setMaxStr] = useState(String(maxSizeKB || 50));

  useEffect(() => {
    setMinStr(String(minSizeKB || ''));
  }, [minSizeKB]);

  useEffect(() => {
    setMaxStr(String(maxSizeKB || ''));
  }, [maxSizeKB]);

  const commitMin = () => {
    const val = parseInt(minStr, 10);
    if (!isNaN(val) && val >= 0) onSizeRangeChange(val, maxSizeKB);
    else setMinStr(String(minSizeKB || 20));
  };

  const commitMax = () => {
    const val = parseInt(maxStr, 10);
    if (!isNaN(val) && val >= 0) onSizeRangeChange(minSizeKB, val);
    else setMaxStr(String(maxSizeKB || 50));
  };

  const stepMin = (delta: number) => {
    const next = Math.max(0, (parseInt(minStr, 10) || 0) + delta);
    setMinStr(String(next));
    onSizeRangeChange(next, maxSizeKB);
  };

  const stepMax = (delta: number) => {
    const next = Math.max(1, (parseInt(maxStr, 10) || 0) + delta);
    setMaxStr(String(next));
    onSizeRangeChange(minSizeKB, next);
  };

  return (
    <div className="space-y-3 pt-3 border-t border-white/10">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Format Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Target File Format:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {FORMATS.map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => onFormatChange(fmt)}
                className={`py-2.5 min-h-[44px] rounded-xl text-xs font-black font-mono border transition-all ${
                  format === fmt
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Size Range */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Target Size Limits (KB):
          </label>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => stepMin(-5)}
                className="w-7 h-[44px] bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold rounded-l-xl border border-white/15 flex items-center justify-center shrink-0 text-xs"
              >
                -
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={minStr}
                onChange={(e) => setMinStr(e.target.value.replace(/\D/g, ''))}
                onBlur={commitMin}
                onKeyDown={(e) => e.key === 'Enter' && commitMin()}
                placeholder="Min"
                className="w-full min-h-[44px] bg-[#080b11] text-white px-2 py-2.5 text-center text-xs font-mono border-y border-white/15 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => stepMin(5)}
                className="w-7 h-[44px] bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold rounded-r-xl border border-white/15 flex items-center justify-center shrink-0 text-xs"
              >
                +
              </button>
            </div>

            <span className="text-slate-400 text-[10px] font-black uppercase">TO</span>

            <div className="flex items-center flex-1">
              <button
                type="button"
                onClick={() => stepMax(-5)}
                className="w-7 h-[44px] bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold rounded-l-xl border border-white/15 flex items-center justify-center shrink-0 text-xs"
              >
                -
              </button>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={maxStr}
                onChange={(e) => setMaxStr(e.target.value.replace(/\D/g, ''))}
                onBlur={commitMax}
                onKeyDown={(e) => e.key === 'Enter' && commitMax()}
                placeholder="Max"
                className="w-full min-h-[44px] bg-[#080b11] text-white px-2 py-2.5 text-center text-xs font-mono border-y border-white/15 focus:outline-none focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={() => stepMax(5)}
                className="w-7 h-[44px] bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold rounded-r-xl border border-white/15 flex items-center justify-center shrink-0 text-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex flex-wrap gap-1.5 text-[11px] pt-1">
        <span className="text-slate-400 font-semibold self-center mr-1">Size Limits:</span>
        {SIZE_PRESETS.map((range, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setMinStr(String(range.min));
              setMaxStr(String(range.max));
              onSizeRangeChange(range.min, range.max);
            }}
            className="bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-300 font-medium px-2 py-1 min-h-[32px] rounded-lg transition-all"
          >
            {range.label}
          </button>
        ))}
      </div>
    </div>
  );
}
