'use client';

import React, { useState, useEffect } from 'react';
import { DimensionUnit, toPixels, fromPixels, COMMON_DPIS } from '@/lib/utils/unitConverter';

interface DimensionInputsProps {
  width?: number;
  height?: number;
  onWidthChange: (val: number) => void;
  onHeightChange: (val: number) => void;
}

export function DimensionInputs({ width, height, onWidthChange, onHeightChange }: DimensionInputsProps) {
  const [unit, setUnit] = useState<DimensionUnit>('px');
  const [dpi, setDpi] = useState<number>(200);

  // Local display strings based on active unit
  const [localW, setLocalW] = useState(String(width || ''));
  const [localH, setLocalH] = useState(String(height || ''));

  useEffect(() => {
    if (unit === 'px') {
      setLocalW(String(width || ''));
      setLocalH(String(height || ''));
    } else {
      setLocalW(String(fromPixels(width || 0, unit, dpi) || ''));
      setLocalH(String(fromPixels(height || 0, unit, dpi) || ''));
    }
  }, [width, height, unit, dpi]);

  const commitW = (valStr = localW) => {
    const num = parseFloat(valStr);
    if (!isNaN(num) && num > 0) {
      const px = toPixels(num, unit, dpi);
      onWidthChange(px);
    } else {
      setLocalW(String(unit === 'px' ? width || '' : fromPixels(width || 0, unit, dpi)));
    }
  };

  const commitH = (valStr = localH) => {
    const num = parseFloat(valStr);
    if (!isNaN(num) && num > 0) {
      const px = toPixels(num, unit, dpi);
      onHeightChange(px);
    } else {
      setLocalH(String(unit === 'px' ? height || '' : fromPixels(height || 0, unit, dpi)));
    }
  };

  const step = (type: 'w' | 'h', delta: number) => {
    if (type === 'w') {
      const cur = parseFloat(localW) || 0;
      const stepVal = unit === 'px' ? 10 : 0.5;
      const next = Math.max(1, cur + delta * stepVal);
      const str = unit === 'px' ? String(Math.round(next)) : next.toFixed(1);
      setLocalW(str);
      commitW(str);
    } else {
      const cur = parseFloat(localH) || 0;
      const stepVal = unit === 'px' ? 10 : 0.5;
      const next = Math.max(1, cur + delta * stepVal);
      const str = unit === 'px' ? String(Math.round(next)) : next.toFixed(1);
      setLocalH(str);
      commitH(str);
    }
  };

  const applyPreset = (pxW: number, pxH: number) => {
    onWidthChange(pxW);
    onHeightChange(pxH);
    if (unit === 'px') {
      setLocalW(String(pxW));
      setLocalH(String(pxH));
    } else {
      setLocalW(String(fromPixels(pxW, unit, dpi)));
      setLocalH(String(fromPixels(pxH, unit, dpi)));
    }
  };

  return (
    <div className="space-y-3 pt-3 border-t border-white/10">
      {/* Header with Unit Selector & DPI */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Target Dimensions:
        </label>
        <div className="flex items-center gap-1.5">
          {/* Unit Toggle Tabs */}
          <div className="bg-[#080b11] p-0.5 rounded-lg border border-white/10 flex items-center">
            {(['px', 'cm', 'mm', 'in'] as DimensionUnit[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`px-2 py-0.5 text-[11px] font-bold rounded-md transition-all ${
                  unit === u ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {u}
              </button>
            ))}
          </div>

          {/* DPI dropdown if physical unit */}
          {unit !== 'px' && (
            <select
              value={dpi}
              onChange={(e) => setDpi(Number(e.target.value))}
              aria-label="Target DPI resolution"
              className="bg-[#080b11] text-[11px] text-slate-300 font-mono border border-white/15 rounded-lg px-1.5 py-1 focus:outline-none"
            >
              {COMMON_DPIS.map((d) => (
                <option key={d.value} value={d.value}>{d.value} DPI</option>
              ))}
            </select>
          )}

          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-500/20">
            {width || 0}×{height || 0}px
          </span>
        </div>
      </div>

      {/* Width and Height inputs with Steppers */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Width ({unit})
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => step('w', -1)}
              className="w-8 h-[44px] bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold rounded-l-xl border border-white/15 flex items-center justify-center shrink-0"
            >
              -
            </button>
            <input
              type="text"
              inputMode="decimal"
              value={localW}
              onChange={(e) => setLocalW(e.target.value.replace(/[^0-9.]/g, ''))}
              onBlur={() => commitW()}
              onKeyDown={(e) => e.key === 'Enter' && commitW()}
              placeholder={unit === 'px' ? '200' : '3.5'}
              className="w-full min-h-[44px] bg-[#080b11] text-white px-2 py-2.5 text-center text-sm font-mono border-y border-white/15 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => step('w', 1)}
              className="w-8 h-[44px] bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold rounded-r-xl border border-white/15 flex items-center justify-center shrink-0"
            >
              +
            </button>
          </div>
        </div>

        <div>
          <span className="text-[11px] font-semibold text-slate-400 block mb-1">
            Height ({unit})
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => step('h', -1)}
              className="w-8 h-[44px] bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold rounded-l-xl border border-white/15 flex items-center justify-center shrink-0"
            >
              -
            </button>
            <input
              type="text"
              inputMode="decimal"
              value={localH}
              onChange={(e) => setLocalH(e.target.value.replace(/[^0-9.]/g, ''))}
              onBlur={() => commitH()}
              onKeyDown={(e) => e.key === 'Enter' && commitH()}
              placeholder={unit === 'px' ? '230' : '4.5'}
              className="w-full min-h-[44px] bg-[#080b11] text-white px-2 py-2.5 text-center text-sm font-mono border-y border-white/15 focus:outline-none focus:border-indigo-500"
            />
            <button
              type="button"
              onClick={() => step('h', 1)}
              className="w-8 h-[44px] bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-bold rounded-r-xl border border-white/15 flex items-center justify-center shrink-0"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* Dimension Quick Preset Chips */}
      <div className="flex flex-wrap gap-1.5 text-[11px]">
        <span className="text-slate-400 font-semibold self-center mr-1">Presets:</span>
        {[
          { label: '3.5×4.5 cm (Passport/SSC)', w: 276, h: 354 },
          { label: '200×230 px (Bank Photo)', w: 200, h: 230 },
          { label: '140×60 px (Standard Sig)', w: 140, h: 60 },
          { label: '350×350 px (UPSC)', w: 350, h: 350 },
          { label: '2×2 inch (US Visa)', w: 400, h: 400 }
        ].map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => applyPreset(preset.w, preset.h)}
            className="bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-300 font-medium px-2.5 py-1.5 min-h-[36px] rounded-lg transition-all cursor-pointer"
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
}
