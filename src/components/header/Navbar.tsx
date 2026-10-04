'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  Search,
  ChevronDown,
  Layers,
  FileStack,
  ShieldCheck
} from 'lucide-react';
import { PresetSelectorModal } from '../presets/PresetSelectorModal';
import { PDF_TOOLS } from '@/config/pdfToolsConfig';
import { SingleDocSpec } from '@/types/presets';
import { SignDropdownMenu } from './_components/SignDropdownMenu';
import { ImageToolsDropdownMenu } from './_components/ImageToolsDropdownMenu';

interface NavbarProps {
  onSelectPresetDoc?: (doc: SingleDocSpec, examName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectPresetDoc }) => {
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isImageToolsMenuOpen, setIsImageToolsMenuOpen] = useState(false);
  const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);
  const [isSignMenuOpen, setIsSignMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsPresetModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-white/[0.08] shadow-lg shadow-black/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4 sm:gap-6">
          {/* Brand Logo & Privacy Pill */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 shrink-0 group touch-target">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-white flex items-center gap-1 font-sans">
                  FitMy<span className="text-indigo-400">Form</span>
                </span>
                <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase -mt-0.5">
                  Studio
                </span>
              </div>
            </Link>

            <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[11px] text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side Private</span>
            </span>
          </div>

          {/* Central Quick Search (Opens 30+ Exams Modal) */}
          <div className="hidden md:flex flex-1 max-w-md mx-auto">
            <button
              onClick={() => setIsPresetModalOpen(true)}
              className="w-full flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] text-slate-400 hover:text-slate-200 px-4 py-2 min-h-[44px] rounded-xl text-xs sm:text-sm border border-white/10 hover:border-indigo-500/40 transition-all shadow-inner cursor-pointer"
            >
              <Search className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="truncate">Search 30+ exams (SSC, UPSC, IBPS, RRB)...</span>
              <kbd className="ml-auto hidden lg:inline-block bg-white/10 text-slate-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/10 shadow-sm">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            {/* Exam Presets Direct Modal Trigger */}
            <button
              onClick={() => setIsPresetModalOpen(true)}
              className="touch-target px-3 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-indigo-600/90 hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-600/25 transition-all cursor-pointer flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-white" />
              <span>Exams</span>
            </button>

            {/* Image Tools Dropdown */}
            <ImageToolsDropdownMenu
              isOpen={isImageToolsMenuOpen}
              onToggle={() => {
                setIsImageToolsMenuOpen(!isImageToolsMenuOpen);
                setIsPdfMenuOpen(false);
                setIsSignMenuOpen(false);
              }}
              onClose={() => setIsImageToolsMenuOpen(false)}
            />

            {/* PDF Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsPdfMenuOpen(!isPdfMenuOpen);
                  setIsImageToolsMenuOpen(false);
                  setIsSignMenuOpen(false);
                }}
                onBlur={() => setTimeout(() => setIsPdfMenuOpen(false), 250)}
                className="touch-target px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <FileStack className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">PDF</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isPdfMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPdfMenuOpen && (
                <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-[calc(100%+0.5rem)] sm:right-0 sm:left-auto sm:w-80 max-h-[calc(100vh-5rem)] sm:max-h-96 overflow-y-auto glass-panel-elevated rounded-2xl p-2 z-50 divide-y divide-white/10 shadow-2xl">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <FileStack className="w-3.5 h-3.5 text-cyan-400" />
                    <span>In-Browser PDF Suite</span>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/pdf-tools"
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                    >
                      Browse All PDF Tools Hub →
                    </Link>
                  </div>
                  <div className="py-1 space-y-0.5">
                    {PDF_TOOLS.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.route}
                        className="block px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.08] transition-colors"
                      >
                        <div className="font-semibold flex items-center justify-between">
                          <span>{tool.name}</span>
                          {tool.badge && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{tool.shortDescription}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* e-Sign Suite Dropdown */}
            <SignDropdownMenu
              isOpen={isSignMenuOpen}
              onToggle={() => {
                setIsSignMenuOpen(!isSignMenuOpen);
                setIsImageToolsMenuOpen(false);
                setIsPdfMenuOpen(false);
              }}
              onClose={() => setIsSignMenuOpen(false)}
            />
          </nav>
        </div>
      </header>

      {/* Preset Selector Search Modal */}
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
