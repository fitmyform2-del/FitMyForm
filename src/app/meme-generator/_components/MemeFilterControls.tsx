'use client';

import React from 'react';
import { MemeImageSettings, MemeFilter } from './memeTypes';
import { RotateCw, FlipHorizontal, FlipVertical, RefreshCw } from 'lucide-react';

interface MemeFilterControlsProps {
  settings: MemeImageSettings;
  onUpdateSettings: (updates: Partial<MemeImageSettings>) => void;
  onResetSettings: () => void;
}

const FILTER_BUTTONS: { id: MemeFilter; name: string; icon: string }[] = [
  { id: 'none', name: 'Normal', icon: '✨' },
  { id: 'deepfry', name: 'Deep Fry', icon: '🔥' },
  { id: 'grayscale', name: 'Grayscale', icon: '🌑' },
  { id: 'sepia', name: 'Sepia', icon: '📜' },
  { id: 'invert', name: 'Invert', icon: '🔮' },
  { id: 'high-contrast', name: 'Contrast', icon: '⚡' },
  { id: 'vintage', name: 'Vintage', icon: '📼' }
];

export function MemeFilterControls({ settings, onUpdateSettings, onResetSettings }: MemeFilterControlsProps) {
  const handleRotate = () => {
    const next = ((settings.rotation + 90) % 360) as 0 | 90 | 180 | 270;
    onUpdateSettings({ rotation: next });
  };

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-300">Image FX Filter</label>
          <button
            type="button"
            onClick={onResetSettings}
            className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset FX</span>
          </button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
          {FILTER_BUTTONS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => onUpdateSettings({ filter: f.id })}
              className={`p-2 rounded-xl text-xs font-bold flex flex-col items-center justify-center gap-1 border transition-all cursor-pointer ${
                settings.filter === f.id
                  ? 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-sm'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-slate-300'
              }`}
            >
              <span>{f.icon}</span>
              <span className="text-[10px] leading-tight text-center">{f.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transforms */}
      <div>
        <label className="text-xs font-bold text-slate-300 block mb-1.5">Transform & Orientation</label>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleRotate}
            className="py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Rotate {settings.rotation}°</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSettings({ flipHorizontal: !settings.flipHorizontal })}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
              settings.flipHorizontal
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'bg-white/[0.04] hover:bg-white/10 border-white/10 text-slate-200'
            }`}
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
            <span>Flip H</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSettings({ flipVertical: !settings.flipVertical })}
            className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
              settings.flipVertical
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'bg-white/[0.04] hover:bg-white/10 border-white/10 text-slate-200'
            }`}
          >
            <FlipVertical className="w-3.5 h-3.5" />
            <span>Flip V</span>
          </button>
        </div>
      </div>

      {/* Adjustments Sliders */}
      <div className="space-y-2.5 p-3 rounded-xl bg-black/30 border border-white/5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Brightness</span>
          <input
            type="range"
            min="60"
            max="140"
            value={settings.brightness}
            onChange={(e) => onUpdateSettings({ brightness: Number(e.target.value) })}
            className="w-36 accent-blue-500"
          />
          <span className="text-slate-300 w-8 text-right">{settings.brightness}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Contrast</span>
          <input
            type="range"
            min="60"
            max="160"
            value={settings.contrast}
            onChange={(e) => onUpdateSettings({ contrast: Number(e.target.value) })}
            className="w-36 accent-blue-500"
          />
          <span className="text-slate-300 w-8 text-right">{settings.contrast}%</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-400">Saturation</span>
          <input
            type="range"
            min="0"
            max="200"
            value={settings.saturation}
            onChange={(e) => onUpdateSettings({ saturation: Number(e.target.value) })}
            className="w-36 accent-blue-500"
          />
          <span className="text-slate-300 w-8 text-right">{settings.saturation}%</span>
        </div>
      </div>

      {/* Watermark / Attribution */}
      <div className="p-3 rounded-xl bg-black/30 border border-white/5 space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">Creator Tag / Watermark</label>
          <button
            type="button"
            onClick={() => onUpdateSettings({ showWatermark: !settings.showWatermark })}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-all cursor-pointer ${
              settings.showWatermark
                ? 'bg-blue-600/20 border-blue-500/50 text-blue-300'
                : 'bg-white/5 border-white/10 text-slate-400'
            }`}
          >
            {settings.showWatermark ? 'Enabled' : 'Disabled (Free)'}
          </button>
        </div>

        {settings.showWatermark && (
          <input
            type="text"
            value={settings.watermarkText}
            onChange={(e) => onUpdateSettings({ watermarkText: e.target.value })}
            placeholder="e.g. @your_name or meme tag"
            className="w-full px-3 py-1.5 rounded-lg bg-black/50 border border-white/10 text-xs text-white focus:outline-none"
          />
        )}
      </div>
    </div>
  );
}
