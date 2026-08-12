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
    <div className="relative overflow-hidden py-8 sm:py-12 px-4 sm:px-6 lg:px-8 text-center">
      {/* Dynamic Background Glow Haloes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[250px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse-glow" />

      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold mb-6 shadow-lg shadow-indigo-500/5 animate-float-subtle">
        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
        <span>100% Free Client-Side Student Document Formatter</span>
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
      </div>

      {/* Main Title */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] max-w-5xl mx-auto">
        Format Photos & Documents to Exact Specs for{' '}
        <span className="gradient-text font-black">SSC, UPSC, Banking & Online Exams</span>
      </h1>

      {/* Description */}
      <p className="mt-4 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
        Upload photo, signature, thumb print, or PDF. Format to exact pixel dimensions (e.g. <strong className="text-indigo-400 font-mono">200 × 230 px</strong>) and target KB limits (e.g. <strong className="text-emerald-400 font-mono">20–50 KB JPG</strong>) in seconds with 0 server uploads.
      </p>

      {/* Guarantee Badges Row */}
      <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-slate-300 bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-2xl py-2.5 px-5 max-w-2xl mx-auto shadow-xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium text-slate-200">100% Zero-Server Upload</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="font-medium text-slate-200">Instant Canvas Processing</span>
        </div>
        <div className="w-1 h-1 rounded-full bg-slate-700 hidden sm:block" />
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="font-medium text-slate-200">Exact Pixel & KB Accuracy</span>
        </div>
      </div>

      {/* Exam Preset Shortcut Chips */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Popular Presets:</span>
        <button
          onClick={() => onQuickPresetSelect('ssc-cgl')}
          className="bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 hover:border-indigo-500/60 text-indigo-300 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
        >
          SSC Photo (20-50 KB)
        </button>
        <button
          onClick={() => onQuickPresetSelect('ibps-banking')}
          className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 hover:border-emerald-500/60 text-emerald-300 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
        >
          IBPS Signature (10-20 KB)
        </button>
        <button
          onClick={() => onQuickPresetSelect('upsc-civil-services')}
          className="bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/60 text-blue-300 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
        >
          UPSC Photo (350x350)
        </button>
        <button
          onClick={() => onQuickPresetSelect('rrb-railway')}
          className="bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/60 text-amber-300 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all shadow-sm"
        >
          Railway RRB (350x450)
        </button>

        <button
          onClick={onOpenPresetModal}
          className="bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-slate-200 text-xs font-bold px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-all shadow-sm group"
        >
          <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>Search 30+ Exams...</span>
        </button>
      </div>
    </div>
  );
};

