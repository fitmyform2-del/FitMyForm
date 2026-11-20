'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, GraduationCap, Camera, PenTool, FileCheck, Layers, ArrowRight, Sparkles } from 'lucide-react';

interface ExamFormsDropdownMenuProps {
  isOpen: boolean;
  isActive: boolean;
  pathname: string;
  onToggle: () => void;
  onClose: () => void;
  onOpenPresets: () => void;
}

const POPULAR_EXAM_LINKS = [
  { href: '/exam-kit', title: 'All-in-One Exam Kit', spec: 'Photo + Sign + Thumb ZIP', icon: Layers, badge: 'New' },
  { href: '/ssc-photo-resizer', title: 'SSC Photo Resizer', spec: '200×230 px • 20–50 KB', icon: Camera, badge: 'Popular' },
  { href: '/signature-resizer', title: 'Signature Resizer', spec: '140×60 px • 10–20 KB', icon: PenTool, badge: 'Official' },
  { href: '/exam/upsc-civil-services', title: 'UPSC CSE / NDA / CDS', spec: '350×350 px • 20–300 KB', icon: GraduationCap },
  { href: '/exam/nta-neet-jee', title: 'NTA NEET / JEE / CUET', spec: '350×450 px • 10–200 KB', icon: GraduationCap },
  { href: '/exam/ibps-banking', title: 'IBPS & SBI Banking', spec: '200×230 px • 20–50 KB', icon: GraduationCap },
  { href: '/exam/rrb-railway', title: 'Railway RRB Portal', spec: '350×450 & 140×60 px', icon: PenTool },
  { href: '/exam/gate-exam', title: 'GATE / PAN / US Visa', spec: '40+ Dedicated Exam Pages', icon: FileCheck }
];

export function ExamFormsDropdownMenu({
  isOpen,
  isActive,
  pathname,
  onToggle,
  onClose,
  onOpenPresets
}: ExamFormsDropdownMenuProps) {
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
        <span>Exam Forms</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+0.65rem)] left-0 w-[520px] bg-[#0f1525]/98 backdrop-blur-2xl border border-white/12 rounded-2xl shadow-2xl shadow-black/60 p-3 z-50 animate-fade-in">
          <div className="flex items-center justify-between px-2.5 pb-2.5 mb-2 border-b border-white/[0.08]">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Official 2025–2026 Exam Resizers
            </span>
            <Link
              href="/presets"
              onClick={onClose}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>All Presets</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {POPULAR_EXAM_LINKS.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl transition-colors group ${
                    active ? 'bg-blue-600/20 border border-blue-500/30' : 'hover:bg-white/[0.06] border border-transparent'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-100 group-hover:text-white truncate">{item.title}</span>
                      {item.badge && (
                        <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate mt-0.5">{item.spec}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="mt-2.5 pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-2 px-1">
            <span className="text-[11px] text-slate-400">Need NEET, JEE, PAN, or State PSC specs?</span>
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPresets();
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/35 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Search Preset DB</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
