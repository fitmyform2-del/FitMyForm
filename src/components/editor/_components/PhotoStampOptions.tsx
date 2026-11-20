'use client';

import React from 'react';
import { Calendar, User, Tag, Check } from 'lucide-react';
import { PhotoStampConfig } from '@/types/document';

interface PhotoStampOptionsProps {
  config?: PhotoStampConfig;
  onChange: (updated: PhotoStampConfig) => void;
}

export const PhotoStampOptions: React.FC<PhotoStampOptionsProps> = ({
  config = { enabled: false },
  onChange
}) => {
  const isEnabled = !!config.enabled;

  const toggleEnabled = () => {
    onChange({
      ...config,
      enabled: !isEnabled,
      name: config.name || '',
      date: config.date || new Date().toISOString().split('T')[0],
      position: config.position || 'bottom',
      bgColor: config.bgColor || '#FFFFFF',
      textColor: config.textColor || '#000000'
    });
  };

  const updateField = <K extends keyof PhotoStampConfig>(
    field: K,
    val: PhotoStampConfig[K]
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
            <Tag className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="text-xs font-bold text-white block">
              Name & Date of Photo (DOP) Stamp
            </span>
            <span className="text-[11px] text-slate-400 block">
              Official requirement for SSC, UPSC, and State PSC applications
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
              <span>Stamp Active</span>
            </>
          ) : (
            <span>+ Add Stamp</span>
          )}
        </button>
      </div>

      {isEnabled && (
        <div className="space-y-3 pt-2 border-t border-white/10 text-xs animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Candidate Name */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <User className="w-3 h-3 text-indigo-400" />
                <span>Candidate Name (Capitals):</span>
              </label>
              <input
                type="text"
                value={config.name || ''}
                onChange={(e) => updateField('name', e.target.value.toUpperCase())}
                placeholder="e.g. RAHUL SHARMA"
                className="w-full bg-[#080b11] border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Date of Photo */}
            <div className="space-y-1">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-400" />
                <span>Date of Photo (DOP):</span>
              </label>
              <input
                type="date"
                value={config.date || ''}
                onChange={(e) => updateField('date', e.target.value)}
                className="w-full bg-[#080b11] border border-white/15 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Quick Style & Position Chips */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Style:</span>
              <button
                type="button"
                onClick={() => {
                  updateField('bgColor', '#FFFFFF');
                  updateField('textColor', '#000000');
                }}
                className={`px-2 py-1 rounded-md border font-medium ${
                  config.bgColor === '#FFFFFF'
                    ? 'border-indigo-400 bg-white text-slate-900 font-bold'
                    : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                White Strip (Black Text)
              </button>
              <button
                type="button"
                onClick={() => {
                  updateField('bgColor', '#000000');
                  updateField('textColor', '#FFFFFF');
                }}
                className={`px-2 py-1 rounded-md border font-medium ${
                  config.bgColor === '#000000'
                    ? 'border-indigo-400 bg-slate-900 text-white font-bold'
                    : 'border-white/10 bg-white/5 text-slate-400'
                }`}
              >
                Black Strip (White Text)
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Position:</span>
              {(['bottom', 'top'] as const).map((pos) => (
                <button
                  key={pos}
                  type="button"
                  onClick={() => updateField('position', pos)}
                  className={`px-2 py-1 rounded-md border capitalize font-medium ${
                    config.position === pos
                      ? 'border-indigo-400 bg-indigo-500/20 text-indigo-300 font-bold'
                      : 'border-white/10 bg-white/5 text-slate-400'
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
