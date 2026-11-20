'use client';

import React from 'react';
import Link from 'next/link';
import { Layers } from 'lucide-react';

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPresets: () => void;
}

export function MobileNavDrawer({ isOpen, onClose, onOpenPresets }: MobileNavDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="lg:hidden border-t border-white/10 bg-[#0d1322] px-4 py-4 space-y-3">
      <div className="grid grid-cols-2 gap-2 text-xs font-bold">
        {[
          { href: '/image-compressor', label: 'Compress IMAGE' },
          { href: '/photo-resizer', label: 'Resize IMAGE' },
          { href: '/crop-image', label: 'Crop IMAGE' },
          { href: '/convert-to-jpg', label: 'Convert to JPG' },
          { href: '/photo-editor', label: 'Photo Editor' },
          { href: '/whiteboard', label: 'Whiteboard' },
          { href: '/remove-background', label: 'Remove BG' },
          { href: '/upscale-image', label: 'Upscale Image' },
          { href: '/pdf-tools', label: 'PDF Tools Hub' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="p-2.5 rounded-xl bg-white/[0.04] text-slate-200 hover:bg-white/[0.08]"
          >
            {item.label}
          </Link>
        ))}
      </div>
      <button
        onClick={() => {
          onClose();
          onOpenPresets();
        }}
        className="w-full py-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer"
      >
        <Layers className="w-4 h-4" />
        <span>Search 30+ Exam Presets</span>
      </button>
    </div>
  );
}
