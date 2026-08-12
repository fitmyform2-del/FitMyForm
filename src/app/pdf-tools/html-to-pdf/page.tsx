'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { Code, Download, RefreshCw, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export default function HtmlToPdfPage() {
  const [htmlContent, setHtmlContent] = useState(
    '<h1>FitMyForm Formatted Document</h1>\n<p>This is a sample document generated 100% client-side inside the web browser.</p>\n<ul>\n  <li>Zero server upload</li>\n  <li>Instant PDF download</li>\n  <li>Formatted print layout</li>\n</ul>'
  );
  const [docTitle, setDocTitle] = useState('My_Document');
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null);

  const handleGeneratePdf = async () => {
    if (!htmlContent.trim()) return;
    setIsProcessing(true);
    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4
      const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

      // Clean HTML tags for plain layout text drawing
      const lines = htmlContent
        .replace(/<h1[^>]*>/gi, '\n# ')
        .replace(/<\/h1>/gi, '\n')
        .replace(/<p[^>]*>/gi, '')
        .replace(/<\/p>/gi, '\n')
        .replace(/<li[^>]*>/gi, '• ')
        .replace(/<\/li>/gi, '\n')
        .replace(/<[^>]+>/g, '')
        .split('\n')
        .filter((l) => l.trim().length > 0);

      let yPos = 800;

      lines.forEach((line) => {
        if (line.startsWith('# ')) {
          page.drawText(line.replace('# ', ''), {
            x: 40,
            y: yPos,
            size: 20,
            font: fontBold,
            color: rgb(0.1, 0.2, 0.4),
          });
          yPos -= 32;
        } else {
          page.drawText(line, {
            x: 40,
            y: yPos,
            size: 11,
            font: fontRegular,
            color: rgb(0.2, 0.2, 0.2),
          });
          yPos -= 20;
        }
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setGeneratedPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('HTML to PDF error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col">
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
          <p className="text-xs text-gray-400">Convert formatted HTML code or text notes into print-ready PDF files.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">Document Title</label>
              <input
                type="text"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1">HTML / Plain Text Content</label>
              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                rows={10}
                className="w-full bg-gray-950 border border-gray-800 rounded-2xl p-4 text-xs font-mono text-gray-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={handleGeneratePdf}
              disabled={isProcessing || !htmlContent.trim()}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
            >
              {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Code className="w-5 h-5" />}
              <span>Generate PDF Document</span>
            </button>

            {generatedPdfUrl && (
              <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" /> PDF Generated Successfully!
                </div>
                <a
                  href={generatedPdfUrl}
                  download={`${docTitle.replace(/\s+/g, '_')}.pdf`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs rounded-xl shadow-lg"
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
