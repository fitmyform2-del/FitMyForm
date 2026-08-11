'use client';

import React from 'react';
import { HelpCircle, CheckCircle2, ShieldCheck, Zap, FileText } from 'lucide-react';

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
    <section className="mt-16 border-t border-gray-800/80 pt-12 space-y-12 max-w-4xl mx-auto">
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
      <div className="space-y-4 text-center sm:text-left">
        <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
        <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{description}</p>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h3 className="font-bold text-sm text-white">100% Client-Side Privacy</h3>
          <p className="text-xs text-gray-400 leading-normal">
            No document is ever uploaded to any cloud server. Your sensitive photos, Aadhaar cards, and signatures remain safely inside your browser.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2">
          <Zap className="w-6 h-6 text-blue-400" />
          <h3 className="font-bold text-sm text-white">High-Precision Compression</h3>
          <p className="text-xs text-gray-400 leading-normal">
            Iterative binary search quality adjustments guarantee your file fits exactly inside the required KB window (e.g. 20–50 KB) without blurriness.
          </p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 space-y-2">
          <FileText className="w-6 h-6 text-indigo-400" />
          <h3 className="font-bold text-sm text-white">Official Exam Specs</h3>
          <p className="text-xs text-gray-400 leading-normal">
            Pre-loaded requirements database for SSC, UPSC, IBPS, RRB Railway, NTA NEET/JEE, UPTET, CTET, and University Admissions.
          </p>
        </div>
      </div>

      {/* Common Exam Specifications Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-base text-white">
          Standard Indian Exam Document Requirements Cheat Sheet
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-300">
            <thead className="bg-gray-950 text-gray-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-3">Exam Portal</th>
                <th className="p-3">Doc Type</th>
                <th className="p-3">Dimensions</th>
                <th className="p-3">Target Size</th>
                <th className="p-3">Format</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 font-mono">
              <tr>
                <td className="p-3 font-bold text-white">SSC (CGL/CHSL)</td>
                <td className="p-3">Photo</td>
                <td className="p-3 text-blue-300">200 × 230 px</td>
                <td className="p-3 text-emerald-400">20 – 50 KB</td>
                <td className="p-3">JPG / JPEG</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">SSC (CGL/CHSL)</td>
                <td className="p-3">Signature</td>
                <td className="p-3 text-blue-300">140 × 60 px</td>
                <td className="p-3 text-emerald-400">10 – 20 KB</td>
                <td className="p-3">JPG / JPEG</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">UPSC Civil Services</td>
                <td className="p-3">Photo & Sig</td>
                <td className="p-3 text-blue-300">350 × 350 px (Min)</td>
                <td className="p-3 text-emerald-400">20 – 300 KB</td>
                <td className="p-3">JPG / JPEG</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">IBPS Banking</td>
                <td className="p-3">Left Thumb</td>
                <td className="p-3 text-blue-300">240 × 240 px</td>
                <td className="p-3 text-emerald-400">20 – 50 KB</td>
                <td className="p-3">JPG / JPEG</td>
              </tr>
              <tr>
                <td className="p-3 font-bold text-white">Railway RRB</td>
                <td className="p-3">Passport Photo</td>
                <td className="p-3 text-blue-300">350 × 450 px</td>
                <td className="p-3 text-emerald-400">20 – 50 KB</td>
                <td className="p-3">JPG / JPEG</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions (FAQ) */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-400" />
          Frequently Asked Questions (FAQ)
        </h3>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-1.5">
              <h4 className="font-semibold text-white text-sm flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{faq.question}</span>
              </h4>
              <p className="text-xs text-gray-400 pl-6 leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
