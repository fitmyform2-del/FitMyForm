import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { Building2, ArrowRight, CheckCircle2, FileText, Key } from 'lucide-react';

export const metadata: Metadata = {
  title: 'eSignatures for Real Estate - Leases, Purchase Agreements & Deeds',
  description: 'Close property transactions faster. Sign residential leases, purchase offers, disclosure statements, and tenancy agreements online securely.',
  keywords: ['esignatures for real estate', 'sign lease agreement pdf', 'real estate esignature', 'property purchase agreement sign'],
  alternates: { canonical: '/esignatures-for-real-estate' }
};

export default function RealEstateEsignaturePage() {
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-4 h-4 text-cyan-400" />
            <span>Real Estate Industry Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            eSignatures for <span className="gradient-text">Real Estate</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Close deals faster. Send and e-sign rental contracts, lease agreements, buyer disclosures, and deeds from any device.
          </p>
          <div className="pt-2">
            <Link
              href="/pdf-tools/sign"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-black text-sm shadow-2xl"
            >
              <span>e-Sign Real Estate PDF</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <Key className="w-8 h-8 text-cyan-400" />
            <h3 className="font-extrabold text-white text-lg">Lease Agreements</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Landlords and property managers get tenancy contracts signed instantly with date and initials placement.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <FileText className="w-8 h-8 text-emerald-400" />
            <h3 className="font-extrabold text-white text-lg">Purchase Offers</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Real estate agents capture buyer counter-offers and seller signatures within minutes.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <CheckCircle2 className="w-8 h-8 text-indigo-400" />
            <h3 className="font-extrabold text-white text-lg">Disclosure Statements</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Ensure buyers review and sign property disclosure documents with verifiable audit trails.
            </p>
          </div>
        </div>

        <SeoContentSection
          title="Streamline Property Management & Agent Sales Workflow"
          description="FitMyForm iLoveSign suite eliminates missing signatures and speeds up property closings."
          faqs={[
            {
              question: 'Can tenants sign lease agreements on mobile phones?',
              answer: 'Yes! FitMyForm works on all smartphones, tablets, laptops, and desktop computers.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
