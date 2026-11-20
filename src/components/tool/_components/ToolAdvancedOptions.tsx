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
