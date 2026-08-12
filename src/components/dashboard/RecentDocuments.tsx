'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Trash2, ShieldCheck } from 'lucide-react';
import { getRecentHistory, clearRecentHistory } from '@/lib/storage/sessionStore';
import { RecentItem } from '@/types/document';

export const RecentDocuments: React.FC = () => {
  const [history, setHistory] = useState<RecentItem[]>([]);

  useEffect(() => {
    setTimeout(() => {
      setHistory(getRecentHistory());
    }, 0);
  }, []);

  const handleClear = () => {
    clearRecentHistory();
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <div className="bg-[#0d121e] border border-white/15 rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl backdrop-blur-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h4 className="font-black text-sm text-white flex items-center gap-2.5 tracking-tight">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <span>Recent Formatted Sessions (Saved in Local Browser Storage)</span>
        </h4>
        <button
          onClick={handleClear}
          className="text-xs font-bold text-slate-400 hover:text-rose-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-[#080b11] border border-white/10 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-indigo-500/40 transition-all shadow-md group"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-xs text-white truncate max-w-[160px] group-hover:text-indigo-400 transition-colors">
                  {item.fileName}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded-md border border-emerald-500/30">
                  {item.format}
                </span>
              </div>

              <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
                <div>Dimensions: <span className="text-slate-200 font-bold">{item.dimensions}</span></div>
                <div>Size Output: <strong className="text-emerald-400">{item.processedSizeKB} KB</strong> <span className="text-slate-500">(was {item.originalSizeKB} KB)</span></div>
              </div>
            </div>

            <div className="text-[10px] text-slate-400 font-medium flex items-center justify-between border-t border-white/10 pt-2">
              <span>{item.timestamp}</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Private
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

