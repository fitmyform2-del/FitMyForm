'use client';

import React, { useState } from 'react';
import { Sparkles, RefreshCw, ArrowRight, AlertCircle, ChevronDown, ChevronUp, Lock, Unlock, Settings2, Sliders } from 'lucide-react';
import { DocumentRequirements, FileFormat } from '@/types/document';
import { ToolAdvancedOptions } from './ToolAdvancedOptions';

interface ToolSpecsSidebarProps {
  requirements: DocumentRequirements;
  isProcessing: boolean;
  errorMsg: string | null;
  sourceAspectRatio?: number;
  onRequirementsChange: (reqs: DocumentRequirements) => void;
  onProcess: () => void;
  onOpenCropper?: () => void;
}

export const ToolSpecsSidebar: React.FC<ToolSpecsSidebarProps> = ({
  requirements,
  isProcessing,
  errorMsg,
  sourceAspectRatio = 1,
  onRequirementsChange,
  onProcess,
  onOpenCropper
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [localW, setLocalW] = useState(String(requirements.width || ''));
  const [localH, setLocalH] = useState(String(requirements.height || ''));

  React.useEffect(() => {
    setLocalW(String(requirements.width || ''));
    setLocalH(String(requirements.height || ''));
  }, [requirements.width, requirements.height]);

  const commitWidth = () => {
    const w = parseInt(localW, 10);
    if (!isNaN(w) && w > 0) {
      const newH = maintainAspect && sourceAspectRatio ? Math.round(w / sourceAspectRatio) : requirements.height;
      if (newH) setLocalH(String(newH));
      onRequirementsChange({ ...requirements, width: w, ...(newH ? { height: newH } : {}) });
    } else {
      setLocalW(String(requirements.width || ''));
    }
  };

  const commitHeight = () => {
    const h = parseInt(localH, 10);
    if (!isNaN(h) && h > 0) {
      const newW = maintainAspect && sourceAspectRatio ? Math.round(h * sourceAspectRatio) : requirements.width;
      if (newW) setLocalW(String(newW));
      onRequirementsChange({ ...requirements, height: h, ...(newW ? { width: newW } : {}) });
    } else {
      setLocalH(String(requirements.height || ''));
    }
  };

  const applyPercentResize = (pct: number) => {
    const curW = requirements.width || 800;
    const newW = Math.round((curW * pct) / 100);
    const newH = Math.round(newW / (sourceAspectRatio || 1));
    onRequirementsChange({ ...requirements, width: newW, height: newH });
  };

  const applyQuickSize = (minKB: number, maxKB: number) => {
    onRequirementsChange({ ...requirements, minSizeKB: minKB, maxSizeKB: maxKB });
  };

  return (
    <div className="fmf-panel p-6 space-y-5">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-blue-400" />
          <h3 className="font-extrabold text-white text-sm">Resize & Format Options</h3>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Simple Mode
        </span>
      </div>

      {/* Simple Mode: Dimensions in px */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">Dimensions (Pixels)</label>
          <button
            type="button"
            onClick={() => setMaintainAspect(!maintainAspect)}
            className={`text-[11px] font-semibold flex items-center gap-1 px-2 py-1 rounded-md transition-colors cursor-pointer ${
              maintainAspect ? 'text-blue-400 bg-blue-500/10' : 'text-slate-400 hover:text-white'
            }`}
          >
            {maintainAspect ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            <span>Lock Aspect Ratio</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Width (px)</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={localW}
              onChange={(e) => setLocalW(e.target.value.replace(/\D/g, ''))}
              onBlur={commitWidth}
              onKeyDown={(e) => e.key === 'Enter' && commitWidth()}
              placeholder="e.g. 200"
              className="w-full touch-target px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Height (px)</span>
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={localH}
              onChange={(e) => setLocalH(e.target.value.replace(/\D/g, ''))}
              onBlur={commitHeight}
              onKeyDown={(e) => e.key === 'Enter' && commitHeight()}
              placeholder="e.g. 230"
              className="w-full touch-target px-3.5 py-2 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-sm focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Percentage Chips */}
        <div className="flex items-center gap-2 pt-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Quick Scale:</span>
          {[25, 50, 75, 100].map((pct) => (
            <button
              key={pct}
              type="button"
              onClick={() => applyPercentResize(pct)}
              className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-bold text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            >
              {pct}%
            </button>
          ))}
        </div>
      </div>

      {/* Simple Target Size Presets */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300">Target KB Size Preset</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: '20–50 KB (SSC)', min: 20, max: 50 },
            { label: '50–100 KB', min: 50, max: 100 },
            { label: '100–200 KB', min: 100, max: 200 }
          ].map((preset) => {
            const isSelected = requirements.minSizeKB === preset.min && requirements.maxSizeKB === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyQuickSize(preset.min, preset.max)}
                className={`py-2 px-1 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/30 border-blue-500 text-blue-200'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Output Format */}
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-slate-300">Format</label>
        <div className="grid grid-cols-3 gap-2">
          {(['JPG', 'PNG', 'PDF'] as FileFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => onRequirementsChange({ ...requirements, format: fmt })}
              className={`py-2 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer ${
                requirements.format === fmt
                  ? 'bg-blue-600 border-blue-400 text-white shadow-md'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Options Accordion */}
      <div className="border-t border-white/[0.08] pt-3">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between text-xs font-bold text-blue-400 hover:text-blue-300 py-1 transition-colors cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5" />
            <span>Advanced options</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showAdvanced && (
          <ToolAdvancedOptions
            requirements={requirements}
            onRequirementsChange={onRequirementsChange}
          />
        )}
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        onClick={onProcess}
        disabled={isProcessing}
        className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProcessing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Processing Image...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Format Document Now</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
