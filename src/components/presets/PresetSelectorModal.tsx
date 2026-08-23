'use client';

import React, { useState, useMemo } from 'react';
import { X, Search, FileText, ArrowRight, Sparkles } from 'lucide-react';
import { EXAM_PRESETS } from '@/config/presets';
import { ExamPreset, SingleDocSpec } from '@/types/presets';

interface PresetSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRequirement: (docSpec: SingleDocSpec, exam: ExamPreset) => void;
}

export const PresetSelectorModal: React.FC<PresetSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectRequirement
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredPresets = useMemo(() => {
    return EXAM_PRESETS.filter((exam) => {
      const matchesCategory =
        selectedCategory === 'all' || exam.category === selectedCategory;

      const term = searchTerm.toLowerCase().trim();
      if (!term) return matchesCategory;

      const nameMatch = exam.name.toLowerCase().includes(term);
      const orgMatch = exam.organization.toLowerCase().includes(term);
      const docMatch = Object.values(exam.documents).some(
        (doc) => doc && doc.title.toLowerCase().includes(term)
      );

      return matchesCategory && (nameMatch || orgMatch || docMatch);
    });
  }, [searchTerm, selectedCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="glass-panel-antigravity rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative backdrop-blur-2xl">
        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between bg-[#080b11]/90">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2.5 tracking-tight">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shadow-inner">
                <Search className="w-4 h-4 text-indigo-400" />
              </div>
              <span>Search Official Exam Requirement Database</span>
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Select any exam requirement preset to automatically set exact format, KB range limits, & pixel dimensions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-2xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-all border border-transparent hover:border-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 sm:p-5 bg-[#0d121e]/80 border-b border-white/10 space-y-3.5">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400" />
            <input
              type="text"
              placeholder="Search exam e.g. 'SSC CGL Photo', 'UPTET Signature', 'NEET', 'UPSC'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#080b11] text-white pl-11 pr-4 py-3 min-h-[44px] rounded-2xl border border-white/15 text-sm focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-400 shadow-inner"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-white text-xs bg-white/10 px-2.5 py-1.5 min-h-[36px] rounded-lg border border-white/10 cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { id: 'all', label: 'All Exams' },
              { id: 'national', label: 'National (SSC/UPSC)' },
              { id: 'banking', label: 'Banking & IBPS' },
              { id: 'railway', label: 'Railway RRB' },
              { id: 'teaching', label: 'CTET / UPTET' },
              { id: 'state', label: 'State Exams' },
              { id: 'other', label: 'General / PDF' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 min-h-[44px] rounded-xl font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-600/35 border border-indigo-400'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/10'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {filteredPresets.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <FileText className="w-12 h-12 mx-auto text-slate-500 mb-3" />
              <p className="font-bold text-white text-base">No preset found matching &quot;{searchTerm}&quot;</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                You can still use Custom Specifications mode on the main screen to enter custom dimensions and KB limits.
              </p>
            </div>
          ) : (
            filteredPresets.map((exam) => (
              <div key={exam.id} className="bg-[#080b11]/80 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 shadow-inner">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight">{exam.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{exam.organization}</p>
                  </div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-indigo-300 bg-indigo-500/20 border border-indigo-500/30 px-3 py-1 rounded-full">
                    {exam.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {Object.entries(exam.documents).map(([key, doc]) => {
                    if (!doc) return null;
                    return (
                      <div
                        key={key}
                        className="antigravity-card-3d p-4 rounded-xl flex flex-col justify-between cursor-pointer group"
                        onClick={() => onSelectRequirement(doc, exam)}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-extrabold text-white text-xs group-hover:text-indigo-300 transition-colors flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                              {doc.title}
                            </span>
                            <span className="text-[10px] bg-white/10 text-slate-200 px-2 py-0.5 rounded font-mono font-bold">
                              {doc.format.join(', ')}
                            </span>
                          </div>

                          <div className="text-xs text-slate-300 space-y-1 font-mono">
                            <div>Target KB: <strong className="text-emerald-400">{doc.minSizeKB}–{doc.maxSizeKB} KB</strong></div>
                            {doc.width && doc.height && (
                              <div>Target Pixels: <strong className="text-indigo-300">{doc.width} × {doc.height} px</strong></div>
                            )}
                          </div>

                          {doc.notes && (
                            <p className="text-[11px] text-slate-400 line-clamp-2 pt-1 border-t border-white/10">
                              {doc.notes}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-white/10 flex items-center justify-between text-xs font-bold text-indigo-400 group-hover:text-indigo-300">
                          <span>Apply Specification</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-[#080b11] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 min-h-[44px] bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/10 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
