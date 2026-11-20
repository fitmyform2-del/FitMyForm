'use client';

import React, { useState } from 'react';
import { Calculator, X, Plus } from 'lucide-react';
import { MATH_CATEGORIES } from '../utils/mathSymbols';

interface MathEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertMath: (formula: string) => void;
}

export function MathEditorModal({ isOpen, onClose, onInsertMath }: MathEditorModalProps) {
  const [activeCategory, setActiveCategory] = useState(0);
  const [formula, setFormula] = useState('');

  if (!isOpen) return null;

  const handleAppend = (sym: string) => {
    setFormula((prev) => prev + sym);
  };

  const handleInsert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formula.trim()) return;
    onInsertMath(formula.trim());
    setFormula('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-[#111726] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-sky-400" />
            <h3 className="font-bold text-base text-white">Math Symbol & Formula Editor</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 border-b border-white/10">
          {MATH_CATEGORIES.map((cat, idx) => (
            <button
              key={cat.title}
              onClick={() => setActiveCategory(idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === idx ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Symbol Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto no-scrollbar p-1 bg-slate-900/60 rounded-xl border border-white/5">
          {MATH_CATEGORIES[activeCategory].symbols.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => handleAppend(item.symbol)}
              title={item.label}
              className="p-2.5 rounded-lg bg-white/5 hover:bg-sky-500/20 border border-white/5 hover:border-sky-500/40 text-base font-serif text-white hover:text-sky-300 transition-all flex items-center justify-center cursor-pointer"
            >
              {item.preview}
            </button>
          ))}
        </div>

        {/* Input & Live Preview */}
        <form onSubmit={handleInsert} className="space-y-3">
          <div>
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
              Formula Expression:
            </label>
            <input
              type="text"
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              placeholder="e.g. ∫(3x² + 2x)dx or E = mc²"
              className="w-full bg-slate-900 border border-white/15 rounded-xl px-3 py-2 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:border-sky-500"
              autoFocus
            />
          </div>

          {formula && (
            <div className="p-3 rounded-xl bg-slate-900/90 border border-sky-500/30 flex items-center justify-center">
              <span className="text-xl font-serif italic text-sky-200">{formula}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormula('')}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={!formula.trim()}
              className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Insert on Whiteboard</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
