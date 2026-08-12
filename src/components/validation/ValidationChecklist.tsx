'use client';

import React from 'react';
import { CheckCircle2, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { validateDocumentResult } from '@/lib/validation/documentValidator';
import { ProcessingResult, DocumentRequirements } from '@/types/document';

interface ValidationChecklistProps {
  result: ProcessingResult;
  requirements: DocumentRequirements;
  onOptimizeAgain: () => void;
}

export const ValidationChecklist: React.FC<ValidationChecklistProps> = ({
  result,
  requirements,
  onOptimizeAgain
}) => {
  const { isValid, checklist } = validateDocumentResult({
    fileSizeKB: result.fileSizeKB,
    width: result.width,
    height: result.height,
    format: result.format,
    requirements
  });

  return (
    <div className={`border rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl backdrop-blur-2xl transition-all ${
      isValid
        ? 'bg-emerald-500/10 border-emerald-500/30'
        : 'bg-amber-500/10 border-amber-500/30'
    }`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <h4 className="font-extrabold text-sm text-white flex items-center gap-2.5 tracking-tight">
          {isValid ? (
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
          )}
          <span>Pre-Submission Compliance Verification</span>
        </h4>
        <span className={`text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm ${
          isValid
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
        }`}>
          {isValid ? '✅ All Specs Satisfied' : '⚠️ Action Recommended'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all ${
              item.passed
                ? 'bg-[#080b11]/80 border-emerald-500/30'
                : 'bg-[#080b11]/80 border-amber-500/30'
            }`}
          >
            {item.passed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5 text-xs">
              <span className="font-bold text-white block">{item.label}</span>
              <div className="text-[11px] text-slate-400 font-mono">
                Target: <span className="text-slate-300">{item.expected}</span>
              </div>
              <div className="text-[11px] font-mono">
                Actual: <strong className={item.passed ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>{item.actual}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isValid && (
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-amber-300 font-medium">
            Some properties require fine-tuning for 100% portal acceptance.
          </p>
          <button
            onClick={onOptimizeAgain}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 shrink-0 shadow-lg shadow-amber-500/20 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-Optimize Document</span>
          </button>
        </div>
      )}
    </div>
  );
};

