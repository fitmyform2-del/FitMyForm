'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ArrowRight, Sparkles } from 'lucide-react';

const FEATURED_EXAMS = [
  {
    id: 'ssc-cgl',
    name: 'Staff Selection Commission (SSC)',
    subtitle: 'CGL, CHSL, MTS, GD Constable & CPO',
    route: '/ssc-photo-resizer',
    photoSpec: '200 × 230 px • 20–50 KB JPG',
    signSpec: '140 × 60 px • 10–20 KB JPG',
    color: 'from-emerald-500/20 to-teal-500/10'
  },
  {
    id: 'ibps-banking',
    name: 'IBPS & SBI Banking Exams',
    subtitle: 'PO, Clerk, SO & Regional Rural Banks (RRB)',
    route: '/signature-resizer',
    photoSpec: '200 × 230 px • 20–50 KB JPG',
    signSpec: '140 × 60 px • 10–20 KB JPG',
    color: 'from-purple-500/20 to-indigo-500/10'
  },
  {
    id: 'upsc-civil-services',
    name: 'UPSC Civil Services (CSE)',
    subtitle: 'IAS, IPS, IFS & Central Engineering Services',
    route: '/photo-resizer',
    photoSpec: '350 × 350 px • 20–300 KB JPG',
    signSpec: '350 × 350 px • 20–300 KB JPG',
    color: 'from-blue-500/20 to-cyan-500/10'
  },
  {
    id: 'rrb-railway',
    name: 'Railway Recruitment Board (RRB)',
    subtitle: 'ALP, NTPC, Group D & JE Technical',
    route: '/photo-resizer',
    photoSpec: '350 × 450 px • 30–70 KB JPG',
    signSpec: '140 × 60 px • 30–70 KB JPG',
    color: 'from-cyan-500/20 to-blue-500/10'
  },
  {
    id: 'ctet-teaching',
    name: 'CTET & State Teacher Eligibility',
    subtitle: 'Central & State Teaching Recruitment',
    route: '/ctet-photo-resizer',
    photoSpec: '10–100 KB JPG (Passport Size)',
    signSpec: '3–30 KB JPG (Exact Signature)',
    color: 'from-pink-500/20 to-purple-500/10'
  },
  {
    id: 'uptet-teaching',
    name: 'UPTET & State PSCs',
    subtitle: 'UP Police, BPSC, MPPSC & State Civil Services',
    route: '/uptet-photo-resizer',
    photoSpec: '20–50 KB JPG • White Background',
    signSpec: '10–20 KB JPG • Clear Black/Blue Ink',
    color: 'from-rose-500/20 to-amber-500/10'
  }
];

export const HomeExamShowcase: React.FC = () => {
  return (
    <section className="space-y-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Popular Online Exam Specifications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Official Exam Photo & Signature Resizers
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Pre-configured with official 2025–2026 portal requirements. Instant formatting with 100% in-browser privacy.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURED_EXAMS.map((item) => (
          <Link
            key={item.id}
            href={item.route}
            className="antigravity-card-3d rounded-2xl p-5 flex flex-col justify-between space-y-4 group relative overflow-hidden cursor-pointer"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.color} blur-2xl pointer-events-none`} />

            <div className="space-y-2 relative z-10">
              <h3 className="font-extrabold text-white text-base group-hover:text-indigo-300 transition-colors">
                {item.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">{item.subtitle}</p>

              <div className="pt-2 space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-slate-400 font-sans">📸 Photo:</span>
                  <span className="text-emerald-300 font-bold">{item.photoSpec}</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                  <span className="text-slate-400 font-sans">✍️ Signature:</span>
                  <span className="text-indigo-300 font-bold">{item.signSpec}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-white flex items-center gap-1.5 group-hover:text-indigo-300 transition-colors">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Open Resizer</span>
              </span>

              <span className="text-xs text-slate-400 group-hover:text-white flex items-center gap-1 transition-colors font-medium">
                <span>Format Now</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
