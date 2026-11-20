'use client';

import React from 'react';
import { Download, Upload, FileDown } from 'lucide-react';

interface HeaderExportMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onExportPng: () => void;
  onExportPdf: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
}

export function HeaderExportMenu({
  isOpen,
  onToggle,
  onClose,
  onExportPng,
  onExportPdf,
  onExportJson,
  onImportJson
}: HeaderExportMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        title="Export Options"
        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/40 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
      >
        <Download className="w-4 h-4" />
        <span className="hidden sm:inline text-[11px]">Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-11 w-52 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 space-y-0.5">
          <div className="px-2 py-1 text-[10px] font-bold uppercase text-slate-400 tracking-wider">Export & Backup</div>
          <button
            onClick={() => { onExportPng(); onClose(); }}
            className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/10 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Save Page as PNG</span>
          </button>
          <button
            onClick={() => { onExportPdf(); onClose(); }}
            className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/10 flex items-center gap-2 cursor-pointer"
          >
            <FileDown className="w-4 h-4 text-rose-400" />
            <span>Save All Pages as PDF</span>
          </button>
          <div className="h-px bg-white/10 my-1" />
          <button
            onClick={() => { onExportJson(); onClose(); }}
            className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/10 flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Export Project (.wbc)</span>
          </button>
          <button
            onClick={() => { onImportJson(); onClose(); }}
            className="w-full text-left px-2.5 py-2 rounded-lg text-xs text-slate-200 hover:bg-white/10 flex items-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4 text-purple-400" />
            <span>Import Project (.wbc)</span>
          </button>
        </div>
      )}
    </div>
  );
}
