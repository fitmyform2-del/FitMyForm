'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { getRecentHistory, clearRecentHistory } from '@/lib/storage/sessionStore';
import { RecentItem } from '@/types/document';
import { Clock, ShieldCheck, Trash2, ArrowLeft, FileText, CheckCircle2 } from 'lucide-react';

export default function DashboardPage() {
  const [history, setHistory] = useState<RecentItem[]>([]);

  useEffect(() => {
    setHistory(getRecentHistory());
  }, []);

  const handleClear = () => {
    clearRecentHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Clock className="w-6 h-6 text-indigo-400" />
              Student Session Dashboard
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              View recent document processing logs and saved browser session stats. No account or login required.
            </p>
          </div>

          <Link
            href="/"
            className="px-3.5 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Resizer</span>
          </Link>
        </div>

        {/* Privacy Stat Card */}
        <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-2xl p-5 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <h3 className="font-bold text-white text-sm">100% Privacy Guarantee Active</h3>
            <p className="text-emerald-200/80 leading-relaxed">
              Your document history is stored only in your browser’s temporary storage (`localStorage`). No files are saved to any cloud database or external server.
            </p>
          </div>
        </div>

        {/* History List */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <h3 className="font-bold text-white text-sm">
              Processed Files ({history.length})
            </h3>
            {history.length > 0 && (
              <button
                onClick={handleClear}
                className="text-xs text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All History</span>
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500 space-y-2">
              <FileText className="w-12 h-12 mx-auto text-gray-700" />
              <p className="font-semibold text-gray-400">No processed files found in this session</p>
              <p className="text-xs">
                Resize a photo or signature on the homepage to view your processing logs here.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Start Resizing Now
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{item.fileName}</span>
                      <span className="text-[10px] bg-gray-800 text-emerald-400 font-mono px-2 py-0.5 rounded">
                        {item.format}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono flex flex-wrap gap-x-4">
                      <span>Dimensions: <strong className="text-blue-300">{item.dimensions}</strong></span>
                      <span>Processed Size: <strong className="text-emerald-400">{item.processedSizeKB} KB</strong></span>
                      <span>(Original: {item.originalSizeKB} KB)</span>
                    </div>
                  </div>

                  <div className="text-right text-xs text-gray-500 font-mono shrink-0">
                    <div>{item.timestamp}</div>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 justify-end mt-0.5">
                      <CheckCircle2 className="w-3 h-3" />
                      Success
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
