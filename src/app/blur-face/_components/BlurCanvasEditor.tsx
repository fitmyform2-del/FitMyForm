'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { BlurBox } from '@/lib/image/editorTools';
import { X, Move, Sparkles } from 'lucide-react';

interface BlurCanvasEditorProps {
  imageSrc: string;
  boxes: BlurBox[];
  selectedBoxIndex: number | null;
  activeMode: BlurBox['type'];
  activeIntensity: number;
  onSelectBox: (index: number | null) => void;
  onAddBox: (box: BlurBox) => void;
  onRemoveBox: (index: number) => void;
}

export function BlurCanvasEditor({
  imageSrc,
  boxes,
  selectedBoxIndex,
  activeMode,
  activeIntensity,
  onSelectBox,
  onAddBox,
  onRemoveBox
}: BlurCanvasEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [naturalSize, setNaturalSize] = useState<{ w: number; h: number }>({ w: 1, h: 1 });
  const [displaySize, setDisplaySize] = useState<{ w: number; h: number }>({ w: 1, h: 1 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentDrag, setCurrentDrag] = useState<{ x: number; y: number } | null>(null);

  const updateDisplaySize = useCallback(() => {
    if (imgRef.current) {
      setDisplaySize({
        w: imgRef.current.clientWidth || 1,
        h: imgRef.current.clientHeight || 1
      });
    }
  }, []);

  useEffect(() => {
    window.addEventListener('resize', updateDisplaySize);
    return () => window.removeEventListener('resize', updateDisplaySize);
  }, [updateDisplaySize]);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalSize({ w: img.naturalWidth || 800, h: img.naturalHeight || 600 });
    updateDisplaySize();
  };

  const scaleToDisplay = (val: number, isY = false) => {
    const scale = isY ? displaySize.h / naturalSize.h : displaySize.w / naturalSize.w;
    return val * scale;
  };

  const scaleToNatural = (val: number, isY = false) => {
    const scale = isY ? naturalSize.h / displaySize.h : naturalSize.w / displaySize.w;
    return Math.round(val * scale);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('.box-action')) return;
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));

    setIsDrawing(true);
    setDrawStart({ x, y });
    setCurrentDrag({ x, y });
    onSelectBox(null);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDrawing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    setCurrentDrag({ x, y });
  };

  const handlePointerUp = () => {
    if (!isDrawing || !drawStart || !currentDrag) {
      setIsDrawing(false);
      return;
    }

    const minX = Math.min(drawStart.x, currentDrag.x);
    const minY = Math.min(drawStart.y, currentDrag.y);
    const width = Math.abs(currentDrag.x - drawStart.x);
    const height = Math.abs(currentDrag.y - drawStart.y);

    setIsDrawing(false);
    setDrawStart(null);
    setCurrentDrag(null);

    // Only add if dragged more than 15px
    if (width > 15 && height > 15) {
      const naturalBox: BlurBox = {
        x: scaleToNatural(minX, false),
        y: scaleToNatural(minY, true),
        width: scaleToNatural(width, false),
        height: scaleToNatural(height, true),
        type: activeMode,
        intensity: activeIntensity
      };
      onAddBox(naturalBox);
    }
  };

  const currentRect = isDrawing && drawStart && currentDrag ? {
    x: Math.min(drawStart.x, currentDrag.x),
    y: Math.min(drawStart.y, currentDrag.y),
    w: Math.abs(currentDrag.x - drawStart.x),
    h: Math.abs(currentDrag.y - drawStart.y)
  } : null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <span className="flex items-center gap-1.5 font-bold text-indigo-400">
          <Move className="w-3.5 h-3.5" />
          <span>Click & drag across faces or confidential text to blur</span>
        </span>
        <span className="font-mono text-slate-500">
          {naturalSize.w} × {naturalSize.h}px
        </span>
      </div>

      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative mx-auto inline-block select-none overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl cursor-crosshair touch-none"
      >
        <img
          ref={imgRef}
          src={imageSrc}
          alt="Editable Preview"
          onLoad={handleImageLoad}
          className="max-h-[460px] w-auto max-w-full block pointer-events-none"
          draggable={false}
        />

        {/* Existing Blur Boxes */}
        {boxes.map((box, idx) => {
          const left = scaleToDisplay(box.x, false);
          const top = scaleToDisplay(box.y, true);
          const width = scaleToDisplay(box.width, false);
          const height = scaleToDisplay(box.height, true);
          const isSelected = selectedBoxIndex === idx;

          return (
            <div
              key={idx}
              onClick={(e) => {
                e.stopPropagation();
                onSelectBox(idx);
              }}
              style={{ left: `${left}px`, top: `${top}px`, width: `${width}px`, height: `${height}px` }}
              className={`absolute transition-all cursor-pointer group ${
                isSelected
                  ? 'ring-2 ring-indigo-400 shadow-lg shadow-indigo-500/30'
                  : 'border-2 border-dashed border-indigo-400/80 hover:border-indigo-300'
              } ${
                box.type === 'censor'
                  ? 'bg-black/90'
                  : box.type === 'pixelate'
                  ? 'bg-indigo-950/40 backdrop-blur-[2px]'
                  : 'backdrop-blur-md bg-white/10'
              }`}
            >
              <div className="absolute top-1 left-1.5 flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/70 text-indigo-300">
                <span>#{idx + 1}</span>
                <span>{box.type}</span>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveBox(idx);
                }}
                className="box-action absolute -top-2.5 -right-2.5 w-6 h-6 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 cursor-pointer"
                title="Remove Box"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}

        {/* Active Dragging Rectangle */}
        {currentRect && (
          <div
            style={{
              left: `${currentRect.x}px`,
              top: `${currentRect.y}px`,
              width: `${currentRect.w}px`,
              height: `${currentRect.h}px`
            }}
            className="absolute border-2 border-indigo-400 bg-indigo-500/20 backdrop-blur-sm pointer-events-none"
          >
            <div className="absolute top-1 left-1.5 text-[10px] font-bold text-white bg-indigo-600 px-1.5 py-0.5 rounded shadow">
              New {activeMode}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
