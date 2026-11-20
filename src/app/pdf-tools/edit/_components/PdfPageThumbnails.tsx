'use client';

import React from 'react';
import { RotateCw, Copy, Trash2, FilePlus2 } from 'lucide-react';
import { RenderedPdfPage } from '@/lib/pdf/pdfjsLoader';
import { PdfPagePlanItem } from '@/lib/pdf/pdfTools';

export interface EditorPageEntry {
  uid: string;
  plan: PdfPagePlanItem;
  preview?: RenderedPdfPage;
}

interface PdfPageThumbnailsProps {
  pages: EditorPageEntry[];
  currentPage: number;
  annotationCountByPage: Record<number, number>;
  onSelectPage: (index: number) => void;
  onRotatePage: (index: number) => void;
  onDuplicatePage: (index: number) => void;
  onInsertBlankPage: (afterIndex: number) => void;
  onDeletePage: (index: number) => void;
}

export const PdfPageThumbnails: React.FC<PdfPageThumbnailsProps> = ({
  pages,
  currentPage,
  annotationCountByPage,
  onSelectPage,
  onRotatePage,
  onDuplicatePage,
  onInsertBlankPage,
  onDeletePage
}) => {
  return (
    <aside className="bg-[#0e1424] border border-white/10 rounded-2xl p-3 flex flex-col gap-3 max-h-[78vh]">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Pages ({pages.length})
        </span>
        <button
          type="button"
          onClick={() => onInsertBlankPage(currentPage)}
          title="Insert blank A4 page after current page"
          className="px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 text-blue-300 text-[10px] font-bold flex items-center gap-1 cursor-pointer"
        >
          <FilePlus2 className="w-3 h-3" />
          <span>+ Blank</span>
        </button>
      </div>

      <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
        {pages.map((entry, idx) => {
          const active = idx === currentPage;
          const count = annotationCountByPage[idx] || 0;
          return (
            <div
              key={entry.uid}
              className={`rounded-xl border p-2 transition-all ${
                active
                  ? 'bg-blue-600/15 border-blue-500/60 shadow-md shadow-blue-950/40'
                  : 'bg-black/30 border-white/[0.07] hover:border-white/20'
              }`}
            >
              <button
                type="button"
                onClick={() => onSelectPage(idx)}
                className="w-full block cursor-pointer"
              >
                <div className="relative rounded-lg overflow-hidden bg-white aspect-[3/4] flex items-center justify-center border border-white/10">
                  {entry.preview ? (
                    <img
                      src={entry.preview.dataUrl}
                      alt={`Page ${idx + 1}`}
                      style={{ transform: `rotate(${entry.plan.rotation}deg)` }}
                      className="max-w-full max-h-full object-contain transition-transform"
                    />
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Blank Page</span>
                  )}

                  <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/75 text-white text-[10px] font-mono font-bold">
                    {idx + 1}
                  </span>

                  {count > 0 && (
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 rounded-full bg-blue-600 text-white text-[9px] font-bold">
                      {count}
                    </span>
                  )}
                </div>
              </button>

              {/* Quick Page Actions */}
              <div className="mt-1.5 flex items-center justify-between gap-1">
                <button
                  type="button"
                  onClick={() => onRotatePage(idx)}
                  title="Rotate 90°"
                  className="flex-1 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.12] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => onDuplicatePage(idx)}
                  title="Duplicate Page"
                  className="flex-1 py-1 rounded-md bg-white/[0.04] hover:bg-white/[0.12] text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  disabled={pages.length <= 1}
                  onClick={() => onDeletePage(idx)}
                  title="Delete Page"
                  className="flex-1 py-1 rounded-md bg-white/[0.04] hover:bg-rose-500/25 text-slate-300 hover:text-rose-300 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};
