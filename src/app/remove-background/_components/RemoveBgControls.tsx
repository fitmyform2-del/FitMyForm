'use client';

import React, { useState } from 'react';
import { Eraser, RefreshCw, ArrowRight, Download, RotateCcw, Settings2 } from 'lucide-react';

interface RemoveBgControlsProps {
  replacementColor: string | 'transparent';
  tolerance: number;
  mode: 'contiguous' | 'global';
  resultUrl: string | null;
  uploadedFileName?: string;
  isProcessing: boolean;
  onReplacementColorChange: (color: string | 'transparent') => void;
  onToleranceChange: (val: number) => void;
  onModeChange: (m: 'contiguous' | 'global') => void;
  onProcessBgRemoval: () => void;
  onResetResult: () => void;
}

export function RemoveBgControls({
  replacementColor,
  tolerance,
  mode,
  resultUrl,
  uploadedFileName = 'cutout.png',
  isProcessing,
  onReplacementColorChange,
  onToleranceChange,
  onModeChange,
  onProcessBgRemoval,
  onResetResult
}: RemoveBgControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="fmf-panel p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <h3 className="font-extrabold text-white text-sm">Background Options</h3>
        <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Cutout Studio</span>
      </div>

      {/* Simple: Replacement Background */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300">New Background</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Transparent', val: 'transparent' },
            { label: 'White', val: '#FFFFFF' },
            { label: 'Passport Blue', val: '#E0F2FE' }
          ].map((bg) => (
            <button
              key={bg.val}
              type="button"
              onClick={() => onReplacementColorChange(bg.val)}
              className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                replacementColor === bg.val
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              {bg.label}
            </button>
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
              <div className="flex justify-between text-slate-300 font-bold mb-1">
                <span>Tolerance</span>
                <span>{tolerance}</span>
              </div>
              <input
                type="range"
                min="5"
                max="60"
                value={tolerance}
                onChange={(e) => onToleranceChange(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onModeChange('contiguous')}
                className={`py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${
                  mode === 'contiguous' ? 'bg-blue-600 border-blue-400 text-white' : 'border-white/10 text-slate-400'
                }`}
              >
                Contiguous Edge
              </button>
              <button
                type="button"
                onClick={() => onModeChange('global')}
                className={`py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${
                  mode === 'global' ? 'bg-blue-600 border-blue-400 text-white' : 'border-white/10 text-slate-400'
                }`}
              >
                Global Match
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Action Button */}
      {!resultUrl ? (
        <button
          type="button"
          onClick={onProcessBgRemoval}
          disabled={isProcessing}
          className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Erasing Background...</span>
            </>
          ) : (
            <>
              <Eraser className="w-4 h-4" />
              <span>Remove Background</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      ) : (
        <div className="space-y-2">
          <a
            href={resultUrl}
            download={`cutout-${uploadedFileName.replace(/\.[^/.]+$/, '')}.${replacementColor === 'transparent' ? 'png' : 'jpg'}`}
            className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Download Cutout Image</span>
          </a>
          <button
            type="button"
            onClick={onResetResult}
            className="w-full fmf-btn-secondary py-2 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Adjust & Re-erase</span>
          </button>
        </div>
      )}
    </div>
  );
}
