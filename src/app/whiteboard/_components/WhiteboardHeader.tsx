'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  ChevronLeft,
  ChevronRight,
  Plus,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Trash2,
  Layers,
  HelpCircle,
  LayoutGrid
} from 'lucide-react';
import { BackgroundType } from '../types/whiteboard';
import { HeaderBackgroundMenu } from './header/HeaderBackgroundMenu';
import { HeaderExportMenu } from './header/HeaderExportMenu';

interface WhiteboardHeaderProps {
  boardTitle: string;
  setBoardTitle: (title: string) => void;
  currentPageIndex: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onAddPage: () => void;
  onToggleThumbnails: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  currentBackground: BackgroundType;
  onChangeBackground: (bg: BackgroundType) => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onClearPage: () => void;
  onOpenShortcuts: () => void;
  onOpenMultiBoard?: () => void;
  totalBoardsCount?: number;
}

export function WhiteboardHeader({
  boardTitle,
  setBoardTitle,
  currentPageIndex,
  totalPages,
  onPrevPage,
  onNextPage,
  onAddPage,
  onToggleThumbnails,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  currentBackground,
  onChangeBackground,
  onExportPng,
  onExportPdf,
  onExportJson,
  onImportJson,
  onClearPage,
  onOpenShortcuts,
  onOpenMultiBoard,
  totalBoardsCount = 1
}: WhiteboardHeaderProps) {
  const [showBgMenu, setShowBgMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header className="h-14 bg-[#0d1322] border-b border-white/10 px-3 flex items-center justify-between gap-2 select-none z-30 shrink-0">
      {/* Left: Brand, Multi-Board & Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Link href="/" className="flex items-center gap-2 group shrink-0" title="Return to FitMyForm">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white">
            <FileCheck className="w-4 h-4" />
          </div>
          <span className="font-black text-sm text-white hidden md:inline">
            FitMy<span className="text-blue-400">Board</span>
          </span>
        </Link>

        {onOpenMultiBoard && (
          <button
            type="button"
            onClick={onOpenMultiBoard}
            title="Multi-Board Manager: Switch or create boards"
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-semibold cursor-pointer transition-colors shrink-0"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Boards ({totalBoardsCount})</span>
          </button>
        )}

        <div className="h-5 w-px bg-white/10 hidden sm:block" />

        <input
          type="text"
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
          placeholder="Board Name"
          className="text-xs sm:text-sm font-semibold bg-transparent hover:bg-white/5 focus:bg-white/10 text-white rounded px-2 py-1 border border-transparent focus:border-blue-500/50 outline-none max-w-[120px] sm:max-w-[180px] truncate"
        />
      </div>

      {/* Center: Page Navigation & Undo/Redo */}
      <div className="flex items-center gap-1 sm:gap-2">
        <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Page Switcher */}
        <div className="flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10 text-xs font-semibold text-slate-200">
          <button
            onClick={onPrevPage}
            disabled={currentPageIndex <= 0}
            title="Previous Page"
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={onToggleThumbnails}
            title="View All Pages"
            className="px-2 py-1 rounded hover:bg-white/10 flex items-center gap-1 text-[11px] cursor-pointer"
          >
            <span>{currentPageIndex + 1} / {totalPages}</span>
            <Layers className="w-3 h-3 text-slate-400" />
          </button>
          <button
            onClick={onNextPage}
            disabled={currentPageIndex >= totalPages - 1}
            title="Next Page"
            className="p-1.5 rounded hover:bg-white/10 disabled:opacity-30 text-slate-300 hover:text-white cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onAddPage}
            title="Add New Page"
            className="p-1.5 rounded hover:bg-white/10 text-blue-400 hover:text-blue-300 border-l border-white/10 ml-0.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="hidden lg:flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10 text-xs text-slate-300">
          <button onClick={onZoomOut} title="Zoom Out (-)" className="p-1.5 rounded hover:bg-white/10 cursor-pointer">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={onZoomReset} title="Reset Zoom (0)" className="px-1.5 py-1 text-[11px] font-mono hover:bg-white/10 cursor-pointer">
            {Math.round(zoom * 100)}%
          </button>
          <button onClick={onZoomIn} title="Zoom In (+)" className="p-1.5 rounded hover:bg-white/10 cursor-pointer">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Right: Background, Export & Actions */}
      <div className="flex items-center gap-1 sm:gap-2">
        <HeaderBackgroundMenu
          isOpen={showBgMenu}
          onToggle={() => { setShowBgMenu(!showBgMenu); setShowExportMenu(false); }}
          onClose={() => setShowBgMenu(false)}
          currentBackground={currentBackground}
          onChangeBackground={onChangeBackground}
        />

        <HeaderExportMenu
          isOpen={showExportMenu}
          onToggle={() => { setShowExportMenu(!showExportMenu); setShowBgMenu(false); }}
          onClose={() => setShowExportMenu(false)}
          onExportPng={onExportPng}
          onExportPdf={onExportPdf}
          onExportJson={onExportJson}
          onImportJson={onImportJson}
        />

        <button
          onClick={onClearPage}
          title="Clear Current Page"
          className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 border border-white/10 transition-colors cursor-pointer"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <button
          onClick={onOpenShortcuts}
          title="Keyboard Shortcuts (?)"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 hidden sm:block transition-colors cursor-pointer"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
