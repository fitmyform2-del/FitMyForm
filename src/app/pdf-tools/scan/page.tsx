'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { Camera, Download, RefreshCw, ArrowLeft, CheckCircle2, Trash2 } from 'lucide-react';
import { imagesToPdf } from '@/lib/pdf/pdfTools';

export default function ScanToPdfPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedBlobs, setCapturedBlobs] = useState<Blob[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedPdfUrl, setScannedPdfUrl] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleStartCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error('Camera access error:', err);
      alert('Camera access denied or un-supported.');
    }
  };

  const handleStopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const handleSnapPhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          setCapturedBlobs((prev) => [...prev, blob]);
          setScannedPdfUrl(null);
        }
      }, 'image/jpeg', 0.92);
    }
  };

  const handleGenerateScannedPdf = async () => {
    if (capturedBlobs.length === 0) return;
    setIsProcessing(true);
    try {
      const imageFiles = capturedBlobs.map((b, i) => new File([b], `scan_${i + 1}.jpg`, { type: 'image/jpeg' }));
      const pdfBlob = await imagesToPdf(imageFiles, { pageSize: 'a4', orientation: 'portrait', margin: 'small' });
      setScannedPdfUrl(URL.createObjectURL(pdfBlob));
      handleStopCamera();
    } catch (err) {
      console.error('Scan PDF error:', err);
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
            <Camera className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Scan to PDF Document</h1>
          <p className="text-xs text-gray-400">Capture pages directly using your phone or laptop camera and export to PDF.</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 space-y-6">
          {!isCameraActive ? (
            <div className="border-2 border-dashed border-gray-800 rounded-2xl p-8 text-center space-y-4 bg-gray-950/50">
              <Camera className="w-10 h-10 text-blue-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-white text-sm">Start Document Camera Scanner</h3>
                <p className="text-xs text-gray-400">Requires camera permissions to snap document pages.</p>
              </div>
              <button
                onClick={handleStartCamera}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-blue-600/30"
              >
                Open Camera Feed
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-video border border-gray-800">
                <video ref={videoRef} className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleSnapPhoto}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" /> Snap Page Photo
                </button>
                <button
                  onClick={handleStopCamera}
                  className="px-4 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold text-xs rounded-xl"
                >
                  Stop Camera
                </button>
              </div>
            </div>
          )}

          {capturedBlobs.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-gray-800">
              <span className="text-xs font-bold text-gray-300">Captured Pages ({capturedBlobs.length})</span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {capturedBlobs.map((b, idx) => (
                  <div key={idx} className="relative bg-gray-950 rounded-xl overflow-hidden border border-gray-800 group">
                    <img src={URL.createObjectURL(b)} alt={`Scan ${idx + 1}`} className="w-full h-24 object-cover" />
                    <button
                      onClick={() => setCapturedBlobs(capturedBlobs.filter((_, i) => i !== idx))}
                      className="absolute top-1 right-1 p-1 bg-red-900/80 text-red-300 rounded hover:bg-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleGenerateScannedPdf}
                disabled={isProcessing}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                <span>Generate PDF from {capturedBlobs.length} Scanned Pages</span>
              </button>

              {scannedPdfUrl && (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Scanned PDF Document Ready!
                  </div>
                  <a
                    href={scannedPdfUrl}
                    download="scanned_document.pdf"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black text-xs rounded-xl shadow-lg"
                  >
                    <Download className="w-4 h-4" /> Download Scanned PDF
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
