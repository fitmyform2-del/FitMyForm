'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search, ChevronDown, ShieldCheck, Clock, Presentation, PenTool,
  GraduationCap, Image as ImageIcon, FileText
} from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  pathname: string;
  onClose: () => void;
  onOpenPresets: () => void;
}

const SECTIONS = [
  {
    id: 'exams',
    label: 'Exam Forms & Presets',
    icon: GraduationCap,
    color: 'text-amber-400',
    links: [
      { href: '/exam-kit', label: 'All-in-One Exam Kit (Batch ZIP)' },
      { href: '/ssc-photo-resizer', label: 'SSC Photo Resizer (20–50 KB)' },
      { href: '/signature-resizer', label: 'Signature Resizer (140×60)' },
      { href: '/photo-resizer', label: 'Passport Photo Resizer' },
      { href: '/exam/upsc-civil-services', label: 'UPSC CSE / NDA / CDS' },
      { href: '/exam/nta-neet-jee', label: 'NTA NEET / JEE / CUET' },
      { href: '/presets', label: 'Browse All 40 Exam Presets' }
    ]
  },
  {
    id: 'images',
    label: 'Image Tools',
    icon: ImageIcon,
    color: 'text-blue-400',
    links: [
      { href: '/image-compressor', label: 'Compress Image to KB' },
      { href: '/crop-image', label: 'Crop Image' },
      { href: '/convert-to-jpg', label: 'Convert to JPG' },
      { href: '/jpg-to-image', label: 'Convert JPG to PNG / WEBP' },
      { href: '/remove-background', label: 'Remove Background' },
      { href: '/upscale-image', label: 'Upscale Image (2× / 4×)' },
      { href: '/photo-editor', label: 'Photo Editor' },
      { href: '/rotate-image', label: 'Rotate & Flip' },
      { href: '/blur-face', label: 'Blur Face / Censor' },
      { href: '/watermark-image', label: 'Watermark Image' },
      { href: '/meme-generator', label: 'Meme Generator' },
      { href: '/html-to-image', label: 'HTML to Image' }
    ]
  },
  {
    id: 'pdf',
    label: 'PDF Tools Suite',
    icon: FileText,
    color: 'text-rose-400',
    links: [
      { href: '/pdf-tools', label: 'All PDF Tools Hub' },
      { href: '/pdf-tools/compress', label: 'Compress PDF' },
      { href: '/pdf-tools/merge', label: 'Merge PDF' },
      { href: '/pdf-tools/split', label: 'Split PDF' },
      { href: '/pdf-tools/jpg-to-pdf', label: 'JPG to PDF' },
      { href: '/pdf-tools/pdf-to-jpg', label: 'PDF to JPG' },
      { href: '/pdf-tools/sign', label: 'Fill & e-Sign PDF' },
      { href: '/pdf-tools/redact', label: 'Redact Sensitive PDF' },
      { href: '/pdf-tools/edit', label: 'Edit & Annotate PDF' },
      { href: '/pdf-tools/unlock', label: 'Unlock PDF' }
    ]
  }
];

export function MobileNavDrawer({ isOpen, pathname, onClose, onOpenPresets }: MobileNavDrawerProps) {
  const [openSection, setOpenSection] = useState<string>('exams');

  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-white/10 bg-[#0b101e]/98 backdrop-blur-2xl max-h-[calc(100vh-4rem)] overflow-y-auto px-4 py-4 space-y-3 animate-fade-in">
      {/* Quick Exam Preset Search */}
      <button
        type="button"
        onClick={() => {
          onClose();
          onOpenPresets();
        }}
        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/25 cursor-pointer"
      >
        <Search className="w-4 h-4" />
        <span>Search 30+ Exam Presets</span>
      </button>

      {/* Direct Highlighted Shortcuts */}
      <div className="grid grid-cols-2 gap-2">
        <Link
          href="/pdf-tools/sign"
          onClick={onClose}
          className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            pathname === '/pdf-tools/sign'
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
              : 'bg-white/[0.04] border-white/[0.08] text-slate-200'
          }`}
        >
          <PenTool className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>e-Sign PDF</span>
        </Link>
        <Link
          href="/whiteboard"
          onClick={onClose}
          className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
            pathname === '/whiteboard'
              ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-200'
              : 'bg-white/[0.04] border-white/[0.08] text-slate-200'
          }`}
        >
          <Presentation className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Whiteboard</span>
        </Link>
      </div>

      {/* Collapsible Tool Categories */}
      <div className="space-y-2">
        {SECTIONS.map((sec) => {
          const Icon = sec.icon;
          const expanded = openSection === sec.id;
          return (
            <div key={sec.id} className="rounded-xl bg-white/[0.03] border border-white/[0.07] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSection(expanded ? '' : sec.id)}
                className="w-full px-3.5 py-3 flex items-center justify-between text-xs font-bold text-white cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${sec.color}`} />
                  <span>{sec.label}</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>

              {expanded && (
                <div className="px-2.5 pb-2.5 grid grid-cols-1 sm:grid-cols-2 gap-1 border-t border-white/[0.06] pt-2">
                  {sec.links.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        pathname === item.href
                          ? 'bg-blue-600/25 text-white font-bold'
                          : 'text-slate-300 hover:bg-white/[0.06] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Utility Row */}
      <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
        <Link
          href="/dashboard"
          onClick={onClose}
          className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white font-semibold py-1"
        >
          <Clock className="w-3.5 h-3.5 text-blue-400" />
          <span>Recent Sessions</span>
        </Link>
        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>100% Client-Side</span>
        </span>
      </div>
    </div>
  );
}
