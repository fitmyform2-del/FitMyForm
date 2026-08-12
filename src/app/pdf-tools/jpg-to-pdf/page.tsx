'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { imagesToPdf, JpgToPdfOptions } from '@/lib/pdf/pdfTools';
import { FileImage, Upload, Download, RefreshCw, ArrowLeft, CheckCircle2, MoveUp, MoveDown, Trash2 } from 'lucide-react';

export default function JpgToPdfPage() {
  const [images, setImages] = useState<File[]>([]);
  const [layout, setLayout] = useState<JpgToPdfOptions>({
    pageSize: 'a4',
    orientation: 'portrait',
    margin: 'small',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((f) => f.type.includes('image'));
      setImages((prev) => [...prev, ...files]);
      setPdfUrl(null);
    }
  };

  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);
    try {
      const blob = await imagesToPdf(images, layout);
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('JPG to PDF error:', err);
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
            <FileImage className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">JPG to PDF Converter</h1>
          <p className="text-xs text-gray-400">Convert JPG, PNG, WEBP document photos into formatted PDF pages.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6">
          <div className="border-2 border-dashed border-gray-800 hover:border-blue-500/60 rounded-2xl p-8 text-center space-y-3 bg-gray-950/50">
            <Upload className="w-8 h-8 text-blue-400 mx-auto" />
            <p className="text-sm font-bold text-gray-300">Select JPG or PNG images</p>
            <input type="file" accept="image/*" multiple onChange={handleAddImages} id="jpg-to-pdf-input" className="hidden" />
            <label
              htmlFor="jpg-to-pdf-input"
              className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-lg shadow-blue-600/30"
            >
              Choose Images
            </label>
          </div>

          {images.length > 0 && (
            <div className="space-y-6">
              {/* Layout settings */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-950 p-4 rounded-2xl border border-gray-800">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Page Size</label>
                  <select
                    value={layout.pageSize}
                    onChange={(e) => setLayout({ ...layout, pageSize: e.target.value as any })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="a4">A4 Standard</option>
                    <option value="letter">US Letter</option>
                    <option value="fit">Fit to Image Size</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Orientation</label>
                  <select
                    value={layout.orientation}
                    onChange={(e) => setLayout({ ...layout, orientation: e.target.value as any })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                    <option value="auto">Auto Aspect Ratio</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Margin</label>
                  <select
                    value={layout.margin}
                    onChange={(e) => setLayout({ ...layout, margin: e.target.value as any })}
                    className="w-full bg-gray-900 border border-gray-800 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="none">No Margin</option>
                    <option value="small">Small Margin</option>
                    <option value="big">Big Margin</option>
                  </select>
                </div>
              </div>

              {/* Image list */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-400">Selected Images ({images.length})</span>
                {images.map((img, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-950 p-3 rounded-xl border border-gray-800 text-xs">
                    <span className="font-bold text-white truncate max-w-xs">{img.name}</span>
                    <button
                      onClick={() => setImages(images.filter((_, i) => i !== idx))}
                      className="p-1 text-red-400 hover:bg-red-950/50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileImage className="w-5 h-5" />}
                <span>Convert {images.length} Images to PDF</span>
              </button>

              {pdfUrl && (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> PDF Generated Successfully!
                  </div>
                  <a
                    href={pdfUrl}
                    download="images_converted.pdf"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs rounded-xl shadow-lg"
                  >
                    <Download className="w-4 h-4" /> Download Converted PDF
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
