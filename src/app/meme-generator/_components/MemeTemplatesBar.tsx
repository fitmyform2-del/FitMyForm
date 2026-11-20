'use client';

import React, { useState } from 'react';
import { MEME_TEMPLATES } from './memePresets';
import { FUNNY_RANDOM_CAPTIONS } from './memeTypes';
import { Sparkles, Shuffle, Search } from 'lucide-react';

interface MemeTemplatesBarProps {
  onSelectTemplate: (templateId: string, name: string, top: string, bottom: string) => void;
  onRandomCaption: (top: string, bottom: string) => void;
}

const CATEGORIES = [
  { id: 'all', name: 'All Formats' },
  { id: 'popular', name: 'Popular' },
  { id: 'two-panel', name: 'Multi-Image' },
  { id: 'news', name: 'Broadcast' }
];

export function MemeTemplatesBar({ onSelectTemplate, onRandomCaption }: MemeTemplatesBarProps) {
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const filtered = MEME_TEMPLATES.filter((t) => {
    const matchesCat = selectedCat === 'all' || t.category === selectedCat;
    const matchesSearch =
      !query.trim() ||
      t.name.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleRandomize = () => {
    const item = FUNNY_RANDOM_CAPTIONS[Math.floor(Math.random() * FUNNY_RANDOM_CAPTIONS.length)];
    onRandomCaption(item.top, item.bottom);
  };

  return (
    <div className="fmf-panel p-4 space-y-3">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-bold text-slate-200">Meme Layout Templates</span>
          <span className="text-[10px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full">
            Ready for Photos
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1 sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter templates..."
              className="w-full pl-8 pr-2.5 py-1.5 rounded-lg bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="button"
            onClick={handleRandomize}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random</span>
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelectedCat(c.id)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedCat === c.id ? 'bg-blue-600 text-white shadow-sm' : 'bg-white/5 text-slate-400 hover:text-white'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
        {filtered.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => onSelectTemplate(tmpl.id, tmpl.name, tmpl.defaultTopText, tmpl.defaultBottomText)}
            className="group flex flex-col items-center p-2 rounded-xl bg-white/[0.03] hover:bg-blue-600/15 border border-white/10 hover:border-blue-500/50 text-left transition-all cursor-pointer"
          >
            <div className="w-full h-14 rounded-lg bg-slate-900 border border-white/5 flex flex-col items-center justify-center text-xl group-hover:scale-105 transition-transform overflow-hidden relative">
              {tmpl.id === 'drake' && <span>🙅‍♂️👉</span>}
              {tmpl.id === 'side-by-side' && <span>↔️ 📸</span>}
              {tmpl.id === 'top-bottom' && <span>↕️ 📸</span>}
              {tmpl.id === 'four-grid' && <span>⊞ 4x</span>}
              {tmpl.id === 'two-buttons' && <span>🔴🔴</span>}
              {tmpl.id === 'breaking-news' && <span>⚡📺</span>}
              {tmpl.slots && (
                <span className="text-[9px] font-bold text-amber-300 bg-black/70 px-1.5 py-0.2 rounded mt-0.5 border border-amber-500/20">
                  {tmpl.slots.length} Slots
                </span>
              )}
            </div>
            <span className="text-[11px] font-bold text-slate-200 mt-2 truncate w-full text-center group-hover:text-blue-300">
              {tmpl.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
