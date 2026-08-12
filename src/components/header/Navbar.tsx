'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCheck,
  Search,
  ChevronDown,
  Sparkles,
  Minimize2,
  Maximize2,
  Crop,
  FileImage,
  Repeat,
  Wand2,
  Eraser,
  Shield,
  Smile,
  RotateCw,
  Code,
  EyeOff,
  Layers,
  Clock,
  FileStack,
  Image as ImageIcon
} from 'lucide-react';
import { PresetSelectorModal } from '../presets/PresetSelectorModal';
import { PDF_TOOLS } from '@/config/pdfToolsConfig';
import { IMAGE_TOOLS } from '@/config/imageToolsConfig';
import { SingleDocSpec } from '@/types/presets';

interface NavbarProps {
  onSelectPresetDoc?: (doc: SingleDocSpec, examName: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSelectPresetDoc }) => {
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isImageToolsMenuOpen, setIsImageToolsMenuOpen] = useState(false);
  const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);

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

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Minimize2': return <Minimize2 className="w-4 h-4 text-emerald-400" />;
      case 'Maximize2': return <Maximize2 className="w-4 h-4 text-cyan-400" />;
      case 'Crop': return <Crop className="w-4 h-4 text-indigo-400" />;
      case 'FileImage': return <FileImage className="w-4 h-4 text-amber-400" />;
      case 'Repeat': return <Repeat className="w-4 h-4 text-cyan-400" />;
      case 'Wand2': return <Wand2 className="w-4 h-4 text-pink-400" />;
      case 'Sparkles': return <Sparkles className="w-4 h-4 text-emerald-400" />;
      case 'Eraser': return <Eraser className="w-4 h-4 text-indigo-400" />;
      case 'Shield': return <Shield className="w-4 h-4 text-blue-400" />;
      case 'Smile': return <Smile className="w-4 h-4 text-amber-400" />;
      case 'RotateCw': return <RotateCw className="w-4 h-4 text-cyan-400" />;
      case 'Code': return <Code className="w-4 h-4 text-purple-400" />;
      case 'EyeOff': return <EyeOff className="w-4 h-4 text-rose-400" />;
      default: return <ImageIcon className="w-4 h-4 text-indigo-400" />;
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-[#080b11]/85 backdrop-blur-2xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-blue-500 to-emerald-400 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-10 h-10 rounded-xl bg-[#0d121e] border border-white/15 flex items-center justify-center shadow-inner">
                <FileCheck className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5 font-sans">
                FitMy<span className="gradient-text font-black">Form</span>
              </span>
              <span className="block text-[10px] text-indigo-300/80 -mt-1 font-semibold tracking-wider uppercase">
                iLoveIMG & Document Suite
              </span>
            </div>
          </Link>

          {/* Quick Exam Preset Search */}
          <button
            onClick={() => setIsPresetModalOpen(true)}
            className="hidden lg:flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 hover:text-white px-4 py-2 rounded-full text-xs font-medium border border-white/10 hover:border-indigo-500/40 transition-all shadow-inner group"
          >
            <Search className="w-3.5 h-3.5 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span className="text-slate-300">Search Exam Presets (SSC, UPSC, IBPS, CTET...)</span>
            <kbd className="bg-white/10 text-indigo-300 text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-white/10 shadow-sm">⌘K</kbd>
          </button>

          {/* Navigation Links */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            {/* All Image Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsImageToolsMenuOpen(!isImageToolsMenuOpen);
                  setIsPdfMenuOpen(false);
                }}
                onBlur={() => setTimeout(() => setIsImageToolsMenuOpen(false), 250)}
                className="flex items-center gap-1.5 text-xs font-extrabold px-3.5 py-2 rounded-xl text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-all shadow-sm cursor-pointer"
              >
                <ImageIcon className="w-4 h-4 text-indigo-400" />
                <span>All Image Tools</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isImageToolsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isImageToolsMenuOpen && (
                <div className="absolute top-full right-0 lg:left-0 lg:right-auto mt-2 w-[340px] sm:w-[420px] max-h-[500px] overflow-y-auto bg-[#0d121e] border border-white/15 rounded-2xl shadow-2xl p-3 z-50 divide-y divide-white/10 backdrop-blur-2xl animate-fade-in">
                  <div className="px-3 py-2 text-[10px] font-black uppercase text-indigo-400 tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                      iLoveIMG Equivalent Suite
                    </span>
                    <span className="text-slate-400 font-mono text-[9px]">13+ Tools</span>
                  </div>

                  <div className="py-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {IMAGE_TOOLS.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.route}
                        className="flex items-start gap-2.5 p-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-white/[0.04] border border-white/10 group-hover:scale-105 transition-transform shrink-0">
                          {getToolIcon(tool.iconName)}
                        </div>
                        <div className="overflow-hidden">
                          <div className="font-bold flex items-center gap-1.5 text-white text-xs">
                            <span className="truncate">{tool.name}</span>
                            {tool.badge && (
                              <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1 py-0.2 rounded border border-emerald-500/30">
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

            {/* PDF Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsPdfMenuOpen(!isPdfMenuOpen);
                  setIsImageToolsMenuOpen(false);
                }}
                onBlur={() => setTimeout(() => setIsPdfMenuOpen(false), 250)}
                className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer"
              >
                <FileStack className="w-4 h-4 text-cyan-400" />
                <span className="hidden sm:inline">PDF Suite</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isPdfMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isPdfMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[#0d121e] border border-white/15 rounded-2xl shadow-2xl p-2.5 z-50 divide-y divide-white/10 backdrop-blur-2xl">
                  <div className="px-3 py-2 text-[10px] font-black uppercase text-indigo-400 tracking-wider flex items-center gap-1.5">
                    <FileStack className="w-3 h-3 text-cyan-400" />
                    <span>Browser PDF Suite</span>
                  </div>
                  <div className="py-1.5">
                    <Link
                      href="/pdf-tools"
                      className="block px-3 py-2 rounded-xl text-xs font-bold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 transition-colors"
                    >
                      Browse All PDF Tools Hub →
                    </Link>
                  </div>
                  <div className="py-1 space-y-1">
                    {PDF_TOOLS.map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.route}
                        className="block px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/[0.06] transition-colors"
                      >
                        <div className="font-bold flex items-center justify-between">
                          <span>{tool.name}</span>
                          {tool.badge && (
                            <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
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
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all cursor-pointer"
            >
              <Layers className="w-4 h-4 text-emerald-400" />
              <span className="hidden md:inline">Exam Presets</span>
            </button>

            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
            >
              <Clock className="w-4 h-4 text-cyan-400" />
              <span className="hidden lg:inline">History</span>
            </Link>
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
