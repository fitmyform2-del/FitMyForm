import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { Award, ShieldCheck, CheckCircle2, ArrowRight, Lock, FileText, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'eSignature Compliance Standards - eIDAS, ESIGN Act & IT Act Guide',
  description: 'Understand electronic signature levels: Simple (SES), Advanced (AES), and Qualified (QES) signature standards under eIDAS, ESIGN Act, and IT Act 2000.',
  keywords: ['esignature compliance standards', 'eIDAS electronic signature', 'ESIGN Act compliance', 'IT Act 2000 signature', 'SES AES QES comparison'],
  alternates: { canonical: '/esignature-compliance-standards' }
};

export default function ComplianceStandardsPage() {
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>Legal Standards & Regulatory Compliance</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Choose the Best <span className="gradient-text">Signature Level</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Learn how electronic signatures comply with global regulatory frameworks including eIDAS in the European Union, the ESIGN Act in the United States, and the IT Act 2000 in India.
          </p>
        </div>

        {/* 3 Signature Levels Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold font-mono">
              SES
            </div>
            <h3 className="font-extrabold text-white text-xl">Simple (SES)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Online signatures for standard business documents, agreements, and forms. Involves typed or stylized drawn names with full audit trail logging.
            </p>
            <div className="pt-2 text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Ideal for NDAs, Sales & Invoices
            </div>
          </div>

          <div className="bg-[#0d121e] border border-indigo-500/40 p-6 rounded-3xl space-y-4 shadow-xl relative">
            <div className="absolute -top-3 right-6 bg-indigo-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full">
              Recommended
            </div>
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold font-mono">
              AES
            </div>
            <h3 className="font-extrabold text-white text-xl">Advanced (AES)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              For sensitive legal agreements. Employs cryptographic SHA-256 document hashing and unique signer verification tracking IDs.
            </p>
            <div className="pt-2 text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Enhanced Legal Enforceability
            </div>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono">
              QES
            </div>
            <h3 className="font-extrabold text-white text-xl">Qualified (QES)</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              The legal equivalent of a handwritten signature in the EU. Backed by eIDAS accredited qualified digital certificates.
            </p>
            <div className="pt-2 text-xs text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Maximum EU Court Admissibility
            </div>
          </div>
        </div>

        <SeoContentSection
          title="Global Regulatory Frameworks for Electronic Signatures"
          description="Electronic signatures are legally recognized worldwide under landmark legislation including the US Electronic Signatures in Global and National Commerce (ESIGN) Act, EU Regulation No 910/2014 (eIDAS), and Indian IT Act 2000."
          faqs={[
            {
              question: 'Are electronic signatures enforceable in court?',
              answer: 'Yes. Documents e-signed with audit trails are admissible in court as legal evidence across the US, EU, UK, Canada, Australia, and India.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
