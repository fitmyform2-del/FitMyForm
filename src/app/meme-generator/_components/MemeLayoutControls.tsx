'use client';

import React from 'react';
import { MemeLayoutMode } from './memeTypes';
import { LayoutTemplate, Subtitles, Frame, MessageSquare } from 'lucide-react';

interface MemeLayoutControlsProps {
  layout: MemeLayoutMode;
  onChangeLayout: (layout: MemeLayoutMode) => void;
}

const LAYOUT_OPTIONS: { id: MemeLayoutMode; name: string; desc: string; icon: React.ReactNode }[] = [
  {
    id: 'classic',
    name: 'Classic Overlay',
    desc: 'Impact top & bottom captions layered over the photo',
    icon: <MessageSquare className="w-4 h-4 text-amber-400" />
  },
  {
    id: 'modern-header',
    name: 'Modern Header',
    desc: 'Twitter / Reddit style clean white banner on top',
    icon: <LayoutTemplate className="w-4 h-4 text-blue-400" />
  },
  {
    id: 'bottom-bar',
    name: 'Subtitle Bar',
    desc: 'Cinematic bottom banner with crisp subtitle caption',
    icon: <Subtitles className="w-4 h-4 text-emerald-400" />
  },
  {
    id: 'demotivational',
    name: 'Demotivational Poster',
    desc: 'Classic black framed border with bold title & subtitle',
    icon: <Frame className="w-4 h-4 text-purple-400" />
  }
];

export function MemeLayoutControls({ layout, onChangeLayout }: MemeLayoutControlsProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300">Meme Layout Style</label>
        <span className="text-[10px] text-slate-400 font-semibold bg-white/5 px-2 py-0.5 rounded">
          {LAYOUT_OPTIONS.find((l) => l.id === layout)?.name}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {LAYOUT_OPTIONS.map((opt) => {
          const isSelected = layout === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChangeLayout(opt.id)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-600/15 border-blue-500 text-white shadow-md'
                  : 'bg-white/[0.03] border-white/10 hover:border-white/20 text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                {opt.icon}
                <span className="text-xs font-bold text-white">{opt.name}</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{opt.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
