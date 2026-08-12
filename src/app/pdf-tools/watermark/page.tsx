'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { watermarkPdf, WatermarkOptions } from '@/lib/pdf/pdfTools';
import { Stamp, Upload, Download, RefreshCw, ArrowLeft, CheckCircle2, FileText } from 'lucide-react';

export default function WatermarkPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [opacity, setOpacity] = useState<number>(0.3);
  const [rotation, setRotation] = useState<number>(-30);
  const [position, setPosition] = useState<WatermarkOptions['position']>('center');
  const [color, setColor] = useState('#3b82f6');
  const [isProcessing, setIsProcessing] = useState(false);
  const [watermarkedUrl, setWatermarkedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setWatermarkedUrl(null);
    }
  };

  const handleApplyWatermark = async () => {
    if (!file || !watermarkText.trim()) return;
    setIsProcessing(true);
    try {
      const blob = await watermarkPdf(file, {
        type: 'text',
        text: watermarkText,
        fontSize: 48,
        opacity,
        rotation,
        position,
        color,
      });
      setWatermarkedUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Watermark error:', err);
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
            <Stamp className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Watermark PDF Pages</h1>
          <p className="text-xs text-gray-400">Stamp text watermarks over your PDF document to protect copyright and identity.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6">
          {!file ? (
            <div className="border-2 border-dashed border-gray-800 hover:border-blue-500/60 rounded-2xl p-8 text-center space-y-3 bg-gray-950/50">
              <Upload className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="text-sm font-bold text-gray-300">Upload PDF to Watermark</p>
              <input type="file" accept="application/pdf" onChange={handleFileChange} id="pdf-wm-input" className="hidden" />
              <label
                htmlFor="pdf-wm-input"
                className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-lg shadow-blue-600/30"
              >
                Choose PDF File
              </label>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-gray-950 border border-gray-800 rounded-2xl p-4 text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-400" />
                  <div>
                    <h4 className="font-bold text-white">{file.name}</h4>
                    <p className="text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-white text-xs font-bold"
                >
                  Change File
                </button>
              </div>

              {/* Settings Form */}
              <div className="space-y-4 bg-gray-950 p-5 rounded-2xl border border-gray-800">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Watermark Text</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY"
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Position</label>
                    <select
                      value={position}
                      onChange={(e) => setPosition(e.target.value as any)}
                      className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                    >
                      <option value="center">Center</option>
                      <option value="tile">Tile Grid</option>
                      <option value="top-left">Top Left</option>
                      <option value="top-right">Top Right</option>
                      <option value="bottom-left">Bottom Left</option>
                      <option value="bottom-right">Bottom Right</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Opacity ({(opacity * 100).toFixed(0)}%)</label>
                    <input
                      type="range"
                      min={0.1}
                      max={1.0}
                      step={0.05}
                      value={opacity}
                      onChange={(e) => setOpacity(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1">Color</label>
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-full h-9 bg-gray-900 border border-gray-800 rounded-xl p-1 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleApplyWatermark}
                disabled={isProcessing || !watermarkText.trim()}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Stamp className="w-5 h-5" />}
                <span>Apply Watermark to PDF</span>
              </button>

              {watermarkedUrl && (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Watermark Applied!
                  </div>
                  <a
                    href={watermarkedUrl}
                    download={`watermarked_${file.name}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs rounded-xl shadow-lg"
                  >
                    <Download className="w-4 h-4" /> Download Watermarked PDF
                  </a>
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
