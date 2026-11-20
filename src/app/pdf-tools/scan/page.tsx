'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/header/Navbar';
import { Footer } from '@/components/footer/Footer';
import { Camera, Download, RefreshCw, ArrowLeft, CheckCircle2, Trash2, AlertCircle } from 'lucide-react';
import { imagesToPdf } from '@/lib/pdf/pdfTools';

interface CapturedScan {
  id: string;
  blob: Blob;
  previewUrl: string;
}

export default function ScanToPdfPage() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedScans, setCapturedScans] = useState<CapturedScan[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scannedPdfUrl, setScannedPdfUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Attach MediaStream AFTER <video> element mounts when isCameraActive becomes true
  useEffect(() => {
    if (isCameraActive && streamRef.current && videoRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch(() => {});
    }
  }, [isCameraActive]);

  // Clean up camera tracks on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
    };
  }, []);

  const handleStartCamera = async () => {
    setErrorMsg(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrorMsg('Camera API is not supported in this browser or requires HTTPS.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' }, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      });
      streamRef.current = stream;
      setIsCameraActive(true);
    } catch {
      setErrorMsg('Camera access was denied or no camera was detected. Please allow camera permission and retry.');
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
    const video = videoRef.current;
    if (!video || video.videoWidth === 0) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCapturedScans((prev) => [
              ...prev,
              { id: `scan-${Date.now()}-${Math.random()}`, blob, previewUrl: URL.createObjectURL(blob) }
            ]);
            setScannedPdfUrl(null);
          }
        },
        'image/jpeg',
        0.92
      );
    }
  };

  const handleDeleteScan = (id: string) => {
    setCapturedScans((prev) => {
      const target = prev.find((s) => s.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((s) => s.id !== id);
    });
    setScannedPdfUrl(null);
  };

  const handleGenerateScannedPdf = async () => {
    if (capturedScans.length === 0) return;
    setIsProcessing(true);
    setErrorMsg(null);
    try {
      const imageFiles = capturedScans.map((s, i) => new File([s.blob], `scan_${i + 1}.jpg`, { type: 'image/jpeg' }));
      const pdfBlob = await imagesToPdf(imageFiles, { pageSize: 'a4', orientation: 'auto', margin: 'small' });
      if (scannedPdfUrl) URL.revokeObjectURL(scannedPdfUrl);
      setScannedPdfUrl(URL.createObjectURL(pdfBlob));
      handleStopCamera();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to build PDF from scanned photos.';
      setErrorMsg(msg);
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
            <Camera className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white">Scan to PDF Document</h1>
          <p className="text-xs text-slate-400">Capture pages directly using your phone or laptop camera and export to PDF.</p>
        </div>

        <div className="fmf-panel p-6 space-y-6">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {!isCameraActive ? (
            <div className="fmf-dropzone rounded-2xl p-8 text-center space-y-4">
              <Camera className="w-10 h-10 text-blue-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="font-bold text-white text-sm">Start Document Camera Scanner</h3>
                <p className="text-xs text-slate-400">Requires camera permissions to snap document pages.</p>
              </div>
              <button
                type="button"
                onClick={handleStartCamera}
                className="px-6 py-3 fmf-btn-primary text-xs font-extrabold cursor-pointer"
              >
                Open Camera Feed
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-2xl overflow-hidden aspect-video border border-white/10">
                <video ref={videoRef} playsInline muted autoPlay className="w-full h-full object-cover" />
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={handleSnapPhoto}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4" /> Snap Page Photo
                </button>
                <button
                  type="button"
                  onClick={handleStopCamera}
                  className="px-4 py-3 fmf-btn-secondary font-bold text-xs cursor-pointer"
                >
                  Stop Camera
                </button>
              </div>
            </div>
          )}

          {capturedScans.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <span className="text-xs font-bold text-slate-300">Captured Pages ({capturedScans.length})</span>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {capturedScans.map((scan, idx) => (
                  <div key={scan.id} className="relative bg-black/50 rounded-xl overflow-hidden border border-white/10">
                    <img src={scan.previewUrl} alt={`Scan ${idx + 1}`} className="w-full h-24 object-cover" />
                    <button
                      type="button"
                      onClick={() => handleDeleteScan(scan.id)}
                      className="absolute top-1 right-1 p-1 bg-rose-900/90 text-rose-200 rounded hover:bg-rose-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleGenerateScannedPdf}
                disabled={isProcessing}
                className="w-full py-4 fmf-btn-primary font-extrabold text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Camera className="w-5 h-5" />}
                <span>Generate PDF from {capturedScans.length} Scanned {capturedScans.length === 1 ? 'Page' : 'Pages'}</span>
              </button>

              {scannedPdfUrl && (
                <div className="p-6 bg-emerald-950/60 border border-emerald-500/40 rounded-2xl text-center space-y-3">
                  <div className="flex items-center justify-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" /> Scanned PDF Document Ready!
                  </div>
                  <a
                    href={scannedPdfUrl}
                    download="scanned_document.pdf"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg"
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
