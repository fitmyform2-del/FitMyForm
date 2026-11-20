'use client';

import React, { useState } from 'react';
import { StickyNote, X, Plus } from 'lucide-react';

interface StickyNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStickyNote: (text: string, color: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange') => void;
}

const COLORS: { id: 'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange'; bg: string; border: string; label: string }[] = [
  { id: 'yellow', bg: '#fef08a', border: '#eab308', label: 'Yellow' },
  { id: 'blue', bg: '#bae6fd', border: '#0284c7', label: 'Blue' },
  { id: 'green', bg: '#bbf7d0', border: '#16a34a', label: 'Green' },
  { id: 'pink', bg: '#fbcfe8', border: '#db2777', label: 'Pink' },
  { id: 'purple', bg: '#e9d5ff', border: '#9333ea', label: 'Purple' },
  { id: 'orange', bg: '#fed7aa', border: '#ea580c', label: 'Orange' }
];

export function StickyNoteModal({ isOpen, onClose, onAddStickyNote }: StickyNoteModalProps) {
  const [text, setText] = useState('');
  const [selectedColor, setSelectedColor] = useState<'yellow' | 'blue' | 'green' | 'pink' | 'purple' | 'orange'>('yellow');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddStickyNote(text.trim(), selectedColor);
    setText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-[#111726] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Add Sticky Note</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Color Palette */}
        <div className="flex items-center justify-between gap-2">
          {COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedColor(c.id)}
              style={{ backgroundColor: c.bg, borderColor: c.border }}
              className={`w-9 h-9 rounded-xl border-2 transition-transform cursor-pointer ${
                selectedColor === c.id ? 'scale-110 ring-2 ring-white/60 shadow-md' : 'opacity-80 hover:opacity-100'
              }`}
              title={c.label}
            />
          ))}
        </div>

        {/* Text Input */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write reminder, instructions, note..."
            rows={4}
            className="w-full bg-slate-900 border border-white/15 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none"
            autoFocus
          />

          <button
            type="submit"
            disabled={!text.trim()}
            className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Place Note on Board</span>
          </button>
        </form>
      </div>
    </div>
  );
}
