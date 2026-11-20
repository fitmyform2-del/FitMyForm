'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  ChevronDown,
  Layers,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';
import { PresetSelectorModal } from '../presets/PresetSelectorModal';
import { PDF_TOOLS } from '@/config/pdfToolsConfig';
import { SingleDocSpec } from '@/types/presets';
import { ImageToolsDropdownMenu } from './_components/ImageToolsDropdownMenu';
import { SignDropdownMenu } from './_components/SignDropdownMenu';
import { MobileNavDrawer } from './_components/MobileNavDrawer';

interface NavbarProps {
  onSelectPresetDoc?: (doc: SingleDocSpec, examName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectPresetDoc }) => {
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isImageToolsMenuOpen, setIsImageToolsMenuOpen] = useState(false);
  const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);
  const [isSignMenuOpen, setIsSignMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <header className="sticky top-0 z-50 w-full bg-[#0d1322]/95 backdrop-blur-md border-b border-white/[0.08] shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
                <FileCheck className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-black text-lg tracking-tight text-white flex items-center">
                  FitMy<span className="text-blue-400">Form</span>
                </span>
                <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase -mt-0.5">
                  Image & Exam Studio
                </span>
              </div>
            </Link>

            <span className="hidden xl:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Client-Side</span>
            </span>
          </div>

          {/* Desktop Direct Tool Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-bold uppercase tracking-wider">
            <Link href="/image-compressor" className="px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors">
              Compress
            </Link>
            <Link href="/photo-resizer" className="px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors">
              Resize
            </Link>
            <Link href="/crop-image" className="px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors">
              Crop
            </Link>
            <Link href="/convert-to-jpg" className="px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors">
              Convert to JPG
            </Link>
            <Link href="/photo-editor" className="px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors">
              Editor
            </Link>
            <Link href="/whiteboard" className="px-2.5 py-1.5 rounded-lg text-indigo-300 hover:text-white hover:bg-indigo-600/20 transition-colors">
              Whiteboard
            </Link>

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
                className="px-2.5 py-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-white/[0.08] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>PDF</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isPdfMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPdfMenuOpen && (
                <div className="absolute top-[calc(100%+0.5rem)] right-0 w-80 max-h-96 overflow-y-auto bg-[#131a2c] border border-white/10 rounded-2xl p-2 z-50 divide-y divide-white/10 shadow-2xl">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase text-slate-400 tracking-wider flex items-center justify-between">
                    <span>PDF Suite</span>
                    <Link href="/pdf-tools" className="text-blue-400 hover:underline">All Tools →</Link>
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

          {/* Right Action: Exam Presets Trigger */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPresetModalOpen(true)}
              className="touch-target px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all shadow-md shadow-blue-600/30 flex items-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              <span>Exam Presets</span>
              <kbd className="hidden md:inline-block bg-white/20 text-[10px] px-1.5 py-0.5 rounded font-mono font-normal">
                ⌘K
              </kbd>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden touch-target p-2 text-slate-300 hover:text-white hover:bg-white/[0.08] rounded-xl"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <MobileNavDrawer
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
          onOpenPresets={() => setIsPresetModalOpen(true)}
        />
      </header>

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
