'use client';

import React from 'react';
import { Edit2, Copy, Trash2, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import { WhiteboardElement } from '../types/whiteboard';

interface CanvasFloatingToolbarProps {
  element: WhiteboardElement | null;
  zoom: number;
  pan: { x: number; y: number };
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onBringToFront: () => void;
  onSendToBack: () => void;
}

export function CanvasFloatingToolbar({
  element,
  zoom,
  pan,
  onEdit,
  onDuplicate,
  onDelete,
  onBringToFront,
  onSendToBack
}: CanvasFloatingToolbarProps) {
  if (!element) return null;

  const screenX = element.x * zoom + pan.x;
  const screenY = element.y * zoom + pan.y - 48;

  const canEdit = element.type === 'text' || element.type === 'stickynote' || element.type === 'math';

  return (
    <div
      style={{
        position: 'absolute',
        left: `${Math.max(16, screenX)}px`,
        top: `${Math.max(16, screenY)}px`,
        transform: 'translateY(-100%)'
      }}
      className="z-40 flex items-center gap-1 bg-slate-900/95 border border-slate-700/90 shadow-2xl rounded-xl px-2 py-1 backdrop-blur-md text-slate-200 select-none animate-in fade-in duration-100"
    >
      {canEdit && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onEdit(); }}
          title="Edit Content"
          className="p-1.5 hover:bg-slate-800 rounded-lg text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-xs font-medium cursor-pointer"
        >
          <Edit2 className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
      )}

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onBringToFront(); }}
        title="Bring to Front"
        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowUpToLine className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onSendToBack(); }}
        title="Send to Back"
        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
      >
        <ArrowDownToLine className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
        title="Duplicate (Cmd/Ctrl+D)"
        className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
      >
        <Copy className="w-3.5 h-3.5" />
      </button>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        title="Delete (Del / Backspace)"
        className="p-1.5 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
