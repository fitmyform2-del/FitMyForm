'use client';

import React, { useState } from 'react';
import { Compass, X } from 'lucide-react';
import { ManipulativeType } from '../types/whiteboard';

interface ManipulativesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onAddManipulative: (type: ManipulativeType, data: Record<string, unknown>, width: number, height: number) => void;
}

const FRACTIONS = [
  { label: '1 Whole', fraction: '1/1', color: '#ef4444', w: 320 },
  { label: '1/2 Half', fraction: '1/2', color: '#f97316', w: 160 },
  { label: '1/3 Third', fraction: '1/3', color: '#eab308', w: 106.6 },
  { label: '1/4 Fourth', fraction: '1/4', color: '#22c55e', w: 80 },
  { label: '1/5 Fifth', fraction: '1/5', color: '#06b6d4', w: 64 },
  { label: '1/6 Sixth', fraction: '1/6', color: '#3b82f6', w: 53.3 },
  { label: '1/8 Eighth', fraction: '1/8', color: '#8b5cf6', w: 40 },
  { label: '1/10 Tenth', fraction: '1/10', color: '#ec4899', w: 32 }
];

const STICKERS = ['⭐', '🏆', '💯', '👍', '✅', '🎯', '🚀', '💡', '👏', '🧠', '❤️', '🔥', '❓', '⏰'];

export function ManipulativesDrawer({
  isOpen,
  onClose,
  onAddManipulative
}: ManipulativesDrawerProps) {
  const [tab, setTab] = useState<'tools' | 'fractions' | 'stickers'>('tools');
  const [tenFrameCount, setTenFrameCount] = useState(5);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-[#111726] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Manipulatives & Gizmos</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-slate-900 rounded-xl border border-white/10 text-xs font-semibold">
          <button
            onClick={() => setTab('tools')}
            className={`py-1.5 rounded-lg transition-colors ${tab === 'tools' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Math Tools
          </button>
          <button
            onClick={() => setTab('fractions')}
            className={`py-1.5 rounded-lg transition-colors ${tab === 'fractions' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Fraction Bars
          </button>
          <button
            onClick={() => setTab('stickers')}
            className={`py-1.5 rounded-lg transition-colors ${tab === 'stickers' ? 'bg-emerald-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Stamps & Badges
          </button>
        </div>

        {/* Tab 1: Math Tools (Ruler, Protractor, Ten-Frame) */}
        {tab === 'tools' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                onClick={() => {
                  onAddManipulative('ruler', {}, 400, 60);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-left transition-all group"
              >
                <div className="font-bold text-white text-xs group-hover:text-emerald-300">Metric Ruler</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Calibrated cm & mm measurements</div>
              </button>

              <button
                onClick={() => {
                  onAddManipulative('protractor', {}, 260, 130);
                  onClose();
                }}
                className="p-3.5 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 hover:border-emerald-500/40 text-left transition-all group"
              >
                <div className="font-bold text-white text-xs group-hover:text-emerald-300">180° Protractor</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Measure & draw geometric angles</div>
              </button>
            </div>

            {/* Ten Frame */}
            <div className="p-3.5 rounded-xl bg-slate-900/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white text-xs">Ten-Frame Counter</span>
                <span className="text-[11px] text-emerald-400 font-mono">{tenFrameCount} / 10 Filled</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={tenFrameCount}
                onChange={(e) => setTenFrameCount(Number(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded-lg accent-emerald-500 cursor-pointer"
              />
              <button
                onClick={() => {
                  onAddManipulative('ten-frame', { filled: tenFrameCount }, 220, 90);
                  onClose();
                }}
                className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                Insert Ten-Frame
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Fraction Bars */}
        {tab === 'fractions' && (
          <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar p-1">
            {FRACTIONS.map((f) => (
              <button
                key={f.fraction}
                onClick={() => {
                  onAddManipulative('fraction-bar', { fraction: f.fraction, label: f.label, color: f.color }, f.w, 40);
                  onClose();
                }}
                className="w-full p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md" style={{ backgroundColor: f.color }} />
                  <span className="font-bold text-xs text-white">{f.label}</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">Insert Strip →</span>
              </button>
            ))}
          </div>
        )}

        {/* Tab 3: Stickers */}
        {tab === 'stickers' && (
          <div className="grid grid-cols-5 gap-2.5 max-h-60 overflow-y-auto no-scrollbar p-1">
            {STICKERS.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  onAddManipulative('sticker', { emoji }, 60, 60);
                  onClose();
                }}
                className="h-12 rounded-xl bg-white/5 hover:bg-emerald-500/20 border border-white/10 text-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
