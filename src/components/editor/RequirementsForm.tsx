'use client';

import React from 'react';
import {
  Camera,
  PenTool,
  Fingerprint,
  FileText,
  CreditCard,
  GraduationCap,
  Award,
  File,
  Crop,
  Palette,
  SlidersHorizontal,
  Sparkles
} from 'lucide-react';
import { DocumentRequirements, DocumentType, FileFormat, CropMode } from '@/types/document';
import { DOCUMENT_TYPE_LABELS } from '@/config/presets';

interface RequirementsFormProps {
  requirements: DocumentRequirements;
  onChange: (updated: DocumentRequirements) => void;
  onOpenManualCropper: () => void;
  presetNotice?: string | null;
}

export const RequirementsForm: React.FC<RequirementsFormProps> = ({
  requirements,
  onChange,
  onOpenManualCropper,
  presetNotice
}) => {
  const updateField = <K extends keyof DocumentRequirements>(
    field: K,
    value: DocumentRequirements[K]
  ) => {
    onChange({
      ...requirements,
      [field]: value
    });
  };

  const handleDocumentTypeChange = (docType: DocumentType) => {
    const meta = DOCUMENT_TYPE_LABELS[docType] || DOCUMENT_TYPE_LABELS['other'];
    onChange({
      ...requirements,
      documentType: docType,
      width: meta.defaultWidth,
      height: meta.defaultHeight,
      minSizeKB: meta.minKB,
      maxSizeKB: meta.maxKB
    });
  };

  return (
    <div className="bg-[#0d121e] border border-white/15 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="text-base font-extrabold text-white flex items-center gap-2.5 tracking-tight">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
          </div>
          <span>Target Requirement Specifications</span>
        </h3>
        {presetNotice && (
          <span className="text-xs bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 px-3 py-1 rounded-full font-bold flex items-center gap-1.5 shadow-sm">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Active: {presetNotice}</span>
          </span>
        )}
      </div>

      {/* 1. Document Type Selector */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
          Document Type Category:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            { type: 'photo', label: 'Passport Photo', icon: Camera },
            { type: 'signature', label: 'Signature', icon: PenTool },
            { type: 'thumb', label: 'Thumb Print', icon: Fingerprint },
            { type: 'declaration', label: 'Declaration', icon: FileText },
            { type: 'aadhaar', label: 'Aadhaar / ID', icon: CreditCard },
            { type: 'marksheet', label: 'Marksheet', icon: GraduationCap },
            { type: 'certificate', label: 'Certificate', icon: Award },
            { type: 'other', label: 'Other File', icon: File }
          ].map((item) => {
            const IconComp = item.icon;
            const isSelected = requirements.documentType === item.type;
            return (
              <button
                key={item.type}
                type="button"
                onClick={() => handleDocumentTypeChange(item.type as DocumentType)}
                className={`p-3 rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                    : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20'
                }`}
              >
                <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Target Dimensions (px) */}
      <div className="space-y-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Target Dimensions (Pixels):
          </label>
          <span className="text-xs font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
            {requirements.width || 0} × {requirements.height || 0} px
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Width (px)</span>
            <input
              type="number"
              value={requirements.width || ''}
              onChange={(e) => updateField('width', Number(e.target.value))}
              placeholder="e.g. 200"
              className="w-full bg-[#080b11] text-white px-3.5 py-2.5 rounded-xl border border-white/15 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-400 block mb-1">Height (px)</span>
            <input
              type="number"
              value={requirements.height || ''}
              onChange={(e) => updateField('height', Number(e.target.value))}
              placeholder="e.g. 230"
              className="w-full bg-[#080b11] text-white px-3.5 py-2.5 rounded-xl border border-white/15 text-sm font-mono focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Dimension Quick Preset Chips */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="text-slate-400 font-semibold self-center mr-1">Presets:</span>
          {[
            { label: '200 × 230 (SSC/Bank Photo)', w: 200, h: 230 },
            { label: '140 × 60 (Standard Sig)', w: 140, h: 60 },
            { label: '350 × 350 (UPSC)', w: 350, h: 350 },
            { label: '350 × 450 (RRB/Passport)', w: 350, h: 450 },
            { label: '240 × 240 (Thumb Print)', w: 240, h: 240 }
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                updateField('width', preset.w);
                updateField('height', preset.h);
              }}
              className="bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-300 font-medium px-2.5 py-1 rounded-lg transition-all"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Format & Size Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
        {/* Format Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Target File Format:
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['JPG', 'PNG', 'PDF'].map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => updateField('format', fmt as FileFormat)}
                className={`py-2.5 rounded-xl text-xs font-black font-mono border transition-all ${
                  requirements.format === fmt
                    ? 'bg-emerald-600 border-emerald-400 text-white shadow-lg shadow-emerald-600/30'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* File Size Range (KB) */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Target File Size Limits (KB):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={requirements.minSizeKB}
              onChange={(e) => updateField('minSizeKB', Number(e.target.value))}
              placeholder="Min KB"
              className="w-full bg-[#080b11] text-white px-3 py-2.5 rounded-xl border border-white/15 text-sm font-mono focus:outline-none focus:border-indigo-500"
            />
            <span className="text-slate-400 text-xs font-extrabold">TO</span>
            <input
              type="number"
              value={requirements.maxSizeKB}
              onChange={(e) => updateField('maxSizeKB', Number(e.target.value))}
              placeholder="Max KB"
              className="w-full bg-[#080b11] text-white px-3 py-2.5 rounded-xl border border-white/15 text-sm font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Size Range Preset Chips */}
      <div className="flex flex-wrap gap-1.5 text-[11px] pt-1">
        <span className="text-slate-400 font-semibold self-center mr-1">Size Limits:</span>
        {[
          { label: '20–50 KB (SSC Photo)', min: 20, max: 50 },
          { label: '10–20 KB (SSC Signature)', min: 10, max: 20 },
          { label: '50–100 KB (Declaration)', min: 50, max: 100 },
          { label: '20–300 KB (UPSC)', min: 20, max: 300 },
          { label: '50–500 KB (Certificates)', min: 50, max: 500 }
        ].map((range, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              updateField('minSizeKB', range.min);
              updateField('maxSizeKB', range.max);
            }}
            className="bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-slate-300 font-medium px-2.5 py-1 rounded-lg transition-all"
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* 4. Crop Mode & Background Fill */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10">
        {/* Crop Mode */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block flex items-center justify-between">
            <span>Aspect Ratio & Crop Mode:</span>
            {requirements.cropMode === 'manual' && (
              <span className="text-[10px] text-emerald-400 font-bold">Visual Crop Active</span>
            )}
          </label>

          <div className="grid grid-cols-2 gap-2">
            {[
              { mode: 'fill', label: 'Fill Padding' },
              { mode: 'center', label: 'Center Crop' },
              { mode: 'stretch', label: 'Stretch Exact' },
              { mode: 'manual', label: 'Visual Manual Crop' }
            ].map((item) => (
              <button
                key={item.mode}
                type="button"
                onClick={() => {
                  updateField('cropMode', item.mode as CropMode);
                  if (item.mode === 'manual') {
                    onOpenManualCropper();
                  }
                }}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                  requirements.cropMode === item.mode
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white'
                }`}
              >
                <Crop className="w-3.5 h-3.5 shrink-0" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Background Color Picker */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-indigo-400" />
            <span>Background Color (For Padding):</span>
          </label>
          <div className="flex items-center gap-2">
            {[
              { color: '#FFFFFF', label: 'White' },
              { color: '#F3F4F6', label: 'Light Gray' },
              { color: '#000000', label: 'Black' }
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => updateField('bgColor', c.color)}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  requirements.bgColor === c.color
                    ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm'
                    : 'border-white/10 bg-white/[0.04] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span
                  className="w-4 h-4 rounded-full border border-slate-600 shadow-sm"
                  style={{ backgroundColor: c.color }}
                />
                <span>{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

