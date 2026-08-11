'use client';

import React, { useState, useMemo } from 'react';
import { X, Search, Check, FileText, ArrowRight } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-800 flex items-center justify-between bg-gray-950">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-400" />
              Search Official Exam Requirements
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Select an exam requirement preset to automatically configure format, KB limits, & dimensions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="p-4 bg-gray-900 border-b border-gray-800 space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search exam e.g. 'SSC CGL Photo', 'UPTET Signature', 'NEET'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-950 text-white pl-10 pr-4 py-2.5 rounded-xl border border-gray-800 text-sm focus:outline-none focus:border-blue-500 transition-all placeholder:text-gray-500"
              autoFocus
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white text-xs bg-gray-800 px-2 py-0.5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs">
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
                className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          {filteredPresets.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <FileText className="w-12 h-12 mx-auto text-gray-600 mb-3" />
              <p className="font-semibold">No preset found matching "{searchTerm}"</p>
              <p className="text-xs text-gray-500 mt-1">
                You can still use Custom Requirements mode to enter manual dimensions and KB limits.
              </p>
            </div>
          ) : (
            filteredPresets.map((exam) => (
              <div key={exam.id} className="bg-gray-950/80 border border-gray-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-gray-800/80 pb-2">
                  <div>
                    <h3 className="font-bold text-white text-base">{exam.name}</h3>
                    <p className="text-xs text-gray-400">{exam.organization}</p>
                  </div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-blue-400 bg-blue-950/80 border border-blue-800 px-2 py-0.5 rounded-full">
                    {exam.category}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {Object.entries(exam.documents).map(([key, doc]) => {
                    if (!doc) return null;
                    return (
                      <div
                        key={key}
                        className="bg-gray-900 border border-gray-800 hover:border-blue-500/60 p-3 rounded-xl flex flex-col justify-between transition-all group cursor-pointer"
                        onClick={() => onSelectRequirement(doc, exam)}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white text-xs group-hover:text-blue-400 transition-colors">
                              {doc.title}
                            </span>
                            <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded font-mono">
                              {doc.format.join(', ')}
                            </span>
                          </div>

                          <div className="text-xs text-gray-300 space-y-0.5 font-mono">
                            <div>Size: <strong className="text-emerald-400">{doc.minSizeKB}–{doc.maxSizeKB} KB</strong></div>
                            {doc.width && doc.height && (
                              <div>Dim: <strong className="text-blue-300">{doc.width} × {doc.height} px</strong></div>
                            )}
                          </div>

                          {doc.notes && (
                            <p className="text-[11px] text-gray-400 line-clamp-2 pt-1 border-t border-gray-800/50">
                              {doc.notes}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 pt-2 border-t border-gray-800/60 flex items-center justify-between text-xs font-semibold text-blue-400 group-hover:text-blue-300">
                          <span>Use This Requirement</span>
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

        {/* Footer */}
        <div className="p-4 bg-gray-950 border-t border-gray-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
