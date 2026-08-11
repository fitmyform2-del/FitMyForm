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
  SlidersHorizontal
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
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-blue-400" />
          Target Requirements & Specifications
        </h3>
        {presetNotice && (
          <span className="text-xs bg-blue-950/90 text-blue-300 border border-blue-800 px-2.5 py-1 rounded-full font-medium">
            Active: {presetNotice}
          </span>
        )}
      </div>

      {/* 1. Document Type Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-gray-300 block">
          Document Type:
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
                className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all ${
                  isSelected
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-gray-950/80 border-gray-800 text-gray-300 hover:border-gray-700 hover:text-white'
                }`}
              >
                <IconComp className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Target Dimensions (px) */}
      <div className="space-y-3 pt-2 border-t border-gray-800/80">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-300">
            Target Dimensions (Pixels):
          </label>
          <span className="text-[11px] text-blue-400 font-mono">
            {requirements.width || 0} × {requirements.height || 0} px
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] text-gray-400 block mb-1">Width (px)</span>
            <input
              type="number"
              value={requirements.width || ''}
              onChange={(e) => updateField('width', Number(e.target.value))}
              placeholder="e.g. 200"
              className="w-full bg-gray-950 text-white px-3 py-2 rounded-xl border border-gray-800 text-sm font-mono focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <span className="text-[11px] text-gray-400 block mb-1">Height (px)</span>
            <input
              type="number"
              value={requirements.height || ''}
              onChange={(e) => updateField('height', Number(e.target.value))}
              placeholder="e.g. 230"
              className="w-full bg-gray-950 text-white px-3 py-2 rounded-xl border border-gray-800 text-sm font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Dimension Quick Preset Chips */}
        <div className="flex flex-wrap gap-1.5 text-[11px]">
          <span className="text-gray-500 self-center mr-1">Presets:</span>
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
              className="bg-gray-950 hover:bg-gray-800 border border-gray-800 text-gray-300 px-2 py-1 rounded-md transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Format & Size Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-800/80">
        {/* Format Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 block">
            Target File Format:
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            {['JPG', 'PNG', 'PDF'].map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => updateField('format', fmt as FileFormat)}
                className={`py-2 rounded-xl text-xs font-semibold font-mono border transition-all ${
                  requirements.format === fmt
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                    : 'bg-gray-950 border-gray-800 text-gray-300 hover:text-white'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* File Size Range (KB) */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 block">
            Target File Size Range (KB):
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={requirements.minSizeKB}
              onChange={(e) => updateField('minSizeKB', Number(e.target.value))}
              placeholder="Min KB"
              className="w-full bg-gray-950 text-white px-3 py-2 rounded-xl border border-gray-800 text-sm font-mono focus:outline-none focus:border-blue-500"
            />
            <span className="text-gray-500 text-xs font-bold">TO</span>
            <input
              type="number"
              value={requirements.maxSizeKB}
              onChange={(e) => updateField('maxSizeKB', Number(e.target.value))}
              placeholder="Max KB"
              className="w-full bg-gray-950 text-white px-3 py-2 rounded-xl border border-gray-800 text-sm font-mono focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Quick Size Range Preset Chips */}
      <div className="flex flex-wrap gap-1.5 text-[11px] pt-1">
        <span className="text-gray-500 self-center mr-1">Size Presets:</span>
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
            className="bg-gray-950 hover:bg-gray-800 border border-gray-800 text-gray-300 px-2 py-1 rounded-md transition-colors"
          >
            {range.label}
          </button>
        ))}
      </div>

      {/* 4. Crop Mode & Background Fill */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-800/80">
        {/* Crop Mode */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 block flex items-center justify-between">
            <span>Aspect Ratio & Crop Mode:</span>
            {requirements.cropMode === 'manual' && (
              <span className="text-[10px] text-emerald-400 font-medium">Visual Crop Active</span>
            )}
          </label>

          <div className="grid grid-cols-2 gap-1.5">
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
                className={`py-2 px-2 rounded-xl text-xs font-medium border flex items-center justify-center gap-1 transition-all ${
                  requirements.cropMode === item.mode
                    ? 'bg-blue-600 border-blue-500 text-white shadow-md'
                    : 'bg-gray-950 border-gray-800 text-gray-300 hover:text-white'
                }`}
              >
                <Crop className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Background Color Picker */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-300 block flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-blue-400" />
            Background Color (For Padding):
          </label>
          <div className="flex items-center gap-2">
            {[
              { color: '#FFFFFF', label: 'White' },
              { color: '#F3F4F6', label: 'Gray' },
              { color: '#000000', label: 'Black' }
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => updateField('bgColor', c.color)}
                className={`flex-1 py-1.5 rounded-xl border text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
                  requirements.bgColor === c.color
                    ? 'border-blue-500 bg-gray-800 text-white'
                    : 'border-gray-800 bg-gray-950 text-gray-400'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full border border-gray-600"
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
