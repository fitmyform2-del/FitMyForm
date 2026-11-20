'use client';

import React, { useState, useEffect } from 'react';
import { Crop, RefreshCw, ArrowRight, Settings2, Crosshair } from 'lucide-react';
import { CropBox } from './cropMath';

interface CropSidebarProps {
  aspectRatio: number | null;
  cropBox: CropBox;
  naturalWidth: number;
  naturalHeight: number;
  outputFormat: 'image/jpeg' | 'image/png' | 'image/webp';
  quality: number;
  isProcessing: boolean;
  onAspectChange: (ratio: number | null) => void;
  onCropBoxChange: (box: CropBox) => void;
  onOutputFormatChange: (fmt: 'image/jpeg' | 'image/png' | 'image/webp') => void;
  onQualityChange: (q: number) => void;
  onCenterCrop: () => void;
  onExecuteCrop: () => void;
}

const PRESETS = [
  { label: 'Freeform', ratio: null },
  { label: '1:1 Square', ratio: 1 },
  { label: '16:9 Wide', ratio: 16 / 9 },
  { label: '4:3 Standard', ratio: 4 / 3 },
  { label: '3:4 Portrait', ratio: 3 / 4 },
  { label: 'Passport (3.5:4.5)', ratio: 3.5 / 4.5 },
];

export function CropSidebar({
  aspectRatio,
  cropBox,
  naturalWidth,
  naturalHeight,
  outputFormat,
  quality,
  isProcessing,
  onAspectChange,
  onCropBoxChange,
  onOutputFormatChange,
  onQualityChange,
  onCenterCrop,
  onExecuteCrop,
}: CropSidebarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localW, setLocalW] = useState(String(cropBox.width));
  const [localH, setLocalH] = useState(String(cropBox.height));
  const [localX, setLocalX] = useState(String(cropBox.x));
  const [localY, setLocalY] = useState(String(cropBox.y));

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

  return (
    <div className="fmf-panel p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <h3 className="font-extrabold text-white text-sm">Crop Options</h3>
        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Smart Crop</span>
      </div>

      {/* Aspect Ratio Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300">Aspect Ratio</label>
        <div className="grid grid-cols-3 gap-2">
          {PRESETS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onAspectChange(item.ratio)}
              className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                aspectRatio === item.ratio
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions & Position */}
      <div className="space-y-3 bg-white/[0.03] p-4 rounded-xl border border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">Exact Dimensions (Pixels)</span>
          <button
            type="button"
            onClick={onCenterCrop}
            className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
          >
            <Crosshair className="w-3 h-3" />
            <span>Center Box</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Width px', val: localW, set: setLocalW, commit: commitWidth },
            { label: 'Height px', val: localH, set: setLocalH, commit: commitHeight },
            { label: 'Position X px', val: localX, set: setLocalX, commit: commitX },
            { label: 'Position Y px', val: localY, set: setLocalY, commit: commitY },
          ].map((field) => (
            <div key={field.label} className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase">{field.label}</label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={field.val}
                onChange={(e) => field.set(e.target.value.replace(/\D/g, ''))}
                onBlur={field.commit}
                onKeyDown={(e) => e.key === 'Enter' && field.commit()}
                className="w-full bg-black/40 border border-white/15 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-blue-500 focus:outline-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Options Accordion */}
      <div className="border-t border-white/[0.08] pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs font-bold text-blue-400 hover:text-blue-300 py-1 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5" />
            <span>Advanced options</span>
          </span>
          <span>{showAdvanced ? '▲' : '▼'}</span>
        </button>
        {showAdvanced && (
          <div className="space-y-3 pt-3 text-xs animate-fade-in">
            <div>
              <label className="text-slate-400 font-bold uppercase text-[10px] block mb-1.5">Output Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'JPG', val: 'image/jpeg' },
                  { label: 'PNG', val: 'image/png' },
                  { label: 'WEBP', val: 'image/webp' },
                ].map((fmt) => (
                  <button
                    key={fmt.label}
                    type="button"
                    onClick={() => onOutputFormatChange(fmt.val as any)}
                    className={`py-1.5 rounded-lg border text-xs font-bold ${
                      outputFormat === fmt.val ? 'bg-blue-600 border-blue-400 text-white' : 'border-white/10 text-slate-400'
                    }`}
                  >
                    {fmt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 text-[10px] font-bold uppercase mb-1">
                <span>Quality</span>
                <span>{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.0"
                step="0.05"
                value={quality}
                onChange={(e) => onQualityChange(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
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
            <span>Crop IMAGE</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </div>
  );
}
