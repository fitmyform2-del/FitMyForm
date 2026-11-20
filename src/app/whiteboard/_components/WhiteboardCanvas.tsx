'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  WhiteboardPage,
  WhiteboardElement,
  ToolType,
  ToolSettings,
  TextElement
} from '../types/whiteboard';
import { renderWhiteboard } from '../utils/canvasRenderer';
import { createId } from '../utils/canvasInteraction';
import { useCanvasPointerEvents } from '../hooks/useCanvasPointerEvents';
import { CanvasFloatingToolbar } from './CanvasFloatingToolbar';

interface WhiteboardCanvasProps {
  page: WhiteboardPage;
  activeTool: ToolType;
  settings: ToolSettings;
  zoom: number;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  selectedIds: string[];
  setSelectedIds: (ids: string[]) => void;
  onCommitElements: (newElements: WhiteboardElement[]) => void;
  onUpdateLiveElements: (newElements: WhiteboardElement[] | null) => void;
  onAddElement: (element: WhiteboardElement) => void;
  onEditElement: (element: WhiteboardElement) => void;
  onBringToFront: (id: string) => void;
  onSendToBack: (id: string) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
}

export function WhiteboardCanvas({
  page,
  activeTool,
  settings,
  zoom,
  pan,
  setPan,
  selectedIds,
  setSelectedIds,
  onCommitElements,
  onUpdateLiveElements,
  onAddElement,
  onEditElement,
  onBringToFront,
  onSendToBack,
  onDuplicateElement,
  onDeleteElement
}: WhiteboardCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [editingText, setEditingText] = useState<{ id?: string; x: number; y: number; text: string } | null>(null);

  const {
    draftElement,
    laserPoints,
    setLaserPoints,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onDoubleClick
  } = useCanvasPointerEvents({
    page,
    activeTool,
    settings,
    zoom,
    pan,
    setPan,
    selectedIds,
    setSelectedIds,
    onCommitElements,
    onUpdateLiveElements,
    onAddElement,
    onStartEditText: (coords) => setEditingText({ x: coords.x, y: coords.y, text: '' }),
    onEditExistingElement: (el) => onEditElement(el)
  });

  // Animation frame loop for rendering canvas and fading laser pointer
  useEffect(() => {
    let animId: number;
    const render = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          renderWhiteboard(
            ctx,
            page,
            zoom,
            pan,
            selectedIds,
            draftElement,
            laserPoints,
            canvas.width,
            canvas.height
          );
        }
      }
      setLaserPoints((prev) => {
        const now = Date.now();
        const active = prev.filter((p) => now - p.time < 1500);
        return active.length !== prev.length ? active : prev;
      });
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [page, zoom, pan, selectedIds, draftElement, laserPoints, setLaserPoints]);

  // Adjust canvas size to parent container
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const commitInlineText = () => {
    if (editingText && editingText.text.trim()) {
      const newEl: TextElement = {
        id: editingText.id || createId('text'),
        type: 'text',
        x: editingText.x,
        y: editingText.y,
        width: Math.max(140, editingText.text.length * (settings.fontSize * 0.65)),
        height: Math.max(40, settings.fontSize * 1.6),
        text: editingText.text,
        fontSize: settings.fontSize,
        fontFamily: settings.fontFamily,
        color: settings.strokeColor,
        align: 'left'
      };
      onAddElement(newEl);
      setSelectedIds([newEl.id]);
    }
    setEditingText(null);
  };

  const selectedElement = selectedIds.length === 1 ? page.elements.find((e) => e.id === selectedIds[0]) || null : null;

  return (
    <div className="relative w-full h-full overflow-hidden bg-transparent select-none">
      <canvas
        ref={canvasRef}
        onPointerDown={(e) => canvasRef.current && onPointerDown(e, canvasRef.current)}
        onPointerMove={(e) => canvasRef.current && onPointerMove(e, canvasRef.current)}
        onPointerUp={onPointerUp}
        onDoubleClick={(e) => canvasRef.current && onDoubleClick(e, canvasRef.current)}
        className={`w-full h-full block ${
          activeTool === 'pan' ? 'cursor-grab active:cursor-grabbing' : activeTool === 'select' ? 'cursor-default' : 'cursor-crosshair'
        }`}
      />

      {/* Floating Action Bar for Selected Item */}
      {selectedElement && !editingText && (
        <CanvasFloatingToolbar
          element={selectedElement}
          zoom={zoom}
          pan={pan}
          onEdit={() => onEditElement(selectedElement)}
          onDuplicate={() => onDuplicateElement(selectedElement.id)}
          onDelete={() => onDeleteElement(selectedElement.id)}
          onBringToFront={() => onBringToFront(selectedElement.id)}
          onSendToBack={() => onSendToBack(selectedElement.id)}
        />
      )}

      {/* High-contrast Inline Text Card */}
      {editingText && (
        <div
          style={{
            position: 'absolute',
            left: `${editingText.x * zoom + pan.x}px`,
            top: `${editingText.y * zoom + pan.y}px`
          }}
          className="z-50 bg-slate-900/95 border border-blue-500 rounded-xl shadow-2xl p-2.5 flex flex-col gap-2 min-w-[240px] max-w-[360px]"
          onClick={(e) => e.stopPropagation()}
        >
          <textarea
            autoFocus
            rows={2}
            value={editingText.text}
            onChange={(e) => setEditingText({ ...editingText, text: e.target.value })}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                commitInlineText();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                setEditingText(null);
              }
            }}
            placeholder="Type note or text..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
          />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-400">Enter to save &bull; Esc to cancel</span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setEditingText(null)}
                className="px-2.5 py-1 text-xs rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={commitInlineText}
                disabled={!editingText.text.trim()}
                className="px-3 py-1 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-medium shadow cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
