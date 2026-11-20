'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, Sparkles } from 'lucide-react';
import { IMAGE_TOOLS, ImageToolConfig } from '@/config/imageToolsConfig';
import { getToolIcon } from '@/components/home/HomeToolIcon';

interface ImageToolsDropdownMenuProps {
  isOpen: boolean;
  isActive: boolean;
  pathname: string;
  onToggle: () => void;
  onClose: () => void;
}

const GROUPS: { title: string; ids: string[] }[] = [
  {
    title: 'Optimize & Resize',
    ids: ['compress-image', 'resize-image', 'upscale-image', 'remove-background']
  },
  {
    title: 'Edit & Create',
    ids: ['crop-image', 'rotate-image', 'photo-editor', 'meme-generator', 'html-to-image']
  },
  {
    title: 'Convert & Privacy',
    ids: ['convert-to-jpg', 'convert-from-jpg', 'watermark-image', 'blur-face']
  }
];

export function ImageToolsDropdownMenu({
  isOpen,
  isActive,
  pathname,
  onToggle,
  onClose
}: ImageToolsDropdownMenuProps) {
  const byId = new Map<string, ImageToolConfig>(IMAGE_TOOLS.map((t) => [t.id, t]));

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
        <span>Image Tools</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+0.65rem)] left-1/2 -translate-x-1/2 w-[680px] max-w-[92vw] bg-[#0f1525]/98 backdrop-blur-2xl border border-white/12 rounded-2xl shadow-2xl shadow-black/60 p-4 z-50 animate-fade-in">
          <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-white/[0.08]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" />
              Image & Photo Studio
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">100% In-Browser • Zero Uploads</span>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {GROUPS.map((group) => (
              <div key={group.title} className="space-y-1.5">
                <div className="px-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {group.ids.map((id) => {
                    const tool = byId.get(id);
                    if (!tool) return null;
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
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center shrink-0 [&>svg]:w-4 [&>svg]:h-4">
                          {getToolIcon(tool.iconName)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-slate-100 group-hover:text-white truncate">
                            {tool.name}
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">{tool.shortDescription}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
