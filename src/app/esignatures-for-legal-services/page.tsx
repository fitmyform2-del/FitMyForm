import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { Scale, ArrowRight, CheckCircle2, ShieldCheck, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'eSignatures for Legal Services - Contracts, NDAs & Court Filings',
  description: 'Execute NDAs, retainer agreements, court filings, and legal contracts with court-admissible electronic signatures and audit trail certificates.',
  keywords: ['esignatures for legal services', 'sign nda pdf', 'legal contract esignature', 'power of attorney esign'],
  alternates: { canonical: '/esignatures-for-legal-services' }
};

export default function LegalEsignaturePage() {
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4 text-indigo-400" />
            <span>Legal Practice Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            eSignatures for <span className="gradient-text">Legal Services</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Execute NDAs, retainer agreements, affidavits, and settlement documents with court-admissible audit trail certificates.
          </p>
          <div className="pt-2">
            <Link
              href="/pdf-tools/sign"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-black text-sm shadow-2xl"
            >
              <span>e-Sign Legal PDF Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <FileText className="w-8 h-8 text-indigo-400" />
            <h3 className="font-extrabold text-white text-lg">NDAs & Client Contracts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Send non-disclosure agreements and engagement letters for rapid digital execution.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h3 className="font-extrabold text-white text-lg">Court Admissibility</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every signed contract includes an appended audit trail logging UTC timestamps and SHA-256 hashes.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <CheckCircle2 className="w-8 h-8 text-cyan-400" />
            <h3 className="font-extrabold text-white text-lg">Attorney Privileged Privacy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Zero-trust client-side architecture preserves attorney-client privilege and data confidentiality.
            </p>
          </div>
        </div>

        <SeoContentSection
          title="Court-Admissible Evidence Standards for Law Firms"
          description="FitMyForm e-Sign audit certificates satisfy judicial evidence standards across the US, EU, UK, and India."
          faqs={[
            {
              question: 'Are e-signatures admissible in court for litigation settlements?',
              answer: 'Yes. Electronic signatures backed by audit logs are admissible under Federal Rules of Evidence and eIDAS.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
