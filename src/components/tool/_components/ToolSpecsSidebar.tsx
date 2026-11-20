'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Lock,
  Unlock,
  Settings2,
  Sliders,
  Maximize2,
  Minimize2,
  MoveHorizontal
} from 'lucide-react';
import { DocumentRequirements, FileFormat } from '@/types/document';
import { fromPixels, toPixels, DimensionUnit } from '@/lib/utils/unitConverter';
import { ToolAdvancedOptions } from './ToolAdvancedOptions';

interface ToolSpecsSidebarProps {
  requirements: DocumentRequirements;
  isProcessing: boolean;
  errorMsg: string | null;
  sourceAspectRatio?: number;
  originalWidth?: number;
  originalHeight?: number;
  defaultLockAspect?: boolean;
  defaultShowAdvanced?: boolean;
  onRequirementsChange: (reqs: DocumentRequirements) => void;
  onProcess: (overrideReqs?: DocumentRequirements) => void;
}

const UNITS: DimensionUnit[] = ['px', 'cm', 'mm', 'in'];

const QUICK_DIM_PRESETS = [
  { label: '200×230 (SSC)', w: 200, h: 230 },
  { label: '350×450 (NTA/RRB)', w: 350, h: 450 },
  { label: '140×60 (Sign)', w: 140, h: 60 },
  { label: '600×600 (Visa)', w: 600, h: 600 }
];

