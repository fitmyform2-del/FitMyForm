'use client';

import React, { useState, useEffect } from 'react';
import { Crop, RefreshCw, ArrowRight, Sliders } from 'lucide-react';
import { CropBox } from './cropMath';

interface CropSidebarProps {
  aspectRatio: number | null;
  cropBox: CropBox;
  naturalWidth: number;
  naturalHeight: number;
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  exportWidth: number | null;
  exportHeight: number | null;
  isProcessing: boolean;
  onAspectChange: (ratio: number | null) => void;
  onCropBoxChange: (box: CropBox) => void;
  onOutputFormatChange: (fmt: 'image/jpeg' | 'image/png' | 'image/webp') => void;
  onQualityChange: (q: number) => void;
  onExportDimChange: (w: number | null, h: number | null) => void;
  onExecuteCrop: () => void;
}

const PRESETS: { label: string; sub: string; ratio: number | null; boxClass: string }[] = [
  { label: 'Freeform', sub: 'Any ratio', ratio: null, boxClass: 'w-4 h-3 border-dashed' },
  { label: '1:1', sub: 'Square', ratio: 1, boxClass: 'w-3.5 h-3.5' },
  { label: 'Passport', sub: '3.5 : 4.5', ratio: 3.5 / 4.5, boxClass: 'w-3 h-4' },
  { label: 'Signature', sub: '140 : 60', ratio: 140 / 60, boxClass: 'w-5 h-2.5' },
  { label: '4:3', sub: 'Photo', ratio: 4 / 3, boxClass: 'w-4 h-3' },
  { label: '16:9', sub: 'Widescreen', ratio: 16 / 9, boxClass: 'w-5 h-2.5' },
  { label: '4:5', sub: 'Portrait', ratio: 4 / 5, boxClass: 'w-3 h-3.5' },
  { label: '9:16', sub: 'Story', ratio: 9 / 16, boxClass: 'w-2.5 h-4' }
];

