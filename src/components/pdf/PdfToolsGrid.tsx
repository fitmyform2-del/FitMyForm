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
    <div className="space-y-8">
      {/* Category Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 glass-panel-antigravity p-4 rounded-3xl shadow-2xl">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
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
              className={`px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-extrabold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/35 border border-blue-400'
                  : 'bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-blue-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search PDF tool (e.g. merge, compress)..."
            className="w-full min-h-[44px] bg-white/[0.05] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Grid of Tools with Antigravity 3D Elevation */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const IconComponent = ICON_MAP[tool.iconName] || FileText;

          return (
            <Link
              key={tool.id}
              href={tool.route}
              className="group relative antigravity-card-3d p-6 rounded-3xl flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/15 border border-blue-500/35 flex items-center justify-center text-blue-400 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  {tool.badge && (
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 shadow-sm">
                      {tool.badge}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-lg text-white group-hover:text-blue-300 transition-colors flex items-center gap-1.5">
                    {tool.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                    {tool.shortDescription}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-blue-400 group-hover:text-blue-300">
                <span>Use {tool.name}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12 glass-panel rounded-3xl border border-white/10 p-8 space-y-3">
          <p className="text-slate-300 text-sm">No PDF tools found matching &quot;{searchQuery}&quot;</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-5 py-2.5 min-h-[44px] rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-500 transition-colors cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
