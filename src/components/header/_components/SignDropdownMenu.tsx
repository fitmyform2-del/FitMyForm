'use client';

import React from 'react';
import Link from 'next/link';
import { PenTool, Sparkles, Award, ShieldCheck, Scale, ChevronDown, ArrowRight } from 'lucide-react';

interface SignDropdownMenuProps {
  isOpen: boolean;
  isActive: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function SignDropdownMenu({ isOpen, isActive, onToggle, onClose }: SignDropdownMenuProps) {
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
        <span>e-Sign</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-400' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+0.65rem)] right-0 w-[340px] bg-[#0f1525]/98 backdrop-blur-2xl border border-white/12 rounded-2xl shadow-2xl shadow-black/60 p-3 z-50 space-y-2.5 animate-fade-in">
          <Link
            href="/pdf-tools/sign"
            onClick={onClose}
            className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 hover:text-emerald-200 transition-colors group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-white">Fill & e-Sign PDF</div>
                <div className="text-[10px] text-emerald-300/80">Visual signing + SHA-256 audit</div>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <div className="space-y-0.5 pt-1 border-t border-white/[0.08]" onClick={onClose}>
            <Link
              href="/esignature-features"
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>eSignature Features</span>
            </Link>
            <Link
              href="/esignature-compliance-standards"
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <Award className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Compliance Standards (SES / AES)</span>
            </Link>
            <Link
              href="/esignature-security"
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Security & Zero-Server Trust</span>
            </Link>
            <Link
              href="/legal-validity"
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              <Scale className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Legal Validity & Enforceability</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-white/[0.08] space-y-1.5" onClick={onClose}>
            <div className="px-2 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
              Industries
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/esignatures-for-insurance" className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg">Insurance</Link>
              <Link href="/esignatures-for-real-estate" className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg">Real Estate</Link>
              <Link href="/esignatures-for-financial-services" className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg">Finance</Link>
              <Link href="/esignatures-for-legal-services" className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg">Legal</Link>
              <Link href="/esignatures-for-human-resources" className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg">HR & Hiring</Link>
              <Link href="/esignatures-for-sales" className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-white/[0.06] rounded-lg">B2B Sales</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
