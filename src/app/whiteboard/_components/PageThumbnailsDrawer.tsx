'use client';

import React from 'react';
import {
  X,
  Plus,
  Copy,
  Trash2,
  ChevronUp,
  ChevronDown,
  Layers
} from 'lucide-react';
import { WhiteboardPage } from '../types/whiteboard';

interface PageThumbnailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pages: WhiteboardPage[];
  currentPageIndex: number;
  onSelectPage: (index: number) => void;
  onAddPage: () => void;
  onDuplicatePage: (index: number) => void;
  onDeletePage: (index: number) => void;
  onMovePage: (from: number, to: number) => void;
}

export function PageThumbnailsDrawer({
  isOpen,
  onClose,
  pages,
  currentPageIndex,
  onSelectPage,
  onAddPage,
  onDuplicatePage,
  onDeletePage,
  onMovePage
}: PageThumbnailsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 left-0 z-40 w-72 bg-[#0d1322] border-r border-white/10 shadow-2xl flex flex-col select-none animate-in slide-in-from-left duration-200">
      {/* Header */}
      <div className="h-14 px-4 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-sm text-white">Board Pages ({pages.length})</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Pages List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {pages.map((page, idx) => {
          const isActive = currentPageIndex === idx;
          return (
            <div
              key={page.id}
              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-600/20 border-blue-500 shadow-md ring-1 ring-blue-500/50'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
              onClick={() => onSelectPage(idx)}
            >
              {/* Page Card Header */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-xs text-white">
                  Page {idx + 1}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {page.elements.length} elements
                </span>
              </div>

              {/* Mini Preview Box */}
              <div className="h-24 w-full bg-slate-900 rounded-lg border border-white/5 flex items-center justify-center relative overflow-hidden text-[10px] text-slate-500">
                <span className="capitalize">{page.background} canvas</span>
              </div>

              {/* Action Buttons for Page */}
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5 text-slate-400" onClick={(e) => e.stopPropagation()}>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onMovePage(idx, idx - 1)}
                    disabled={idx === 0}
                    className="p-1 rounded hover:bg-white/10 disabled:opacity-20"
                    title="Move Up"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onMovePage(idx, idx + 1)}
                    disabled={idx === pages.length - 1}
                    className="p-1 rounded hover:bg-white/10 disabled:opacity-20"
                    title="Move Down"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onDuplicatePage(idx)}
                    className="p-1 rounded hover:bg-white/10 hover:text-white"
                    title="Duplicate Page"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => onDeletePage(idx)}
                    disabled={pages.length <= 1}
                    className="p-1 rounded hover:bg-rose-500/20 hover:text-rose-400 disabled:opacity-20"
                    title="Delete Page"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Add Page Button */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={onAddPage}
          className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Page</span>
        </button>
      </div>
    </div>
  );
}
