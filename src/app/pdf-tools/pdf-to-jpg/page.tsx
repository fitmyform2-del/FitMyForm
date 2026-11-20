'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { renderPdfAllPagesToDataUrls, RenderedPdfPage } from '@/lib/pdf/pdfjsLoader';
import { zipAndDownloadBlobs } from '@/lib/pdf/pdfTools';
import { Image as ImageIcon, Upload, Download, RefreshCw, ArrowLeft, FileText, AlertCircle, Archive } from 'lucide-react';

export default function PdfToJpgPage() {
  const [file, setFile] = useState<File | null>(null);
  const [dpiScale, setDpiScale] = useState<number>(1.75);
  const [isProcessing, setIsProcessing] = useState(false);
  const [convertedImages, setConvertedImages] = useState<RenderedPdfPage[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setConvertedImages([]);
      setErrorMsg(null);
    }
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const rendered = await renderPdfAllPagesToDataUrls(file, {
        scale: dpiScale,
        format: 'image/jpeg',
        quality: 0.92
      });
      setConvertedImages(rendered);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not render this PDF. Make sure it is not password-protected.';
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadAllZip = async () => {
    if (!file || convertedImages.length === 0) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    const items = await Promise.all(
      convertedImages.map(async (page) => {
        const res = await fetch(page.dataUrl);
        const blob = await res.blob();
        return { blob, name: `${baseName}_page_${page.pageNum}.jpg` };
      })
    );
    await zipAndDownloadBlobs(items, `${baseName}_pages_jpg.zip`);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 space-y-8">
        <Link href="/pdf-tools" className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to All PDF Tools
        </Link>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400 mx-auto">
            <ImageIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">PDF to JPG Converter</h1>
          <p className="text-xs text-slate-400">Render every page of your PDF into crisp, high-resolution JPG images 100% client-side.</p>
        </div>

        <div className="fmf-panel p-6 space-y-6">
          {!file ? (
            <div className="fmf-dropzone rounded-2xl p-8 text-center space-y-3">
              <Upload className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="text-sm font-bold text-slate-200">Upload PDF to Convert</p>
              <input type="file" accept="application/pdf" onChange={handleFileChange} id="pdf-to-jpg-input" className="hidden" />
              <label
                htmlFor="pdf-to-jpg-input"
                className="inline-block px-5 py-2.5 fmf-btn-primary text-xs font-extrabold cursor-pointer"
              >
                Choose PDF File
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <div>
                    <h4 className="font-bold text-white">{file.name}</h4>
                    <p className="text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setConvertedImages([]);
                    setErrorMsg(null);
                  }}
                  className="px-3 py-1.5 rounded-lg fmf-btn-secondary text-xs font-bold cursor-pointer"
                >
                  Change File
                </button>
              </div>

              {/* Resolution selector */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                {[
                  { label: 'Standard (1×)', scale: 1.25 },
                  { label: 'High Quality (1.75×)', scale: 1.75 },
                  { label: 'Ultra Crisp (2.5×)', scale: 2.5 }
                ].map((opt) => (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setDpiScale(opt.scale)}
                    className={`py-2.5 rounded-xl font-bold border transition-all cursor-pointer ${
                      dpiScale === opt.scale
                        ? 'bg-blue-600 border-blue-400 text-white'
                        : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-4 fmf-btn-primary font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <ImageIcon className="w-5 h-5" />}
                <span>{isProcessing ? 'Rendering PDF Pages...' : 'Convert PDF Pages to JPG'}</span>
              </button>

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {convertedImages.length > 0 && (
                <div className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold text-emerald-400">
                      Rendered {convertedImages.length} {convertedImages.length === 1 ? 'Page' : 'Pages'}
                    </span>
                    {convertedImages.length > 1 && (
                      <button
                        type="button"
                        onClick={handleDownloadAllZip}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Archive className="w-3.5 h-3.5" /> Download All ({convertedImages.length} JPGs) as ZIP
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {convertedImages.map((page) => (
                      <div key={page.pageNum} className="bg-black/40 border border-white/10 rounded-xl p-2.5 space-y-2 text-center">
                        <img
                          src={page.dataUrl}
                          alt={`Page ${page.pageNum}`}
                          className="w-full h-44 object-contain rounded bg-white"
                        />
                        <div className="text-[10px] font-mono text-slate-400">
                          {page.width} × {page.height} px
                        </div>
                        <a
                          href={page.dataUrl}
                          download={`${file.name.replace(/\.pdf$/i, '')}_page_${page.pageNum}.jpg`}
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:text-blue-300"
                        >
                          <Download className="w-3.5 h-3.5" /> Download Page {page.pageNum}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
