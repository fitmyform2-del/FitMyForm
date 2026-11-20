'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Grid,
  UserCircle2,
  Maximize,
  Crosshair,
  RefreshCw
} from 'lucide-react';
import { CropBox, DragAction, computeFreeformResize, computeAspectResize } from './cropMath';

interface CropStageProps {
  imageUrl: string;
  cropBox: CropBox;
  aspectRatio: number | null;
  naturalWidth: number;
  naturalHeight: number;
  onCropBoxChange: (box: CropBox) => void;
  onImageLoaded: (dim: { width: number; height: number }) => void;
  onRotate: (delta: 90 | -90) => void;
  onFlip: (axis: 'h' | 'v') => void;
  onCenterCrop: () => void;
  onSelectFull: () => void;
  onChangeImage: () => void;
}

export function CropStage({
  imageUrl,
  cropBox,
  aspectRatio,
  naturalWidth,
  naturalHeight,
  onCropBoxChange,
  onImageLoaded,
  onRotate,
  onFlip,
  onCenterCrop,
  onSelectFull,
  onChangeImage
}: CropStageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(0);
  const [showGrid, setShowGrid] = useState(true);
  const [showFaceGuide, setShowFaceGuide] = useState(false);
  const [dragState, setDragState] = useState<{
    action: DragAction;
    startX: number;
    startY: number;
    startBox: CropBox;
  } | null>(null);

  const measureScale = useCallback(() => {
    const img = imgRef.current;
    if (!img) return;
    const natW = img.naturalWidth || naturalWidth;
    if (natW > 0 && img.clientWidth > 0) {
      setScale(img.clientWidth / natW);
    }
  }, [naturalWidth]);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;
    measureScale();
    const ro = new ResizeObserver(() => measureScale());
    ro.observe(img);
    window.addEventListener('resize', measureScale);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measureScale);
    };
  }, [measureScale, imageUrl]);

  // Pointer drag / resize handling
  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const dx = (e.clientX - dragState.startX) / (scale || 1);
      const dy = (e.clientY - dragState.startY) / (scale || 1);
      const { startBox, action } = dragState;

      if (action === 'move') {
        const maxX = Math.max(0, naturalWidth - startBox.width);
        const maxY = Math.max(0, naturalHeight - startBox.height);
        const newX = Math.round(Math.max(0, Math.min(maxX, startBox.x + dx)));
        const newY = Math.round(Math.max(0, Math.min(maxY, startBox.y + dy)));
        onCropBoxChange({ ...startBox, x: newX, y: newY });
        return;
      }

      if (!aspectRatio) {
        onCropBoxChange(computeFreeformResize(action, dx, dy, startBox, naturalWidth, naturalHeight));
      } else {
        onCropBoxChange(computeAspectResize(action, dx, dy, startBox, naturalWidth, naturalHeight, aspectRatio));
      }
    };

    const handlePointerUp = () => setDragState(null);

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [dragState, scale, naturalWidth, naturalHeight, aspectRatio, onCropBoxChange]);

  const startDrag = (e: React.PointerEvent, action: DragAction) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState({
      action,
      startX: e.clientX,
      startY: e.clientY,
      startBox: { ...cropBox }
    });
  };

  return (
    <div className="fmf-panel overflow-hidden flex flex-col">
      {/* Studio Top Bar */}
      <div className="px-4 py-3 bg-[#0c111e] border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-300 font-bold text-[11px]">
            Interactive Crop Canvas
          </span>
          {naturalWidth > 0 && (
            <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
              Source: {naturalWidth} × {naturalHeight} px
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onChangeImage}
          className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Replace Image</span>
        </button>
      </div>

      {/* Main Crop Viewport */}
      <div className="relative overflow-hidden bg-[#060910] p-5 sm:p-8 flex items-center justify-center min-h-[400px] select-none touch-none">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)', backgroundSize: '18px 18px' }}
        />

        <div className="relative inline-block max-h-[500px] overflow-hidden rounded-lg shadow-[0_24px_60px_rgba(0,0,0,0.85)]">
          <img
            ref={imgRef}
            src={imageUrl}
            alt="Crop workspace"
            onLoad={(e) => {
              const img = e.currentTarget;
              onImageLoaded({ width: img.naturalWidth, height: img.naturalHeight });
              if (img.naturalWidth > 0 && img.clientWidth > 0) {
                setScale(img.clientWidth / img.naturalWidth);
              }
            }}
            className="max-h-[500px] w-auto max-w-full object-contain block pointer-events-none"
            draggable={false}
          />

          {naturalWidth > 0 && scale > 0 && (
            <div
              style={{
                left: `${cropBox.x * scale}px`,
                top: `${cropBox.y * scale}px`,
                width: `${cropBox.width * scale}px`,
                height: `${cropBox.height * scale}px`
              }}
              onPointerDown={(e) => startDrag(e, 'move')}
              className="absolute border border-white/80 cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.68)]"
            >
              {/* Rule of thirds grid */}
              {showGrid && (
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  <div className="border-r border-b border-white/25" />
                  <div className="border-r border-b border-white/25" />
                  <div className="border-b border-white/25" />
                  <div className="border-r border-b border-white/25" />
                  <div className="border-r border-b border-white/25" />
                  <div className="border-b border-white/25" />
                  <div className="border-r border-white/25" />
                  <div className="border-r border-white/25" />
                  <div />
                </div>
              )}

              {/* Passport Face Oval Guide */}
              {showFaceGuide && (
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <div className="w-[58%] h-[68%] -mt-[4%] rounded-[50%] border-2 border-dashed border-emerald-400/80" />
                </div>
              )}

              {/* Safe Inside Top-Left Size Pill */}
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-sm border border-white/20 text-white text-[10px] font-mono font-bold pointer-events-none whitespace-nowrap">
                {cropBox.width} × {cropBox.height} px
              </div>

              {/* Sleek L-Shaped Corner Brackets (with generous hit areas) */}
              <div
                onPointerDown={(e) => startDrag(e, 'nw')}
                style={{ cursor: 'nwse-resize' }}
                className="absolute -top-2 -left-2 w-7 h-7 z-30 flex items-start justify-start p-1.5"
              >
                <span className="w-4 h-4 border-t-[3px] border-l-[3px] border-white drop-shadow" />
              </div>
              <div
                onPointerDown={(e) => startDrag(e, 'ne')}
                style={{ cursor: 'nesw-resize' }}
                className="absolute -top-2 -right-2 w-7 h-7 z-30 flex items-start justify-end p-1.5"
              >
                <span className="w-4 h-4 border-t-[3px] border-r-[3px] border-white drop-shadow" />
              </div>
              <div
                onPointerDown={(e) => startDrag(e, 'sw')}
                style={{ cursor: 'nesw-resize' }}
                className="absolute -bottom-2 -left-2 w-7 h-7 z-30 flex items-end justify-start p-1.5"
              >
                <span className="w-4 h-4 border-b-[3px] border-l-[3px] border-white drop-shadow" />
              </div>
              <div
                onPointerDown={(e) => startDrag(e, 'se')}
                style={{ cursor: 'nwse-resize' }}
                className="absolute -bottom-2 -right-2 w-7 h-7 z-30 flex items-end justify-end p-1.5"
              >
                <span className="w-4 h-4 border-b-[3px] border-r-[3px] border-white drop-shadow" />
              </div>

              {/* Sleek Edge Pill Handles */}
              <div
                onPointerDown={(e) => startDrag(e, 'n')}
                style={{ cursor: 'ns-resize' }}
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-4 z-20 flex items-center justify-center"
              >
                <span className="w-6 h-1 rounded-full bg-white shadow" />
              </div>
              <div
                onPointerDown={(e) => startDrag(e, 's')}
                style={{ cursor: 'ns-resize' }}
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-4 z-20 flex items-center justify-center"
              >
                <span className="w-6 h-1 rounded-full bg-white shadow" />
              </div>
              <div
                onPointerDown={(e) => startDrag(e, 'w')}
                style={{ cursor: 'ew-resize' }}
                className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-10 z-20 flex items-center justify-center"
              >
                <span className="w-1 h-6 rounded-full bg-white shadow" />
              </div>
              <div
                onPointerDown={(e) => startDrag(e, 'e')}
                style={{ cursor: 'ew-resize' }}
                className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-10 z-20 flex items-center justify-center"
              >
                <span className="w-1 h-6 rounded-full bg-white shadow" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Studio Bottom Action Bar */}
      <div className="px-4 py-3 bg-[#0c111e] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onRotate(-90)}
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] text-slate-300 hover:text-white cursor-pointer"
            title="Rotate Left 90°"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onRotate(90)}
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] text-slate-300 hover:text-white cursor-pointer"
            title="Rotate Right 90°"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFlip('h')}
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] text-slate-300 hover:text-white cursor-pointer"
            title="Flip Horizontal"
          >
            <FlipHorizontal className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onFlip('v')}
            className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] text-slate-300 hover:text-white cursor-pointer"
            title="Flip Vertical"
          >
            <FlipVertical className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowGrid((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
              showGrid ? 'bg-blue-600/25 border-blue-500/40 text-blue-300' : 'bg-white/[0.04] border-white/[0.08] text-slate-400'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            type="button"
            onClick={() => setShowFaceGuide((v) => !v)}
            className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold flex items-center gap-1 cursor-pointer ${
              showFaceGuide ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/[0.04] border-white/[0.08] text-slate-400'
            }`}
          >
            <UserCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Face Guide</span>
          </button>
          <button
            type="button"
            onClick={onCenterCrop}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5 text-blue-400" />
            <span>Center</span>
          </button>
          <button
            type="button"
            onClick={onSelectFull}
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/[0.08] text-slate-300 hover:text-white text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Maximize className="w-3.5 h-3.5 text-amber-400" />
            <span>Full</span>
          </button>
        </div>
      </div>
    </div>
  );
}
