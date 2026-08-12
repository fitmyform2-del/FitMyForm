import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { Landmark, ArrowRight, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'eSignatures for Financial Services - Banking, Loans & Wealth Management',
  description: 'Streamline loan applications, account opening forms, wealth disclosures, and banking agreements with 100% browser e-signature security.',
  keywords: ['esignatures for financial services', 'sign loan agreement pdf', 'banking esignature', 'wealth management esign'],
  alternates: { canonical: '/esignatures-for-financial-services' }
};

export default function FinancialEsignaturePage() {
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Landmark className="w-4 h-4 text-emerald-400" />
            <span>Financial Services Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            eSignatures for <span className="gradient-text">Finance & Banking</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Accelerate loan approvals, wealth management onboarding, and account disclosures with zero server data storage.
          </p>
          <div className="pt-2">
            <Link
              href="/pdf-tools/sign"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-indigo-600 text-white font-black text-sm shadow-2xl"
            >
              <span>e-Sign Financial PDF</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <Landmark className="w-8 h-8 text-emerald-400" />
            <h3 className="font-extrabold text-white text-lg">Loan Origination</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Process mortgage, personal loan, and commercial credit applications with cryptographic audit trails.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <Lock className="w-8 h-8 text-indigo-400" />
            <h3 className="font-extrabold text-white text-lg">Wealth Disclosures</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensure investor disclosures and asset management agreements are executed securely.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <ShieldCheck className="w-8 h-8 text-cyan-400" />
            <h3 className="font-extrabold text-white text-lg">Zero Data Risk</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              100% browser RAM processing ensures client financial statements never touch third-party servers.
            </p>
          </div>
        </div>

        <SeoContentSection
          title="Bank-Grade Security & Regulatory Compliance"
          description="FitMyForm e-Sign suite complies with financial regulations including GLBA, SOX, eIDAS, and ESIGN Act."
          faqs={[
            {
              question: 'Are financial e-signatures encrypted?',
              answer: 'Yes, all PDF signature operations utilize SHA-256 cryptographic hashing and local RAM memory sandbox.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
