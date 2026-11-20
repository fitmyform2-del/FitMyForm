'use client';

import React from 'react';
import { X, Music } from 'lucide-react';

interface InteractivePianoWidgetProps {
  onClose: () => void;
  onPlayNote: (note: string) => void;
}

const WHITE_KEYS = [
  { note: 'C4', label: 'C', key: 'A' },
  { note: 'D4', label: 'D', key: 'S' },
  { note: 'E4', label: 'E', key: 'D' },
  { note: 'F4', label: 'F', key: 'F' },
  { note: 'G4', label: 'G', key: 'G' },
  { note: 'A4', label: 'A', key: 'H' },
  { note: 'B4', label: 'B', key: 'J' },
  { note: 'C5', label: 'C', key: 'K' }
];

const BLACK_KEYS = [
  { note: 'C#4', label: 'C#', offset: 'left-[26px]' },
  { note: 'D#4', label: 'D#', offset: 'left-[68px]' },
  { note: 'F#4', label: 'F#', offset: 'left-[152px]' },
  { note: 'G#4', label: 'G#', offset: 'left-[194px]' },
  { note: 'A#4', label: 'A#', offset: 'left-[236px]' }
];

export function InteractivePianoWidget({ onClose, onPlayNote }: InteractivePianoWidgetProps) {
  return (
    <div className="bg-[#111726]/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl p-4 w-88 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <Music className="w-4 h-4 text-pink-400" />
          <span className="font-bold text-xs text-white uppercase tracking-wider">Musical Piano Keys</span>
        </div>
        <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="relative h-36 flex justify-center bg-slate-950 p-2 rounded-xl border border-white/10 shadow-inner">
        {/* White Keys */}
        <div className="flex">
          {WHITE_KEYS.map((k) => (
            <button
              key={k.note}
              onClick={() => onPlayNote(k.note)}
              className="w-10 h-32 bg-white hover:bg-slate-100 active:bg-blue-100 border border-slate-300 rounded-b-md flex flex-col justify-end items-center pb-2 transition-colors cursor-pointer shadow"
            >
              <span className="text-[10px] font-bold text-slate-800">{k.label}</span>
              <span className="text-[8px] text-slate-400 font-mono">{k.key}</span>
            </button>
          ))}
        </div>

        {/* Black Keys */}
        {BLACK_KEYS.map((k) => (
          <button
            key={k.note}
            onClick={() => onPlayNote(k.note)}
            className={`absolute ${k.offset} top-2 w-6 h-20 bg-slate-900 hover:bg-slate-800 active:bg-blue-900 border border-black rounded-b-sm flex items-end justify-center pb-1 text-[8px] font-bold text-white shadow-md z-10 cursor-pointer`}
          >
            {k.label}
          </button>
        ))}
      </div>
      <div className="text-[10px] text-slate-400 text-center mt-2">
        Click or tap keys to play live synthesiser notes
      </div>
    </div>
  );
}
