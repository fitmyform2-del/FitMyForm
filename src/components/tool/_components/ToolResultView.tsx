'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Download, CheckCircle2, RotateCcw, Sliders, Wand2, FileText, AlertTriangle } from 'lucide-react';
import { UploadedFile, DocumentRequirements, ProcessingResult } from '@/types/document';
import { ValidationChecklist } from '@/components/validation/ValidationChecklist';
import { PassportSheetPanel } from './PassportSheetPanel';

interface ToolResultViewProps {
  uploadedFile: UploadedFile;
  requirements: DocumentRequirements;
  processingResult: ProcessingResult;
  onBackToAdjust: () => void;
  onReset: () => void;
  onOptimizeAgain: () => void;
}

export const ToolResultView: React.FC<ToolResultViewProps> = ({
  uploadedFile,
  requirements,
  processingResult,
  onBackToAdjust,
  onReset,
  onOptimizeAgain
}) => {
  const router = useRouter();

  const savingsPct = uploadedFile.originalSizeKB > 0
    ? Math.round(((uploadedFile.originalSizeKB - processingResult.fileSizeKB) / uploadedFile.originalSizeKB) * 100)
    : 0;

  const handleOpenInPhotoEditor = () => {
    if (processingResult.format === 'PDF') return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        sessionStorage.setItem(
          'fitmyform_handoff_image',
          JSON.stringify({
            dataUrl: reader.result,
            name: processingResult.fileName,
            type: processingResult.blob.type || 'image/jpeg',
            sizeKB: processingResult.fileSizeKB,
            width: processingResult.width,
            height: processingResult.height
          })
        );
      } catch {
        // sessionStorage quota exceeded — fall through
      }
      router.push('/photo-editor');
    };
    reader.readAsDataURL(processingResult.blob);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="fmf-panel-elevated p-6 sm:p-8 space-y-6 text-center">
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border ${
            processingResult.isValid
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
          }`}
        >
          {processingResult.isValid ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Document Formatted & Verified</span>
            </>
          ) : (
            <>
              <AlertTriangle className="w-4 h-4" />
              <span>Formatted — Review Checklist Below</span>
            </>
          )}
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Your {processingResult.format} document is ready!
        </h2>

        {/* Side-by-side Before / After Preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="rounded-2xl bg-black/40 border border-white/10 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase">
              <span>Original</span>
              <span className="font-mono text-slate-300">{uploadedFile.originalSizeKB} KB</span>
            </div>
            <div className="aspect-square max-h-52 rounded-xl bg-[#080b11] border border-white/10 flex items-center justify-center p-2 overflow-hidden">
              <img src={uploadedFile.previewUrl} alt="Original" className="max-h-full max-w-full object-contain rounded" />
            </div>
            <div className="text-[11px] font-mono text-slate-400 text-center">
              {uploadedFile.width} × {uploadedFile.height} px
            </div>
          </div>

          <div className="rounded-2xl bg-black/40 border-2 border-emerald-500/40 p-3.5 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] font-bold text-emerald-400 uppercase">
              <span>Formatted Output</span>
              <span className="font-mono text-emerald-300">
                {processingResult.fileSizeKB} KB {savingsPct > 0 ? `(-${savingsPct}%)` : ''}
              </span>
            </div>
            <div className="aspect-square max-h-52 rounded-xl bg-[#080b11] border border-white/10 flex items-center justify-center p-2 overflow-hidden">
              {processingResult.format === 'PDF' ? (
                <div className="text-center space-y-2 p-4">
                  <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
                  <p className="text-xs font-bold text-white break-all">{processingResult.fileName}</p>
                  <p className="text-[11px] text-slate-400">Valid PDF Document</p>
                </div>
              ) : (
                <img src={processingResult.previewUrl} alt="Output" className="max-h-full max-w-full object-contain rounded shadow-md" />
              )}
            </div>
            <div className="text-[11px] font-mono text-blue-300 text-center font-bold">
              {processingResult.width} × {processingResult.height} px • {processingResult.format}
            </div>
          </div>
        </div>

        {/* Primary Actions */}
        <div className="space-y-3 pt-2">
          <a
            href={processingResult.previewUrl}
            download={processingResult.fileName}
            className="w-full fmf-btn-primary py-4 text-base font-black flex items-center justify-center gap-2.5 shadow-xl shadow-blue-600/30 cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Download {processingResult.fileName}</span>
          </a>

          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={onBackToAdjust}
              className="fmf-btn-secondary px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span>Adjust Settings / Re-crop</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="fmf-btn-secondary px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Upload Another Image</span>
            </button>

            {processingResult.format !== 'PDF' && (
              <button
                type="button"
                onClick={handleOpenInPhotoEditor}
                className="fmf-btn-secondary px-5 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5 text-pink-400" />
                <span>Open in Photo Editor</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Printable Passport Sheet (4x6 / A4) */}
      {processingResult.format !== 'PDF' && (
        <PassportSheetPanel imageUrl={processingResult.previewUrl} />
      )}

      {/* Live Compliance Checklist */}
      <ValidationChecklist
        result={processingResult}
        requirements={requirements}
        onOptimizeAgain={onOptimizeAgain}
      />
    </div>
  );
};
