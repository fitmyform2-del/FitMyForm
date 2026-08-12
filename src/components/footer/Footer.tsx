import React from 'react';
import Link from 'next/link';
import { FileCheck, ShieldCheck, Heart, Sparkles, PenTool } from 'lucide-react';
import { IMAGE_TOOLS } from '@/config/imageToolsConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#05070c] border-t border-white/10 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                <FileCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                FitMy<span className="gradient-text font-black">Form</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              The fastest 100% free client-side web application for image modification, e-signing, and student document formatting. Compress, resize, e-sign, crop, convert, watermark, and upscale photos & PDFs securely in your web browser.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1.5 rounded-full w-fit">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Client-Side Privacy Guaranteed</span>
            </div>
          </div>

          {/* iLoveSign Suite Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <PenTool className="w-3.5 h-3.5 text-emerald-400" />
              <span>iLoveSign Suite</span>
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/pdf-tools/sign" className="hover:text-white transition-colors">Fill & e-Sign PDF</Link></li>
              <li><Link href="/esignature-features" className="hover:text-white transition-colors">eSignature Features</Link></li>
              <li><Link href="/esignature-compliance-standards" className="hover:text-white transition-colors">Compliance Standards</Link></li>
              <li><Link href="/esignature-security" className="hover:text-white transition-colors">Security Architecture</Link></li>
              <li><Link href="/legal-validity" className="hover:text-white transition-colors">Legal Validity</Link></li>
            </ul>
          </div>

          {/* eSign Industries Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">eSign Industries</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/esignatures-for-insurance" className="hover:text-white transition-colors">Insurance</Link></li>
              <li><Link href="/esignatures-for-real-estate" className="hover:text-white transition-colors">Real Estate</Link></li>
              <li><Link href="/esignatures-for-financial-services" className="hover:text-white transition-colors">Financial Services</Link></li>
              <li><Link href="/esignatures-for-legal-services" className="hover:text-white transition-colors">Legal Practice</Link></li>
              <li><Link href="/esignatures-for-human-resources" className="hover:text-white transition-colors">HR & Hiring</Link></li>
              <li><Link href="/esignatures-for-sales" className="hover:text-white transition-colors">B2B Sales</Link></li>
            </ul>
          </div>

          {/* Image Tools Col */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Image Tools</span>
            </h4>
            <ul className="space-y-2 text-xs">
              {IMAGE_TOOLS.slice(0, 6).map((tool) => (
                <li key={tool.id}>
                  <Link href={tool.route} className="hover:text-white transition-colors">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Exam Resizers & PDF Suite */}
          <div className="space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">Exam Resizers</h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/ssc-photo-resizer" className="hover:text-white transition-colors">SSC Photo Resizer 20-50 KB</Link></li>
              <li><Link href="/signature-resizer" className="hover:text-white transition-colors">Signature Resizer 140x60</Link></li>
              <li><Link href="/ctet-photo-resizer" className="hover:text-white transition-colors">CTET Photo Resizer</Link></li>
              <li><Link href="/uptet-photo-resizer" className="hover:text-white transition-colors">UPTET Photo Resizer</Link></li>
              <li><Link href="/pdf-compressor" className="hover:text-white transition-colors">PDF Compressor to KB</Link></li>
              <li><Link href="/pdf-tools" className="hover:text-white transition-colors">Client PDF Tools Hub</Link></li>
            </ul>
          </div>
        </div>

        {/* SEO Keyword Tags Strip */}
        <div className="pt-8 border-t border-white/10 space-y-3">
          <div className="text-[10px] font-black uppercase text-indigo-400 tracking-wider">Top Search Keywords</div>
          <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-500 leading-normal">
            <span>free esignature online</span> • <span>sign pdf document free</span> • <span>eIDAS esignature compliance</span> •
            <span>free online image compressor</span> • <span>reduce image size in kb</span> • <span>crop image online free</span> •
            <span>convert png to jpg</span> • <span>remove background transparent png</span> • <span>upscale image 4k online</span> •
            <span>free meme generator</span> • <span>watermark image online</span> • <span>blur face photo</span> •
            <span>ssc photo resizer 20-50 kb</span> • <span>signature resizer 140x60</span>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} FitMyForm iLoveIMG & iLoveSign Suite. Built for creators & professionals worldwide.</p>
          <p className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for 100% Privacy & Fast Latency.
          </p>
        </div>
      </div>
    </footer>
  );
};
