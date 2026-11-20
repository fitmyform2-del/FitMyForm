'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, RotateCcw, Check, Move, Grid, UserCircle2 } from 'lucide-react';
import { CropRect, UploadedFile, DocumentRequirements } from '@/types/document';

interface InteractiveCropperProps {
  isOpen: boolean;
  uploadedFile: UploadedFile;
  requirements: DocumentRequirements;
  initialCrop?: CropRect;
  onClose: () => void;
  onApplyCrop: (rect: CropRect) => void;
}

export const InteractiveCropper: React.FC<InteractiveCropperProps> = ({
  isOpen,
  uploadedFile,
  requirements,
  initialCrop,
  onClose,
  onApplyCrop
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  const targetW = Math.max(10, requirements.width || uploadedFile.width || 200);
  const targetH = Math.max(10, requirements.height || uploadedFile.height || 230);

  const maxBoxW = 460;
  const maxBoxH = 400;
  const aspect = targetW / targetH;
  const displayW = aspect >= maxBoxW / maxBoxH ? maxBoxW : Math.max(140, Math.round(maxBoxH * aspect));
  const displayH = aspect >= maxBoxW / maxBoxH ? Math.max(110, Math.round(maxBoxW / aspect)) : maxBoxH;

  const [zoom, setZoom] = useState(initialCrop?.zoom ?? 1);
  const [rotation, setRotation] = useState(initialCrop?.rotation ?? 0);
  const [offset, setOffset] = useState({
    x: (initialCrop?.x ?? 0) * displayW,
    y: (initialCrop?.y ?? 0) * displayH
  });
  const [showGrid, setShowGrid] = useState(true);
  const [showFaceGuide, setShowFaceGuide] = useState(requirements.documentType === 'photo');
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imgLoaded, setImgLoaded] = useState(false);

  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const pinchStartRef = useRef<{
    dist: number;
    startZoom: number;
    midX: number;
    midY: number;
    startOffsetX: number;
    startOffsetY: number;
  } | null>(null);

  const getPinchMetrics = (map: Map<number, { x: number; y: number }>) => {
    const pts = Array.from(map.values());
    return {
      dist: Math.max(1, Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y)),
      midX: (pts[0].x + pts[1].x) / 2,
      midY: (pts[0].y + pts[1].y) / 2
    };
  };

  useEffect(() => {
    if (!isOpen || !uploadedFile.previewUrl) return;
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
  }, [isOpen, uploadedFile.previewUrl]);

  // Arrow-key precision nudging + Escape to close
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const step = e.shiftKey ? 10 : 2;
      if (e.key === 'ArrowLeft') { e.preventDefault(); setOffset((o) => ({ ...o, x: o.x - step })); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); setOffset((o) => ({ ...o, x: o.x + step })); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setOffset((o) => ({ ...o, y: o.y - step })); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setOffset((o) => ({ ...o, y: o.y + step })); }
      else if (e.key === 'Escape') { onClose(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = displayW;
    canvas.height = displayH;

    ctx.clearRect(0, 0, displayW, displayH);
    ctx.fillStyle = requirements.bgColor || '#FFFFFF';
    ctx.fillRect(0, 0, displayW, displayH);

    const baseScale = Math.max(displayW / img.width, displayH / img.height);
    const totalScale = baseScale * zoom;

    ctx.save();
    ctx.translate(displayW / 2 + offset.x, displayH / 2 + offset.y);
    if (rotation) {
      ctx.rotate((rotation * Math.PI) / 180);
    }
    ctx.scale(totalScale, totalScale);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  }, [displayW, displayH, zoom, rotation, offset, requirements.bgColor]);

  useEffect(() => {
    if (isOpen && imgLoaded) {
      drawPreview();
    }
  }, [isOpen, imgLoaded, drawPreview]);

  const handleSave = () => {
    onApplyCrop({
      x: offset.x / displayW,
      y: offset.y / displayH,
      width: 1,
      height: 1,
      zoom,
      rotation
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1525] border border-white/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Studio Header */}
        <div className="px-5 py-4 bg-[#090d18] border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Move className="w-4 h-4 text-blue-400" />
              Precision Studio Cropper
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Drag to frame, scroll to zoom, or use Arrow keys for pixel-perfect nudging.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Canvas Viewport */}
        <div className="relative p-6 sm:p-8 bg-[#060910] flex flex-col items-center justify-center select-none">
          <div
            className="relative rounded-lg shadow-[0_24px_60px_rgba(0,0,0,0.85)] ring-2 ring-blue-500 overflow-hidden cursor-grab active:cursor-grabbing touch-none"
            style={{ width: `${displayW}px`, height: `${displayH}px` }}
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
              if (pointersRef.current.size === 2) {
                const { dist, midX, midY } = getPinchMetrics(pointersRef.current);
                pinchStartRef.current = {
                  dist,
                  startZoom: zoom,
                  midX,
                  midY,
                  startOffsetX: offset.x,
                  startOffsetY: offset.y
                };
                setIsDragging(true);
              } else if (pointersRef.current.size === 1) {
                setIsDragging(true);
                setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
              }
            }}
            onPointerMove={(e) => {
              if (!pointersRef.current.has(e.pointerId)) return;
              pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
              if (pointersRef.current.size === 2 && pinchStartRef.current) {
                const { dist, midX, midY } = getPinchMetrics(pointersRef.current);
                const ratio = dist / pinchStartRef.current.dist;
                setZoom(Math.max(0.4, Math.min(3.5, Number((pinchStartRef.current.startZoom * ratio).toFixed(2)))));
                setOffset({
                  x: pinchStartRef.current.startOffsetX + (midX - pinchStartRef.current.midX),
                  y: pinchStartRef.current.startOffsetY + (midY - pinchStartRef.current.midY)
                });
                return;
              }
              if (pointersRef.current.size === 1 && isDragging) {
                setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
              }
            }}
            onPointerUp={(e) => {
              pointersRef.current.delete(e.pointerId);
              if (pointersRef.current.size < 2) pinchStartRef.current = null;
              if (pointersRef.current.size === 0) {
                setIsDragging(false);
              } else if (pointersRef.current.size === 1) {
                const rem = Array.from(pointersRef.current.values())[0];
                setDragStart({ x: rem.x - offset.x, y: rem.y - offset.y });
              }
            }}
            onPointerCancel={(e) => {
              pointersRef.current.delete(e.pointerId);
              if (pointersRef.current.size < 2) pinchStartRef.current = null;
              if (pointersRef.current.size === 0) setIsDragging(false);
            }}
            onWheel={(e) => {
              e.preventDefault();
              setZoom((z) => Math.max(0.4, Math.min(3.5, Number((z - e.deltaY * 0.0012).toFixed(2)))));
            }}
          >
            <canvas ref={canvasRef} className="block w-full h-full" />

            {/* Crisp L-Corner Brackets */}
            <div className="pointer-events-none absolute inset-0">
              <span className="absolute top-0 left-0 w-5 h-5 border-t-[3px] border-l-[3px] border-white drop-shadow" />
              <span className="absolute top-0 right-0 w-5 h-5 border-t-[3px] border-r-[3px] border-white drop-shadow" />
              <span className="absolute bottom-0 left-0 w-5 h-5 border-b-[3px] border-l-[3px] border-white drop-shadow" />
              <span className="absolute bottom-0 right-0 w-5 h-5 border-b-[3px] border-r-[3px] border-white drop-shadow" />
            </div>

            {showGrid && (
              <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
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

            {showFaceGuide && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="w-[58%] h-[68%] -mt-[4%] rounded-[50%] border-2 border-dashed border-emerald-400/80" />
              </div>
            )}

            <div className="pointer-events-none absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-md bg-black/75 border border-white/15 text-[11px] font-mono font-bold text-white">
              {targetW} × {targetH} px
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 text-xs font-mono text-slate-400">
            <span>Zoom: <strong className="text-blue-300">{Math.round(zoom * 100)}%</strong></span>
            <span>•</span>
            <span>Rotation: <strong className="text-emerald-400">{rotation}°</strong></span>
          </div>
        </div>

        {/* Studio Controls Footer */}
        <div className="p-5 bg-[#0f1525] border-t border-white/10 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[200px]">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
                className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 cursor-pointer"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <input
                type="range"
                min="0.4"
                max="3.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 h-1.5 bg-slate-800 rounded-lg accent-blue-500 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3.5, Number((z + 0.1).toFixed(2))))}
                className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] text-slate-300 cursor-pointer"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 270) % 360)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-200 border border-white/10 cursor-pointer"
                title="Rotate Left 90°"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.12] text-slate-200 border border-white/10 cursor-pointer"
                title="Rotate Right 90°"
              >
                <RotateCw className="w-4 h-4 text-emerald-400" />
              </button>
              <button
                type="button"
                onClick={() => setShowGrid((v) => !v)}
                className={`p-2 rounded-xl border cursor-pointer ${
                  showGrid ? 'bg-blue-600/25 border-blue-500/40 text-blue-300' : 'bg-white/[0.05] border-white/10 text-slate-400'
                }`}
                title="Grid Overlay"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setShowFaceGuide((v) => !v)}
                className={`p-2 rounded-xl border cursor-pointer ${
                  showFaceGuide ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300' : 'bg-white/[0.05] border-white/10 text-slate-400'
                }`}
                title="Passport Face Oval Guide"
              >
                <UserCircle2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setRotation(0);
                setOffset({ x: 0, y: 0 });
              }}
              className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Reset Framing
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-xs font-semibold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-600/25 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Apply Crop</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
