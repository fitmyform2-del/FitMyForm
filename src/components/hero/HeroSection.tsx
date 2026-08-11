'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Zap, Award, Search } from 'lucide-react';

interface HeroSectionProps {
  onOpenPresetModal: () => void;
  onQuickPresetSelect: (presetId: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenPresetModal,
  onQuickPresetSelect
}) => {
  return (
    <div className="relative overflow-hidden py-10 sm:py-16 px-4 sm:px-6 lg:px-8 text-center">
      {/* Background glow accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[250px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-6 shadow-md animate-pulse-subtle">
        <Sparkles className="w-3.5 h-3.5 text-blue-400" />
        <span>100% Free & Browser-Only Document Formatter</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
        Student Document Resizer for{' '}
        <span className="gradient-text">SSC, UPSC, Banking & Online Exams</span>
      </h1>

      {/* Description */}
      <p className="mt-4 text-sm sm:text-base text-gray-300 max-w-2xl mx-auto leading-relaxed font-normal">
        Upload your photo, signature, or thumb impression. Automatically resize to exact dimensions (e.g. <strong>200 × 230 px</strong>), crop, and compress to target file limits (e.g. <strong>20–50 KB JPG</strong>) in seconds.
      </p>

      {/* Privacy Guarantee Pill */}
      <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 text-xs text-gray-300 bg-gray-900/60 backdrop-blur border border-gray-800 rounded-2xl py-2 px-4 max-w-xl mx-auto">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>No Server Upload</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block" />
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Instant Processing</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-gray-700 hidden sm:block" />
        <div className="flex items-center gap-1.5">
          <Award className="w-4 h-4 text-blue-400 shrink-0" />
          <span>Exact Pixel Accuracy</span>
        </div>
      </div>

      {/* Exam Preset Shortcut Chips */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
        <span className="text-xs font-semibold text-gray-400 mr-1">Popular Presets:</span>
        <button
          onClick={() => onQuickPresetSelect('ssc-cgl')}
          className="bg-blue-900/40 hover:bg-blue-800/60 border border-blue-500/30 text-blue-200 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
        >
          SSC Photo (20-50 KB)
        </button>
        <button
          onClick={() => onQuickPresetSelect('ibps-banking')}
          className="bg-emerald-900/40 hover:bg-emerald-800/60 border border-emerald-500/30 text-emerald-200 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
        >
          IBPS Signature (10-20 KB)
        </button>
        <button
          onClick={() => onQuickPresetSelect('upsc-civil-services')}
          className="bg-indigo-900/40 hover:bg-indigo-800/60 border border-indigo-500/30 text-indigo-200 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
        >
          UPSC Photo (350x350)
        </button>
        <button
          onClick={() => onQuickPresetSelect('rrb-railway')}
          className="bg-amber-900/40 hover:bg-amber-800/60 border border-amber-500/30 text-amber-200 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
        >
          Railway RRB (350x450)
        </button>

        <button
          onClick={onOpenPresetModal}
          className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-gray-300 text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"
        >
          <Search className="w-3 h-3 text-blue-400" />
          <span>Search 30+ Exams...</span>
        </button>
      </div>
    </div>
  );
};
