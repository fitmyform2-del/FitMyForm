import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { FileText, CheckCircle2, Globe, Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Legal Validity of Electronic Signatures - Enforceability Guide',
  description: 'Learn about the legal validity and court enforceability of electronic signatures across US, EU, UK, Canada, Australia, and India.',
  keywords: ['legal validity esignature', 'are electronic signatures legal', 'esign act enforceability', 'eIDAS compliance', 'it act 2000 legal signature'],
  alternates: { canonical: '/legal-validity' }
};

export default function LegalValidityPage() {
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-4 h-4 text-emerald-400" />
            <span>Global Legal Recognition</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Legal Validity of <span className="gradient-text">e-Signatures</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Electronic signatures are legally binding and admissible in court across major international jurisdictions. Discover how electronic agreements are enforced.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-indigo-400 font-bold">
              <Globe className="w-5 h-5" />
              <h3 className="text-lg text-white">United States (ESIGN & UETA)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Under the Electronic Signatures in Global and National Commerce Act (ESIGN) and Uniform Electronic Transactions Act (UETA), electronic signatures have the same legal weight as handwritten pen signatures.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Globe className="w-5 h-5" />
              <h3 className="text-lg text-white">European Union (eIDAS Regulation)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Regulation (EU) No 910/2014 (eIDAS) ensures that electronic signatures cannot be denied legal effect or admissibility in court proceedings solely because they are in electronic form.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <Globe className="w-5 h-5" />
              <h3 className="text-lg text-white">India (Information Technology Act 2000)</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Section 10A of the Indian IT Act 2000 validates contracts formed through electronic means and recognizes electronic signatures for commercial agreements.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Globe className="w-5 h-5" />
              <h3 className="text-lg text-white">United Kingdom & Commonwealth</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              The UK Electronic Communications Act 2000 and Electronic Identification Regulations recognize electronic signatures for business contracts, NDAs, and commercial transactions.
            </p>
          </div>
        </div>

        <SeoContentSection
          title="Court Admissibility & Evidence Standards"
          description="FitMyForm e-Sign audit trail logs provide clear evidence of intent, signing timestamp, document hash, and field locations to satisfy judicial evidence standards."
          faqs={[
            {
              question: 'Which documents can be signed electronically?',
              answer: 'Commercial contracts, NDAs, sales quotes, real estate leases, employment offer letters, insurance claims, and vendor agreements can all be signed electronically.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
