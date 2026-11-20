'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { extractPdfTextByPage } from '@/lib/pdf/pdfjsLoader';
import { FileCode, Upload, Download, RefreshCw, ArrowLeft, FileText, Copy, Check, AlertCircle } from 'lucide-react';

export default function PdfToTextPage() {
  const [file, setFile] = useState<File | null>(null);
  const [extractedText, setExtractedText] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setExtractedText('');
      setPageCount(0);
      setErrorMsg(null);
    }
  };

  const handleExtractText = async () => {
    if (!file) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const pages = await extractPdfTextByPage(file);
      setPageCount(pages.length);

      const nonEmptyPages = pages.filter((p) => p.text.trim().length > 0);
      if (nonEmptyPages.length === 0) {
        setExtractedText('');
        setErrorMsg(
          'No selectable text layer was found in this PDF. It appears to be a scanned image-only PDF (OCR is not available offline).'
        );
        return;
      }

      const formatted = pages
        .map((p) => `--- Page ${p.pageNum} of ${pages.length} ---\n${p.text || '(No text on this page)'}`)
        .join('\n\n');

      setExtractedText(formatted);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not read text from this PDF.';
      setErrorMsg(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(extractedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([extractedText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file?.name.replace(/\.pdf$/i, '') || 'document'}_text.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
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
            <FileCode className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Extract Text from PDF</h1>
          <p className="text-xs text-slate-400">Extract real readable text from PDF pages directly in your browser and copy or export as .txt.</p>
        </div>

        <div className="fmf-panel p-6 space-y-6">
          {!file ? (
            <div className="fmf-dropzone rounded-2xl p-8 text-center space-y-3">
              <Upload className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="text-sm font-bold text-slate-200">Upload PDF to Extract Text</p>
              <input type="file" accept="application/pdf" onChange={handleFileChange} id="pdf-text-input" className="hidden" />
              <label
                htmlFor="pdf-text-input"
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
                    <p className="text-slate-400">
                      {(file.size / 1024).toFixed(1)} KB {pageCount > 0 ? `• ${pageCount} pages` : ''}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setFile(null);
                    setExtractedText('');
                    setErrorMsg(null);
                  }}
                  className="px-3 py-1.5 rounded-lg fmf-btn-secondary text-xs font-bold cursor-pointer"
                >
                  Change File
                </button>
              </div>

              <button
                type="button"
                onClick={handleExtractText}
                disabled={isProcessing}
                className="w-full py-4 fmf-btn-primary font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileCode className="w-5 h-5" />}
                <span>{isProcessing ? 'Extracting Text...' : 'Extract Text Content'}</span>
              </button>

              {errorMsg && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {extractedText && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">
                      Extracted Text ({extractedText.length.toLocaleString()} characters)
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopy}
                        className="px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied!' : 'Copy Text'}
                      </button>
                      <button
                        type="button"
                        onClick={handleDownloadTxt}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Download .txt
                      </button>
                    </div>
                  </div>

                  <textarea
                    value={extractedText}
                    readOnly
                    rows={14}
                    className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none"
                  />
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
