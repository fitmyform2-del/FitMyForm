'use client';

import React from 'react';
import { PenTool, Check } from 'lucide-react';
import { SignatureFilterConfig } from '@/types/document';

interface SignatureFilterOptionsProps {
  config?: SignatureFilterConfig;
  onChange: (updated: SignatureFilterConfig) => void;
}

export const SignatureFilterOptions: React.FC<SignatureFilterOptionsProps> = ({
  config = { enabled: false, whitenBackground: true, inkBoost: true, threshold: 175 },
  onChange
}) => {
  const isEnabled = !!config.enabled;

  const toggleEnabled = () => {
    onChange({
      ...config,
      enabled: !isEnabled,
      whitenBackground: config.whitenBackground ?? true,
      inkBoost: config.inkBoost ?? true,
      threshold: config.threshold ?? 175
    });
  };

  const updateField = <K extends keyof SignatureFilterConfig>(
    field: K,
    val: SignatureFilterConfig[K]
  ) => {
    onChange({
      ...config,
      [field]: val
    });
  };

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4 space-y-3.5 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <PenTool className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              Signature & Thumb Enhancement
            </span>
            <span className="text-[11px] text-slate-400 block">
              Auto-remove yellow shadows & sharpen ink for portal acceptance
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleEnabled}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 min-h-[36px] ${
            isEnabled
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-white/10 hover:bg-white/15 text-slate-300'
          }`}
        >
          {isEnabled ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Clean-Up Active</span>
            </>
          ) : (
            <span>+ Clean Signature</span>
          )}
        </button>
      </div>

      {isEnabled && (
        <div className="space-y-3 pt-2 border-t border-white/10 text-xs animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => updateField('whitenBackground', !config.whitenBackground)}
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                config.whitenBackground
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-slate-400'
              }`}
            >
              <div className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                config.whitenBackground ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black' : 'border-slate-500'
              }`}>
                {config.whitenBackground ? '✓' : ''}
              </div>
              <div className="text-left">
                <span className="font-bold block">Whiten Paper Shadow</span>
                <span className="text-[10px] text-slate-400 block">Cleans off-white notebook paper</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => updateField('inkBoost', !config.inkBoost)}
              className={`p-2.5 rounded-xl border flex items-center gap-2 transition-all ${
                config.inkBoost
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-white'
                  : 'border-white/10 bg-white/5 text-slate-400'
              }`}
            >
              <div className={`w-4 h-4 rounded-md border flex items-center justify-center text-[10px] ${
                config.inkBoost ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-black' : 'border-slate-500'
              }`}>
                {config.inkBoost ? '✓' : ''}
              </div>
              <div className="text-left">
                <span className="font-bold block">Ink Darkener</span>
                <span className="text-[10px] text-slate-400 block">Deepens blue & black ink</span>
              </div>
            </button>
          </div>

          {/* Whiten Threshold Sensitivity Slider */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[11px] text-slate-300 font-semibold">
              <span>Paper Shadow Threshold:</span>
              <span className="font-mono text-indigo-400">{config.threshold ?? 175}</span>
            </div>
            <input
              type="range"
              min="100"
              max="240"
              step="5"
              value={config.threshold ?? 175}
              onChange={(e) => updateField('threshold', Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};
