'use client';

import React from 'react';
import Link from 'next/link';
import { Award, ArrowRight, Sparkles } from 'lucide-react';

const FEATURED_EXAMS = [
  {
    id: 'ssc-cgl',
    name: 'Staff Selection Commission (SSC)',
    subtitle: 'CGL, CHSL, MTS, GD Constable & CPO',
    photoRoute: '/ssc-photo-resizer',
    signRoute: '/photo-resizer?preset=ssc-cgl&doc=signature',
    photoSpec: '200 × 230 px • 20–50 KB JPG',
    signSpec: '140 × 60 px • 10–20 KB JPG',
    color: 'from-blue-500/20 to-sky-500/10'
  },
  {
    id: 'ibps-banking',
    name: 'IBPS & SBI Banking Exams',
    subtitle: 'PO, Clerk, SO & Regional Rural Banks (RRB)',
    photoRoute: '/exam/ibps-banking',
    signRoute: '/exam-kit?exam=ibps-banking',
    photoSpec: '200 × 230 px • 20–50 KB JPG',
    signSpec: '140 × 60 px • 10–20 KB JPG',
    color: 'from-indigo-500/20 to-blue-500/10'
  },
  {
    id: 'upsc-civil-services',
    name: 'UPSC Civil Services (CSE)',
    subtitle: 'IAS, IPS, IFS & Central Engineering Services',
    photoRoute: '/exam/upsc-civil-services',
    signRoute: '/exam-kit?exam=upsc-civil-services',
    photoSpec: '350 × 350 px • 20–300 KB JPG',
    signSpec: '350 × 350 px • 20–300 KB JPG',
    color: 'from-emerald-500/20 to-teal-500/10'
  },
  {
    id: 'rrb-railway',
    name: 'Railway Recruitment Board (RRB)',
    subtitle: 'ALP, NTPC, Group D, JE & RPF (rrbapply.gov.in)',
    photoRoute: '/exam/rrb-railway',
    signRoute: '/exam-kit?exam=rrb-railway',
    photoSpec: '350 × 450 px • 30–70 KB JPG',
    signSpec: '140 × 60 px • 30–49 KB JPG',
    color: 'from-cyan-500/20 to-blue-500/10'
  },
  {
    id: 'nta-neet-jee',
    name: 'NTA NEET UG / JEE Main / CUET',
    subtitle: 'Passport, 4×6 Postcard, Signature & Fingers',
    photoRoute: '/exam/nta-neet-jee',
    signRoute: '/exam-kit?exam=nta-neet-jee',
    photoSpec: '350 × 450 px • 10–200 KB JPG',
    signSpec: '350 × 150 px • 4–50 KB JPG',
    color: 'from-pink-500/20 to-purple-500/10'
  },
  {
    id: 'ctet-teaching',
    name: 'CTET, DSSSB & State PSCs',
    subtitle: 'CBSE CTET, UPTET, UPPSC, BPSC & State Exams',
    photoRoute: '/ctet-photo-resizer',
    signRoute: '/photo-resizer?preset=ctet&doc=signature',
    photoSpec: '350 × 450 px • 10–100 KB JPG',
    signSpec: '350 × 150 px • 3–30 KB JPG',
    color: 'from-amber-500/20 to-orange-500/10'
  }
];

export const HomeExamShowcase: React.FC = () => {
  return (
    <section className="space-y-6 pt-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div>
          <div className="flex items-center gap-2 text-blue-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Popular Online Exam Specifications</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Official Exam Photo & Signature Resizers
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Pre-configured with verified 2025–2026 portal requirements across 35+ exams & government portals.
          </p>
        </div>
        <Link
          href="/presets"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 shrink-0"
        >
          <span>Browse All 35+ Exam Presets</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FEATURED_EXAMS.map((item) => (
          <div
            key={item.id}
            className="fmf-card p-5 flex flex-col justify-between space-y-4 group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${item.color} blur-2xl pointer-events-none`} />

            <div className="space-y-2 relative z-10">
              <h3 className="font-black text-white text-base">
                {item.name}
              </h3>
              <p className="text-xs text-slate-300 line-clamp-1">{item.subtitle}</p>

              <div className="pt-2 space-y-1.5 text-xs font-mono">
                <Link
                  href={item.photoRoute}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-blue-500/15 border border-white/[0.06] hover:border-blue-500/40 transition-colors"
                >
                  <span className="text-slate-300 font-sans font-semibold">📸 Photo:</span>
                  <span className="text-emerald-400 font-bold">{item.photoSpec}</span>
                </Link>
                <Link
                  href={item.signRoute}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/[0.03] hover:bg-blue-500/15 border border-white/[0.06] hover:border-blue-500/40 transition-colors"
                >
                  <span className="text-slate-300 font-sans font-semibold">✍️ Signature:</span>
                  <span className="text-blue-300 font-bold">{item.signSpec}</span>
                </Link>
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between gap-2 relative z-10">
              <Link
                href={item.photoRoute}
                className="text-xs font-bold text-white hover:text-blue-400 flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Resize Photo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>

              <Link
                href={item.signRoute}
                className="text-xs text-blue-300 hover:text-white flex items-center gap-1 transition-colors font-semibold"
              >
                <span>Resize Sign</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
