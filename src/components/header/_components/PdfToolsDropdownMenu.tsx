'use client';

import React from 'react';
import Link from 'next/link';
import {
  ChevronDown, ArrowRight, FileText, GitMerge, Scissors, Minimize2,
  LayoutGrid, RotateCw, FileImage, Image as ImageIcon, PenTool, Stamp,
  Hash, Unlock, EyeOff, Columns, Camera, FileCode, Code
} from 'lucide-react';
import { PDF_TOOLS, PdfToolMeta } from '@/config/pdfToolsConfig';

interface PdfToolsDropdownMenuProps {
  isOpen: boolean;
  isActive: boolean;
  pathname: string;
  onToggle: () => void;
  onClose: () => void;
}

const PDF_ICON_MAP: Record<string, React.ElementType> = {
  GitMerge, Scissors, Minimize2, LayoutGrid, RotateCw, FileImage,
  Image: ImageIcon, PenTool, Stamp, Hash, Unlock, FileText, EyeOff,
  Columns, Camera, FileCode, Code
};

const PDF_GROUPS: { title: string; category: PdfToolMeta['category'] }[] = [
  { title: 'Merge, Split & Arrange', category: 'merge-split' },
  { title: 'Compress, Edit & Compare', category: 'compress-edit' },
  { title: 'Convert & Scan', category: 'convert' },
  { title: 'Sign & Privacy', category: 'security-sign' }
];

export function PdfToolsDropdownMenu({
  isOpen,
  isActive,
  pathname,
  onToggle,
  onClose
}: PdfToolsDropdownMenuProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={`h-9 px-3 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
          isOpen || isActive
            ? 'text-white bg-white/[0.1] shadow-inner'
            : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
        }`}
      >
        <span>PDF Tools</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+0.65rem)] left-1/2 -translate-x-1/2 w-[660px] max-w-[92vw] bg-[#0f1525]/98 backdrop-blur-2xl border border-white/12 rounded-2xl shadow-2xl shadow-black/60 p-4 z-50 animate-fade-in">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.08]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-rose-400" />
              Client-Side PDF Suite ({PDF_TOOLS.length} Tools)
            </span>
            <Link
              href="/pdf-tools"
              onClick={onClose}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>PDF Tools Hub</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-x-5 gap-y-4">
            {PDF_GROUPS.map((group) => {
              const items = PDF_TOOLS.filter((t) => t.category === group.category);
              return (
                <div key={group.category} className="space-y-1.5">
                  <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    {group.title}
                  </div>
                  <div className="space-y-0.5">
                    {items.map((tool) => {
                      const Icon = PDF_ICON_MAP[tool.iconName] || FileText;
                      const active = pathname === tool.route;
                      return (
                        <Link
                          key={tool.id}
                          href={tool.route}
                          onClick={onClose}
                          className={`flex items-center gap-2.5 p-2 rounded-xl transition-colors group ${
                            active ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-white/[0.06] border border-transparent'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-blue-400 shrink-0 group-hover:text-blue-300">
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs font-bold text-slate-100 group-hover:text-white truncate">
                                {tool.name}
                              </span>
                              {tool.badge && (
                                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shrink-0">
                                  {tool.badge}
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
