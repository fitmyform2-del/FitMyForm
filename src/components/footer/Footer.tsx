import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-gray-950 border-t border-gray-800/80 text-gray-400 py-12 px-4 sm:px-6 lg:px-8 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand & Privacy */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg">
              F
            </div>
            <span className="font-extrabold text-lg text-white">FitMyForm</span>
          </div>
          <p className="text-xs leading-relaxed text-gray-400">
            Free student document resizer & formatter. Tailored for Indian government competitive exams, college admissions, and job forms.
          </p>
          <div className="flex items-start gap-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 text-emerald-300 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              <strong>100% Client-Side Privacy:</strong> Your sensitive Aadhaar cards, photos, and signatures never leave your device.
            </span>
          </div>
        </div>

        {/* Popular Resizer Tools */}
        <div>
          <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
            Quick Resizer Tools
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/photo-resizer" className="hover:text-blue-400 transition-colors">Passport Photo Resizer</Link></li>
            <li><Link href="/signature-resizer" className="hover:text-blue-400 transition-colors">Signature Resizer & Formatter</Link></li>
            <li><Link href="/image-compressor" className="hover:text-blue-400 transition-colors">Compress Image to 20 KB - 50 KB</Link></li>
            <li><Link href="/image-to-jpg" className="hover:text-blue-400 transition-colors">Convert PNG / WEBP to JPG</Link></li>
            <li><Link href="/pdf-compressor" className="hover:text-blue-400 transition-colors">Client-Side PDF Size Reducer</Link></li>
          </ul>
        </div>

        {/* Exam Specific Presets */}
        <div>
          <h4 className="font-semibold text-white text-sm mb-3 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-400" />
            Exam Photo Formats
          </h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/ssc-photo-resizer" className="hover:text-emerald-400 transition-colors">SSC CGL / CHSL Photo Resizer (200x230)</Link></li>
            <li><Link href="/uptet-photo-resizer" className="hover:text-emerald-400 transition-colors">UPTET Photo & Signature Maker</Link></li>
            <li><Link href="/ctet-photo-resizer" className="hover:text-emerald-400 transition-colors">CTET Photo Resizer (10-100 KB)</Link></li>
            <li><Link href="/presets" className="hover:text-emerald-400 transition-colors">UPSC Photo & Signature (350x350)</Link></li>
            <li><Link href="/presets" className="hover:text-emerald-400 transition-colors">IBPS Bank Photo & Thumb Impression</Link></li>
          </ul>
        </div>

        {/* Informational Guides */}
        <div>
          <h4 className="font-semibold text-white text-sm mb-3">Guidelines & Help</h4>
          <ul className="space-y-2 text-xs">
            <li><Link href="/resize-photo-for-online-form" className="hover:text-indigo-400 transition-colors">How to Resize Photos for Online Forms</Link></li>
            <li><Link href="/presets" className="hover:text-indigo-400 transition-colors">View All Exam Requirements Database</Link></li>
            <li><Link href="/dashboard" className="hover:text-indigo-400 transition-colors">My Recent Processed Files</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-gray-800/60 text-center text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} FitMyForm. Built for Indian Students & Applicants.</p>
        <p className="flex items-center gap-1 justify-center">
          Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for fast & error-free form submissions.
        </p>
      </div>
    </footer>
  );
};
