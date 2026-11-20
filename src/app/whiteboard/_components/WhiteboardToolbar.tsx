'use client';

import React from 'react';
import {
  MousePointer2,
  Pen,
  Highlighter,
  Zap,
  Eraser,
  Square,
  Type,
  StickyNote,
  Compass,
  Boxes,
  Hand,
  Image as ImageIcon,
  FileText,
  Camera,
  Calculator
} from 'lucide-react';
import { ToolType } from '../types/whiteboard';

interface WhiteboardToolbarProps {
  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  onOpenShapesModal: () => void;
  onOpenStickyModal: () => void;
  onOpenMathModal: () => void;
  onOpenManipulatives: () => void;
  onOpenWidgets: () => void;
  onUploadImageClick: () => void;
  onOpenPdfModal: () => void;
  onOpenCameraModal: () => void;
  onOpenTextModal?: () => void;
}

export function WhiteboardToolbar({
  activeTool,
  setActiveTool,
  onOpenShapesModal,
  onOpenStickyModal,
  onOpenMathModal,
  onOpenManipulatives,
  onOpenWidgets,
  onUploadImageClick,
  onOpenPdfModal,
  onOpenCameraModal,
  onOpenTextModal
}: WhiteboardToolbarProps) {
  const primaryTools: {
    id: ToolType;
    icon: React.ReactNode;
    label: string;
    shortcut: string;
    onClick?: () => void;
  }[] = [
    { id: 'select', icon: <MousePointer2 className="w-5 h-5" />, label: 'Select / Move', shortcut: 'S' },
    { id: 'pen', icon: <Pen className="w-5 h-5" />, label: 'Draw Pen', shortcut: 'D' },
    { id: 'highlighter', icon: <Highlighter className="w-5 h-5" />, label: 'Highlighter', shortcut: 'H' },
    { id: 'laser', icon: <Zap className="w-5 h-5 text-rose-400" />, label: 'Laser Pointer', shortcut: 'L' },
    { id: 'eraser', icon: <Eraser className="w-5 h-5" />, label: 'Eraser', shortcut: 'E' },
    {
      id: 'shape',
      icon: <Square className="w-5 h-5" />,
      label: 'Shapes & Lines',
      shortcut: 'R',
      onClick: onOpenShapesModal
    },
    {
      id: 'text',
      icon: <Type className="w-5 h-5" />,
      label: 'Text Box',
      shortcut: 'T',
      onClick: onOpenTextModal
    },
    {
      id: 'stickynote',
      icon: <StickyNote className="w-5 h-5 text-amber-300" />,
      label: 'Sticky Note',
      shortcut: 'N',
      onClick: onOpenStickyModal
    },
    {
      id: 'math',
      icon: <Calculator className="w-5 h-5 text-sky-400" />,
      label: 'Math & Formulas',
      shortcut: 'M',
      onClick: onOpenMathModal
    },
    {
      id: 'manipulative',
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      label: 'Manipulatives (Ruler/Protractor)',
      shortcut: 'G',
      onClick: onOpenManipulatives
    },
    { id: 'pan', icon: <Hand className="w-5 h-5" />, label: 'Pan Hand', shortcut: 'Space' }
  ];

  return (
    <aside className="w-14 sm:w-16 bg-[#0d1322] border-r border-white/10 flex flex-col items-center py-2.5 gap-1.5 z-20 shrink-0 select-none overflow-y-auto no-scrollbar">
      {/* Primary Tool Buttons */}
      <div className="flex flex-col gap-1 w-full px-2">
        {primaryTools.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id);
                if (tool.onClick) tool.onClick();
              }}
              title={`${tool.label} (${tool.shortcut})`}
              className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all relative group cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/40 ring-2 ring-blue-400/50'
                  : 'text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tool.icon}
              {/* Tooltip */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 border border-slate-700 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
                {tool.label} <span className="text-slate-400 font-mono text-[10px]">[{tool.shortcut}]</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="w-8 h-px bg-white/10 my-1" />

      {/* Classroom Widgets Button */}
      <div className="flex flex-col gap-1 w-full px-2">
        <button
          onClick={onOpenWidgets}
          title="Interactive Classroom Widgets (Timer, Dice, Spinner, Piano)"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 border border-purple-500/30 flex items-center justify-center transition-colors relative group cursor-pointer"
        >
          <Boxes className="w-5 h-5 text-purple-400" />
          <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 border border-slate-700 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Widgets (Timer, Dice, Piano, Buzzer)
          </div>
        </button>

        {/* Media Inserts */}
        <button
          onClick={onUploadImageClick}
          title="Insert Image (JPG, PNG, SVG)"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors relative group cursor-pointer"
        >
          <ImageIcon className="w-5 h-5 text-emerald-400" />
          <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 border border-slate-700 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Insert Image
          </div>
        </button>

        <button
          onClick={onOpenPdfModal}
          title="Insert PDF Page / Worksheet"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors relative group cursor-pointer"
        >
          <FileText className="w-5 h-5 text-rose-400" />
          <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 border border-slate-700 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Insert PDF Page
          </div>
        </button>

        <button
          onClick={onOpenCameraModal}
          title="Camera Snapshot to Board"
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors relative group cursor-pointer"
        >
          <Camera className="w-5 h-5 text-cyan-400" />
          <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 border border-slate-700 text-white text-[11px] font-medium rounded-md whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Camera Snapshot
          </div>
        </button>
      </div>
    </aside>
  );
}
