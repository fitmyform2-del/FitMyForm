'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { IMAGE_TOOLS } from '@/config/imageToolsConfig';
import { getToolIcon } from '@/components/home/HomeToolIcon';

interface ImageToolsDropdownMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function ImageToolsDropdownMenu({ isOpen, onToggle, onClose }: ImageToolsDropdownMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        onBlur={() => setTimeout(onClose, 250)}
        className="flex items-center gap-1.5 min-h-[36px] text-sm font-medium px-3 py-1.5 rounded-lg text-slate-300 hover:text-slate-50 hover:bg-slate-800/80 transition-colors"
      >
        <ImageIcon className="w-4 h-4 text-indigo-400/80" />
        <span className="hidden sm:inline">Image Tools</span>
        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-[calc(100%+0.5rem)] sm:right-0 sm:left-auto sm:w-[420px] max-h-[calc(100vh-5rem)] overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-2 z-50 divide-y divide-slate-700/50">
          <div className="px-3 py-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              iLoveIMG Equivalent Suite
            </span>
            <span className="text-slate-500 font-mono text-[9px]">13+ Tools</span>
          </div>

          <div className="py-2 grid grid-cols-1 sm:grid-cols-2 gap-1">
            {IMAGE_TOOLS.map((tool) => (
              <Link
                key={tool.id}
                href={tool.route}
                className="flex items-start gap-2.5 p-2 rounded-md text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-colors group"
              >
                <div className="p-1.5 rounded-md bg-slate-700/50 border border-slate-600/50 text-indigo-400 group-hover:bg-indigo-500/10 group-hover:text-indigo-300 transition-colors shrink-0">
                  {getToolIcon(tool.iconName)}
                </div>
                <div className="overflow-hidden">
                  <div className="font-semibold flex items-center gap-1.5 text-slate-100 text-xs">
                    <span className="truncate">{tool.name}</span>
                    {tool.badge && (
                      <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">{tool.shortDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
