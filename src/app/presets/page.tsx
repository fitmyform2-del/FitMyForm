'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { EXAM_PRESETS } from '@/config/presets';
import { Search, Layers } from 'lucide-react';

export default function PresetsDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filtered = EXAM_PRESETS.filter((exam) => {
    const matchesTab = activeTab === 'all' || exam.category === activeTab;
    const term = searchTerm.toLowerCase().trim();
    if (!term) return matchesTab;

    return (
      matchesTab &&
      (exam.name.toLowerCase().includes(term) ||
        exam.organization.toLowerCase().includes(term) ||
        Object.values(exam.documents).some((d) => d && d.title.toLowerCase().includes(term)))
    );
  });

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-blue-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Official Exam Requirements Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Competitive Exam <span className="text-blue-400">Photo & Document Specs</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
            Browse official document dimension specifications, file format rules, and KB size limits for over 30+ competitive exams.
          </p>
        </div>

        {/* Search & Category Filter */}
        <div className="fmf-panel p-4 space-y-4 max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search exam specs e.g. 'SSC CGL', 'UPSC', 'IBPS PO', 'NEET'..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/40 text-white pl-10 pr-4 py-2.5 rounded-xl border border-white/10 text-sm focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 text-xs justify-center">
            {[
              { id: 'all', label: 'All Exams' },
              { id: 'national', label: 'National (SSC/UPSC)' },
              { id: 'banking', label: 'Banking & IBPS' },
              { id: 'railway', label: 'Railway RRB' },
              { id: 'teaching', label: 'CTET / UPTET' },
              { id: 'state', label: 'State Exams' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white/[0.04] text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((exam) => (
            <div key={exam.id} className="fmf-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                <div>
                  <h3 className="font-black text-white text-base">{exam.name}</h3>
                  <p className="text-xs text-slate-400">{exam.organization}</p>
                </div>
                <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-full border border-blue-500/20">
                  {exam.category}
                </span>
              </div>

              <div className="space-y-3">
                {Object.entries(exam.documents).map(([key, doc]) => {
                  if (!doc) return null;
                  return (
                    <div key={key} className="bg-black/40 border border-white/10 rounded-xl p-3.5 space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{doc.title}</span>
                        <span className="font-mono bg-white/[0.08] text-emerald-400 px-2 py-0.5 rounded text-[10px]">
                          {doc.format.join(', ')}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-300 font-mono pt-1">
                        <div>Size: <strong className="text-emerald-400">{doc.minSizeKB}–{doc.maxSizeKB} KB</strong></div>
                        {doc.width && doc.height && (
                          <div>Dim: <strong className="text-blue-300">{doc.width} × {doc.height} px</strong></div>
                        )}
                      </div>

                      {doc.notes && (
                        <p className="text-[11px] text-slate-400 pt-1 border-t border-white/[0.06]">
                          {doc.notes}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>

              <Link
                href="/"
                className="fmf-btn-primary block text-center w-full py-2.5 text-xs font-bold"
              >
                Use Requirements in Resizer Tool →
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
