'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Search, ArrowRight } from 'lucide-react';
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
    <section className="space-y-8 pt-4">
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider shadow-md">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Complete iLoveIMG Feature Suite</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          Every Tool You Need to <span className="text-indigo-400">Edit Images</span> Online
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          100% free, browser-based image editor and converter suite. Modify photos instantly with zero server uploads and zero quality loss.
        </p>
      </div>

      {/* Filter Bar & Search Input */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-800 p-4 rounded-xl shadow-md border border-slate-700">
        {/* Category Tabs (Horizontally Scrollable on Mobile) */}
        <div className="flex overflow-x-auto w-full md:w-auto pb-2 md:pb-0 gap-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {TOOL_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`snap-center shrink-0 px-4 py-2 min-h-[40px] rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Instant Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools (crop, bg, watermark...)"
            className="w-full min-h-[40px] pl-9 pr-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.route}
            className="group relative bg-slate-800 hover:bg-slate-700/80 p-5 rounded-xl border border-slate-700 flex flex-col justify-between transition-colors shadow-sm cursor-pointer"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                  {getToolIcon(tool.iconName)}
                </div>
                {tool.badge && (
                  <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {tool.badge}
                  </span>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-slate-100 group-hover:text-white flex items-center gap-1.5 transition-colors">
                  <span>{tool.name}</span>
                  <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                </h3>
                <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-700/50 flex items-center justify-between text-[11px] text-slate-500">
              <span className="capitalize font-medium">{tool.category}</span>
              <span className="text-indigo-400 font-medium group-hover:underline">Open Tool →</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
