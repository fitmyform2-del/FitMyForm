'use client';

import React from 'react';
import { Download, CheckCircle2 } from 'lucide-react';
import { ProcessingResult } from '@/types/document';

interface ToolResultViewProps {
  processingResult: ProcessingResult;
  onReset: () => void;
}

export const ToolResultView: React.FC<ToolResultViewProps> = ({ processingResult, onReset }) => {
  return (
    <div className="max-w-2xl mx-auto glass-panel-elevated rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl text-center">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>100% Portal Compliant Output Ready</span>
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-white">
        Document Formatted Successfully!
      </h3>

      <div className="relative aspect-square max-h-64 mx-auto rounded-2xl bg-black/40 border-2 border-emerald-500/50 flex items-center justify-center p-3 overflow-hidden shadow-2xl">
        <img src={processingResult.previewUrl} alt="Output" className="max-h-full max-w-full object-contain rounded-lg" />
      </div>

      <div className="flex items-center justify-center gap-4 text-xs font-mono text-slate-300">
        <span>Dimensions: <strong className="text-indigo-300">{processingResult.width}×{processingResult.height} px</strong></span>
        <span>•</span>
        <span>File Size: <strong className="text-emerald-400">{processingResult.fileSizeKB} KB</strong></span>
        <span>•</span>
        <span>Format: <strong className="text-emerald-400">{processingResult.format}</strong></span>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
        <a
          href={processingResult.previewUrl}
          download={processingResult.fileName}
          className="w-full sm:w-auto touch-target px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all"
        >
          <Download className="w-4 h-4" />
          <span>Download Formatted Document</span>
        </a>

        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto touch-target px-5 py-3 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          <span>Format Another Photo</span>
        </button>
      </div>
    </div>
  );
};
