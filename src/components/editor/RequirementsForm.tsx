'use client';

import React from 'react';
import { SlidersHorizontal, Sparkles } from 'lucide-react';
import { DocumentRequirements, FileFormat, CropMode } from '@/types/document';
import { DocCategorySelector } from './_components/DocCategorySelector';
import { DimensionInputs } from './_components/DimensionInputs';
import { SizeAndFormatSection } from './_components/SizeAndFormatSection';
import { PhotoStampOptions } from './_components/PhotoStampOptions';
import { SignatureFilterOptions } from './_components/SignatureFilterOptions';
import { CropAndBgSection } from './_components/CropAndBgSection';

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
    onChange({ ...requirements, [field]: value });
  };

  const isPhoto = requirements.documentType === 'photo';
  const isSignatureOrThumb =
    requirements.documentType === 'signature' || requirements.documentType === 'thumb';

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
      <DocCategorySelector
        currentType={requirements.documentType}
        onSelectType={(docType, defaults) => {
          onChange({
            ...requirements,
            documentType: docType,
            width: defaults.width,
            height: defaults.height,
            minSizeKB: defaults.minKB,
            maxSizeKB: defaults.maxKB
          });
        }}
      />

      {/* 2. Target Dimensions with Unit Converter (px / cm / mm / in) */}
      <DimensionInputs
        width={requirements.width}
        height={requirements.height}
        onWidthChange={(w) => updateField('width', w)}
        onHeightChange={(h) => updateField('height', h)}
      />

      {/* 3. Format & Size Range Limits */}
      <SizeAndFormatSection
        format={requirements.format}
        minSizeKB={requirements.minSizeKB}
        maxSizeKB={requirements.maxSizeKB}
        onFormatChange={(fmt: FileFormat) => updateField('format', fmt)}
        onSizeRangeChange={(min, max) => {
          onChange({
            ...requirements,
            minSizeKB: min,
            maxSizeKB: max
          });
        }}
      />

      {/* 4. Exam Photo Name & DOP Stamp (SSC / UPSC / State Exams) */}
      {isPhoto && (
        <PhotoStampOptions
          config={requirements.photoStamp}
          onChange={(stampConfig) => updateField('photoStamp', stampConfig)}
        />
      )}

      {/* 5. Signature Contrast & Paper Whitener */}
      {isSignatureOrThumb && (
        <SignatureFilterOptions
          config={requirements.signatureFilter}
          onChange={(sigConfig) => updateField('signatureFilter', sigConfig)}
        />
      )}

      {/* 6. Crop Mode & Background Fill Color */}
      <CropAndBgSection
        cropMode={requirements.cropMode}
        bgColor={requirements.bgColor}
        onCropModeChange={(mode: CropMode) => updateField('cropMode', mode)}
        onBgColorChange={(color) => updateField('bgColor', color)}
        onOpenManualCropper={onOpenManualCropper}
      />
    </div>
  );
};
