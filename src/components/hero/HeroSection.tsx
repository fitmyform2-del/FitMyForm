'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Zap, Award } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <div className="relative pt-6 pb-2 text-center max-w-4xl mx-auto space-y-4">
      {/* Floating Pill Badge */}
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold shadow-sm">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>100% Free • In-Browser Processing • Official 2025–2026 Portal Standards</span>
      </div>

      {/* Main Title (iLove Style) */}
      <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
        Every tool you could want to <span className="gradient-text">edit images</span> & format exam documents
      </h1>

      {/* Subtitle */}
      <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
        Your free online image editor and document formatter. Compress photos to exact KB limits, crop, convert formats, or resize photos and signatures for SSC, UPSC, Banking, and Online Exams with zero server uploads.
      </p>

      {/* Guarantee Badges Row */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 pt-2 text-xs font-semibold text-slate-300">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>100% In-Browser Privacy</span>
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="flex items-center gap-1.5 text-amber-400">
          <Zap className="w-4 h-4" />
          <span>Zero Server Uploads</span>
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="flex items-center gap-1.5 text-indigo-400">
          <Award className="w-4 h-4" />
          <span>Official Exam Portal Specs</span>
        </span>
      </div>
    </div>
  );
};