export const ToolSpecsSidebar: React.FC<ToolSpecsSidebarProps> = ({
  requirements,
  isProcessing,
  errorMsg,
  sourceAspectRatio = 1,
  originalWidth,
  originalHeight,
  defaultLockAspect = false,
  defaultShowAdvanced = false,
  onRequirementsChange,
  onProcess
}) => {
  const [unit, setUnit] = useState<DimensionUnit>('px');
  const [dpi, setDpi] = useState<number>(requirements.dpi || 200);
  const [showAdvanced, setShowAdvanced] = useState(defaultShowAdvanced);
  const [maintainAspect, setMaintainAspect] = useState(defaultLockAspect);

  const fmtDisplay = (pxVal: number | undefined, u: DimensionUnit, d: number) => {
    if (!pxVal) return '';
    return u === 'px' ? String(Math.round(pxVal)) : String(fromPixels(pxVal, u, d));
  };

  const [localW, setLocalW] = useState(() => fmtDisplay(requirements.width, unit, dpi));
  const [localH, setLocalH] = useState(() => fmtDisplay(requirements.height, unit, dpi));

  useEffect(() => {
    setLocalW(fmtDisplay(requirements.width, unit, dpi));
    setLocalH(fmtDisplay(requirements.height, unit, dpi));
  }, [requirements.width, requirements.height, unit, dpi]);

  const toPx = (raw: string): number | null => {
    const val = parseFloat(raw);
    if (isNaN(val) || val <= 0) return null;
    return Math.max(10, unit === 'px' ? Math.round(val) : toPixels(val, unit, dpi));
  };

  const handleWidthInput = (raw: string) => {
    const cleaned = unit === 'px' ? raw.replace(/\D/g, '') : raw.replace(/[^0-9.]/g, '');
    setLocalW(cleaned);
    const wPx = toPx(cleaned);
    if (wPx) {
      if (maintainAspect && sourceAspectRatio) {
        const hPx = Math.max(10, Math.round(wPx / sourceAspectRatio));
        setLocalH(fmtDisplay(hPx, unit, dpi));
        onRequirementsChange({ ...requirements, width: wPx, height: hPx, dpi });
      } else {
        onRequirementsChange({ ...requirements, width: wPx, dpi });
      }
    }
  };

  const handleHeightInput = (raw: string) => {
    const cleaned = unit === 'px' ? raw.replace(/\D/g, '') : raw.replace(/[^0-9.]/g, '');
    setLocalH(cleaned);
    const hPx = toPx(cleaned);
    if (hPx) {
      if (maintainAspect && sourceAspectRatio) {
        const wPx = Math.max(10, Math.round(hPx * sourceAspectRatio));
        setLocalW(fmtDisplay(wPx, unit, dpi));
        onRequirementsChange({ ...requirements, width: wPx, height: hPx, dpi });
      } else {
        onRequirementsChange({ ...requirements, height: hPx, dpi });
      }
    }
  };

  const applyPercentResize = (pct: number) => {
    const baseW = originalWidth || requirements.width || 800;
    const baseH = originalHeight || requirements.height || Math.round(baseW / (sourceAspectRatio || 1));
    const newW = Math.max(10, Math.round((baseW * pct) / 100));
    const newH = Math.max(10, Math.round((baseH * pct) / 100));
    onRequirementsChange({ ...requirements, width: newW, height: newH });
  };

  const handleSubmit = () => {
    const wPx = toPx(localW) ?? requirements.width;
    const hPx = toPx(localH) ?? requirements.height;
    const synced: DocumentRequirements = { ...requirements, width: wPx, height: hPx, dpi };
    onRequirementsChange(synced);
    onProcess(synced);
  };

  return (
    <div className="fmf-panel p-5 sm:p-6 space-y-5">
      {/* Header + Unit Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sliders className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-extrabold text-white text-sm">Resize & Export Inspector</h3>
        </div>

        {/* Unit Pill Toggle */}
        <div className="flex items-center bg-black/50 border border-white/10 rounded-lg p-0.5 text-[11px] font-mono">
          {UNITS.map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={`px-2 py-1 rounded-md font-bold uppercase transition-colors cursor-pointer ${
                unit === u ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions Inputs + Aspect Lock */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200">
            Output Dimensions ({unit.toUpperCase()})
          </label>
          <button
            type="button"
            onClick={() => setMaintainAspect(!maintainAspect)}
            className={`text-[11px] font-semibold flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
              maintainAspect
                ? 'text-blue-300 bg-blue-500/15 border-blue-500/35'
                : 'text-slate-400 hover:text-white bg-white/[0.03] border-white/10'
            }`}
          >
            {maintainAspect ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
            <span>{maintainAspect ? 'Ratio Locked' : 'Free Ratio'}</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-black/35 border border-white/10 rounded-xl p-2.5 focus-within:border-blue-500 transition-colors">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Width ({unit})</span>
            <input
              type="text"
              inputMode="decimal"
              value={localW}
              onChange={(e) => handleWidthInput(e.target.value)}
              onBlur={() => setLocalW(fmtDisplay(requirements.width, unit, dpi))}
              placeholder={unit === 'px' ? '200' : '3.5'}
              className="w-full bg-transparent text-white font-mono font-bold text-base focus:outline-none mt-0.5"
            />
          </div>
          <div className="bg-black/35 border border-white/10 rounded-xl p-2.5 focus-within:border-blue-500 transition-colors">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Height ({unit})</span>
            <input
              type="text"
              inputMode="decimal"
              value={localH}
              onChange={(e) => handleHeightInput(e.target.value)}
              onBlur={() => setLocalH(fmtDisplay(requirements.height, unit, dpi))}
              placeholder={unit === 'px' ? '230' : '4.5'}
              className="w-full bg-transparent text-white font-mono font-bold text-base focus:outline-none mt-0.5"
            />
          </div>
        </div>

        {unit !== 'px' && (
          <div className="flex items-center justify-between text-[11px] bg-blue-500/10 border border-blue-500/20 rounded-xl px-3 py-2">
            <span className="text-blue-200 font-mono">
              = {requirements.width || 0} × {requirements.height || 0} px
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">DPI:</span>
              {[150, 200, 300].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDpi(d)}
                  className={`px-1.5 py-0.5 rounded font-mono font-bold cursor-pointer ${
                    dpi === d ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quick Scale + Common Dimensions */}
        <div className="space-y-2 pt-0.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase mr-0.5">Scale:</span>
            {[25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => applyPercentResize(pct)}
                className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-[11px] font-bold text-slate-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              >
                {pct}%
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {QUICK_DIM_PRESETS.map((p) => {
              const active = requirements.width === p.w && requirements.height === p.h;
              return (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => onRequirementsChange({ ...requirements, width: p.w, height: p.h })}
                  className={`px-2 py-1 rounded-lg text-[10px] font-semibold border transition-colors cursor-pointer ${
                    active
                      ? 'bg-blue-600/25 border-blue-500/50 text-blue-200'
                      : 'bg-white/[0.03] border-white/[0.08] text-slate-400 hover:text-white hover:bg-white/[0.07]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fit Mode Selector with Visual Icons */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200">Framing Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'fill', label: 'Fill & Crop', desc: 'Edge-to-edge', icon: Maximize2 },
            { id: 'fit', label: 'Fit + Pad', desc: 'Keep full image', icon: Minimize2 },
            { id: 'stretch', label: 'Stretch', desc: 'Exact box fit', icon: MoveHorizontal }
          ].map((m) => {
            const Icon = m.icon;
            const active = requirements.cropMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onRequirementsChange({ ...requirements, cropMode: m.id as DocumentRequirements['cropMode'] })}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  active
                    ? 'bg-blue-600/25 border-blue-400 text-white shadow-sm'
                    : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.07]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 mb-1 ${active ? 'text-blue-300' : 'text-slate-400'}`} />
                <div className="text-[11px] font-bold leading-tight">{m.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{m.desc}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target KB Size */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-200">Target File Size</label>
          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-md">
            {requirements.minSizeKB}–{requirements.maxSizeKB} KB
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: '10–20 KB', min: 10, max: 20 },
            { label: '20–50 KB', min: 20, max: 50 },
            { label: '50–100 KB', min: 50, max: 100 },
            { label: '20–300 KB', min: 20, max: 300 }
          ].map((preset) => {
            const isSelected = requirements.minSizeKB === preset.min && requirements.maxSizeKB === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => onRequirementsChange({ ...requirements, minSizeKB: preset.min, maxSizeKB: preset.max })}
                className={`py-2 px-1 rounded-xl text-[11px] font-bold border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/30 border-blue-400 text-white'
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
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-200">Output Format</label>
        <div className="grid grid-cols-4 gap-2">
          {(['JPG', 'PNG', 'WEBP', 'PDF'] as FileFormat[]).map((fmt) => (
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
            <span>Custom KB, Name/Date Stamp & Signature Clean-up</span>
          </span>
          {showAdvanced ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
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
        onClick={handleSubmit}
        disabled={isProcessing}
        className="w-full fmf-btn-primary py-4 text-sm font-black flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProcessing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Formatting & Compressing...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Export Formatted {requirements.format}</span>
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
