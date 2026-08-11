'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, Search, FileCheck, Layers, Sparkles, Clock } from 'lucide-react';
import { PresetSelectorModal } from '../presets/PresetSelectorModal';
import { ExamPreset, SingleDocSpec } from '@/types/presets';

interface NavbarProps {
  onSelectPresetDoc?: (doc: SingleDocSpec, examName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectPresetDoc }) => {
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full glass-panel border-b border-gray-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-emerald-400 p-0.5 shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-gray-950 rounded-[10px] flex items-center justify-center">
                <FileCheck className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                FitMy<span className="gradient-text">Form</span>
              </span>
              <span className="block text-[10px] text-gray-400 -mt-1 font-medium tracking-wide">
                Document Resizer & Formatter
              </span>
            </div>
          </Link>

          {/* Search Presets Quick Button */}
          <button
            onClick={() => setIsPresetModalOpen(true)}
            className="hidden md:flex items-center gap-2 bg-gray-900/90 hover:bg-gray-800 text-gray-300 hover:text-white px-3.5 py-1.5 rounded-full text-xs border border-gray-700/60 transition-all shadow-inner"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span>Search Exam Requirements (SSC, UPSC, IBPS...)</span>
            <kbd className="bg-gray-800 text-gray-400 text-[10px] px-1.5 py-0.5 rounded border border-gray-700">⌘K</kbd>
          </button>

          {/* Nav Links */}
          <nav className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => setIsPresetModalOpen(true)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Exam Presets</span>
            </button>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800/60 transition-colors"
            >
              <Clock className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Recent</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Private (Browser-Only)</span>
            </div>
          </nav>
        </div>
      </header>

      {/* Exam Presets Search Modal */}
      {isPresetModalOpen && (
        <PresetSelectorModal
          isOpen={isPresetModalOpen}
          onClose={() => setIsPresetModalOpen(false)}
          onSelectRequirement={(docSpec, exam) => {
            if (onSelectPresetDoc) {
              onSelectPresetDoc(docSpec, exam.name);
            }
            setIsPresetModalOpen(false);
          }}
        />
      )}
    </>
  );
};
