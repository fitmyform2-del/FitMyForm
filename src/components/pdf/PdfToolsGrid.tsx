'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { PDF_TOOLS } from '@/config/pdfToolsConfig';
import {
  GitMerge, Scissors, Minimize2, LayoutGrid, RotateCw, FileImage, Image,
  PenTool, Stamp, Hash, Lock, Unlock, FileText, EyeOff, Columns, Camera,
  FileCode, Code, Search, ArrowRight
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  GitMerge, Scissors, Minimize2, LayoutGrid, RotateCw, FileImage, Image,
  PenTool, Stamp, Hash, Lock, Unlock, FileText, EyeOff, Columns, Camera,
  FileCode, Code
};

export const PdfToolsGrid: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredTools = PDF_TOOLS.filter((tool) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || tool.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 fmf-panel p-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All PDF Tools' },
            { id: 'merge-split', label: 'Organize & Split' },
            { id: 'compress-edit', label: 'Compress & Edit' },
            { id: 'convert', label: 'Convert & Scan' },
            { id: 'security-sign', label: 'Sign & Security' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PDF tools..."
            className="w-full bg-black/40 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Grid of Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => {
          const IconComponent = ICON_MAP[tool.iconName] || FileText;

          return (
            <Link
              key={tool.id}
              href={tool.route}
              className="fmf-card p-5 rounded-2xl flex flex-col justify-between group cursor-pointer relative"
            >
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform shadow-inner">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {tool.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-base text-white group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <span className="text-[11px] text-slate-400 font-medium">100% Client-Side</span>
                <span className="text-blue-400 font-bold group-hover:underline flex items-center gap-1">
                  Open <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
