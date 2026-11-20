'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  FileCheck,
  Search,
  Clock,
  Presentation,
  Menu,
  X
} from 'lucide-react';
import { PresetSelectorModal } from '../presets/PresetSelectorModal';
import { SingleDocSpec } from '@/types/presets';
import { ExamFormsDropdownMenu } from './_components/ExamFormsDropdownMenu';
import { ImageToolsDropdownMenu } from './_components/ImageToolsDropdownMenu';
import { PdfToolsDropdownMenu } from './_components/PdfToolsDropdownMenu';
import { SignDropdownMenu } from './_components/SignDropdownMenu';
import { MobileNavDrawer } from './_components/MobileNavDrawer';

interface NavbarProps {
  onSelectPresetDoc?: (doc: SingleDocSpec, examName: string) => void;
}

type OpenMenu = 'exams' | 'images' | 'pdf' | 'sign' | null;

const EXAM_ROUTES = ['/ssc-photo-resizer', '/signature-resizer', '/photo-resizer', '/ctet-photo-resizer', '/uptet-photo-resizer', '/presets', '/resize-photo-for-online-form'];
const IMAGE_ROUTES = ['/image-compressor', '/crop-image', '/convert-to-jpg', '/jpg-to-image', '/image-to-jpg', '/image-to-png', '/photo-editor', '/upscale-image', '/remove-background', '/watermark-image', '/meme-generator', '/rotate-image', '/blur-face', '/html-to-image'];
const SIGN_ROUTES = ['/pdf-tools/sign', '/esignature-features', '/esignature-compliance-standards', '/esignature-security', '/legal-validity'];

export const Navbar: React.FC<NavbarProps> = ({ onSelectPresetDoc }) => {
  const router = useRouter();
  const pathname = usePathname() || '/';
  const headerRef = useRef<HTMLElement>(null);

  const [openMenu, setOpenMenu] = useState<OpenMenu>(null);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = (menu: Exclude<OpenMenu, null>) => {
    setOpenMenu((prev) => (prev === menu ? null : menu));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpenMenu(null);
        setIsPresetModalOpen(true);
      } else if (e.key === 'Escape') {
        setOpenMenu(null);
        setIsPresetModalOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isExamActive = EXAM_ROUTES.includes(pathname);
  const isImageActive = IMAGE_ROUTES.includes(pathname);
  const isSignActive = SIGN_ROUTES.includes(pathname) || pathname.startsWith('/esignatures-for-');
  const isPdfActive = (pathname.startsWith('/pdf-tools') && pathname !== '/pdf-tools/sign') || pathname === '/pdf-compressor';
  const isWhiteboardActive = pathname === '/whiteboard';

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 w-full bg-[#090d18]/85 backdrop-blur-xl border-b border-white/[0.08] supports-[backdrop-filter]:bg-[#090d18]/75"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand Logo */}
          <Link
            href="/"
            onClick={() => setOpenMenu(null)}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 flex items-center justify-center shadow-md shadow-blue-600/30 group-hover:scale-105 transition-transform">
              <FileCheck className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-[17px] tracking-tight text-white">
              FitMy<span className="text-blue-400">Form</span>
            </span>
          </Link>

          {/* Center: 5 Clean, Unified Navigation Pillars */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1">
            <ExamFormsDropdownMenu
              isOpen={openMenu === 'exams'}
              isActive={isExamActive}
              pathname={pathname}
              onToggle={() => toggleMenu('exams')}
              onClose={() => setOpenMenu(null)}
              onOpenPresets={() => setIsPresetModalOpen(true)}
            />

            <ImageToolsDropdownMenu
              isOpen={openMenu === 'images'}
              isActive={isImageActive}
              pathname={pathname}
              onToggle={() => toggleMenu('images')}
              onClose={() => setOpenMenu(null)}
            />

            <PdfToolsDropdownMenu
              isOpen={openMenu === 'pdf'}
              isActive={isPdfActive}
              pathname={pathname}
              onToggle={() => toggleMenu('pdf')}
              onClose={() => setOpenMenu(null)}
            />

            <SignDropdownMenu
              isOpen={openMenu === 'sign'}
              isActive={isSignActive}
              onToggle={() => toggleMenu('sign')}
              onClose={() => setOpenMenu(null)}
            />

            <Link
              href="/whiteboard"
              onClick={() => setOpenMenu(null)}
              className={`h-9 px-3 rounded-lg text-[13px] font-semibold flex items-center gap-1.5 transition-all ${
                isWhiteboardActive
                  ? 'text-white bg-indigo-600/30 border border-indigo-500/40'
                  : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              <Presentation className="w-3.5 h-3.5 text-indigo-400" />
              <span>Whiteboard</span>
            </Link>
          </nav>

          {/* Right: Command-style Exam Preset Trigger + History + Mobile Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                setOpenMenu(null);
                setIsPresetModalOpen(true);
              }}
              className="h-9 px-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-blue-500/40 text-xs font-semibold text-slate-200 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Exam Presets</span>
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[10px] font-mono text-slate-400">
                ⌘K
              </kbd>
            </button>

            <Link
              href="/dashboard"
              title="Recent Sessions"
              aria-label="Recent Sessions"
              className={`hidden sm:inline-flex w-9 h-9 rounded-xl items-center justify-center border transition-colors ${
                pathname === '/dashboard'
                  ? 'bg-blue-600/25 border-blue-500/40 text-blue-300'
                  : 'bg-white/[0.04] hover:bg-white/[0.09] border-white/10 text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-9 h-9 flex items-center justify-center text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 rounded-xl cursor-pointer"
              aria-label="Toggle Menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <MobileNavDrawer
          isOpen={isMobileMenuOpen}
          pathname={pathname}
          onClose={() => setIsMobileMenuOpen(false)}
          onOpenPresets={() => setIsPresetModalOpen(true)}
        />
      </header>

      {isPresetModalOpen && (
        <PresetSelectorModal
          isOpen={isPresetModalOpen}
          onClose={() => setIsPresetModalOpen(false)}
          onSelectRequirement={(docSpec, exam, docKey) => {
            setIsPresetModalOpen(false);
            if (onSelectPresetDoc) {
              onSelectPresetDoc(docSpec, exam.name);
            } else if (docSpec.format.length === 1 && docSpec.format[0] === 'PDF') {
              router.push(`/pdf-tools/compress?targetKB=${docSpec.maxSizeKB}&preset=${encodeURIComponent(exam.id)}&doc=${encodeURIComponent(docKey)}`);
            } else {
              router.push(`/photo-resizer?preset=${encodeURIComponent(exam.id)}&doc=${encodeURIComponent(docKey)}`);
            }
          }}
        />
      )}
    </>
  );
};
