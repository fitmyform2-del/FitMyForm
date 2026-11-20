'use client';

import React from 'react';
import { Grid } from 'lucide-react';
import { BackgroundType } from '../../types/whiteboard';

interface HeaderBackgroundMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  currentBackground: BackgroundType;
  onChangeBackground: (bg: BackgroundType) => void;
}

const BG_OPTIONS: { id: BackgroundType; label: string }[] = [
  { id: 'blank', label: 'Plain White' },
  { id: 'blackboard', label: 'Blackboard' },
  { id: 'greenboard', label: 'Green Chalkboard' },
  { id: 'grid-sm', label: 'Math Small Grid' },
  { id: 'grid-lg', label: 'Math Large Grid' },
  { id: 'dots', label: 'Dot Grid' },
  { id: 'lined', label: 'Ruled Lined' },
  { id: 'isometric', label: 'Isometric 3D' },
  { id: 'music', label: 'Music Staff' }
];

export function HeaderBackgroundMenu({
  isOpen,
  onToggle,
  onClose,
  currentBackground,
  onChangeBackground
}: HeaderBackgroundMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        title="Change Canvas Background"
        className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
          isOpen ? 'bg-blue-600 border-blue-500 text-white' : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
        }`}
      >
        <Grid className="w-4 h-4" />
        <span className="hidden xl:inline text-[11px] font-medium">Grid</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 w-44 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 space-y-0.5">
          <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Canvas Pattern</div>
          {BG_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => { onChangeBackground(opt.id); onClose(); }}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between cursor-pointer ${
                currentBackground === opt.id ? 'bg-blue-600/30 text-blue-300 font-bold' : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              <span>{opt.label}</span>
              {currentBackground === opt.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
