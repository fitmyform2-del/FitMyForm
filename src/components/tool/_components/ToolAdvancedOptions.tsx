'use client';

import React, { useState, useEffect } from 'react';
import { DocumentRequirements } from '@/types/document';
import { PhotoStampOptions } from '@/components/editor/_components/PhotoStampOptions';
import { SignatureFilterOptions } from '@/components/editor/_components/SignatureFilterOptions';

interface ToolAdvancedOptionsProps {
  requirements: DocumentRequirements;
  onRequirementsChange: (reqs: DocumentRequirements) => void;
}

export const ToolAdvancedOptions: React.FC<ToolAdvancedOptionsProps> = ({
  requirements,
  onRequirementsChange
}) => {
  const [minStr, setMinStr] = useState(String(requirements.minSizeKB ?? 20));
  const [maxStr, setMaxStr] = useState(String(requirements.maxSizeKB ?? 50));

  useEffect(() => {
    setMinStr(String(requirements.minSizeKB ?? 20));
    setMaxStr(String(requirements.maxSizeKB ?? 50));
  }, [requirements.minSizeKB, requirements.maxSizeKB]);

  const commitMin = () => {
    const parsed = parseInt(minStr, 10);
    const v = isNaN(parsed) || parsed < 1 ? 1 : parsed;
    setMinStr(String(v));
    onRequirementsChange({ ...requirements, minSizeKB: v });
  };

  const commitMax = () => {
    const parsed = parseInt(maxStr, 10);
    const v = isNaN(parsed) || parsed < 1 ? 50 : parsed;
    setMaxStr(String(v));
    onRequirementsChange({ ...requirements, maxSizeKB: v });
  };

  return (
    <div className="space-y-4 pt-3 text-xs animate-fade-in">
      {/* Exact KB Range */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Exact Min (KB)</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={minStr}
            onChange={(e) => setMinStr(e.target.value.replace(/\D/g, ''))}
            onBlur={commitMin}
            onKeyDown={(e) => e.key === 'Enter' && commitMin()}
            placeholder="e.g. 20"
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Exact Max (KB)</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={maxStr}
            onChange={(e) => setMaxStr(e.target.value.replace(/\D/g, ''))}
            onBlur={commitMax}
            onKeyDown={(e) => e.key === 'Enter' && commitMax()}
            placeholder="e.g. 50"
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 1-Click Passport White Background */}
      <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] text-white font-bold block">Passport White Background</span>
            <span className="text-[10px] text-slate-400">Replace colored backdrop for UPSC / NEET / Passport</span>
          </div>
          <button
            type="button"
            onClick={() =>
              onRequirementsChange({
                ...requirements,
                whiteBg: {
                  enabled: !requirements.whiteBg?.enabled,
                  tolerance: requirements.whiteBg?.tolerance ?? 42,
                  fillColor: requirements.whiteBg?.fillColor || '#FFFFFF'
                }
              })
            }
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
              requirements.whiteBg?.enabled
                ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-300'
                : 'bg-white/[0.04] border-white/10 text-slate-300 hover:text-white'
            }`}
          >
            {requirements.whiteBg?.enabled ? 'Active' : 'Enable'}
          </button>
        </div>

        {requirements.whiteBg?.enabled && (
          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <div className="flex items-center justify-between text-[10px] text-slate-300">
              <span>Edge Sensitivity</span>
              <span className="font-mono text-blue-300 font-bold">{requirements.whiteBg.tolerance ?? 42}</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              step="1"
              value={requirements.whiteBg.tolerance ?? 42}
              onChange={(e) =>
                onRequirementsChange({
                  ...requirements,
                  whiteBg: {
                    ...requirements.whiteBg!,
                    tolerance: Number(e.target.value)
                  }
                })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg accent-emerald-400 cursor-pointer"
            />
            <div className="flex items-center gap-1.5 pt-1">
              {[
                { name: 'Pure White', color: '#FFFFFF' },
                { name: 'Off-White', color: '#F8FAFC' },
                { name: 'Sky Blue', color: '#E0F2FE' }
              ].map((sw) => (
                <button
                  key={sw.color}
                  type="button"
                  onClick={() =>
                    onRequirementsChange({
                      ...requirements,
                      whiteBg: { ...requirements.whiteBg!, fillColor: sw.color }
                    })
                  }
                  className={`flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-semibold cursor-pointer ${
                    (requirements.whiteBg?.fillColor || '#FFFFFF') === sw.color
                      ? 'border-emerald-400 bg-emerald-500/15 text-white'
                      : 'border-white/10 text-slate-400'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-slate-500" style={{ backgroundColor: sw.color }} />
                  <span>{sw.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Photo Name & Date Stamp */}
      <PhotoStampOptions
        config={requirements.photoStamp}
        onChange={(photoStamp) => onRequirementsChange({ ...requirements, photoStamp })}
      />

      {/* Signature & Paper Enhancement */}
      <SignatureFilterOptions
        config={requirements.signatureFilter}
        onChange={(signatureFilter) => onRequirementsChange({ ...requirements, signatureFilter })}
      />

      {/* Background Color & Padding Mode */}
      <div className="space-y-1.5">
        <span className="text-[10px] text-slate-400 uppercase font-bold block">Background Fill (Padding)</span>
        <div className="flex items-center gap-2">
          {[
            { name: 'White', color: '#FFFFFF' },
            { name: 'Off-White', color: '#F8FAFC' },
            { name: 'Light Blue', color: '#E0F2FE' }
          ].map((bg) => (
            <button
              key={bg.color}
              type="button"
              onClick={() => onRequirementsChange({ ...requirements, bgColor: bg.color, cropMode: 'fit' })}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold ${
                requirements.bgColor === bg.color ? 'border-blue-400 bg-blue-500/10 text-white' : 'border-white/10 text-slate-400'
              }`}
            >
              <span className="w-3 h-3 rounded-full border border-slate-600" style={{ backgroundColor: bg.color }} />
              <span>{bg.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
