'use client';

import React from 'react';
import {
  Square,
  Circle,
  Triangle,
  Star,
  Hexagon,
  Diamond,
  Minus,
  MoveRight,
  ArrowLeftRight,
  CornerDownRight,
  X
} from 'lucide-react';
import { ShapeType } from '../types/whiteboard';

interface ShapesPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedShape: ShapeType;
  onSelectShape: (shape: ShapeType) => void;
}

const SHAPES_LIST: { id: ShapeType; label: string; icon: React.ReactNode }[] = [
  { id: 'rectangle', label: 'Rectangle', icon: <Square className="w-5 h-5" /> },
  { id: 'rounded-rect', label: 'Rounded Rect', icon: <div className="w-5 h-5 border-2 border-current rounded-md" /> },
  { id: 'circle', label: 'Circle / Oval', icon: <Circle className="w-5 h-5" /> },
  { id: 'triangle', label: 'Triangle', icon: <Triangle className="w-5 h-5" /> },
  { id: 'right-triangle', label: 'Right Triangle', icon: <div className="w-0 h-0 border-l-[16px] border-b-[16px] border-l-transparent border-b-current" /> },
  { id: 'star', label: '5-Point Star', icon: <Star className="w-5 h-5" /> },
  { id: 'polygon', label: 'Hexagon', icon: <Hexagon className="w-5 h-5" /> },
  { id: 'diamond', label: 'Diamond', icon: <Diamond className="w-5 h-5" /> },
  { id: 'line', label: 'Straight Line', icon: <Minus className="w-5 h-5" /> },
  { id: 'arrow', label: 'Single Arrow', icon: <MoveRight className="w-5 h-5" /> },
  { id: 'double-arrow', label: 'Double Arrow', icon: <ArrowLeftRight className="w-5 h-5" /> },
  { id: 'curved-arrow', label: 'Curved Arrow', icon: <CornerDownRight className="w-5 h-5" /> }
];

export function ShapesPickerModal({
  isOpen,
  onClose,
  selectedShape,
  onSelectShape
}: ShapesPickerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-[#111726] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Square className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base text-white">Select Shape or Line</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {SHAPES_LIST.map((s) => {
            const isSelected = selectedShape === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  onSelectShape(s.id);
                  onClose();
                }}
                className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-2 text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300 ring-2 ring-blue-500/50'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <div className="text-current flex items-center justify-center h-6">{s.icon}</div>
                <span className="text-[11px] truncate w-full text-center">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