export function CropSidebar({
  aspectRatio,
  cropBox,
  naturalWidth,
  naturalHeight,
  outputFormat,
  quality,
  exportWidth,
  exportHeight,
  isProcessing,
  onAspectChange,
  onCropBoxChange,
  onOutputFormatChange,
  onQualityChange,
  onExportDimChange,
  onExecuteCrop
}: CropSidebarProps) {
  const [localW, setLocalW] = useState(String(cropBox.width));
  const [localH, setLocalH] = useState(String(cropBox.height));
  const [localX, setLocalX] = useState(String(cropBox.x));
  const [localY, setLocalY] = useState(String(cropBox.y));
  const [resizeOutput, setResizeOutput] = useState(Boolean(exportWidth && exportHeight));
  const [outWStr, setOutWStr] = useState(String(exportWidth || 200));
  const [outHStr, setOutHStr] = useState(String(exportHeight || 230));

  useEffect(() => {
    setLocalW(String(cropBox.width));
    setLocalH(String(cropBox.height));
    setLocalX(String(cropBox.x));
    setLocalY(String(cropBox.y));
  }, [cropBox.width, cropBox.height, cropBox.x, cropBox.y]);

  const commitWidth = () => {
    const val = parseInt(localW, 10);
    const w = isNaN(val) ? 30 : Math.max(30, Math.min(naturalWidth - cropBox.x, val));
    setLocalW(String(w));
    let h = cropBox.height;
    if (aspectRatio) {
      h = Math.round(w / aspectRatio);
      if (cropBox.y + h > naturalHeight) h = naturalHeight - cropBox.y;
      setLocalH(String(h));
    }
    onCropBoxChange({ ...cropBox, width: w, height: h });
  };

  const commitHeight = () => {
    const val = parseInt(localH, 10);
    const h = isNaN(val) ? 30 : Math.max(30, Math.min(naturalHeight - cropBox.y, val));
    setLocalH(String(h));
    let w = cropBox.width;
    if (aspectRatio) {
      w = Math.round(h * aspectRatio);
      if (cropBox.x + w > naturalWidth) w = naturalWidth - cropBox.x;
      setLocalW(String(w));
    }
    onCropBoxChange({ ...cropBox, width: w, height: h });
  };

  const commitX = () => {
    const val = parseInt(localX, 10);
    const x = isNaN(val) ? 0 : Math.max(0, Math.min(naturalWidth - cropBox.width, val));
    setLocalX(String(x));
    onCropBoxChange({ ...cropBox, x });
  };

  const commitY = () => {
    const val = parseInt(localY, 10);
    const y = isNaN(val) ? 0 : Math.max(0, Math.min(naturalHeight - cropBox.height, val));
    setLocalY(String(y));
    onCropBoxChange({ ...cropBox, y });
  };

  const toggleResizeOutput = (enabled: boolean) => {
    setResizeOutput(enabled);
    if (!enabled) {
      onExportDimChange(null, null);
    } else {
      const w = parseInt(outWStr, 10) || cropBox.width;
      const h = parseInt(outHStr, 10) || cropBox.height;
      onExportDimChange(w, h);
    }
  };

  return (
    <div className="fmf-panel p-5 sm:p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-extrabold text-white text-sm">Crop & Export Inspector</h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 font-bold">
          {resizeOutput && exportWidth && exportHeight
            ? `${exportWidth}×${exportHeight}`
            : `${cropBox.width}×${cropBox.height}`} px
        </span>
      </div>

      {/* Visual Aspect Ratio Grid */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200">Aspect Ratio</label>
        <div className="grid grid-cols-4 gap-1.5">
          {PRESETS.map((item) => {
            const active = aspectRatio === item.ratio;
            return (
              <button
                key={item.label}
                type="button"
                onClick={() => onAspectChange(item.ratio)}
                className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                  active
                    ? 'bg-blue-600/25 border-blue-400 text-white shadow-sm'
                    : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                }`}
              >
                <span className={`border rounded-[2px] ${item.boxClass} ${active ? 'border-blue-300' : 'border-slate-500'}`} />
                <span className="text-[11px] font-bold leading-none mt-0.5">{item.label}</span>
                <span className="text-[9px] text-slate-400 leading-none">{item.sub}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Exact Crop Coordinates */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200">Crop Area (Pixels)</label>
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: 'Width', val: localW, set: setLocalW, commit: commitWidth },
            { label: 'Height', val: localH, set: setLocalH, commit: commitHeight },
            { label: 'Offset X', val: localX, set: setLocalX, commit: commitX },
            { label: 'Offset Y', val: localY, set: setLocalY, commit: commitY }
          ].map((field) => (
            <div key={field.label} className="bg-black/35 border border-white/10 rounded-xl px-3 py-2 focus-within:border-blue-500">
              <label className="text-[10px] font-bold text-slate-400 uppercase block">{field.label}</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={field.val}
                onChange={(e) => field.set(e.target.value.replace(/\D/g, ''))}
                onBlur={field.commit}
                onKeyDown={(e) => e.key === 'Enter' && field.commit()}
                className="w-full bg-transparent text-sm text-white font-mono font-bold focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Optional Export Resize */}
      <div className="bg-white/[0.03] border border-white/10 rounded-xl p-3.5 space-y-3">
        <label className="flex items-center justify-between cursor-pointer text-xs">
          <span className="font-bold text-slate-200">Resize output to exact pixels</span>
          <input
            type="checkbox"
            checked={resizeOutput}
            onChange={(e) => toggleResizeOutput(e.target.checked)}
            className="w-4 h-4 accent-blue-600 cursor-pointer"
          />
        </label>
        {resizeOutput && (
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Export W (px)</span>
              <input
                type="text"
                inputMode="numeric"
                value={outWStr}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  setOutWStr(v);
                  const n = parseInt(v, 10);
                  if (n >= 10) onExportDimChange(n, parseInt(outHStr, 10) || cropBox.height);
                }}
                className="w-full mt-1 bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Export H (px)</span>
              <input
                type="text"
                inputMode="numeric"
                value={outHStr}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '');
                  setOutHStr(v);
                  const n = parseInt(v, 10);
                  if (n >= 10) onExportDimChange(parseInt(outWStr, 10) || cropBox.width, n);
                }}
                className="w-full mt-1 bg-black/50 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono"
              />
            </div>
          </div>
        )}
      </div>

      {/* Output Format & Quality */}
      <div className="space-y-3 pt-1">
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { label: 'JPG', val: 'image/jpeg' },
              { label: 'PNG', val: 'image/png' },
              { label: 'WEBP', val: 'image/webp' }
            ] as const
          ).map((fmt) => (
            <button
              key={fmt.label}
              type="button"
              onClick={() => onOutputFormatChange(fmt.val)}
              className={`py-2 rounded-xl border text-xs font-bold font-mono cursor-pointer transition-all ${
                outputFormat === fmt.val
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>

        {outputFormat !== 'image/png' && (
          <div>
            <div className="flex justify-between text-slate-300 text-[11px] font-bold mb-1">
              <span>Export Quality</span>
              <span className="font-mono text-blue-300">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.0"
              step="0.05"
              value={quality}
              onChange={(e) => onQualityChange(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
          </div>
        )}
      </div>

      {/* Primary Action */}
      <button
        type="button"
        onClick={onExecuteCrop}
        disabled={isProcessing}
        className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-blue-600/25"
      >
        {isProcessing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Cropping Image...</span>
          </>
        ) : (
          <>
            <Crop className="w-4 h-4" />
            <span>Crop & Export Image</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
