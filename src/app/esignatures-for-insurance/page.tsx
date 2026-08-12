import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { ShieldCheck, ArrowRight, CheckCircle2, FileText, Umbrella } from 'lucide-react';

export const metadata: Metadata = {
  title: 'eSignatures for Insurance - Fast Claims & Policy Onboarding',
  description: 'Accelerate insurance policy issuance, claim forms, and policyholder onboarding with secure e-signatures and 100% client-side privacy.',
  keywords: ['esignatures for insurance', 'sign insurance policy pdf', 'insurance claim esignature', 'eIDAS insurance sign'],
  alternates: { canonical: '/esignatures-for-insurance' }
};

export default function InsuranceEsignaturePage() {
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Umbrella className="w-4 h-4 text-indigo-400" />
            <span>Insurance Industry Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            eSignatures for <span className="gradient-text">Insurance</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Speed up policy creation, claims processing, and client approvals with secure, legally binding electronic signatures.
          </p>
          <div className="pt-2">
            <Link
              href="/pdf-tools/sign"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 text-white font-black text-sm shadow-2xl"
            >
              <span>e-Sign Insurance PDF Now</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <FileText className="w-8 h-8 text-indigo-400" />
            <h3 className="font-extrabold text-white text-lg">Policy Onboarding</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get new policy applications signed instantly online without physical paperwork or postal delays.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h3 className="font-extrabold text-white text-lg">Fast Claim Settlement</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Collect verified claim forms and loss settlement releases securely with SHA-256 audit logging.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <CheckCircle2 className="w-8 h-8 text-cyan-400" />
            <h3 className="font-extrabold text-white text-lg">HIPAA & GDPR Compliance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Client-side WebAssembly processing ensures policyholder data remains completely private.
            </p>
          </div>
        </div>

        <SeoContentSection
          title="Digitize Insurance Underwriting & Claims Processing"
          description="Insurance agencies, brokers, and underwriters use FitMyForm e-Sign suite to eliminate physical paperwork delays."
          faqs={[
            {
              question: 'Are e-signed insurance policies recognized by courts?',
              answer: 'Yes. e-Signed insurance documents meet SES/AES standards under eIDAS, ESIGN Act, and IT Act 2000.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
