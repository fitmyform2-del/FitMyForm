'use client';

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, File, Image as ImageIcon, Camera, RefreshCw, AlertCircle, Shield, CheckCircle2 } from 'lucide-react';
import { UploadedFile } from '@/types/document';
import { CameraCaptureModal } from '../camera/CameraCaptureModal';

interface DropzoneUploadProps {
  uploadedFile: UploadedFile | null;
  onFileUpload: (uploaded: UploadedFile) => void;
  onClearFile: () => void;
}

export const DropzoneUpload: React.FC<DropzoneUploadProps> = ({
  uploadedFile,
  onFileUpload,
  onClearFile
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processSelectedFile = useCallback((file: File) => {
    setErrorMsg(null);

    // Limit maximum upload size (e.g. 25 MB)
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('This file is too large. Please upload a document smaller than 25 MB.');
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const originalSizeKB = Number((file.size / 1024).toFixed(2));

    if (isPdf) {
      const previewUrl = '/pdf-icon.png';
      onFileUpload({
        id: Date.now().toString(),
        file,
        name: file.name,
        originalSizeKB,
        type: 'application/pdf',
        previewUrl,
        isPdf: true
      });
      return;
    }

    // Process image dimensions
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      onFileUpload({
        id: Date.now().toString(),
        file,
        name: file.name,
        originalSizeKB,
        type: file.type || 'image/jpeg',
        width: img.width,
        height: img.height,
        aspectRatio: Number((img.width / img.height).toFixed(2)),
        previewUrl: objectUrl,
        isPdf: false
      });
    };

    img.onerror = () => {
      setErrorMsg('Could not load this image file. Please ensure it is a valid JPG, PNG, or WEBP image.');
    };

    img.src = objectUrl;
  }, [onFileUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={handleChange}
      />

      {!uploadedFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-3xl p-6 sm:p-10 text-center transition-all duration-300 group cursor-pointer ${
            isDragging
              ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01] shadow-2xl shadow-indigo-500/20'
              : 'border-white/15 hover:border-indigo-500/50 bg-[#0d121e]/80 hover:bg-[#0d121e] shadow-xl'
          }`}
        >
          {/* Animated Glow Backing */}
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 transition-all duration-300 shadow-inner">
            <UploadCloud className="w-8 h-8 text-indigo-400 group-hover:text-indigo-300" />
          </div>

          <h3 className="text-lg font-black text-white mb-1 tracking-tight">
            Drag & Drop your photo or document here
          </h3>
          <p className="text-xs text-slate-400 mb-6 max-w-sm mx-auto leading-relaxed">
            Passport Photos, Signatures, Thumb Impressions, Certificates (JPG, PNG, WEBP, PDF).
          </p>

          {/* Action Buttons: File Picker & Camera Capture */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/25 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Select File from Device</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Photo via Camera</span>
            </button>
          </div>

          <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-emerald-400" /> Max file size: 25 MB
            </span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Browser In-Memory Processing
            </span>
          </div>
        </div>
      ) : (
        /* Uploaded File Active Card */
        <div className="bg-[#0d121e] border border-indigo-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 animate-fade-in relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-16 h-16 rounded-2xl bg-[#080b11] border border-white/15 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {uploadedFile.isPdf ? (
                  <File className="w-8 h-8 text-amber-400" />
                ) : (
                  <img
                    src={uploadedFile.previewUrl}
                    alt="Source Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-wider uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-md font-mono">
                    {uploadedFile.isPdf ? 'PDF Document' : uploadedFile.type.replace('image/', '').toUpperCase()}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm truncate max-w-xs sm:max-w-md mt-1">
                  {uploadedFile.name}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                  <span>
                    Original Size: <strong className="text-emerald-400 font-mono font-bold">{uploadedFile.originalSizeKB > 1024 ? `${(uploadedFile.originalSizeKB / 1024).toFixed(2)} MB` : `${uploadedFile.originalSizeKB} KB`}</strong>
                  </span>
                  {uploadedFile.width && uploadedFile.height && (
                    <span>
                      • Dimensions: <strong className="text-indigo-300 font-mono font-bold">{uploadedFile.width} × {uploadedFile.height} px</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Retake Photo using Camera"
              >
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Camera</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClearFile();
                  if (inputRef.current) inputRef.current.value = '';
                }}
                className="px-3.5 py-2 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center gap-1.5 border border-white/10 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                <span>Change File</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Camera Capture Modal */}
      {isCameraOpen && (
        <CameraCaptureModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={(file) => {
            processSelectedFile(file);
          }}
        />
      )}
    </div>
  );
};

