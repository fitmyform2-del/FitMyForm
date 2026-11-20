'use client';

import React from 'react';
import Link from 'next/link';
import { Download, CheckCircle2, RotateCcw, ArrowRight, Wand2 } from 'lucide-react';
import { ProcessingResult } from '@/types/document';

interface ToolResultViewProps {
  processingResult: ProcessingResult;
  onReset: () => void;
}

export const ToolResultView: React.FC<ToolResultViewProps> = ({ processingResult, onReset }) => {
  return (
    <div className="max-w-2xl mx-auto fmf-panel-elevated p-6 sm:p-10 space-y-6 text-center animate-fade-in">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
        <CheckCircle2 className="w-4 h-4" />
        <span>Document Formatted Successfully</span>
      </div>

      <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
        Your document is ready to download!
      </h2>

      {/* Image Preview Stage */}
      <div className="relative aspect-square max-h-72 mx-auto rounded-2xl bg-black/50 border border-emerald-500/40 flex items-center justify-center p-4 overflow-hidden shadow-2xl">
        <img src={processingResult.previewUrl} alt="Output" className="max-h-full max-w-full object-contain rounded-lg shadow-md" />
      </div>

      {/* Before / After Stats Badge */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-mono bg-white/[0.04] p-3 rounded-xl border border-white/10">
        <span>Dimensions: <strong className="text-blue-300 font-bold">{processingResult.width} × {processingResult.height} px</strong></span>
        <span>•</span>
        <span>File Size: <strong className="text-emerald-400 font-bold">{processingResult.fileSizeKB} KB</strong></span>
        <span>•</span>
        <span>Format: <strong className="text-blue-300 font-bold">{processingResult.format}</strong></span>
      </div>

      {/* Primary Actions */}
      <div className="space-y-3 pt-2">
        <a
          href={processingResult.previewUrl}
          download={processingResult.fileName}
          className="w-full fmf-btn-primary py-4 text-base font-black flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/30 cursor-pointer"
        >
          <Download className="w-5 h-5" />
          <span>Download Formatted Document</span>
        </a>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
          <button
            type="button"
            onClick={onReset}
            className="w-full sm:w-auto fmf-btn-secondary px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Process Another Image</span>
          </button>

          <Link
            href="/photo-editor"
            className="w-full sm:w-auto fmf-btn-secondary px-6 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Wand2 className="w-3.5 h-3.5 text-pink-400" />
            <span>Open in Photo Editor</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
