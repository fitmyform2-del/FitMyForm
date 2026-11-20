'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Printer, Download, FileText, Scissors, ChevronDown, ChevronUp } from 'lucide-react';
import {
  PASSPORT_SHEET_SPECS,
  SheetPaperSize,
  renderPassportSheetCanvas,
  exportPassportSheetBlob
} from '@/lib/image/tools/passportSheet';
import { loadImage } from '@/lib/image/resizer';

interface PassportSheetPanelProps {
  imageUrl: string;
}

export const PassportSheetPanel: React.FC<PassportSheetPanelProps> = ({ imageUrl }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [paperSize, setPaperSize] = useState<SheetPaperSize>('4x6');
  const [showCutLines, setShowCutLines] = useState(true);
  const [isExporting, setIsExporting] = useState<'JPG' | 'PDF' | null>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    let active = true;
    loadImage(imageUrl)
      .then((img) => {
        if (!active || !previewCanvasRef.current) return;
        const fullSheet = renderPassportSheetCanvas(img, paperSize, showCutLines);
        const target = previewCanvasRef.current;
        const maxPreviewW = 460;
        const scale = Math.min(1, maxPreviewW / fullSheet.width);
        target.width = Math.round(fullSheet.width * scale);
        target.height = Math.round(fullSheet.height * scale);
        const ctx = target.getContext('2d');
        if (ctx) {
          ctx.drawImage(fullSheet, 0, 0, target.width, target.height);
        }
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [isOpen, imageUrl, paperSize, showCutLines]);

  const handleDownload = async (format: 'JPG' | 'PDF') => {
    setIsExporting(format);
    try {
      const img = await loadImage(imageUrl);
      const { blob, fileName } = await exportPassportSheetBlob(img, paperSize, format, showCutLines);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      // ignore
    } finally {
      setIsExporting(null);
    }
  };

  const activeSpec = PASSPORT_SHEET_SPECS[paperSize];

  return (
    <div className="fmf-panel overflow-hidden text-left">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="w-full px-5 py-4 flex items-center justify-between gap-3 hover:bg-white/[0.03] transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
            <Printer className="w-4 h-4" />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>Printable Passport Photo Sheet (4×6&quot; / A4)</span>
              <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25">
                300 DPI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Tile 8, 12, or 30 copies with cut lines for instant studio or home printing.
            </p>
          </div>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
        )}
      </button>

      {isOpen && (
        <div className="px-5 pb-5 pt-2 border-t border-white/[0.08] space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(Object.keys(PASSPORT_SHEET_SPECS) as SheetPaperSize[]).map((key) => {
              const spec = PASSPORT_SHEET_SPECS[key];
              const active = paperSize === key;
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPaperSize(key)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    active
                      ? 'bg-indigo-600/20 border-indigo-400/50 text-white'
                      : 'bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.06]'
                  }`}
                >
                  <div className="text-xs font-bold">{spec.label}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{spec.subtitle}</div>
                </button>
              );
            })}
          </div>

          {/* Live Sheet Preview */}
          <div className="rounded-2xl bg-[#070a12] border border-white/10 p-4 flex flex-col items-center justify-center">
            <canvas
              ref={previewCanvasRef}
              className="max-w-full max-h-[300px] w-auto h-auto rounded-lg shadow-2xl border border-white/15 bg-white"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between w-full gap-2 text-[11px] text-slate-400">
              <span>
                {activeSpec.cols * activeSpec.rows} copies • {activeSpec.widthPx}×{activeSpec.heightPx} px (300 DPI)
              </span>
              <button
                type="button"
                onClick={() => setShowCutLines((v) => !v)}
                className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1.5 cursor-pointer ${
                  showCutLines
                    ? 'bg-blue-500/15 border-blue-400/40 text-blue-300'
                    : 'bg-white/[0.04] border-white/10 text-slate-400'
                }`}
              >
                <Scissors className="w-3 h-3" />
                <span>Cut Lines: {showCutLines ? 'On' : 'Off'}</span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2.5">
            <button
              type="button"
              disabled={isExporting !== null}
              onClick={() => handleDownload('JPG')}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isExporting === 'JPG' ? 'Generating...' : 'Download Sheet JPG'}</span>
            </button>
            <button
              type="button"
              disabled={isExporting !== null}
              onClick={() => handleDownload('PDF')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{isExporting === 'PDF' ? 'Generating...' : 'Download Print PDF'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
