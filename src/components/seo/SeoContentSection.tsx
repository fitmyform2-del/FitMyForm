'use client';

import React from 'react';
import { HelpCircle, CheckCircle2, ShieldCheck, Zap, FileText, Sparkles } from 'lucide-react';

interface SeoContentSectionProps {
  title: string;
  description: string;
  faqs: { question: string; answer: string }[];
}

export const SeoContentSection: React.FC<SeoContentSectionProps> = ({
  title,
  description,
  faqs
}) => {
  // Schema JSON-LD structured data for SEO ranking
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'FitMyForm - Student Document Resizer & Formatter',
    'url': 'https://fitmyform.com',
    'applicationCategory': 'UtilitiesApplication',
    'operatingSystem': 'All',
    'browserRequirements': 'Requires JavaScript. Requires HTML5 Canvas.',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'INR'
    },
    'description': description
  };

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': `How to Resize Document for Online Application Forms using FitMyForm`,
    'step': [
      {
        '@type': 'HowToStep',
        'name': 'Upload Document',
        'text': 'Select or drop your photo, signature, thumb impression, or certificate.'
      },
      {
        '@type': 'HowToStep',
        'name': 'Configure Form Requirements',
        'text': 'Select exam preset (SSC, UPSC, Banking, CTET) or enter target width, height, and KB limit.'
      },
      {
        '@type': 'HowToStep',
        'name': 'Process & Download',
        'text': 'The client-side engine automatically resizes, crops, and compresses your file for instant download.'
      }
    ]
  };

  return (
    <section className="mt-16 border-t border-white/10 pt-12 space-y-12 max-w-5xl mx-auto">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* Title & Overview */}
      <div className="space-y-3 text-center sm:text-left">
        <h2 className="text-2xl font-black text-white tracking-tight">{title}</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">{description}</p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#0d121e] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl backdrop-blur-2xl hover:border-emerald-500/40 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>
          <h3 className="font-extrabold text-sm text-white">100% Client-Side Privacy</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            No document is ever uploaded to any cloud server. Your sensitive photos, Aadhaar cards, and signatures remain safely inside your browser memory.
          </p>
        </div>

        <div className="bg-[#0d121e] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl backdrop-blur-2xl hover:border-indigo-500/40 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="font-extrabold text-sm text-white">High-Precision Compression</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Iterative binary search quality adjustments guarantee your file fits exactly inside the required KB window (e.g. 20–50 KB) without blurriness.
          </p>
        </div>

        <div className="bg-[#0d121e] border border-white/10 rounded-3xl p-5 space-y-3 shadow-xl backdrop-blur-2xl hover:border-cyan-500/40 transition-all">
          <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <FileText className="w-5 h-5 text-cyan-400" />
          </div>
          <h3 className="font-extrabold text-sm text-white">Official Exam Specs</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Pre-loaded requirements database for SSC, UPSC, IBPS, RRB Railway, NTA NEET/JEE, UPTET, CTET, and University Admissions.
          </p>
        </div>
      </div>

      {/* Common Exam Specifications Table */}
      <div className="bg-[#0d121e] border border-white/10 rounded-3xl p-6 space-y-4 shadow-2xl backdrop-blur-2xl">
        <h3 className="font-extrabold text-base text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Standard Indian Exam Document Requirements Cheat Sheet</span>
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-[#080b11] text-slate-400 uppercase font-mono text-[10px] border-b border-white/10">
              <tr>
                <th className="p-3.5">Exam Portal</th>
                <th className="p-3.5">Doc Type</th>
                <th className="p-3.5">Dimensions</th>
                <th className="p-3.5">Target KB Limits</th>
                <th className="p-3.5">Output Format</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 font-mono">
              <tr>
                <td className="p-3.5 font-extrabold text-white">SSC (CGL/CHSL)</td>
                <td className="p-3.5">Passport Photo</td>
                <td className="p-3.5 text-indigo-300 font-bold">200 × 230 px</td>
                <td className="p-3.5 text-emerald-400 font-bold">20 – 50 KB</td>
                <td className="p-3.5">JPG / JPEG</td>
              </tr>
              <tr>
                <td className="p-3.5 font-extrabold text-white">SSC (CGL/CHSL)</td>
                <td className="p-3.5">Signature</td>
                <td className="p-3.5 text-indigo-300 font-bold">140 × 60 px</td>
                <td className="p-3.5 text-emerald-400 font-bold">10 – 20 KB</td>
                <td className="p-3.5">JPG / JPEG</td>
              </tr>
              <tr>
                <td className="p-3.5 font-extrabold text-white">UPSC Civil Services</td>
                <td className="p-3.5">Photo & Sig</td>
                <td className="p-3.5 text-indigo-300 font-bold">350 × 350 px (Min)</td>
                <td className="p-3.5 text-emerald-400 font-bold">20 – 300 KB</td>
                <td className="p-3.5">JPG / JPEG</td>
              </tr>
              <tr>
                <td className="p-3.5 font-extrabold text-white">IBPS Banking</td>
                <td className="p-3.5">Left Thumb</td>
                <td className="p-3.5 text-indigo-300 font-bold">240 × 240 px</td>
                <td className="p-3.5 text-emerald-400 font-bold">20 – 50 KB</td>
                <td className="p-3.5">JPG / JPEG</td>
              </tr>
              <tr>
                <td className="p-3.5 font-extrabold text-white">Railway RRB</td>
                <td className="p-3.5">Passport Photo</td>
                <td className="p-3.5 text-indigo-300 font-bold">350 × 450 px</td>
                <td className="p-3.5 text-emerald-400 font-bold">20 – 50 KB</td>
                <td className="p-3.5">JPG / JPEG</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="space-y-5">
        <h3 className="font-extrabold text-xl text-white flex items-center gap-2.5 tracking-tight">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
          </div>
          <span>Frequently Asked Questions (FAQ)</span>
        </h3>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-[#0d121e] border border-white/10 rounded-2xl p-5 space-y-2 shadow-lg backdrop-blur-2xl">
              <h4 className="font-extrabold text-white text-sm flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h4>
              <p className="text-xs text-slate-300 pl-6 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

