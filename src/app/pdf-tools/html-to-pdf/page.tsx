'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { sanitizeWinAnsi } from '@/lib/pdf/pdfjsLoader';
import { Code, Download, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb, PDFFont } from 'pdf-lib';

function wrapTextLines(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, fontSize) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines.length > 0 ? lines : [''];
}

export default function HtmlToPdfPage() {
  const [htmlContent, setHtmlContent] = useState(
    '<h1>FitMyForm Formatted Document</h1>\n<p>This is a multi-page ready document generated 100% client-side inside your web browser with automatic line wrapping.</p>\n<ul>\n  <li>Zero server upload</li>\n  <li>Instant PDF download</li>\n  <li>Automatic word-wrap &amp; page breaks</li>\n</ul>'
  );
  const [docTitle, setDocTitle] = useState('My_Document');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);

  const handleGeneratePdf = async () => {
    if (!htmlContent.trim()) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      pdfDoc.setTitle(sanitizeWinAnsi(docTitle));
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      const pageW = 595.28;
      const pageH = 841.89;
      const marginX = 48;
      const marginTop = 56;
      const marginBottom = 56;
      const maxTextW = pageW - marginX * 2;

      let page = pdfDoc.addPage([pageW, pageH]);
      let yPos = pageH - marginTop;

      const ensureSpace = (needed: number) => {
        if (yPos - needed < marginBottom) {
          page = pdfDoc.addPage([pageW, pageH]);
          yPos = pageH - marginTop;
        }
      };

      const decoded = htmlContent
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");

      const blocks = decoded
        .replace(/<h1[^>]*>/gi, '\n# ')
        .replace(/<h2[^>]*>/gi, '\n## ')
        .replace(/<\/h[1-6]>/gi, '\n')
        .replace(/<p[^>]*>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<li[^>]*>/gi, '\n- ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      for (const rawBlock of blocks) {
        const clean = sanitizeWinAnsi(rawBlock);
        if (clean.startsWith('# ')) {
          const wrapped = wrapTextLines(clean.slice(2), fontBold, 20, maxTextW);
          for (const line of wrapped) {
            ensureSpace(28);
            page.drawText(line, { x: marginX, y: yPos, size: 20, font: fontBold, color: rgb(0.08, 0.16, 0.35) });
            yPos -= 28;
          }
          yPos -= 6;
        } else if (clean.startsWith('## ')) {
          const wrapped = wrapTextLines(clean.slice(3), fontBold, 15, maxTextW);
          for (const line of wrapped) {
            ensureSpace(22);
            page.drawText(line, { x: marginX, y: yPos, size: 15, font: fontBold, color: rgb(0.12, 0.22, 0.42) });
            yPos -= 22;
          }
          yPos -= 4;
        } else {
          const isBullet = clean.startsWith('- ');
          const text = isBullet ? `* ${clean.slice(2)}` : clean;
          const x = isBullet ? marginX + 12 : marginX;
          const wrapped = wrapTextLines(text, fontRegular, 11, maxTextW - (isBullet ? 12 : 0));
          for (const line of wrapped) {
            ensureSpace(17);
            page.drawText(line, { x, y: yPos, size: 11, font: fontRegular, color: rgb(0.18, 0.2, 0.24) });
            yPos -= 17;
          }
          yPos -= 5;
        }
      }

      const pdfBytes = await pdfDoc.save({ useObjectStreams: true });
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      if (generatedPdfUrl) URL.revokeObjectURL(generatedPdfUrl);
      setGeneratedPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('HTML to PDF error:', err);
    } finally {
      setIsProcessing(false);
    }
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
            <Code className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">HTML / Text to PDF Generator</h1>
          <p className="text-xs text-slate-400">Convert HTML notes or plain text into clean, multi-page wrapped PDF documents.</p>
        </div>

        <div className="fmf-panel p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">Document Title</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1">HTML / Plain Text Content</label>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                rows={10}
                className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-xs font-mono text-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="button"
              onClick={handleGeneratePdf}
              disabled={isProcessing || !htmlContent.trim()}
              className="w-full py-4 fmf-btn-primary font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Code className="w-5 h-5" />}
              <span>Generate PDF Document</span>
            </button>

            {generatedPdfUrl && (
              <div className="p-6 bg-emerald-950/50 border border-emerald-500/40 rounded-2xl text-center space-y-3 animate-fade-in">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" /> PDF Generated Successfully!
                </div>
                <a
                  href={generatedPdfUrl}
                  download={`${docTitle.replace(/\s+/g, '_') || 'document'}.pdf`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg"
                >
                  <Download className="w-4 h-4" /> Download PDF File
                </a>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
