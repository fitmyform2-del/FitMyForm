'use client';

import React from 'react';
import { BlurBox } from '@/lib/image/editorTools';
import { Plus, Trash2, Shield, EyeOff, Sparkles, Sliders } from 'lucide-react';

interface BlurControlsPanelProps {
  boxes: BlurBox[];
  selectedBoxIndex: number | null;
  activeMode: BlurBox['type'];
  activeIntensity: number;
  onSetMode: (mode: BlurBox['type']) => void;
  onSetIntensity: (intensity: number) => void;
  onSelectBox: (index: number | null) => void;
  onRemoveBox: (index: number) => void;
  onClearBoxes: () => void;
  onAddPreset: (type: 'face' | 'aadhaar') => void;
  onUpdateActiveBox: (partial: Partial<BlurBox>) => void;
}

export function BlurControlsPanel({
  boxes,
  selectedBoxIndex,
  activeMode,
  activeIntensity,
  onSetMode,
  onSetIntensity,
  onSelectBox,
  onRemoveBox,
  onClearBoxes,
  onAddPreset,
  onUpdateActiveBox
}: BlurControlsPanelProps) {
  const currentBox = selectedBoxIndex !== null ? boxes[selectedBoxIndex] : null;

  return (
    <div className="space-y-5 bg-[#0d121e] border border-white/10 rounded-3xl p-5 shadow-2xl backdrop-blur-2xl">
      {/* Header and Clear */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <EyeOff className="w-4 h-4 text-indigo-400" />
          <h3 className="font-extrabold text-white text-sm">Privacy Blur Settings</h3>
        </div>
        {boxes.length > 0 && (
          <button
            type="button"
            onClick={onClearBoxes}
            className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 min-h-[44px] cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* 1-Click Quick Add Presets */}
      <div className="space-y-2">
        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Quick Preset Zones
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onAddPreset('face')}
            className="p-3 min-h-[44px] rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Center Face</span>
          </button>
          <button
            type="button"
            onClick={() => onAddPreset('aadhaar')}
            className="p-3 min-h-[44px] rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>+ Censor Bar</span>
          </button>
        </div>
      </div>

      {/* Blur Mode Picker */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Active Blur Mode</span>
          {currentBox && (
            <span className="text-[11px] text-indigo-400 font-mono">
              Editing #{selectedBoxIndex! + 1}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'pixelate', label: 'Pixelate' },
            { id: 'gaussian', label: 'Blur' },
            { id: 'censor', label: 'Black Bar' }
          ].map((mode) => {
            const isSelected = currentBox
              ? currentBox.type === mode.id
              : activeMode === mode.id;

            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => {
                  onSetMode(mode.id as BlurBox['type']);
                  if (selectedBoxIndex !== null) {
                    onUpdateActiveBox({ type: mode.id as BlurBox['type'] });
                  }
                }}
                className={`py-2.5 px-2 min-h-[44px] rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30'
                    : 'bg-white/[0.03] text-slate-300 border-white/10 hover:bg-white/[0.06]'
                }`}
              >
                {mode.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Intensity Slider (Only for blur and pixelate) */}
      {(currentBox ? currentBox.type !== 'censor' : activeMode !== 'censor') && (
        <div className="space-y-2 bg-white/[0.02] p-3.5 rounded-2xl border border-white/5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-indigo-400" />
              <span>Blur Strength</span>
            </span>
            <span className="font-mono text-indigo-400">
              {currentBox ? currentBox.intensity : activeIntensity}px
            </span>
          </div>
          <input
            type="range"
            min="4"
            max="35"
            value={currentBox ? currentBox.intensity : activeIntensity}
            onChange={(e) => {
              const val = Number(e.target.value);
              onSetIntensity(val);
              if (selectedBoxIndex !== null) {
                onUpdateActiveBox({ intensity: val });
              }
            }}
            className="w-full min-h-[44px] accent-indigo-500 cursor-pointer"
          />
        </div>
      )}

      {/* Active Zones List */}
      <div className="space-y-2 pt-2 border-t border-white/10">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
          Active Redaction Zones ({boxes.length})
        </span>

        {boxes.length === 0 ? (
          <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 text-center text-xs text-slate-400">
            No blur zones yet. Click and drag on the photo or click "+ Center Face" above.
          </div>
        ) : (
          <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1">
            {boxes.map((b, idx) => (
              <div
                key={idx}
                onClick={() => onSelectBox(idx)}
                className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition-all ${
                  selectedBoxIndex === idx
                    ? 'bg-indigo-600/20 border-indigo-500 text-white'
                    : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                    {idx + 1}
                  </span>
                  <span className="font-bold capitalize">{b.type}</span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    ({b.width}×{b.height}px)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBox(idx);
                  }}
                  className="w-8 h-8 rounded-lg hover:bg-rose-500/20 text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                  title="Delete zone"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
