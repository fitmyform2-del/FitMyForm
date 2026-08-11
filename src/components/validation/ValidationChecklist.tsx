'use client';

import React from 'react';
import { CheckCircle2, XCircle, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';
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
  const { isValid, checklist, validationErrors } = validateDocumentResult({
    fileSizeKB: result.fileSizeKB,
    width: result.width,
    height: result.height,
    format: result.format,
    requirements
  });

  return (
    <div className={`border rounded-2xl p-5 space-y-4 shadow-xl ${
      isValid
        ? 'bg-emerald-950/40 border-emerald-500/40'
        : 'bg-amber-950/40 border-amber-500/40'
    }`}>
      <div className="flex items-center justify-between border-b border-gray-800/80 pb-3">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          {isValid ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          )}
          <span>Verification & Portal Compliance Status</span>
        </h4>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
          isValid
            ? 'bg-emerald-900 text-emerald-300 border border-emerald-700'
            : 'bg-amber-900 text-amber-300 border border-amber-700'
        }`}>
          {isValid ? '✅ Requirement Satisfied' : '⚠️ Action Required'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {checklist.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
              item.passed
                ? 'bg-gray-900/80 border-emerald-500/30'
                : 'bg-gray-900/80 border-amber-500/40'
            }`}
          >
            {item.passed ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            )}
            <div className="space-y-0.5 text-xs">
              <span className="font-semibold text-white block">{item.label}</span>
              <div className="text-[11px] text-gray-400 font-mono">
                Req: <span className="text-gray-300">{item.expected}</span>
              </div>
              <div className="text-[11px] font-mono">
                Actual: <strong className={item.passed ? 'text-emerald-400' : 'text-amber-400'}>{item.actual}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isValid && (
        <div className="pt-2 flex items-center justify-between gap-3">
          <p className="text-xs text-amber-300">
            One or more form specifications are out of bounds.
          </p>
          <button
            onClick={onOptimizeAgain}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shrink-0 shadow-lg shadow-amber-600/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Optimize Again</span>
          </button>
        </div>
      )}
    </div>
  );
};
