import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { ShieldCheck, Lock, Key, FileCheck, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'eSignature Security & Data Protection Architecture',
  description: 'Discover FitMyForm iLoveSign security standards: client-side zero-trust architecture, SHA-256 document hashing, and ISO 27001 compliance.',
  keywords: ['esignature security', 'secure pdf signing', 'client side esign security', 'zero server upload signature', 'sha256 pdf verification'],
  alternates: { canonical: '/esignature-security' }
};

export default function EsignatureSecurityPage() {
  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Zero-Trust Privacy & Security Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight">
            Security That Protects <span className="gradient-text">Your Data</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Your confidential agreements, NDAs, and financial contracts never leave your web browser. FitMyForm uses client-side WebAssembly cryptography to process PDF signatures in RAM memory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <Lock className="w-8 h-8 text-indigo-400" />
            <h3 className="font-extrabold text-white text-lg">Zero Server Upload</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unlike cloud-based signature portals, your PDF document byte array is processed 100% locally. Zero remote storage risk.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <Key className="w-8 h-8 text-emerald-400" />
            <h3 className="font-extrabold text-white text-lg">SHA-256 Hashing</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every signed PDF gets a cryptographic SHA-256 hash tracking string to guarantee document integrity and prevent tampering.
            </p>
          </div>

          <div className="bg-[#0d121e] border border-white/10 p-6 rounded-3xl space-y-3 shadow-xl">
            <FileCheck className="w-8 h-8 text-cyan-400" />
            <h3 className="font-extrabold text-white text-lg">Verifiable Audit Certificate</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Optional audit trail certificates contain UTC signing timestamps, page indices, and field details for court admissibility.
            </p>
          </div>
        </div>

        <SeoContentSection
          title="Bank-Grade Privacy for Sensitive Business Contracts"
          description="Protect corporate agreements, employee onboarding forms, and legal settlements from unauthorized cloud data breaches."
          faqs={[
            {
              question: 'Are my documents stored on any server memory?',
              answer: 'No. FitMyForm is a client-side web application. All operations occur in browser memory and are wiped when you close the tab.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
