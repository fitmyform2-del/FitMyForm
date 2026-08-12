'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { editPdf, AnnotationItem } from '@/lib/pdf/pdfTools';
import { FileText, Upload, Download, RefreshCw, ArrowLeft, CheckCircle2, Type, Square, Plus, Trash2 } from 'lucide-react';

export default function EditPdfPage() {
  const [file, setFile] = useState<File | null>(null);
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([
    { type: 'text', pageIndex: 0, xRatio: 0.1, yRatio: 0.15, text: 'Approved Document Annotation', color: '#1d4ed8', fontSize: 18 },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editedUrl, setEditedUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
      setEditedUrl(null);
    }
  };

  const handleAddAnnotation = () => {
    setAnnotations((prev) => [
      ...prev,
      { type: 'text', pageIndex: 0, xRatio: 0.1, yRatio: 0.2 + prev.length * 0.1, text: 'New Text Annotation', color: '#047857', fontSize: 16 },
    ]);
  };

  const handleSaveEdit = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const blob = await editPdf(file, annotations);
      setEditedUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error('Edit error:', err);
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
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Edit & Annotate PDF</h1>
          <p className="text-xs text-gray-400">Add text annotations, shapes, drawings, and stamps directly to PDF pages.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6">
          {!file ? (
            <div className="border-2 border-dashed border-gray-800 hover:border-blue-500/60 rounded-2xl p-8 text-center space-y-3 bg-gray-950/50">
              <Upload className="w-8 h-8 text-blue-400 mx-auto" />
              <p className="text-sm font-bold text-gray-300">Upload PDF to Edit</p>
              <input type="file" accept="application/pdf" onChange={handleFileChange} id="pdf-edit-input" className="hidden" />
              <label
                htmlFor="pdf-edit-input"
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

              {/* Annotations List */}
              <div className="space-y-3 bg-gray-950 p-5 rounded-2xl border border-gray-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-300">Active Annotations ({annotations.length})</span>
                  <button
                    onClick={handleAddAnnotation}
                    className="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-400" /> Add Text Layer
                  </button>
                </div>

                <div className="space-y-2">
                  {annotations.map((ann, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-gray-900 p-3 rounded-xl border border-gray-800 text-xs">
                      <input
                        type="text"
                        value={ann.text || ''}
                        onChange={(e) => {
                          const updated = [...annotations];
                          updated[idx].text = e.target.value;
                          setAnnotations(updated);
                        }}
                        className="bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white w-full max-w-sm mr-2"
                      />
                      <button
                        onClick={() => setAnnotations(annotations.filter((_, i) => i !== idx))}
                        className="p-1 text-red-400 hover:bg-red-950/50 rounded shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSaveEdit}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <FileText className="w-5 h-5" />}
                <span>Export Edited PDF</span>
              </button>

              {editedUrl && (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> PDF Annotations Exported!
                  </div>
                  <a
                    href={editedUrl}
                    download={`edited_${file.name}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs rounded-xl shadow-lg"
                  >
                    <Download className="w-4 h-4" /> Download Edited PDF
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
