import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { PenTool, ShieldCheck, Zap, Layers, ArrowRight, CheckCircle2, FileText, Lock, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'eSignature Features - Fast, Secure & Free PDF Signing Platform',
  description: 'Explore FitMyForm iLoveSign e-signature features. Draw, type, or upload signatures, place initials, full names, and date fields with zero server uploads.',
  keywords: ['esignature features', 'electronic signature features', 'sign pdf features', 'client side esign', 'audit trail certificate'],
  alternates: { canonical: '/esignature-features' }
};

export default function EsignatureFeaturesPage() {
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <PenTool className="w-4 h-4 text-indigo-400" />
            <span>Platform Features & Capabilities</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Effortless, Secure & <span className="gradient-text">Legally Binding</span> e-Signing
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Manage, sign, and seal business agreements with ease. Built with 100% client-side privacy architecture so your confidential documents never leave your computer.
          </p>
          <div className="pt-2">
            <Link
              href="/pdf-tools/sign"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-emerald-500 hover:from-indigo-500 hover:to-emerald-400 text-white font-black text-sm shadow-2xl"
            >
              <span>e-Sign PDF Document Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              title: '100% Client-Side Privacy',
              desc: 'Document cryptographic calculations and PDF signature embeddings execute entirely inside browser memory. Zero server uploads.'
            },
            {
              icon: PenTool,
              title: 'Versatile Signature Creation',
              desc: 'Draw signatures with mouse or touchscreen, type stylish calligraphy names, or upload transparent PNG signature files.'
            },
            {
              icon: FileText,
              title: 'Multi-Field Placement',
              desc: 'Place signature boxes, initials, full name, company title, date signed, checkmarks, and custom text inputs onto any page.'
            },
            {
              icon: Award,
              title: 'Audit Trail Certificate',
              desc: 'Automatically append verifiable audit trail certificates with UTC timestamps, SHA-256 document hashes, and tracking IDs.'
            },
            {
              icon: Zap,
              title: 'Instant Execution',
              desc: 'No login, subscription, or software installation required. Sign documents on desktop, laptop, or mobile phones instantly.'
            },
            {
              icon: Globe,
              title: 'Global Compliance',
              desc: 'Full compliance with EU eIDAS regulation, US ESIGN Act, UK Electronic Communications Act, and Indian IT Act 2000.'
            }
          ].map((f, i) => (
            <div key={i} className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-white text-lg">{f.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

        <SeoContentSection
          title="Streamline Business Agreements with Digital e-Signatures"
          description="Electronic signatures replace paper printing, physical courier mailing, and manual scanning. FitMyForm iLoveSign suite empowers teams to seal contracts in seconds."
          faqs={[
            {
              question: 'Do I need to create an account to sign PDFs?',
              answer: 'No. You can sign unlimited PDF documents for free without registration or subscription.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
import { Award } from 'lucide-react';
