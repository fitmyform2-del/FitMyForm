'use client';

import React, { useRef, useState } from 'react';
import { AnnotationItem } from '@/lib/pdf/pdfTools';
import { EditorToolMode } from './PdfEditorToolbar';
import { EditorPageEntry } from './PdfPageThumbnails';

interface ToolStyleDefaults {
  color: string;
  fillColor: string;
  bgColor: string;
  fontSize: number;
  fontFamily: 'Helvetica' | 'TimesRoman' | 'Courier';
  bold: boolean;
  italic: boolean;
  strokeWidth: number;
  opacity: number;
  stampText: string;
}

interface PdfEditorCanvasProps {
  pageEntry: EditorPageEntry;
  pageIndex: number;
  zoom: number;
  activeTool: EditorToolMode;
  styleDefaults: ToolStyleDefaults;
  annotations: AnnotationItem[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
  onAddAnnotation: (ann: AnnotationItem) => void;
  onUpdateAnnotation: (id: string, patch: Partial<AnnotationItem>, recordHistory?: boolean) => void;
}

function makeId() {
  return `ann-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function cssFontFamily(family?: string) {
  if (family === 'TimesRoman') return 'Georgia, "Times New Roman", serif';
  if (family === 'Courier') return '"Courier New", Courier, monospace';
  return 'Arial, Helvetica, sans-serif';
}

export const PdfEditorCanvas: React.FC<PdfEditorCanvasProps> = ({
  pageEntry,
  pageIndex,
  zoom,
  activeTool,
  styleDefaults,
  annotations,
  selectedId,
  onSelectId,
  onAddAnnotation,
  onUpdateAnnotation
}) => {
  const stageRef = useRef<HTMLDivElement>(null);

  const [draft, setDraft] = useState<AnnotationItem | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  const dragOpRef = useRef<
    | {
        mode: 'move' | 'resize' | 'draw-box' | 'draw-line' | 'draw-pen';
        id?: string;
        startClientX: number;
        startClientY: number;
        orig?: AnnotationItem;
        startXRatio: number;
        startYRatio: number;
      }
    | null
  >(null);

  const pageAnns = annotations.filter((a) => a.pageIndex === pageIndex);

  const getRatios = (clientX: number, clientY: number) => {
    const rect = stageRef.current!.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(1, (clientX - rect.left) / rect.width)),
      y: Math.max(0, Math.min(1, (clientY - rect.top) / rect.height)),
      rect
    };
  };

  const handleStagePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const { x, y } = getRatios(e.clientX, e.clientY);

    if (activeTool === 'select') {
      onSelectId(null);
      setEditingTextId(null);
      return;
    }

    e.currentTarget.setPointerCapture(e.pointerId);

    // Click-to-place instant tools
    if (activeTool === 'text' || activeTool === 'date' || activeTool === 'check' || activeTool === 'cross' || activeTool === 'stamp') {
      const id = makeId();
      if (activeTool === 'text') {
        onAddAnnotation({
          id,
          type: 'text',
          pageIndex,
          xRatio: Math.min(0.88, x),
          yRatio: Math.min(0.92, y),
          text: 'Double-click to edit',
          color: styleDefaults.color,
          bgColor: styleDefaults.bgColor,
          fontSize: styleDefaults.fontSize,
          fontFamily: styleDefaults.fontFamily,
          bold: styleDefaults.bold,
          italic: styleDefaults.italic,
          opacity: styleDefaults.opacity
        });
        setEditingTextId(id);
      } else if (activeTool === 'date') {
        const today = new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
        onAddAnnotation({
          id,
          type: 'text',
          pageIndex,
          xRatio: Math.min(0.85, x),
          yRatio: Math.min(0.92, y),
          text: today,
          color: styleDefaults.color,
          bgColor: styleDefaults.bgColor,
          fontSize: styleDefaults.fontSize,
          fontFamily: styleDefaults.fontFamily,
          bold: true,
          opacity: 1
        });
      } else if (activeTool === 'check' || activeTool === 'cross') {
        onAddAnnotation({
          id,
          type: activeTool,
          pageIndex,
          xRatio: Math.max(0, x - 0.02),
          yRatio: Math.max(0, y - 0.015),
          wRatio: 0.04,
          hRatio: 0.03,
          color: activeTool === 'check' ? '#16a34a' : '#dc2626',
          opacity: 1
        });
      } else if (activeTool === 'stamp') {
        onAddAnnotation({
          id,
          type: 'stamp',
          pageIndex,
          xRatio: Math.max(0, Math.min(0.75, x - 0.12)),
          yRatio: Math.max(0, Math.min(0.92, y - 0.03)),
          wRatio: 0.24,
          hRatio: 0.065,
          text: styleDefaults.stampText || 'APPROVED',
          color: styleDefaults.color === '#1d4ed8' ? '#dc2626' : styleDefaults.color,
          opacity: 0.9
        });
      }
      onSelectId(id);
      return;
    }

    // Drag-to-create tools
    if (activeTool === 'draw') {
      const item: AnnotationItem = {
        id: makeId(),
        type: 'draw',
        pageIndex,
        xRatio: x,
        yRatio: y,
        color: styleDefaults.color,
        strokeWidth: styleDefaults.strokeWidth,
        opacity: styleDefaults.opacity,
        points: [{ x, y }]
      };
      setDraft(item);
      dragOpRef.current = {
        mode: 'draw-pen',
        startClientX: e.clientX,
        startClientY: e.clientY,
        startXRatio: x,
        startYRatio: y
      };
      return;
    }

    if (activeTool === 'line' || activeTool === 'arrow') {
      const item: AnnotationItem = {
        id: makeId(),
        type: activeTool,
        pageIndex,
        xRatio: x,
        yRatio: y,
        x2Ratio: x,
        y2Ratio: y,
        color: styleDefaults.color,
        strokeWidth: styleDefaults.strokeWidth,
        opacity: styleDefaults.opacity
      };
      setDraft(item);
      dragOpRef.current = {
        mode: 'draw-line',
        startClientX: e.clientX,
        startClientY: e.clientY,
        startXRatio: x,
        startYRatio: y
      };
      return;
    }

    if (activeTool === 'highlight' || activeTool === 'whiteout' || activeTool === 'rect' || activeTool === 'circle') {
      const item: AnnotationItem = {
        id: makeId(),
        type: activeTool,
        pageIndex,
        xRatio: x,
        yRatio: y,
        wRatio: 0.01,
        hRatio: 0.01,
        color: activeTool === 'highlight' ? '#fde047' : styleDefaults.color,
        fillColor: activeTool === 'whiteout' ? '#ffffff' : styleDefaults.fillColor,
        strokeWidth: styleDefaults.strokeWidth,
        opacity: activeTool === 'highlight' ? 0.38 : styleDefaults.opacity
      };
      setDraft(item);
      dragOpRef.current = {
        mode: 'draw-box',
        startClientX: e.clientX,
        startClientY: e.clientY,
        startXRatio: x,
        startYRatio: y
      };
    }
  };

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const op = dragOpRef.current;
    if (!op || !stageRef.current) return;
    const { x, y, rect } = getRatios(e.clientX, e.clientY);

    if (op.mode === 'draw-pen') {
      setDraft((prev) =>
        prev ? { ...prev, points: [...(prev.points || []), { x, y }] } : null
      );
      return;
    }

    if (op.mode === 'draw-line') {
      setDraft((prev) => (prev ? { ...prev, x2Ratio: x, y2Ratio: y } : null));
      return;
    }

    if (op.mode === 'draw-box') {
      const minX = Math.min(op.startXRatio, x);
      const minY = Math.min(op.startYRatio, y);
      const w = Math.max(0.01, Math.abs(x - op.startXRatio));
      const h = Math.max(0.01, Math.abs(y - op.startYRatio));
      setDraft((prev) => (prev ? { ...prev, xRatio: minX, yRatio: minY, wRatio: w, hRatio: h } : null));
      return;
    }

    if (op.mode === 'move' && op.id && op.orig) {
      const dx = (e.clientX - op.startClientX) / rect.width;
      const dy = (e.clientY - op.startClientY) / rect.height;
      if (op.orig.type === 'draw' && op.orig.points) {
        onUpdateAnnotation(
          op.id,
          {
            xRatio: op.orig.xRatio + dx,
            yRatio: op.orig.yRatio + dy,
            points: op.orig.points.map((pt) => ({
              x: Math.max(0, Math.min(1, pt.x + dx)),
              y: Math.max(0, Math.min(1, pt.y + dy))
            }))
          },
          false
        );
      } else if (op.orig.type === 'line' || op.orig.type === 'arrow') {
        onUpdateAnnotation(
          op.id,
          {
            xRatio: Math.max(0, Math.min(0.98, op.orig.xRatio + dx)),
            yRatio: Math.max(0, Math.min(0.98, op.orig.yRatio + dy)),
            x2Ratio: Math.max(0, Math.min(0.98, (op.orig.x2Ratio ?? op.orig.xRatio + 0.15) + dx)),
            y2Ratio: Math.max(0, Math.min(0.98, (op.orig.y2Ratio ?? op.orig.yRatio) + dy))
          },
          false
        );
      } else {
        onUpdateAnnotation(
          op.id,
          {
            xRatio: Math.max(0, Math.min(0.96, op.orig.xRatio + dx)),
            yRatio: Math.max(0, Math.min(0.96, op.orig.yRatio + dy))
          },
          false
        );
      }
      return;
    }

    if (op.mode === 'resize' && op.id && op.orig) {
      const dx = (e.clientX - op.startClientX) / rect.width;
      const dy = (e.clientY - op.startClientY) / rect.height;
      const nextW = Math.max(0.025, Math.min(1 - op.orig.xRatio, (op.orig.wRatio ?? 0.2) + dx));
      const nextH = Math.max(0.02, Math.min(1 - op.orig.yRatio, (op.orig.hRatio ?? 0.08) + dy));
      onUpdateAnnotation(op.id, { wRatio: nextW, hRatio: nextH }, false);
    }
  };

  const handleStagePointerUp = () => {
    const op = dragOpRef.current;
    if (!op) return;

    if ((op.mode === 'draw-box' || op.mode === 'draw-line' || op.mode === 'draw-pen') && draft) {
      let finalDraft = draft;
      if (op.mode === 'draw-box' && (draft.wRatio ?? 0) < 0.025 && (draft.hRatio ?? 0) < 0.02) {
        // User single-clicked instead of dragging -> place sensible default size
        finalDraft = {
          ...draft,
          wRatio: draft.type === 'highlight' ? 0.24 : 0.18,
          hRatio: draft.type === 'highlight' ? 0.032 : draft.type === 'whiteout' ? 0.045 : 0.11
        };
      }
      if (op.mode === 'draw-line') {
        const dist = Math.hypot((draft.x2Ratio ?? 0) - draft.xRatio, (draft.y2Ratio ?? 0) - draft.yRatio);
        if (dist < 0.02) {
          finalDraft = { ...draft, x2Ratio: Math.min(0.95, draft.xRatio + 0.18), y2Ratio: draft.yRatio };
        }
      }
      onAddAnnotation(finalDraft);
      if (finalDraft.id) onSelectId(finalDraft.id);
      setDraft(null);
    }

    dragOpRef.current = null;
  };

  const isSelectMode = activeTool === 'select';

  const startMove = (e: React.PointerEvent, ann: AnnotationItem) => {
    if (!ann.id || !isSelectMode) return;
    e.stopPropagation();
    stageRef.current?.setPointerCapture(e.pointerId);
    onSelectId(ann.id);
    dragOpRef.current = {
      mode: 'move',
      id: ann.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      orig: ann,
      startXRatio: ann.xRatio,
      startYRatio: ann.yRatio
    };
  };

  const startResize = (e: React.PointerEvent, ann: AnnotationItem) => {
    if (!ann.id || !isSelectMode) return;
    e.stopPropagation();
    stageRef.current?.setPointerCapture(e.pointerId);
    onSelectId(ann.id);
    dragOpRef.current = {
      mode: 'resize',
      id: ann.id,
      startClientX: e.clientX,
      startClientY: e.clientY,
      orig: ann,
      startXRatio: ann.xRatio,
      startYRatio: ann.yRatio
    };
  };

  const renderList = draft ? [...pageAnns, draft] : pageAnns;
  const baseWidthPx = Math.round(640 * zoom);
  const aspectRatio = pageEntry.preview
    ? pageEntry.preview.width / Math.max(1, pageEntry.preview.height)
    : (pageEntry.plan.width || 595.28) / (pageEntry.plan.height || 841.89);

  return (
    <div className="bg-[#070b14] border border-white/10 rounded-2xl p-4 sm:p-6 overflow-auto max-h-[78vh] flex justify-center items-start">
      <div
        ref={stageRef}
        onPointerDown={handleStagePointerDown}
        onPointerMove={handleStagePointerMove}
        onPointerUp={handleStagePointerUp}
        onPointerCancel={handleStagePointerUp}
        style={{
          width: `${baseWidthPx}px`,
          aspectRatio: `${aspectRatio}`,
          cursor: activeTool === 'select' ? 'default' : 'crosshair'
        }}
        className="relative bg-white shadow-[0_24px_60px_rgba(0,0,0,0.75)] rounded-md select-none touch-none shrink-0 overflow-hidden"
      >
        {/* Base PDF Page Image */}
        {pageEntry.preview ? (
          <img
            src={pageEntry.preview.dataUrl}
            alt={`Page ${pageIndex + 1}`}
            draggable={false}
            style={{ transform: `rotate(${pageEntry.plan.rotation}deg)` }}
            className="w-full h-full object-fill pointer-events-none block"
          />
        ) : (
          <div className="w-full h-full bg-white pointer-events-none" />
        )}

        {/* Vector SVG Layer for Freehand Drawings, Lines & Arrows */}
        <svg
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full pointer-events-none"
        >
          {renderList.map((ann) => {
            const isSel = ann.id === selectedId;
            if (ann.type === 'draw' && ann.points && ann.points.length > 1) {
              const d = ann.points
                .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${(p.x * 1000).toFixed(1)} ${(p.y * 1000).toFixed(1)}`)
                .join(' ');
              return (
                <path
                  key={ann.id}
                  d={d}
                  fill="none"
                  stroke={ann.color || '#1d4ed8'}
                  strokeWidth={(ann.strokeWidth ?? 3) * 1.4}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  opacity={ann.opacity ?? 1}
                  className={isSel ? 'drop-shadow-[0_0_4px_rgba(59,130,246,0.9)]' : ''}
                />
              );
            }
            if (ann.type === 'line' || ann.type === 'arrow') {
              const x1 = ann.xRatio * 1000;
              const y1 = ann.yRatio * 1000;
              const x2 = (ann.x2Ratio ?? ann.xRatio + 0.15) * 1000;
              const y2 = (ann.y2Ratio ?? ann.yRatio) * 1000;
              const angle = Math.atan2(y2 - y1, x2 - x1);
              const headLen = Math.max(16, (ann.strokeWidth ?? 2) * 6);
              const a1 = angle - Math.PI / 6;
              const a2 = angle + Math.PI / 6;

              return (
                <g key={ann.id} opacity={ann.opacity ?? 1}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke={ann.color || '#dc2626'}
                    strokeWidth={(ann.strokeWidth ?? 2.5) * 1.4}
                    strokeLinecap="round"
                  />
                  {ann.type === 'arrow' && (
                    <>
                      <line
                        x1={x2}
                        y1={y2}
                        x2={x2 - headLen * Math.cos(a1)}
                        y2={y2 - headLen * Math.sin(a1)}
                        stroke={ann.color || '#dc2626'}
                        strokeWidth={(ann.strokeWidth ?? 2.5) * 1.4}
                        strokeLinecap="round"
                      />
                      <line
                        x1={x2}
                        y1={y2}
                        x2={x2 - headLen * Math.cos(a2)}
                        y2={y2 - headLen * Math.sin(a2)}
                        stroke={ann.color || '#dc2626'}
                        strokeWidth={(ann.strokeWidth ?? 2.5) * 1.4}
                        strokeLinecap="round"
                      />
                    </>
                  )}
                </g>
              );
            }
            return null;
          })}
        </svg>

        {/* Interactive Overlay Layer */}
        {renderList.map((ann) => {
          const isSel = ann.id === selectedId;
          const isBoxType =
            ann.type === 'highlight' ||
            ann.type === 'whiteout' ||
            ann.type === 'rect' ||
            ann.type === 'circle' ||
            ann.type === 'stamp' ||
            ann.type === 'image' ||
            ann.type === 'check' ||
            ann.type === 'cross';

          // Clickable handle for line/arrow/draw selection & move
          if (ann.type === 'draw' || ann.type === 'line' || ann.type === 'arrow') {
            let minX = ann.xRatio;
            let minY = ann.yRatio;
            let maxX = ann.x2Ratio ?? ann.xRatio;
            let maxY = ann.y2Ratio ?? ann.yRatio;
            if (ann.type === 'draw' && ann.points?.length) {
              minX = Math.min(...ann.points.map((p) => p.x));
              maxX = Math.max(...ann.points.map((p) => p.x));
              minY = Math.min(...ann.points.map((p) => p.y));
              maxY = Math.max(...ann.points.map((p) => p.y));
            } else {
              const tx1 = Math.min(minX, maxX);
              const tx2 = Math.max(minX, maxX);
              const ty1 = Math.min(minY, maxY);
              const ty2 = Math.max(minY, maxY);
              minX = tx1;
              maxX = tx2;
              minY = ty1;
              maxY = ty2;
            }
            return (
              <div
                key={`hit-${ann.id}`}
                onPointerDown={isSelectMode ? (e) => startMove(e, ann) : undefined}
                style={{
                  left: `${Math.max(0, minX - 0.01) * 100}%`,
                  top: `${Math.max(0, minY - 0.01) * 100}%`,
                  width: `${Math.max(0.03, maxX - minX + 0.02) * 100}%`,
                  height: `${Math.max(0.03, maxY - minY + 0.02) * 100}%`
                }}
                className={`absolute ${
                  isSelectMode ? 'cursor-move pointer-events-auto' : 'pointer-events-none'
                } ${isSel ? 'ring-2 ring-blue-500 ring-dashed rounded' : ''}`}
              />
            );
          }

          if (ann.type === 'text') {
            const isInlineEditing = editingTextId === ann.id;
            const textInteractive = isSelectMode || isInlineEditing;
            return (
              <div
                key={ann.id}
                onPointerDown={
                  textInteractive
                    ? (e) => {
                        if (!isInlineEditing) startMove(e, ann);
                        else e.stopPropagation();
                      }
                    : undefined
                }
                onDoubleClick={
                  isSelectMode
                    ? (e) => {
                        e.stopPropagation();
                        if (ann.id) {
                          onSelectId(ann.id);
                          setEditingTextId(ann.id);
                        }
                      }
                    : undefined
                }
                style={{
                  left: `${ann.xRatio * 100}%`,
                  top: `${ann.yRatio * 100}%`,
                  color: ann.color || '#1d4ed8',
                  backgroundColor: ann.bgColor && ann.bgColor !== 'transparent' ? ann.bgColor : 'transparent',
                  fontSize: `${(ann.fontSize || 16) * zoom}px`,
                  fontFamily: cssFontFamily(ann.fontFamily),
                  fontWeight: ann.bold ? 700 : 400,
                  fontStyle: ann.italic ? 'italic' : 'normal',
                  opacity: ann.opacity ?? 1,
                  lineHeight: 1.25
                }}
                className={`absolute px-1 py-0.5 rounded whitespace-pre-wrap ${
                  textInteractive
                    ? isInlineEditing
                      ? 'pointer-events-auto cursor-text'
                      : 'pointer-events-auto cursor-move'
                    : 'pointer-events-none'
                } ${
                  isSel
                    ? 'ring-2 ring-blue-500 bg-blue-500/5'
                    : isSelectMode
                      ? 'hover:ring-1 hover:ring-blue-400/60'
                      : ''
                }`}
              >
                {isInlineEditing && ann.id ? (
                  <textarea
                    autoFocus
                    rows={Math.max(1, (ann.text || '').split('\n').length)}
                    value={ann.text || ''}
                    onChange={(e) => onUpdateAnnotation(ann.id!, { text: e.target.value }, false)}
                    onBlur={() => setEditingTextId(null)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setEditingTextId(null);
                    }}
                    className="bg-transparent outline-none resize-both min-w-[120px]"
                    style={{ color: 'inherit', font: 'inherit' }}
                  />
                ) : (
                  ann.text || 'Text'
                )}
              </div>
            );
          }

          if (!isBoxType) return null;

          return (
            <div
              key={ann.id}
              onPointerDown={isSelectMode ? (e) => startMove(e, ann) : undefined}
              style={{
                left: `${ann.xRatio * 100}%`,
                top: `${ann.yRatio * 100}%`,
                width: `${(ann.wRatio ?? 0.18) * 100}%`,
                height: `${(ann.hRatio ?? 0.08) * 100}%`,
                opacity: ann.opacity ?? 1
              }}
              className={`absolute ${
                isSelectMode ? 'pointer-events-auto cursor-move' : 'pointer-events-none'
              } ${
                isSel
                  ? 'ring-2 ring-blue-500 ring-offset-1'
                  : isSelectMode
                    ? 'hover:ring-1 hover:ring-blue-400/60'
                    : ''
              }`}
            >
              {ann.type === 'highlight' && (
                <div className="w-full h-full rounded-[2px]" style={{ backgroundColor: ann.color || '#fde047' }} />
              )}

              {ann.type === 'whiteout' && (
                <div
                  className="w-full h-full border border-dashed border-slate-300/80"
                  style={{ backgroundColor: ann.fillColor || '#ffffff' }}
                />
              )}

              {ann.type === 'rect' && (
                <div
                  className="w-full h-full"
                  style={{
                    border: `${ann.strokeWidth ?? 2}px solid ${ann.color || '#1d4ed8'}`,
                    backgroundColor:
                      ann.fillColor && ann.fillColor !== 'transparent' ? `${ann.fillColor}55` : 'transparent'
                  }}
                />
              )}

              {ann.type === 'circle' && (
                <div
                  className="w-full h-full rounded-full"
                  style={{
                    border: `${ann.strokeWidth ?? 2}px solid ${ann.color || '#1d4ed8'}`,
                    backgroundColor:
                      ann.fillColor && ann.fillColor !== 'transparent' ? `${ann.fillColor}55` : 'transparent'
                  }}
                />
              )}

              {ann.type === 'check' && (
                <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
                  <path
                    d="M4 12.5 L9.5 18 L20 6"
                    stroke={ann.color || '#16a34a'}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}

              {ann.type === 'cross' && (
                <svg viewBox="0 0 24 24" className="w-full h-full" fill="none">
                  <path
                    d="M5 5 L19 19 M19 5 L5 19"
                    stroke={ann.color || '#dc2626'}
                    strokeWidth="3.2"
                    strokeLinecap="round"
                  />
                </svg>
              )}

              {ann.type === 'stamp' && (
                <div
                  className="w-full h-full flex items-center justify-center font-black tracking-wider uppercase rounded bg-white/90"
                  style={{
                    border: `2.5px solid ${ann.color || '#dc2626'}`,
                    color: ann.color || '#dc2626',
                    fontSize: `${Math.max(10, 14 * zoom)}px`
                  }}
                >
                  {ann.text || 'APPROVED'}
                </div>
              )}

              {ann.type === 'image' && ann.imageDataUrl && (
                <img
                  src={ann.imageDataUrl}
                  alt="Inserted"
                  draggable={false}
                  className="w-full h-full object-fill pointer-events-none"
                />
              )}

              {/* Bottom-Right Resize Handle */}
              {isSel && isSelectMode && (
                <div
                  onPointerDown={(e) => startResize(e, ann)}
                  className="absolute -right-2 -bottom-2 w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow cursor-nwse-resize"
                  title="Drag to resize"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
