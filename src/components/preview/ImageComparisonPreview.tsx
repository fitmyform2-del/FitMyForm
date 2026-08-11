'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Download, Sparkles, Eye, CheckCircle2, ArrowRight, RefreshCw, ZoomIn } from 'lucide-react';
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
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 }
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
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 space-y-6 shadow-2xl">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-800 pb-4">
        <div>
          <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            Processed Document Ready
          </h3>
          <p className="text-xs text-gray-400">
            Formatted to exact pixel dimensions & target KB limits.
          </p>
        </div>

        {savingsPct > 0 && (
          <span className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Saved {savingsPct}% File Size</span>
          </span>
        )}
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Original Document */}
        <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Original File
            </span>
            <span className="text-xs font-mono text-gray-400">
              {uploadedFile.originalSizeKB > 1024
                ? `${(uploadedFile.originalSizeKB / 1024).toFixed(2)} MB`
                : `${uploadedFile.originalSizeKB} KB`}
            </span>
          </div>

          <div className="relative aspect-square max-h-56 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center p-2 overflow-hidden group">
            {uploadedFile.isPdf ? (
              <div className="text-center p-4">
                <span className="text-4xl">📄</span>
                <p className="text-xs text-gray-400 mt-2 font-mono">{uploadedFile.name}</p>
              </div>
            ) : (
              <img
                src={uploadedFile.previewUrl}
                alt="Original"
                className="max-h-full max-w-full object-contain"
              />
            )}

            <button
              onClick={() => setZoomModalUrl(uploadedFile.previewUrl)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1 transition-opacity"
            >
              <ZoomIn className="w-4 h-4" />
              <span>Zoom View</span>
            </button>
          </div>

          <div className="text-xs text-gray-400 space-y-1 font-mono pt-1">
            <div>Dimensions: <span className="text-gray-200">{uploadedFile.width || 0} × {uploadedFile.height || 0} px</span></div>
            <div>Format: <span className="text-gray-200">{uploadedFile.type.replace('image/', '').toUpperCase()}</span></div>
          </div>
        </div>

        {/* Formatted Result Document */}
        <div className="bg-gray-950 border-2 border-emerald-500/50 rounded-xl p-4 space-y-3 relative shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Formatted Result
            </span>
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              {processingResult.fileSizeKB} KB
            </span>
          </div>

          <div className="relative aspect-square max-h-56 bg-gray-900 rounded-lg border border-gray-800 flex items-center justify-center p-2 overflow-hidden group">
            {processingResult.format === 'PDF' ? (
              <div className="text-center p-4">
                <span className="text-4xl">📄</span>
                <p className="text-xs text-emerald-300 mt-2 font-mono font-semibold">
                  {processingResult.fileName}
                </p>
              </div>
            ) : (
              <img
                src={processingResult.previewUrl}
                alt="Processed Result"
                className="max-h-full max-w-full object-contain"
              />
            )}

            <button
              onClick={() => setZoomModalUrl(processingResult.previewUrl)}
              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1 transition-opacity"
            >
              <ZoomIn className="w-4 h-4" />
              <span>Full Preview</span>
            </button>
          </div>

          <div className="text-xs text-gray-300 space-y-1 font-mono pt-1">
            <div>Exact Dimensions: <strong className="text-blue-300">{processingResult.width} × {processingResult.height} px</strong></div>
            <div>Output Format: <strong className="text-emerald-400">{processingResult.format}</strong></div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="pt-4 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          onClick={onOptimizeAgain}
          className="w-full sm:w-auto px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        >
          <RefreshCw className="w-4 h-4 text-blue-400" />
          <span>Optimize Again</span>
        </button>

        <button
          onClick={handleDownload}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-500/25 transform hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <Download className="w-5 h-5" />
          <span>Download Formatted Document</span>
        </button>
      </div>

      {/* Zoom Modal */}
      {zoomModalUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setZoomModalUrl(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-gray-900 rounded-2xl p-4 border border-gray-800">
            <img src={zoomModalUrl} alt="Zoom Preview" className="max-h-[80vh] max-w-full object-contain mx-auto" />
            <button
              onClick={() => setZoomModalUrl(null)}
              className="absolute top-2 right-2 text-white bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-xl text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
