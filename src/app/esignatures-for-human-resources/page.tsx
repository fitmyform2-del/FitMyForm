import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { Users, ArrowRight, CheckCircle2, FileText, Award } from 'lucide-react';

export const metadata: Metadata = {
  title: 'eSignatures for Human Resources - Offer Letters & Employee Onboarding',
  description: 'Onboard candidates faster. Send and e-sign HR offer letters, employment contracts, NDA agreements, and policy acknowledgments online.',
  keywords: ['esignatures for human resources', 'sign hr offer letter pdf', 'employee onboarding esignature', 'employment contract sign'],
  alternates: { canonical: '/esignatures-for-human-resources' }
};

export default function HrEsignaturePage() {
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>Human Resources Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            eSignatures for <span className="gradient-text">Human Resources</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Delight new hires. Execute employment offer letters, NDAs, direct deposit authorizations, and handbook sign-offs in seconds.
          </p>
          <div className="pt-2">
            <Link
              href="/pdf-tools/sign"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-black text-sm shadow-2xl"
            >
              <span>e-Sign HR Document PDF</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <FileText className="w-8 h-8 text-cyan-400" />
            <h3 className="font-extrabold text-white text-lg">Offer Letters</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Secure top talent faster by delivering e-signable job offers directly to candidate smartphones.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <Users className="w-8 h-8 text-indigo-400" />
            <h3 className="font-extrabold text-white text-lg">Onboarding Packs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bundle tax forms (W-4, I-9), company policies, and IT equipment receipts for streamlined e-signing.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <Award className="w-8 h-8 text-emerald-400" />
            <h3 className="font-extrabold text-white text-lg">Policy Acknowledgments</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Maintain audit readiness with date-stamped employee policy confirmations and compliance logs.
            </p>
          </div>
        </div>

        <SeoContentSection
          title="Transform Employee Onboarding into a 100% Digital Experience"
          description="HR leaders use FitMyForm e-Sign suite to eliminate onboarding friction and track contract execution."
          faqs={[
            {
              question: 'Can new candidates sign offer letters on mobile devices?',
              answer: 'Yes! Candidates can sign using touchscreen signature drawing or calligraphy typing on iOS and Android.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
