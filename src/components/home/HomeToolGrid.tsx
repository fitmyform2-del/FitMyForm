'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowRight, X } from 'lucide-react';
import { IMAGE_TOOLS, TOOL_CATEGORIES } from '@/config/imageToolsConfig';
import { getToolIcon } from './HomeToolIcon';

export function HomeToolGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTools = IMAGE_TOOLS.filter((tool) => {
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesSearch =
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="space-y-6 pt-2">
      {/* Category Pills & Search Bar (iLove Style) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-2.5 rounded-2xl glass-panel">
        {/* Category Tabs */}
        <div className="flex overflow-x-auto w-full md:w-auto pb-1 md:pb-0 gap-1.5 snap-x no-scrollbar">
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`snap-center shrink-0 touch-target px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (ssc, compress, crop...)"
            className="w-full touch-target pl-9 pr-8 py-2 rounded-xl bg-black/40 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Tools Cards Grid (iLoveIMG Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.route}
            className="antigravity-card-3d p-5 rounded-2xl flex flex-col justify-between group cursor-pointer relative overflow-hidden"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform shadow-inner">
                  {getToolIcon(tool.iconName)}
                </div>
                {tool.badge && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {tool.badge}
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-extrabold text-white text-base group-hover:text-indigo-300 flex items-center gap-1.5 transition-colors">
                  <span>{tool.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
              <span className="text-[11px] font-medium text-slate-500">{tool.shortDescription}</span>
              <span className="text-indigo-400 font-bold group-hover:underline">Open →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
