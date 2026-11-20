'use client';

import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS = [
  { key: 'D or P', desc: 'Freehand Pen / Pencil' },
  { key: 'H', desc: 'Highlighter' },
  { key: 'L', desc: 'Laser Pointer' },
  { key: 'E', desc: 'Eraser' },
  { key: 'S or V', desc: 'Select & Move Tool' },
  { key: 'T', desc: 'Text Box' },
  { key: 'N', desc: 'Sticky Note' },
  { key: 'M', desc: 'Math & Formulas' },
  { key: 'R', desc: 'Shapes & Lines' },
  { key: 'Space', desc: 'Pan / Hand Tool' },
  { key: 'Ctrl + Z', desc: 'Undo last change' },
  { key: 'Ctrl + Y', desc: 'Redo change' },
  { key: 'Ctrl + D', desc: 'Duplicate selected' },
  { key: 'Delete', desc: 'Delete selected element' },
  { key: '+ / -', desc: 'Zoom In / Out' },
  { key: '0', desc: 'Reset Zoom to 100%' },
  { key: '?', desc: 'Open Shortcuts Guide' }
];

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none">
      <div className="bg-[#111726] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base text-white">Keyboard Shortcuts</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto no-scrollbar space-y-1.5 p-1">
          {SHORTCUTS.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between p-2 rounded-xl bg-white/5 border border-white/5 text-xs"
            >
              <span className="text-slate-300 font-medium">{s.desc}</span>
              <kbd className="px-2 py-0.5 rounded bg-slate-900 border border-white/20 text-blue-300 font-mono font-bold text-[11px]">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>

        <div className="text-[11px] text-slate-400 text-center">
          Antigravity Offline Whiteboard Studio • 100% Client-Side Privacy
        </div>
      </div>
    </div>
  );
}
