'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { CropBox, DragAction, computeFreeformResize, computeAspectResize } from './cropMath';

interface CropStageProps {
  imageUrl: string;
  cropBox: CropBox;
  aspectRatio: number | null;
  naturalWidth: number;
  naturalHeight: number;
  onCropBoxChange: (box: CropBox) => void;
  onImageLoaded: (dim: { width: number; height: number }) => void;
}

const HANDLES: { id: DragAction; cursor: string; posClass: string }[] = [
  { id: 'nw', cursor: 'nwse-resize', posClass: '-top-2.5 -left-2.5' },
  { id: 'n', cursor: 'ns-resize', posClass: '-top-2.5 left-1/2 -translate-x-1/2' },
  { id: 'ne', cursor: 'nesw-resize', posClass: '-top-2.5 -right-2.5' },
  { id: 'e', cursor: 'ew-resize', posClass: 'top-1/2 -right-2.5 -translate-y-1/2' },
  { id: 'se', cursor: 'nwse-resize', posClass: '-bottom-2.5 -right-2.5' },
  { id: 's', cursor: 'ns-resize', posClass: '-bottom-2.5 left-1/2 -translate-x-1/2' },
  { id: 'sw', cursor: 'nesw-resize', posClass: '-bottom-2.5 -left-2.5' },
  { id: 'w', cursor: 'ew-resize', posClass: 'top-1/2 -left-2.5 -translate-y-1/2' },
];

export function CropStage({
  imageUrl,
  cropBox,
  aspectRatio,
  naturalWidth,
  naturalHeight,
  onCropBoxChange,
  onImageLoaded,
}: CropStageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [scale, setScale] = useState(1);
  const [dragState, setDragState] = useState<{
    action: DragAction;
    startX: number;
    startY: number;
    startBox: CropBox;
  } | null>(null);

  const updateScale = useCallback(() => {
    if (imgRef.current && naturalWidth > 0) {
      const renderedWidth = imgRef.current.clientWidth;
      setScale(renderedWidth / naturalWidth);
    }
  }, [naturalWidth]);

  useEffect(() => {
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [updateScale]);

  useEffect(() => {
    if (!dragState) return;

    const handlePointerMove = (e: PointerEvent) => {
      const dx = (e.clientX - dragState.startX) / (scale || 1);
      const dy = (e.clientY - dragState.startY) / (scale || 1);
      const { startBox, action } = dragState;

      if (action === 'move') {
        const maxX = naturalWidth - startBox.width;
        const maxY = naturalHeight - startBox.height;
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
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState, scale, naturalWidth, naturalHeight, aspectRatio, onCropBoxChange]);

  const startDrag = (e: React.PointerEvent, action: DragAction) => {
    e.preventDefault();
    e.stopPropagation();
    setDragState({
      action,
      startX: e.clientX,
      startY: e.clientY,
      startBox: { ...cropBox },
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden rounded-2xl bg-black/85 border border-white/10 p-4 flex items-center justify-center min-h-[380px] select-none touch-none shadow-2xl"
    >
      <div className="relative inline-block max-h-[500px]">
        <img
          ref={imgRef}
          src={imageUrl}
          alt="Crop workspace"
          onLoad={(e) => {
            const img = e.currentTarget;
            onImageLoaded({ width: img.naturalWidth, height: img.naturalHeight });
            updateScale();
          }}
          className="max-h-[500px] w-auto max-w-full object-contain block pointer-events-none rounded-lg"
          draggable={false}
        />

        {naturalWidth > 0 && scale > 0 && (
          <div
            style={{
              left: `${cropBox.x * scale}px`,
              top: `${cropBox.y * scale}px`,
              width: `${cropBox.width * scale}px`,
              height: `${cropBox.height * scale}px`,
            }}
            onPointerDown={(e) => startDrag(e, 'move')}
            className="absolute border-2 border-blue-400 cursor-move shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]"
          >
            {/* Rule of thirds grid */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              <div className="border-r border-b border-white/25" />
              <div className="border-r border-b border-white/25" />
              <div className="border-b border-white/25" />
              <div className="border-r border-b border-white/25" />
              <div className="border-r border-b border-white/25" />
              <div className="border-b border-white/25" />
              <div className="border-r border-b border-white/25" />
              <div className="border-r border-b border-white/25" />
              <div />
            </div>

            {/* Live Size Pill */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-mono font-bold shadow-lg pointer-events-none whitespace-nowrap">
              {cropBox.width} × {cropBox.height} px
            </div>

            {/* Interactive Handles */}
            {HANDLES.map((h) => (
              <div
                key={h.id}
                style={{ cursor: h.cursor }}
                onPointerDown={(e) => startDrag(e, h.id)}
                className={`absolute w-4 h-4 bg-white border-2 border-blue-600 rounded-sm shadow-md z-30 hover:scale-125 transition-transform ${h.posClass}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
