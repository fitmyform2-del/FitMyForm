'use client';

import React, { useRef } from 'react';
import {
  MousePointer2,
  Type,
  Highlighter,
  Eraser,
  PenTool,
  Square,
  Circle,
  Minus,
  ArrowUpRight,
  Check,
  X,
  Stamp,
  Calendar,
  Image as ImageIcon,
  Signature,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Download,
  RefreshCw,
  Trash2
} from 'lucide-react';
import { AnnotationType } from '@/lib/pdf/pdfTools';

export type EditorToolMode = 'select' | AnnotationType | 'date';

interface PdfEditorToolbarProps {
  activeTool: EditorToolMode;
  onSelectTool: (tool: EditorToolMode) => void;
  onInsertImageFile: (file: File) => void;
  onOpenSignModal: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onClearPage: () => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  isProcessing: boolean;
  hasEdits: boolean;
  onExport: () => void;
}

const TOOL_GROUPS: Array<Array<{ id: EditorToolMode; label: string; icon: React.ComponentType<{ className?: string }> }>> = [
  [
    { id: 'select', label: 'Select', icon: MousePointer2 },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'highlight', label: 'Highlight', icon: Highlighter },
    { id: 'whiteout', label: 'Whiteout', icon: Eraser },
    { id: 'draw', label: 'Pen', icon: PenTool }
  ],
  [
    { id: 'rect', label: 'Box', icon: Square },
    { id: 'circle', label: 'Circle', icon: Circle },
    { id: 'line', label: 'Line', icon: Minus },
    { id: 'arrow', label: 'Arrow', icon: ArrowUpRight }
  ],
  [
    { id: 'check', label: 'Check', icon: Check },
    { id: 'cross', label: 'Cross', icon: X },
    { id: 'date', label: 'Date', icon: Calendar },
    { id: 'stamp', label: 'Stamp', icon: Stamp }
  ]
];

export const PdfEditorToolbar: React.FC<PdfEditorToolbarProps> = ({
  activeTool,
  onSelectTool,
  onInsertImageFile,
  onOpenSignModal,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onClearPage,
  zoom,
  onZoomChange,
  isProcessing,
  hasEdits,
  onExport
}) => {
  const imgInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-[#0e1424] border border-white/10 rounded-2xl p-2.5 flex flex-wrap items-center justify-between gap-2 shadow-xl">
      {/* Left: Tool Palette */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 pr-2 mr-1 border-r border-white/10">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo (Ctrl+Z)"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo (Ctrl+Y)"
            className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/[0.08] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Grouped Interactive Tools */}
        {TOOL_GROUPS.map((group, gIdx) => (
          <div
            key={gIdx}
            className="flex items-center gap-0.5 pr-2 mr-0.5 border-r border-white/10 last:border-r-0"
          >
            {group.map((tool) => {
              const Icon = tool.icon;
              const active = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => onSelectTool(tool.id)}
                  title={tool.label}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                      : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">{tool.label}</span>
                </button>
              );
            })}
          </div>
        ))}

        {/* Insert Image & Signature */}
        <div className="flex items-center gap-1">
          <input
            ref={imgInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onInsertImageFile(f);
              e.target.value = '';
            }}
          />
          <button
            type="button"
            onClick={() => imgInputRef.current?.click()}
            title="Insert Image / Photo / Logo"
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Image</span>
          </button>
          <button
            type="button"
            onClick={onOpenSignModal}
            title="Draw & Insert Signature"
            className="px-2.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.12] border border-white/10 text-slate-200 text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <Signature className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Sign</span>
          </button>
        </div>
      </div>

      {/* Right: Zoom, Clear Page & Export */}
      <div className="flex items-center gap-2 ml-auto">
        <div className="flex items-center gap-0.5 bg-black/40 border border-white/10 rounded-xl px-1 py-0.5">
          <button
            type="button"
            onClick={() => onZoomChange(Math.max(0.5, Number((zoom - 0.15).toFixed(2))))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(1)}
            className="px-2 text-[11px] font-mono font-bold text-slate-200 hover:text-blue-300 cursor-pointer"
            title="Reset Zoom to 100%"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            type="button"
            onClick={() => onZoomChange(Math.min(2, Number((zoom + 0.15).toFixed(2))))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        <button
          type="button"
          onClick={onClearPage}
          title="Clear annotations on this page"
          className="p-2 rounded-xl bg-white/[0.04] hover:bg-rose-500/20 border border-white/10 text-slate-400 hover:text-rose-300 cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          disabled={isProcessing || !hasEdits}
          onClick={onExport}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black flex items-center gap-1.5 shadow-lg shadow-blue-600/30 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
