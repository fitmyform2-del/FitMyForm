'use client';

import React from 'react';
import { Download, CheckCircle2, ShieldCheck, EyeOff } from 'lucide-react';

interface BlurDownloadCardProps {
  blurredUrl: string | null;
  fileName?: string;
  isProcessing: boolean;
}

export function BlurDownloadCard({
  blurredUrl,
  fileName = 'censored-photo.jpg',
  isProcessing
}: BlurDownloadCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Blurred Output Result</span>
        </h2>
        {blurredUrl && (
          <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
            Ready to Download
          </span>
        )}
      </div>

      {blurredUrl ? (
        <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-5 space-y-5 shadow-2xl backdrop-blur-2xl">
          {/* Output image container */}
          <div className="p-3 bg-black/50 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px] max-h-[380px] overflow-hidden">
            <img
              src={blurredUrl}
              alt="Blurred Result"
              className="max-h-[350px] w-auto object-contain rounded-lg shadow-md"
            />
          </div>

          <div className="space-y-3">
            <a
              href={blurredUrl}
              download={fileName.startsWith('censored-') ? fileName : `censored-${fileName}`}
              className="w-full py-4 min-h-[48px] rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-500/20 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              <span>Download Blurred Image</span>
            </a>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Client-Side Private • Zero Server Upload</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-8 text-center text-slate-400 space-y-3">
          <EyeOff className="w-8 h-8 text-indigo-400 mx-auto" />
          <h4 className="font-extrabold text-white text-sm">Real-time Censor Preview</h4>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {isProcessing
              ? 'Rendering blur effect...'
              : 'Add blur zones on the photo to see the live censored preview here.'}
          </p>
        </div>
      )}
    </div>
  );
}
