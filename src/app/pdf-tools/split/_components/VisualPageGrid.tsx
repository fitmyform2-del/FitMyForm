'use client';

import React from 'react';
import { Layers, FileText, Check } from 'lucide-react';

interface VisualPageGridProps {
  totalPages: number;
  startPage: number;
  endPage: number;
  onRangeSelect: (start: number, end: number) => void;
}

export function VisualPageGrid({
  totalPages,
  startPage,
  endPage,
  onRangeSelect
}: VisualPageGridProps) {
  if (totalPages <= 1) return null;

  const handlePageClick = (p: number) => {
    if (p < startPage) {
      onRangeSelect(p, endPage);
    } else if (p > endPage) {
      onRangeSelect(startPage, p);
    } else if (p === startPage && p === endPage) {
      // already single page
    } else {
      // Clicked inside range: set single page or adjust boundary
      onRangeSelect(p, p);
    }
  };

  const selectOdd = () => onRangeSelect(1, totalPages % 2 === 0 ? totalPages - 1 : totalPages);
  const selectEven = () => onRangeSelect(2, totalPages % 2 === 0 ? totalPages : totalPages - 1);
  const selectFirstHalf = () => onRangeSelect(1, Math.max(1, Math.ceil(totalPages / 2)));
  const selectSecondHalf = () => onRangeSelect(Math.min(totalPages, Math.ceil(totalPages / 2) + 1), totalPages);

  return (
    <div className="space-y-3 pt-3 border-t border-white/10">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span>Interactive Page Selector Grid</span>
        </label>
        <div className="flex items-center gap-1.5 text-[11px]">
          <button
            type="button"
            onClick={selectFirstHalf}
            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10"
          >
            1st Half
          </button>
          <button
            type="button"
            onClick={selectSecondHalf}
            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10"
          >
            2nd Half
          </button>
          <button
            type="button"
            onClick={selectOdd}
            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10"
          >
            Odd Range
          </button>
          <button
            type="button"
            onClick={selectEven}
            className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10"
          >
            Even Range
          </button>
        </div>
      </div>

      {/* Grid of clickable pages */}
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 max-h-48 overflow-y-auto p-1 custom-scrollbar">
        {Array.from({ length: Math.min(100, totalPages) }, (_, i) => i + 1).map((p) => {
          const isSelected = p >= startPage && p <= endPage;
          const isEdge = p === startPage || p === endPage;

          return (
            <button
              key={p}
              type="button"
              onClick={() => handlePageClick(p)}
              className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md shadow-indigo-600/20'
                  : 'bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-white'
              } ${isEdge ? 'ring-2 ring-indigo-400 ring-offset-1 ring-offset-black' : ''}`}
            >
              <FileText className={`w-4 h-4 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
              <span className="text-xs font-mono font-bold">p.{p}</span>
              {isSelected && (
                <span className="text-[9px] font-black text-emerald-400 flex items-center">
                  <Check className="w-2.5 h-2.5" />
                </span>
              )}
            </button>
          );
        })}
      </div>
      {totalPages > 100 && (
        <p className="text-[10px] text-slate-400 italic">Showing first 100 pages in grid.</p>
      )}
    </div>
  );
}
