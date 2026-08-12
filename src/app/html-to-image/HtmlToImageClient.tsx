'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { SeoContentSection } from '@/components/seo/SeoContentSection';
import { renderHtmlToCanvas } from '@/lib/image/editorTools';
import { Code, Download, RefreshCw, CheckCircle2, Sparkles } from 'lucide-react';

const DEFAULT_HTML = `<div style="text-align: center; font-family: sans-serif;">
  <h1 style="color: #6366f1; font-size: 36px; margin-bottom: 8px;">HTML to Image</h1>
  <p style="color: #94a3b8; font-size: 18px;">Render custom HTML &amp; CSS snippets to high-res PNG images!</p>
  <div style="margin-top: 20px; padding: 12px 24px; background: #6366f1; color: white; border-radius: 12px; display: inline-block; font-weight: bold;">
    100% Client-Side
  </div>
</div>`;

export default function HtmlToImageClient() {
  const [htmlContent, setHtmlContent] = useState(DEFAULT_HTML);
  const [canvasWidth, setCanvasWidth] = useState(800);
  const [canvasHeight, setCanvasHeight] = useState(450);
  const [bgColor, setBgColor] = useState('#0d121e');
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processRender = async () => {
    setIsProcessing(true);
    try {
      const canvas = await renderHtmlToCanvas(htmlContent, canvasWidth, canvasHeight, bgColor);
      canvas.toBlob((blob) => {
        if (blob) {
          if (renderedUrl) URL.revokeObjectURL(renderedUrl);
          setRenderedUrl(URL.createObjectURL(blob));
        }
        setIsProcessing(false);
      }, 'image/png', 0.95);
    } catch (e) {
      console.error(e);
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) processRender();
    }, 0);
    return () => {
      active = false;
    };
  }, [htmlContent, canvasWidth, canvasHeight, bgColor]);

  return (
    <div className="min-h-screen bg-[#080b11] text-slate-100 flex flex-col selection:bg-indigo-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Code className="w-4 h-4 text-indigo-400" />
            <span>HTML & CSS Code Canvas Renderer</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            HTML to <span className="gradient-text">IMAGE</span> Converter
          </h1>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Convert HTML markup and CSS styles into high-resolution PNG or JPG graphics instantly inside your web browser.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[#0d121e] border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-white text-sm flex items-center gap-2">
                  <Code className="w-4 h-4 text-indigo-400" /> HTML Markup Editor
                </h3>
              </div>

              <textarea
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                rows={8}
                className="w-full p-4 rounded-2xl bg-black/50 border border-white/10 text-emerald-400 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />

              <div className="grid grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Canvas Width</label>
                  <input
                    type="number"
                    value={canvasWidth}
                    onChange={(e) => setCanvasWidth(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Canvas Height</label>
                  <input
                    type="number"
                    value={canvasHeight}
                    onChange={(e) => setCanvasHeight(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Background Color</label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-9 rounded-xl bg-transparent border-0 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <h2 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Rendered Image Preview</span>
            </h2>

            {renderedUrl ? (
              <div className="bg-[#0d121e] border border-emerald-500/30 rounded-3xl p-6 space-y-6 shadow-2xl backdrop-blur-2xl">
                <div className="p-2 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center min-h-[260px]">
                  <img src={renderedUrl} alt="Rendered HTML" className="max-h-[350px] w-auto object-contain rounded-lg" />
                </div>

                <a
                  href={renderedUrl}
                  download="rendered-html.png"
                  className="w-full py-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 transition-all shadow-xl"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Rendered PNG</span>
                </a>
              </div>
            ) : (
              <div className="bg-[#0d121e] border border-white/10 border-dashed rounded-3xl p-10 text-center text-slate-400 space-y-3">
                <Code className="w-8 h-8 text-indigo-400 mx-auto" />
                <h4 className="font-extrabold text-white text-base">Rendering Preview</h4>
                <p className="text-xs text-slate-400">Type HTML snippet above to render live image graphics.</p>
              </div>
            )}
          </div>
        </div>

        <SeoContentSection
          title="Render Web Graphics, Cards & Code Snippets into PNG"
          description="FitMyForm's HTML to image converter uses SVG foreignObject rendering to render styled HTML and CSS markup directly to image canvas."
          faqs={[
            {
              question: 'Does this support custom inline CSS styling?',
              answer: 'Yes! You can add inline CSS styling (colors, fonts, borders, shadows, flexbox layout) to your HTML tags.'
            }
          ]}
        />
      </main>

      <Footer />
    </div>
  );
}
