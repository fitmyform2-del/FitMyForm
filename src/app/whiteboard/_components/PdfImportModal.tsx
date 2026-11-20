'use client';

import React, { useState } from 'react';
import { FileText, X, Upload, Check, AlertCircle } from 'lucide-react';

interface PdfImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertPage: (dataUrl: string, asBackground: boolean) => void;
}

export function PdfImportModal({
  isOpen,
  onClose,
  onInsertPage
}: PdfImportModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [asBackground, setAsBackground] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    setErrorMsg(null);
    setIsLoading(true);

    try {
      if (selected.type.includes('image')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
          setIsLoading(false);
        };
        reader.readAsDataURL(selected);
      } else if (selected.type.includes('pdf')) {
        // Dynamic import pdfjs-dist
        const arrayBuffer = await selected.arrayBuffer();
        const pdfjs = await import('pdfjs-dist/build/pdf.mjs');
        const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const page = await pdf.getPage(1);

        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas 2d context');

        // Render PDF page into canvas
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (page as any).render({ canvasContext: ctx, viewport }).promise;
        const dataUrl = canvas.toDataURL('image/png', 0.95);
        setPreviewUrl(dataUrl);
        setIsLoading(false);
      }
    } catch (err: unknown) {
      console.warn('PDF render error:', err);
      setErrorMsg('Could not render PDF. You can also upload JPG or PNG worksheets directly.');
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (previewUrl) {
      onInsertPage(previewUrl, asBackground);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-[#111726] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-rose-400" />
            <h3 className="font-bold text-base text-white">Import PDF / Worksheet</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!previewUrl ? (
          <label className="border-2 border-dashed border-white/15 hover:border-rose-500/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-2.5 cursor-pointer bg-white/5 hover:bg-white/10 transition-all">
            <input
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Upload className="w-6 h-6" />
            </div>
            <div className="text-center">
              <span className="font-bold text-xs text-white block">Choose PDF Worksheet or Exam Paper</span>
              <span className="text-[11px] text-slate-400">PDF, JPG, PNG up to 25 MB</span>
            </div>
          </label>
        ) : (
          <div className="space-y-3">
            <div className="relative aspect-[4/3] bg-slate-900 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
              <img src={previewUrl} alt="Worksheet preview" className="w-full h-full object-contain" />
            </div>

            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/10 text-xs">
              <span className="text-slate-300 font-medium">Placement:</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAsBackground(true)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    asBackground ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Canvas Background
                </button>
                <button
                  type="button"
                  onClick={() => setAsBackground(false)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                    !asBackground ? 'bg-rose-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Movable Item
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-2 text-xs text-slate-300 animate-pulse">
            Rendering PDF page in browser...
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {previewUrl && (
          <div className="flex gap-2">
            <button
              onClick={() => setPreviewUrl(null)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs cursor-pointer"
            >
              Change File
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30"
            >
              <Check className="w-4 h-4" />
              <span>Insert on Whiteboard</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
