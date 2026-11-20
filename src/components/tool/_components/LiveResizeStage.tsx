'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  RotateCcw,
  Grid,
  UserCircle2,
  Maximize2,
  Move,
  RefreshCw,
  Sparkles,
  Scissors,
  CheckCircle2,
  Gauge
} from 'lucide-react';
import { UploadedFile, DocumentRequirements, CropRect } from '@/types/document';
import { renderToCanvas } from '@/lib/image/resizer';
import { computeAutoTrimSignatureCrop } from '@/lib/image/tools/autoTrimSignature';

interface LiveResizeStageProps {
  uploadedFile: UploadedFile;
  requirements: DocumentRequirements;
  cropRect?: CropRect;
  onCropChange: (rect: CropRect | undefined) => void;
  onRequirementsChange?: (reqs: DocumentRequirements) => void;
  onModeSwitchToManual: () => void;
  onOpenFullCropper: () => void;
  onChangePhoto: () => void;
}

export const LiveResizeStage: React.FC<LiveResizeStageProps> = ({
  uploadedFile,
  requirements,
  cropRect,
  onCropChange,
  onRequirementsChange,
  onModeSwitchToManual,
  onOpenFullCropper,
  onChangePhoto
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const [imgLoaded, setImgLoaded] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [showFaceGuide, setShowFaceGuide] = useState(requirements.documentType === 'photo');
  const [isDragging, setIsDragging] = useState(false);
  const [estimatedKB, setEstimatedKB] = useState<number | null>(null);
  const [trimFeedback, setTrimFeedback] = useState<string | null>(null);

  // Multi-pointer tracking for 1-finger pan & 2-finger pinch-to-zoom on mobile
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const dragStartRef = useRef<{ clientX: number; clientY: number; startX: number; startY: number } | null>(null);
  const pinchStartRef = useRef<{
    dist: number;
    startZoom: number;
    midX: number;
    midY: number;
    startX: number;
    startY: number;
  } | null>(null);

  const targetW = Math.max(10, requirements.width || uploadedFile.width || 200);
  const targetH = Math.max(10, requirements.height || uploadedFile.height || 230);

  const maxW = 420;
  const maxH = 340;
  const aspect = targetW / targetH;
  const displayW = aspect >= maxW / maxH ? maxW : Math.max(130, Math.round(maxH * aspect));
  const displayH = aspect >= maxW / maxH ? Math.max(110, Math.round(maxW / aspect)) : maxH;

  const activeZoom = cropRect?.zoom ?? 1;
  const activeRotation = cropRect?.rotation ?? 0;
  const whiteBgEnabled = Boolean(requirements.whiteBg?.enabled);
  const isSignature = requirements.documentType === 'signature';

  useEffect(() => {
    let active = true;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (active) {
        imgRef.current = img;
        setImgLoaded(true);
      }
    };
    img.src = uploadedFile.previewUrl;
    return () => {
      active = false;
    };
  }, [uploadedFile.previewUrl]);

  const drawLiveCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const previewReqs: DocumentRequirements = {
      ...requirements,
      width: displayW,
      height: displayH
    };
    const rendered = renderToCanvas(img, previewReqs, cropRect);

    canvas.width = displayW;
    canvas.height = displayH;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, displayW, displayH);
    ctx.drawImage(rendered, 0, 0, displayW, displayH);
  }, [requirements, cropRect, displayW, displayH]);

  useEffect(() => {
    if (imgLoaded) {
      drawLiveCanvas();
    }
  }, [imgLoaded, drawLiveCanvas]);

  // Debounced live file size estimate at true target dimensions
  useEffect(() => {
    if (!imgLoaded || !imgRef.current) return;
    let cancelled = false;
    const timer = window.setTimeout(() => {
      const img = imgRef.current;
      if (!img || cancelled) return;
      try {
        const exportCanvas = renderToCanvas(img, requirements, cropRect);
        const mime =
          requirements.format === 'PNG'
            ? 'image/png'
            : requirements.format === 'WEBP'
              ? 'image/webp'
              : 'image/jpeg';
        exportCanvas.toBlob(
          (blob) => {
            if (!cancelled && blob) {
              setEstimatedKB(Number((blob.size / 1024).toFixed(1)));
            }
          },
          mime,
          0.86
        );
      } catch {
        if (!cancelled) setEstimatedKB(null);
      }
    }, 240);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [imgLoaded, requirements, cropRect]);

  const ensureCropRect = (): CropRect =>
    cropRect || { x: 0, y: 0, width: 1, height: 1, zoom: 1, rotation: 0 };

  const getPinchMetrics = (map: Map<number, { x: number; y: number }>) => {
    const pts = Array.from(map.values());
    const dx = pts[1].x - pts[0].x;
    const dy = pts[1].y - pts[0].y;
    return {
      dist: Math.max(1, Math.hypot(dx, dy)),
      midX: (pts[0].x + pts[1].x) / 2,
      midY: (pts[0].y + pts[1].y) / 2
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    const current = ensureCropRect();
    if (requirements.cropMode !== 'manual') {
      onModeSwitchToManual();
    }

    if (pointersRef.current.size === 2) {
      const { dist, midX, midY } = getPinchMetrics(pointersRef.current);
      pinchStartRef.current = {
        dist,
        startZoom: current.zoom || 1,
        midX,
        midY,
        startX: current.x,
        startY: current.y
      };
      dragStartRef.current = null;
      setIsDragging(true);
    } else if (pointersRef.current.size === 1) {
      setIsDragging(true);
      dragStartRef.current = {
        clientX: e.clientX,
        clientY: e.clientY,
        startX: current.x,
        startY: current.y
      };
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pointersRef.current.has(e.pointerId)) return;
    pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointersRef.current.size === 2 && pinchStartRef.current) {
      const { dist, midX, midY } = getPinchMetrics(pointersRef.current);
      const scaleRatio = dist / pinchStartRef.current.dist;
      const nextZoom = Math.max(0.4, Math.min(3.5, Number((pinchStartRef.current.startZoom * scaleRatio).toFixed(2))));
      const dx = (midX - pinchStartRef.current.midX) / displayW;
      const dy = (midY - pinchStartRef.current.midY) / displayH;
      const current = ensureCropRect();
      onCropChange({
        ...current,
        zoom: nextZoom,
        x: pinchStartRef.current.startX + dx,
        y: pinchStartRef.current.startY + dy
      });
      return;
    }

    if (pointersRef.current.size === 1 && isDragging && dragStartRef.current) {
      const dx = (e.clientX - dragStartRef.current.clientX) / displayW;
      const dy = (e.clientY - dragStartRef.current.clientY) / displayH;
      const current = ensureCropRect();
      onCropChange({
        ...current,
        x: dragStartRef.current.startX + dx,
        y: dragStartRef.current.startY + dy
      });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pointersRef.current.delete(e.pointerId);
    if (pointersRef.current.size < 2) {
      pinchStartRef.current = null;
    }
    if (pointersRef.current.size === 0) {
      setIsDragging(false);
      dragStartRef.current = null;
    } else if (pointersRef.current.size === 1) {
      const remaining = Array.from(pointersRef.current.values())[0];
      const current = ensureCropRect();
      dragStartRef.current = {
        clientX: remaining.x,
        clientY: remaining.y,
        startX: current.x,
        startY: current.y
      };
    }
  };

  const updateZoom = (newZoom: number) => {
    const clamped = Math.max(0.4, Math.min(3.5, Number(newZoom.toFixed(2))));
    const current = ensureCropRect();
    if (requirements.cropMode !== 'manual') onModeSwitchToManual();
    onCropChange({ ...current, zoom: clamped });
  };

  const rotateBy = (delta: number) => {
    const current = ensureCropRect();
    if (requirements.cropMode !== 'manual') onModeSwitchToManual();
    onCropChange({ ...current, rotation: (current.rotation + delta + 360) % 360 });
  };

  const handleToggleWhiteBg = () => {
    if (!onRequirementsChange) return;
    onRequirementsChange({
      ...requirements,
      whiteBg: {
        enabled: !whiteBgEnabled,
        tolerance: requirements.whiteBg?.tolerance ?? 42,
        fillColor: requirements.whiteBg?.fillColor || '#FFFFFF'
      }
    });
  };

  const handleAutoTrimSignature = () => {
    const img = imgRef.current;
    if (!img) return;
    const trimmed = computeAutoTrimSignatureCrop(img, targetW, targetH);
    if (!trimmed) {
      setTrimFeedback('No clear ink bounds found');
      window.setTimeout(() => setTrimFeedback(null), 2200);
      return;
    }
    if (onRequirementsChange) {
      onRequirementsChange({
        ...requirements,
        cropMode: 'manual',
        bgColor: '#FFFFFF',
        signatureFilter: {
          enabled: true,
          whitenBackground: true,
          inkBoost: true,
          threshold: requirements.signatureFilter?.threshold ?? 175
        }
      });
    } else {
      onModeSwitchToManual();
    }
    onCropChange(trimmed);
    setTrimFeedback('Signature auto-trimmed & ink boosted');
    window.setTimeout(() => setTrimFeedback(null), 2400);
  };

  const resetFraming = () => {
    onCropChange(undefined);
  };

  const withinKbTarget =
    estimatedKB !== null &&
    estimatedKB >= requirements.minSizeKB &&
    estimatedKB <= requirements.maxSizeKB;

  return (
    <div className="fmf-panel overflow-hidden flex flex-col">
      {/* Studio Top Bar */}
      <div className="px-4 py-3 bg-[#0c111e] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 font-bold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Preview
          </span>

          {estimatedKB !== null && (
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border font-mono text-[11px] font-bold ${
                withinKbTarget
                  ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-300'
                  : 'bg-blue-500/10 border-blue-500/25 text-blue-300'
              }`}
              title={`Target range: ${requirements.minSizeKB}–${requirements.maxSizeKB} KB (auto-calibrated on export)`}
            >
              {withinKbTarget ? <CheckCircle2 className="w-3 h-3" /> : <Gauge className="w-3 h-3" />}
              <span>~{estimatedKB} KB</span>
              <span className="text-[10px] font-sans font-normal text-slate-300 hidden sm:inline">
                {withinKbTarget ? '• Target met' : `→ auto-fits ${requirements.minSizeKB}–${requirements.maxSizeKB} KB`}
              </span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onRequirementsChange && !isSignature && (
            <button
              type="button"
              onClick={handleToggleWhiteBg}
              className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                whiteBgEnabled
                  ? 'bg-emerald-500/20 border-emerald-400/50 text-emerald-200'
                  : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-slate-200'
              }`}
              title="Convert photo backdrop to pure white for Passport / UPSC / NEET portals"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{whiteBgEnabled ? 'White BG On' : 'White BG'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleAutoTrimSignature}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isSignature
                ? 'bg-blue-600/25 hover:bg-blue-600/35 border-blue-400/40 text-blue-200'
                : 'bg-white/[0.04] hover:bg-white/[0.1] border-white/10 text-slate-300 hidden sm:flex'
            }`}
            title="Auto-detect ink bounds, trim excess paper margins, and whiten background"
          >
            <Scissors className="w-3.5 h-3.5 text-blue-400" />
            <span>Auto-Trim Sign</span>
          </button>

          <button
            type="button"
            onClick={onOpenFullCropper}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-slate-200 hover:text-white text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer"
            title="Open Full-Screen Cropper"
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">Expand</span>
          </button>

          <button
            type="button"
            onClick={onChangePhoto}
            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" />
            <span className="hidden sm:inline">Replace</span>
          </button>
        </div>
      </div>

      {/* Interactive WYSIWYG Viewport */}
      <div className="relative p-6 sm:p-8 bg-[#070a12] flex flex-col items-center justify-center min-h-[340px] select-none">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '18px 18px' }}
        />

        {trimFeedback && (
          <div className="relative z-20 mb-3 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold animate-fade-in">
            {trimFeedback}
          </div>
        )}

        {/* Draggable & Pinch-Zoomable Frame */}
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={(e) => {
            e.preventDefault();
            updateZoom(activeZoom - e.deltaY * 0.0012);
          }}
          style={{ width: `${displayW}px`, height: `${displayH}px` }}
          className={`relative rounded-lg overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)] ring-2 transition-shadow touch-none ${
            isDragging ? 'ring-blue-400 cursor-grabbing' : 'ring-blue-500/70 hover:ring-blue-400 cursor-grab'
          }`}
        >
          <canvas ref={canvasRef} className="block w-full h-full" />

          {/* Corner Crop Brackets */}
          <div className="pointer-events-none absolute inset-0">
            <span className="absolute top-0 left-0 w-4 h-4 border-t-[3px] border-l-[3px] border-white drop-shadow" />
            <span className="absolute top-0 right-0 w-4 h-4 border-t-[3px] border-r-[3px] border-white drop-shadow" />
            <span className="absolute bottom-0 left-0 w-4 h-4 border-b-[3px] border-l-[3px] border-white drop-shadow" />
            <span className="absolute bottom-0 right-0 w-4 h-4 border-b-[3px] border-r-[3px] border-white drop-shadow" />
          </div>

          {showGrid && (
            <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-r border-b border-white/20" />
              <div className="border-b border-white/20" />
              <div className="border-r border-white/20" />
              <div className="border-r border-white/20" />
              <div />
            </div>
          )}

          {showFaceGuide && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="w-[58%] h-[68%] -mt-[4%] rounded-[50%] border-2 border-dashed border-emerald-400/75 shadow-[0_0_0_1px_rgba(0,0,0,0.4)]" />
            </div>
          )}

          <div className="pointer-events-none absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm border border-white/15 text-[10px] font-mono font-bold text-white">
            {targetW} × {targetH} px
          </div>
        </div>

        <div className="relative z-10 mt-4 flex items-center gap-2 text-[11px] text-slate-400 text-center">
          <Move className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>Drag to pan • Pinch or scroll to zoom</span>
        </div>
      </div>

      {/* Studio Bottom Control Bar */}
      <div className="px-4 py-3 bg-[#0c111e] border-t border-white/[0.08] space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[170px]">
            <button
              type="button"
              onClick={() => updateZoom(activeZoom - 0.1)}
              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <input
              type="range"
              min="0.4"
              max="3.5"
              step="0.05"
              value={activeZoom}
              onChange={(e) => updateZoom(Number(e.target.value))}
              className="flex-1 h-1.5 bg-slate-800 rounded-lg accent-blue-500 cursor-pointer"
            />
            <button
              type="button"
              onClick={() => updateZoom(activeZoom + 0.1)}
              className="p-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono font-bold text-blue-300 w-10 text-right">
              {Math.round(activeZoom * 100)}%
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => rotateBy(-90)}
              className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/[0.08] cursor-pointer"
              title="Rotate Left 90°"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => rotateBy(90)}
              className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 hover:text-white border border-white/[0.08] cursor-pointer"
              title="Rotate Right 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowGrid((v) => !v)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                showGrid
                  ? 'bg-blue-600/25 border-blue-500/40 text-blue-300'
                  : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
              title="Toggle Rule-of-Thirds Grid"
            >
              <Grid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setShowFaceGuide((v) => !v)}
              className={`p-2 rounded-lg border transition-colors cursor-pointer ${
                showFaceGuide
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-white/[0.04] border-white/[0.08] text-slate-400 hover:text-white'
              }`}
              title="Toggle Passport Face Oval Guide"
            >
              <UserCircle2 className="w-3.5 h-3.5" />
            </button>
            {cropRect && (
              <button
                type="button"
                onClick={resetFraming}
                className="px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-[11px] font-bold cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Original vs Target Metadata Strip */}
        <div className="pt-2 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
          <span>
            Source: <strong className="text-slate-200">{uploadedFile.width}×{uploadedFile.height}</strong> ({uploadedFile.originalSizeKB} KB)
          </span>
          <span>
            Output: <strong className="text-emerald-400">{targetW}×{targetH}</strong> • {requirements.minSizeKB}–{requirements.maxSizeKB} KB {requirements.format}
            {activeRotation !== 0 ? ` • ${activeRotation}°` : ''}
          </span>
        </div>
      </div>
    </div>
  );
};
