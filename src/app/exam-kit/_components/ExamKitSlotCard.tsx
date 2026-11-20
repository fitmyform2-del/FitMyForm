'use client';

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Upload,
  Crop,
  Sparkles,
  Scissors,
  Download,
  CheckCircle2,
  Trash2,
  FileText,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { SingleDocSpec } from '@/types/presets';
import { UploadedFile, DocumentRequirements, CropRect, ProcessingResult } from '@/types/document';
import { renderToCanvas } from '@/lib/image/resizer';
import { computeAutoTrimSignatureCrop } from '@/lib/image/tools/autoTrimSignature';

export interface KitSlotState {
  uploadedFile: UploadedFile | null;
  requirements: DocumentRequirements;
  cropRect?: CropRect;
  result: ProcessingResult | null;
  isProcessing: boolean;
  error: string | null;
}

interface ExamKitSlotCardProps {
  examId: string;
  docKey: string;
  spec: SingleDocSpec;
  state: KitSlotState;
  onUpload: (file: File) => void;
  onUpdateState: (patch: Partial<KitSlotState>) => void;
  onOpenCropper: () => void;
  onFormatSingle: () => void;
}

export const ExamKitSlotCard: React.FC<ExamKitSlotCardProps> = ({
  examId,
  docKey,
  spec,
  state,
  onUpload,
  onUpdateState,
  onOpenCropper,
  onFormatSingle
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgLoaded, setImgLoaded] = useState(false);

  const isPdfOnly = spec.format.length === 1 && spec.format[0] === 'PDF';
  const isSignature = spec.documentType === 'signature';
  const whiteBgOn = Boolean(state.requirements.whiteBg?.enabled);

  useEffect(() => {
    if (!state.uploadedFile?.previewUrl) {
      imgRef.current = null;
      setImgLoaded(false);
      return;
    }
    let active = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (active) {
        imgRef.current = img;
        setImgLoaded(true);
      }
    };
    img.src = state.uploadedFile.previewUrl;
    return () => {
      active = false;
    };
  }, [state.uploadedFile?.previewUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !imgLoaded) return;

    const targetW = Math.max(10, state.requirements.width || img.width);
    const targetH = Math.max(10, state.requirements.height || img.height);
    const maxW = 240;
    const maxH = 160;
    const aspect = targetW / targetH;
    const dw = aspect >= maxW / maxH ? maxW : Math.max(80, Math.round(maxH * aspect));
    const dh = aspect >= maxW / maxH ? Math.max(60, Math.round(maxW / aspect)) : maxH;

    const rendered = renderToCanvas(
      img,
      { ...state.requirements, width: dw, height: dh },
      state.cropRect
    );
    canvas.width = dw;
    canvas.height = dh;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, dw, dh);
      ctx.drawImage(rendered, 0, 0, dw, dh);
    }
  }, [imgLoaded, state.requirements, state.cropRect]);

  const handleAutoTrim = () => {
    const img = imgRef.current;
    if (!img) return;
    const targetW = Math.max(10, state.requirements.width || img.width);
    const targetH = Math.max(10, state.requirements.height || img.height);
    const trimmed = computeAutoTrimSignatureCrop(img, targetW, targetH);
    if (!trimmed) return;
    onUpdateState({
      cropRect: trimmed,
      result: null,
      requirements: {
        ...state.requirements,
        cropMode: 'manual',
        bgColor: '#FFFFFF',
        signatureFilter: {
          enabled: true,
          whitenBackground: true,
          inkBoost: true,
          threshold: 175
        }
      }
    });
  };

  if (isPdfOnly) {
    return (
      <div className="fmf-card p-5 flex flex-col justify-between gap-4 border-dashed border-white/15">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-white text-sm">{spec.title}</h3>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/25">
              PDF ONLY
            </span>
          </div>
          <p className="text-xs font-mono text-emerald-400">
            {spec.minSizeKB}–{spec.maxSizeKB} KB PDF
          </p>
          {spec.notes && <p className="text-[11px] text-slate-400 leading-relaxed">{spec.notes}</p>}
        </div>
        <Link
          href={`/pdf-tools/compress?targetKB=${spec.maxSizeKB}&preset=${encodeURIComponent(examId)}&doc=${encodeURIComponent(docKey)}`}
          className="w-full py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-200 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Open in PDF Compressor →</span>
        </Link>
      </div>
    );
  }

  return (
    <div
      className={`fmf-card p-5 flex flex-col justify-between gap-4 transition-all ${
        state.result?.isValid
          ? 'border-emerald-500/40 bg-emerald-950/10'
          : state.uploadedFile
            ? 'border-blue-500/35'
            : ''
      }`}
    >
      {/* Header */}
      <div className="space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-extrabold text-white text-sm leading-snug">{spec.title}</h3>
          {state.result ? (
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3" />
              {state.result.fileSizeKB} KB
            </span>
          ) : (
            <span className="shrink-0 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white/[0.07] text-blue-300">
              {spec.format[0] || 'JPG'}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] font-mono">
          {spec.width && spec.height && (
            <span className="text-blue-300 font-bold">
              {spec.width} × {spec.height} px
            </span>
          )}
          <span className="text-emerald-400 font-bold">
            {spec.minSizeKB}–{spec.maxSizeKB} KB
          </span>
        </div>

        {spec.notes && <p className="text-[11px] text-slate-400 line-clamp-2">{spec.notes}</p>}
      </div>

      {/* Upload or Live Preview */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onUpload(f);
          e.target.value = '';
        }}
      />

      {!state.uploadedFile ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const f = e.dataTransfer.files?.[0];
            if (f) onUpload(f);
          }}
          className="h-40 rounded-2xl border-2 border-dashed border-white/15 hover:border-blue-500/60 bg-black/30 hover:bg-blue-950/20 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-white transition-all cursor-pointer p-4"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/15 border border-blue-500/25 flex items-center justify-center text-blue-400">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-xs font-bold">Upload {spec.title.split('(')[0].trim()}</span>
          <span className="text-[10px] text-slate-500">Drop JPG / PNG / WEBP or click</span>
        </button>
      ) : (
        <div className="space-y-3">
          <div className="h-44 rounded-2xl bg-[#070a12] border border-white/10 flex items-center justify-center p-3 overflow-hidden relative">
            <canvas
              ref={canvasRef}
              className="max-h-full max-w-full rounded-md shadow-lg ring-1 ring-white/15"
            />
            <button
              type="button"
              onClick={() =>
                onUpdateState({
                  uploadedFile: null,
                  cropRect: undefined,
                  result: null,
                  error: null
                })
              }
              className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 hover:bg-rose-500/30 text-slate-300 hover:text-rose-200 border border-white/10 cursor-pointer"
              title="Remove file"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Slot Studio Controls */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenCropper}
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-slate-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Crop className="w-3 h-3 text-blue-400" />
              <span>Crop</span>
            </button>

            {isSignature ? (
              <button
                type="button"
                onClick={handleAutoTrim}
                className="px-2.5 py-1.5 rounded-lg bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 text-blue-200 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
              >
                <Scissors className="w-3 h-3" />
                <span>Auto-Trim & Clean</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  onUpdateState({
                    result: null,
                    requirements: {
                      ...state.requirements,
                      whiteBg: {
                        enabled: !whiteBgOn,
                        tolerance: 42,
                        fillColor: '#FFFFFF'
                      }
                    }
                  })
                }
                className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
                  whiteBgOn
                    ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                    : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-slate-300'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>{whiteBgOn ? 'White BG On' : 'White BG'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="ml-auto px-2 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.1] text-slate-400 hover:text-white text-[11px] cursor-pointer"
              title="Replace image"
            >
              Replace
            </button>
          </div>
        </div>
      )}

      {state.error && (
        <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-300 text-[11px] flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{state.error}</span>
        </div>
      )}

      {/* Footer Action */}
      {state.uploadedFile && (
        <div className="flex items-center gap-2 pt-1 border-t border-white/[0.06]">
          {state.result ? (
            <a
              href={state.result.previewUrl}
              download={state.result.fileName}
              className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download ({state.result.fileSizeKB} KB)</span>
            </a>
          ) : (
            <button
              type="button"
              disabled={state.isProcessing}
              onClick={onFormatSingle}
              className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {state.isProcessing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Formatting...</span>
                </>
              ) : (
                <span>Format This Document</span>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
