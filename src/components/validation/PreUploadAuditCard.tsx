'use client';

import React from 'react';
import { UploadedFile, DocumentRequirements } from '@/types/document';
import { ShieldCheck, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface PreUploadAuditCardProps {
  uploadedFile: UploadedFile;
  requirements: DocumentRequirements;
}

export function PreUploadAuditCard({ uploadedFile, requirements }: PreUploadAuditCardProps) {
  const origKB = Math.round(uploadedFile.originalSizeKB);
  const minKB = requirements.minSizeKB || 20;
  const maxKB = requirements.maxSizeKB || 50;

  const targetW = requirements.width || 200;
  const targetH = requirements.height || 230;

  const needsCompression = origKB > maxKB;
  const compressionRatio = needsCompression ? Math.round(((origKB - maxKB) / origKB) * 100) : 0;

  return (
    <div className="bg-indigo-950/20 border border-indigo-500/30 rounded-2xl p-4 space-y-3 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-white">Live Form Compliance Preview</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
          <Zap className="w-2.5 h-2.5" /> Auto-Correction Ready
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
        {/* File Size Audit */}
        <div className="bg-[#080b11]/80 p-2.5 rounded-xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Size Optimization</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className={needsCompression ? 'text-amber-400 font-bold' : 'text-slate-300'}>
              {origKB} KB
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-emerald-400 font-bold">
              {minKB}–{maxKB} KB
            </span>
          </div>
          {needsCompression && (
            <span className="text-[10px] text-indigo-300 font-medium block">
              Will safely reduce size by ~{compressionRatio}% without quality loss.
            </span>
          )}
        </div>

        {/* Dimension Audit */}
        <div className="bg-[#080b11]/80 p-2.5 rounded-xl border border-white/10 space-y-1">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Target Dimensions</span>
          <div className="flex items-center gap-1.5 font-mono">
            <span className="text-slate-300">
              {uploadedFile.width && uploadedFile.height ? `${uploadedFile.width}×${uploadedFile.height}` : 'Original'}
            </span>
            <ArrowRight className="w-3 h-3 text-slate-500" />
            <span className="text-emerald-400 font-bold">
              {targetW}×{targetH} px
            </span>
          </div>
          <span className="text-[10px] text-indigo-300 font-medium block">
            Aspect ratio locked to {requirements.format} format standard.
          </span>
        </div>
      </div>
    </div>
  );
}
