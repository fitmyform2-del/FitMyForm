'use client';

import React from 'react';
import Link from 'next/link';
import { PenTool, Sparkles, Award, ShieldCheck, Scale, ChevronDown } from 'lucide-react';

interface SignDropdownMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export function SignDropdownMenu({ isOpen, onToggle, onClose }: SignDropdownMenuProps) {
  return (
    <div className="relative">
      <button
        onClick={onToggle}
        onBlur={() => setTimeout(onClose, 250)}
        className="flex items-center gap-1.5 min-h-[36px] text-sm font-medium px-3 py-1.5 rounded-lg text-slate-300 hover:text-slate-50 hover:bg-slate-800/80 transition-colors"
      >
        <PenTool className="w-4 h-4 text-emerald-400/80" />
        <span className="hidden sm:inline">iLoveSign</span>
        <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-[calc(100%+0.5rem)] sm:right-0 sm:left-auto sm:w-[340px] max-h-[calc(100vh-5rem)] overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-2 z-50 divide-y divide-slate-700/50">
          <div className="px-3 py-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <PenTool className="w-3 h-3 text-emerald-400" />
              iLoveSign e-Sign Suite
            </span>
            <span className="text-slate-500 font-mono text-[9px]">eIDAS Compliant</span>
          </div>

          <div className="py-2 space-y-1">
            <Link
              href="/pdf-tools/sign"
              className="flex items-center gap-2.5 p-2 rounded-md text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 transition-colors"
            >
              <PenTool className="w-4 h-4" />
              <span>Fill & e-Sign PDF Workspace →</span>
            </Link>
            <Link
              href="/esignature-features"
              className="flex items-center gap-2.5 p-2 rounded-md text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>eSignature Features</span>
            </Link>
            <Link
              href="/esignature-compliance-standards"
              className="flex items-center gap-2.5 p-2 rounded-md text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <Award className="w-4 h-4 text-cyan-400" />
              <span>Signature Standards (SES, AES, QES)</span>
            </Link>
            <Link
              href="/esignature-security"
              className="flex items-center gap-2.5 p-2 rounded-md text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Security & Zero-Server Trust</span>
            </Link>
            <Link
              href="/legal-validity"
              className="flex items-center gap-2.5 p-2 rounded-md text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <Scale className="w-4 h-4 text-amber-400" />
              <span>Legal Validity & Enforceability</span>
            </Link>
          </div>

          <div className="pt-2 space-y-1">
            <div className="px-3 py-1 text-[9px] font-bold uppercase text-slate-500 tracking-wider">
              Industries Solutions
            </div>
            <div className="grid grid-cols-2 gap-1 text-[11px]">
              <Link href="/esignatures-for-insurance" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md">Insurance</Link>
              <Link href="/esignatures-for-real-estate" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md">Real Estate</Link>
              <Link href="/esignatures-for-financial-services" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md">Finance</Link>
              <Link href="/esignatures-for-legal-services" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md">Legal</Link>
              <Link href="/esignatures-for-human-resources" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md">HR & Hiring</Link>
              <Link href="/esignatures-for-sales" className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md">B2B Sales</Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
