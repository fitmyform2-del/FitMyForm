'use client';

import React, { useState } from 'react';
import { FilterOptions } from '@/lib/image/editorTools';
import { Download, Settings2 } from 'lucide-react';

interface PhotoEditorControlsProps {
  filters: FilterOptions;
  editedUrl: string | null;
  uploadedFileName?: string;
  onApplyPreset: (preset: string) => void;
  onFilterChange: (filters: FilterOptions) => void;
}

export function PhotoEditorControls({
  filters,
  editedUrl,
  uploadedFileName = 'edited-photo.jpg',
  onApplyPreset,
  onFilterChange
}: PhotoEditorControlsProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="fmf-panel p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <h3 className="font-extrabold text-white text-sm">Enhancement Options</h3>
        <span className="text-[10px] font-bold text-pink-400 bg-pink-500/10 px-2 py-0.5 rounded">Photo Studio</span>
      </div>

      {/* Style Presets */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-300">Style Presets</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Original', id: 'reset' },
            { label: 'Vivid', id: 'vivid' },
            { label: 'B & W', id: 'grayscale' },
            { label: 'Vintage', id: 'vintage' },
            { label: 'Sepia', id: 'sepia' }
          ].map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onApplyPreset(p.id)}
              className="py-2 rounded-xl text-xs font-bold bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-slate-200 transition-all cursor-pointer"
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Sliders */}
      <div className="space-y-3 bg-white/[0.03] p-3.5 rounded-xl border border-white/10">
        <div>
          <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
            <span>Brightness</span>
            <span>{filters.brightness}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="200"
            value={filters.brightness}
            onChange={(e) => onFilterChange({ ...filters, brightness: Number(e.target.value) })}
            className="w-full accent-pink-500"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold text-slate-300 mb-1">
            <span>Contrast</span>
            <span>{filters.contrast}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="200"
            value={filters.contrast}
            onChange={(e) => onFilterChange({ ...filters, contrast: Number(e.target.value) })}
            className="w-full accent-pink-500"
          />
        </div>
      </div>

      {/* Advanced Options Accordion */}
      <div className="border-t border-white/[0.08] pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs font-bold text-pink-400 hover:text-pink-300 py-1 cursor-pointer"
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
                <span>Saturation</span>
                <span>{filters.saturate}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={filters.saturate}
                onChange={(e) => onFilterChange({ ...filters, saturate: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>
            <div>
              <div className="flex justify-between text-slate-300 font-bold mb-1">
                <span>Blur Softness</span>
                <span>{filters.blur}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={filters.blur}
                onChange={(e) => onFilterChange({ ...filters, blur: Number(e.target.value) })}
                className="w-full accent-pink-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Download Action */}
      {editedUrl && (
        <a
          href={editedUrl}
          download={`edited-${uploadedFileName}`}
          className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
        >
          <Download className="w-5 h-5" />
          <span>Download Edited IMAGE</span>
        </a>
      )}
    </div>
  );
}
