import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { BarChart3, ArrowRight, CheckCircle2, Zap, FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'eSignatures for Sales - Close Deals & Proposals Faster',
  description: 'Shorten sales cycles. Send and e-sign sales proposals, Master Services Agreements (MSA), Statements of Work (SOW), and quotes online.',
  keywords: ['esignatures for sales', 'sign sales proposal pdf', 'msa sow esignature', 'sales contract e-sign'],
  alternates: { canonical: '/esignatures-for-sales' }
};

export default function SalesEsignaturePage() {
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            <span>Sales Operations Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            eSignatures for <span className="gradient-text">Sales Teams</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Close revenue faster. Deliver e-signable sales proposals, Master Services Agreements (MSA), and Statements of Work (SOW) instantly.
          </p>
          <div className="pt-2">
            <Link
              href="/pdf-tools/sign"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-black text-sm shadow-2xl"
            >
              <span>e-Sign Sales PDF Proposal</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <Zap className="w-8 h-8 text-indigo-400" />
            <h3 className="font-extrabold text-white text-lg">Shorter Sales Cycles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Remove friction from contract approvals and turn customer intent into signed revenue within minutes.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <FileText className="w-8 h-8 text-emerald-400" />
            <h3 className="font-extrabold text-white text-lg">MSA & SOW Execution</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Place multi-signatory signature boxes, client names, dates, and order form options.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <CheckCircle2 className="w-8 h-8 text-cyan-400" />
            <h3 className="font-extrabold text-white text-lg">Audit Trail & Proof</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Verifiable UTC timestamp certificates guarantee contract enforceability for accounting and revenue recognition.
            </p>
          </div>
        </div>

        <SeoContentSection
          title="Accelerate B2B Contract Approvals & Revenue Growth"
          description="Sales operations leaders use FitMyForm e-Sign suite to eliminate signature bottlenecks."
          faqs={[
            {
              question: 'How do customers sign sales quotes online?',
              answer: 'Customers open the PDF in the e-Sign workspace, add their signature or initials, and download the signed PDF.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
