'use client';

import React, { useState, useEffect } from 'react';
import { Clock, FileText, Trash2, ArrowUpRight } from 'lucide-react';
import { getRecentHistory, clearRecentHistory } from '@/lib/storage/sessionStore';
import { RecentItem } from '@/types/document';

export const RecentDocuments: React.FC = () => {
  const [history, setHistory] = useState<RecentItem[]>([]);

  useEffect(() => {
    setHistory(getRecentHistory());
  }, []);

  const handleClear = () => {
    clearRecentHistory();
    setHistory([]);
  };

  if (history.length === 0) return null;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-gray-800 pb-3">
        <h4 className="font-bold text-sm text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <span>Recent Sessions History (This Browser)</span>
        </h4>
        <button
          onClick={handleClear}
          className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
        {history.map((item) => (
          <div
            key={item.id}
            className="bg-gray-950 border border-gray-800 rounded-xl p-3 flex flex-col justify-between space-y-2 hover:border-gray-700 transition-colors"
          >
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-white truncate max-w-[150px]">
                  {item.fileName}
                </span>
                <span className="text-[10px] bg-gray-800 text-emerald-400 font-mono px-2 py-0.5 rounded">
                  {item.format}
                </span>
              </div>

              <div className="text-[11px] text-gray-400 font-mono space-y-0.5">
                <div>Dimensions: <span className="text-gray-200">{item.dimensions}</span></div>
                <div>Size: <span className="text-emerald-400">{item.processedSizeKB} KB</span> (was {item.originalSizeKB} KB)</div>
              </div>
            </div>

            <div className="text-[10px] text-gray-500 flex items-center justify-between border-t border-gray-800/60 pt-2">
              <span>{item.timestamp}</span>
              <span className="text-indigo-400">Browser Stored</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
