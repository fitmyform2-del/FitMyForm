'use client';

import React from 'react';
import {
  Camera,
  PenTool,
  Fingerprint,
  FileText,
  CreditCard,
  GraduationCap,
  Award,
  File
} from 'lucide-react';
import { DocumentType } from '@/types/document';
import { DOCUMENT_TYPE_LABELS } from '@/config/presets';

interface DocCategorySelectorProps {
  currentType: DocumentType;
  onSelectType: (type: DocumentType, defaults: { width: number; height: number; minKB: number; maxKB: number }) => void;
}

export function DocCategorySelector({ currentType, onSelectType }: DocCategorySelectorProps) {
  const handleSelect = (docType: DocumentType) => {
    const meta = DOCUMENT_TYPE_LABELS[docType] || DOCUMENT_TYPE_LABELS['other'];
    onSelectType(docType, {
      width: meta.defaultWidth,
      height: meta.defaultHeight,
      minKB: meta.minKB,
      maxKB: meta.maxKB
    });
  };

  return (
    <div className="space-y-2.5">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
        Document Type Category:
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[
          { type: 'photo', label: 'Passport Photo', icon: Camera },
          { type: 'signature', label: 'Signature', icon: PenTool },
          { type: 'thumb', label: 'Thumb Print', icon: Fingerprint },
          { type: 'declaration', label: 'Declaration', icon: FileText },
          { type: 'aadhaar', label: 'Aadhaar / ID', icon: CreditCard },
          { type: 'marksheet', label: 'Marksheet', icon: GraduationCap },
          { type: 'certificate', label: 'Certificate', icon: Award },
          { type: 'other', label: 'Other File', icon: File }
        ].map((item) => {
          const IconComp = item.icon;
          const isSelected = currentType === item.type;
          return (
            <button
              key={item.type}
              type="button"
              onClick={() => handleSelect(item.type as DocumentType)}
              className={`p-3 min-h-[44px] rounded-2xl border text-xs font-bold flex items-center gap-2.5 transition-all ${
                isSelected
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 border-indigo-400 text-white shadow-lg shadow-indigo-600/30 scale-[1.02]'
                  : 'bg-white/[0.03] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white hover:border-white/20'
              }`}
            >
              <IconComp className={`w-4 h-4 shrink-0 ${isSelected ? 'text-white' : 'text-indigo-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
