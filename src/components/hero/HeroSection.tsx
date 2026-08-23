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
    <div className="relative overflow-hidden py-8 sm:py-14 px-4 sm:px-6 lg:px-8 text-center">
      {/* Floating Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-6">
        <Sparkles className="w-4 h-4" />
        <span>100% Free Client-Side Student Document Formatter</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.15] max-w-5xl mx-auto">
        Format Photos & Documents to Exact Specs for{' '}
        <span className="text-indigo-400">SSC, UPSC, Banking & Online Exams</span>
      </h1>

      {/* Subtitle Description */}
      <p className="mt-5 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
        Upload photo, signature, thumb print, or PDF. Format to exact pixel dimensions (e.g. <strong className="text-indigo-300 font-mono">200 × 230 px</strong>) and target KB limits (e.g. <strong className="text-emerald-400 font-mono">20–50 KB JPG</strong>) in seconds with zero server uploads.
      </p>

      {/* Guarantee Badges Row */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-xs text-slate-300 bg-slate-800/50 rounded-xl py-4 px-6 max-w-3xl mx-auto border border-slate-700/50">
        <div className="flex items-center justify-between w-full sm:w-auto gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 flex-1 sm:flex-none">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold tracking-wide text-[11px] sm:text-xs">Zero Server Upload</span>
          </div>
          <div className="w-[1px] h-6 bg-slate-700 hidden sm:block" />
          <div className="flex flex-col sm:flex-row items-center gap-2 flex-1 sm:flex-none">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="font-semibold tracking-wide text-[11px] sm:text-xs">Instant Processing</span>
          </div>
        </div>
        <div className="w-full h-[1px] sm:w-[1px] sm:h-6 bg-slate-700 block" />
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Award className="w-5 h-5 text-indigo-400 shrink-0" />
          <span className="font-semibold tracking-wide text-[11px] sm:text-xs">Exact Pixel & KB Accuracy</span>
        </div>
      </div>

      {/* Exam Preset Shortcut Chips */}
      <div className="mt-9 flex flex-col items-center justify-center gap-4 max-w-3xl mx-auto w-full">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          Popular Form Presets
        </span>
        
        {/* Horizontal Scroll on Mobile */}
        <div className="flex overflow-x-auto w-full pb-4 pt-1 px-1 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] gap-3 justify-start sm:justify-center">
          <button
            onClick={() => onQuickPresetSelect('ssc-cgl')}
            className="snap-center shrink-0 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium px-5 py-3 min-h-[48px] rounded-lg transition-colors cursor-pointer"
          >
            SSC Photo (20-50 KB)
          </button>
          <button
            onClick={() => onQuickPresetSelect('ibps-banking')}
            className="snap-center shrink-0 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium px-5 py-3 min-h-[48px] rounded-lg transition-colors cursor-pointer"
          >
            IBPS Signature (10-20 KB)
          </button>
          <button
            onClick={() => onQuickPresetSelect('upsc-civil-services')}
            className="snap-center shrink-0 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium px-5 py-3 min-h-[48px] rounded-lg transition-colors cursor-pointer"
          >
            UPSC Photo (350x350)
          </button>
          <button
            onClick={() => onQuickPresetSelect('rrb-railway')}
            className="snap-center shrink-0 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-medium px-5 py-3 min-h-[48px] rounded-lg transition-colors cursor-pointer"
          >
            Railway RRB (350x450)
          </button>

          <button
            onClick={onOpenPresetModal}
            className="snap-center shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-5 py-3 min-h-[48px] rounded-lg flex items-center gap-2 transition-colors cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Search 30+ Exams...</span>
          </button>
        </div>
      </div>
    </div>
  );
};
