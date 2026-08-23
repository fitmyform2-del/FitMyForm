'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  Search,
  ChevronDown,
  Layers,
  FileStack
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
      <header className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-shadow">
              <FileCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col -gap-0.5">
              <span className="font-bold text-lg tracking-tight text-slate-50 flex items-center gap-1 font-sans">
                FitMy<span className="text-indigo-400">Form</span>
              </span>
              <span className="text-[9px] text-slate-400 font-medium tracking-widest uppercase">
                Tool Suite
              </span>
            </div>
          </Link>

          {/* Quick Exam Preset Search (Central Search Bar) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-auto">
            <button
              onClick={() => setIsPresetModalOpen(true)}
              className="w-full flex items-center gap-3 bg-slate-900/50 hover:bg-slate-800 text-slate-400 hover:text-slate-200 px-4 py-2 rounded-xl text-sm border border-slate-700/50 hover:border-slate-600 transition-all shadow-inner"
            >
              <Search className="w-4 h-4" />
              <span>Search exams (SSC, UPSC, IBPS...)</span>
              <div className="ml-auto flex items-center gap-1">
                <kbd className="bg-slate-800 text-slate-300 text-[10px] font-mono font-semibold px-1.5 py-0.5 rounded border border-slate-700 shadow-sm">⌘K</kbd>
              </div>
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2 sm:gap-3">
            {/* iLoveSign Suite Dropdown */}
            <SignDropdownMenu
              isOpen={isSignMenuOpen}
              onToggle={() => {
                setIsSignMenuOpen(!isSignMenuOpen);
                setIsImageToolsMenuOpen(false);
                setIsPdfMenuOpen(false);
              }}
              onClose={() => setIsSignMenuOpen(false)}
            />

            {/* All Image Tools Dropdown */}
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
                className="flex items-center gap-1.5 min-h-[36px] text-sm font-medium px-3 py-1.5 rounded-lg text-slate-300 hover:text-slate-50 hover:bg-slate-800/80 transition-colors"
              >
                <FileStack className="w-4 h-4 text-indigo-400/80" />
                <span className="hidden sm:inline">PDF Suite</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform ${isPdfMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPdfMenuOpen && (
                <div className="fixed top-16 left-4 right-4 sm:absolute sm:top-[calc(100%+0.5rem)] sm:right-0 sm:left-auto sm:w-80 max-h-[calc(100vh-5rem)] sm:max-h-96 overflow-y-auto bg-slate-800 border border-slate-700 rounded-xl shadow-xl p-2 z-50 divide-y divide-slate-700/50">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                    <FileStack className="w-3 h-3" />
                    <span>Browser PDF Suite</span>
                  </div>
                  <div className="py-1">
                    <Link
                      href="/pdf-tools"
                      className="block px-3 py-2 rounded-md text-xs font-semibold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                    >
                      Browse All PDF Tools Hub →
                    </Link>
                  </div>
                  <div className="py-1 space-y-0.5">
                    {PDF_TOOLS.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.route}
                        className="block px-3 py-2 rounded-md text-xs text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        <div className="font-medium flex items-center justify-between">
                          <span>{tool.name}</span>
                          {tool.badge && (
                            <span className="text-[9px] font-medium text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                              {tool.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">{tool.shortDescription}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setIsPresetModalOpen(true)}
              className="flex items-center gap-1.5 min-h-[36px] text-sm font-medium px-3 py-1.5 rounded-lg text-slate-300 hover:text-slate-50 hover:bg-slate-800/80 transition-colors"
            >
              <Layers className="w-4 h-4 text-emerald-400/80" />
              <span className="hidden md:inline">Exam Presets</span>
            </button>
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
