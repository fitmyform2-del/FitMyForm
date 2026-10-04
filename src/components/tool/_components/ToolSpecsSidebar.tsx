'use client';

import React from 'react';
import { Sparkles, RefreshCw, ArrowRight, AlertCircle } from 'lucide-react';
import { DocumentRequirements, FileFormat } from '@/types/document';

interface ToolSpecsSidebarProps {
  requirements: DocumentRequirements;
  isProcessing: boolean;
  errorMsg: string | null;
  onRequirementsChange: (reqs: DocumentRequirements) => void;
  onProcess: () => void;
}

export const ToolSpecsSidebar: React.FC<ToolSpecsSidebarProps> = ({
  requirements,
  isProcessing,
  errorMsg,
  onRequirementsChange,
  onProcess
}) => {
  return (
    <div className="glass-panel rounded-3xl p-6 space-y-5 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="font-bold text-white text-sm">Target Specifications</h3>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          Pre-configured
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Target Width (px)</span>
          <input
            type="number"
            value={requirements.width || ''}
            onChange={(e) => onRequirementsChange({ ...requirements, width: Number(e.target.value) })}
            className="w-full touch-target px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-white font-mono"
          />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Target Height (px)</span>
          <input
            type="number"
            value={requirements.height || ''}
            onChange={(e) => onRequirementsChange({ ...requirements, height: Number(e.target.value) })}
            className="w-full touch-target px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-white font-mono"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Min File Size (KB)</span>
          <input
            type="number"
            value={requirements.minSizeKB || ''}
            onChange={(e) => onRequirementsChange({ ...requirements, minSizeKB: Number(e.target.value) })}
            className="w-full touch-target px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-white font-mono"
          />
        </div>
        <div>
          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Max File Size (KB)</span>
          <input
            type="number"
            value={requirements.maxSizeKB || ''}
            onChange={(e) => onRequirementsChange({ ...requirements, maxSizeKB: Number(e.target.value) })}
            className="w-full touch-target px-3 py-2 rounded-xl bg-white/[0.04] border border-white/15 text-white font-mono"
          />
        </div>
      </div>

      <div>
        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Output Format</span>
        <div className="grid grid-cols-3 gap-2">
          {(['JPG', 'PNG', 'PDF'] as FileFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => onRequirementsChange({ ...requirements, format: fmt })}
              className={`touch-target py-2 rounded-xl text-xs font-bold font-mono border transition-all cursor-pointer ${
                requirements.format === fmt
                  ? 'bg-indigo-600 border-indigo-400 text-white shadow-md'
                  : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={onProcess}
        disabled={isProcessing}
        className="w-full touch-target py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer"
      >
        {isProcessing ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Processing Document...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Format Document Now</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {errorMsg && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
};
