'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Download, Sparkles, CheckCircle2, RefreshCw, ZoomIn, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { UploadedFile, ProcessingResult } from '@/types/document';

interface ImageComparisonPreviewProps {
  uploadedFile: UploadedFile;
  processingResult: ProcessingResult;
  onOptimizeAgain: () => void;
}

export const ImageComparisonPreview: React.FC<ImageComparisonPreviewProps> = ({
  uploadedFile,
  processingResult,
  onOptimizeAgain
}) => {
  const [zoomModalUrl, setZoomModalUrl] = useState<string | null>(null);

  const handleDownload = () => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore if confetti blocked
    }

    // Direct browser file download
    const link = document.createElement('a');
    link.href = processingResult.previewUrl;
    link.download = processingResult.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const savingsPct = Math.max(
    0,
    Math.round(((uploadedFile.originalSizeKB - processingResult.fileSizeKB) / uploadedFile.originalSizeKB) * 100)
  );

  return (
    <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-5 sm:p-7 space-y-6 shadow-2xl relative overflow-hidden backdrop-blur-2xl animate-fade-in">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl pointer-events-none" />

      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Portal Compliant
            </span>
            {savingsPct > 0 && (
              <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full">
                -{savingsPct}% Size Reduced
              </span>
            )}
          </div>
          <h3 className="text-xl font-black text-white flex items-center gap-2 mt-1.5 tracking-tight">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Formatted Output Document Ready
          </h3>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
        {/* Original Document */}
        <div className="bg-[#080b11] border border-white/10 rounded-2xl p-4 space-y-3 shadow-inner">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Original Input File
            </span>
            <span className="text-xs font-mono font-semibold text-slate-300">
              {uploadedFile.originalSizeKB > 1024
                ? `${(uploadedFile.originalSizeKB / 1024).toFixed(2)} MB`
                : `${uploadedFile.originalSizeKB} KB`}
            </span>
          </div>

          <div className="relative aspect-square max-h-56 bg-[#0d121e] rounded-xl border border-white/10 flex items-center justify-center p-3 overflow-hidden group">
            {uploadedFile.isPdf ? (
              <div className="text-center p-4">
                <span className="text-4xl">📄</span>
                <p className="text-xs text-slate-400 mt-2 font-mono">{uploadedFile.name}</p>
              </div>
            ) : (
              <img
                src={uploadedFile.previewUrl}
                alt="Original"
                className="max-h-full max-w-full object-contain shadow-md rounded"
              />
            )}

            <button
              onClick={() => setZoomModalUrl(uploadedFile.previewUrl)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1.5 transition-all backdrop-blur-sm"
            >
              <ZoomIn className="w-4 h-4 text-indigo-400" />
              <span>Inspect Original</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 space-y-1 font-mono pt-1">
            <div>Original Dimensions: <span className="text-slate-200 font-bold">{uploadedFile.width || 0} × {uploadedFile.height || 0} px</span></div>
            <div>File Format: <span className="text-slate-200 font-bold">{uploadedFile.type.replace('image/', '').toUpperCase()}</span></div>
          </div>
        </div>

        {/* Formatted Result Document */}
        <div className="bg-[#080b11] border-2 border-emerald-500/50 rounded-2xl p-4 space-y-3 relative shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Formatted Result
            </span>
            <span className="text-xs font-mono font-bold text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-md">
              {processingResult.fileSizeKB} KB
            </span>
          </div>

          <div className="relative aspect-square max-h-56 bg-[#0d121e] rounded-xl border border-white/10 flex items-center justify-center p-3 overflow-hidden group">
            {processingResult.format === 'PDF' ? (
              <div className="text-center p-4">
                <span className="text-4xl">📄</span>
                <p className="text-xs text-emerald-300 mt-2 font-mono font-bold">
                  {processingResult.fileName}
                </p>
              </div>
            ) : (
              <img
                src={processingResult.previewUrl}
                alt="Processed Result"
                className="max-h-full max-w-full object-contain shadow-md rounded"
              />
            )}

            <button
              onClick={() => setZoomModalUrl(processingResult.previewUrl)}
              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold gap-1.5 transition-all backdrop-blur-sm"
            >
              <ZoomIn className="w-4 h-4 text-emerald-400" />
              <span>Full Output Preview</span>
            </button>
          </div>

          <div className="text-xs text-slate-300 space-y-1 font-mono pt-1">
            <div>Target Dimensions: <strong className="text-indigo-400">{processingResult.width} × {processingResult.height} px</strong></div>
            <div>Output Format: <strong className="text-emerald-400">{processingResult.format}</strong></div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10">
        <button
          onClick={onOptimizeAgain}
          className="w-full sm:w-auto px-5 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4 text-indigo-400" />
          <span>Adjust & Process Again</span>
        </button>

        <button
          onClick={handleDownload}
          className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-black text-sm rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/25 transform hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
        >
          <Download className="w-5 h-5" />
          <span>Download Formatted Document</span>
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>

      {/* Zoom Modal */}
      {zoomModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setZoomModalUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-[#0d121e] rounded-3xl p-6 border border-white/15 shadow-2xl">
            <img src={zoomModalUrl} alt="Zoom Preview" className="max-h-[75vh] max-w-full object-contain mx-auto rounded-xl" />
            <button
              onClick={() => setZoomModalUrl(null)}
              className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-xs font-bold border border-white/15"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

