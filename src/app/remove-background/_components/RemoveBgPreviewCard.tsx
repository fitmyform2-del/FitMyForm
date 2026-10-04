'use client';

import React from 'react';
import { Download, Eraser, CheckCircle2 } from 'lucide-react';

interface RemoveBgPreviewCardProps {
  resultUrl: string | null;
  fileName?: string;
}

export function RemoveBgPreviewCard({ resultUrl, fileName = 'photo.png' }: RemoveBgPreviewCardProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
        <span>Background Cutout Output</span>
      </h2>

      {resultUrl ? (
        <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
          <div className="p-2 bg-black/60 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px] bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:16px_16px]">
            <img src={resultUrl} alt="Background Cutout Result" className="max-h-[350px] w-auto object-contain rounded-lg" />
          </div>

          <a
            href={resultUrl}
            download={`cutout-${fileName}`}
            className="w-full py-4 min-h-[48px] rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
          >
            <Download className="w-5 h-5" />
            <span>Download Cutout Image</span>
          </a>
        </div>
      ) : (
        <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
          <Eraser className="w-8 h-8 text-indigo-400 mx-auto" />
          <h4 className="font-extrabold text-white text-base">Cutout Preview</h4>
          <p className="text-xs text-slate-400">Click on the background in your photo or click Remove Background Now.</p>
        </div>
      )}
    </div>
  );
}
