'use client';

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, File, Image as ImageIcon, Camera, RefreshCw, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';
import { UploadedFile } from '@/types/document';
import { CameraCaptureModal } from '../camera/CameraCaptureModal';

interface DropzoneUploadProps {
  uploadedFile: UploadedFile | null;
  onFileUpload: (uploaded: UploadedFile) => void;
  onClearFile: () => void;
  acceptLabel?: string;
}

export const DropzoneUpload: React.FC<DropzoneUploadProps> = ({
  uploadedFile,
  onFileUpload,
  onClearFile,
  acceptLabel = 'JPG, PNG, WEBP, or PDF'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processSelectedFile = useCallback((file: File) => {
    setErrorMsg(null);
    if (file.size > 25 * 1024 * 1024) {
      setErrorMsg('This file is too large. Please upload a document smaller than 25 MB.');
      return;
    }

    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const originalSizeKB = Number((file.size / 1024).toFixed(2));

    if (isPdf) {
      onFileUpload({
        id: `pdf-${Date.now()}`,
        file,
        name: file.name,
        originalSizeKB,
        type: 'application/pdf',
        previewUrl: '/pdf-icon.png',
        isPdf: true
      });
      return;
    }

    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      onFileUpload({
        id: `img-${Date.now()}`,
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

  return (
    <div className="w-full space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) processSelectedFile(e.target.files[0]);
        }}
      />

      {!uploadedFile ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.[0]) processSelectedFile(e.dataTransfer.files[0]);
          }}
          className={`fmf-dropzone rounded-3xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer ${
            isDragging ? 'fmf-dropzone-active border-blue-500 scale-[1.01]' : ''
          }`}
          onClick={() => inputRef.current?.click()}
        >
          <div className="w-20 h-20 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5 shadow-inner">
            <UploadCloud className="w-10 h-10 text-blue-400" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-white mb-2 tracking-tight">
            Drop your image here
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-sm mx-auto">
            {acceptLabel} (Max 25 MB)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="fmf-btn-primary px-8 py-3.5 text-sm sm:text-base font-black flex items-center gap-2.5 cursor-pointer"
            >
              <ImageIcon className="w-5 h-5" />
              <span>Select images</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="fmf-btn-secondary px-5 py-3.5 text-xs sm:text-sm font-bold flex items-center gap-2 cursor-pointer"
            >
              <Camera className="w-4 h-4 text-amber-400" />
              <span>Use Camera</span>
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-center gap-2 text-xs text-emerald-400 font-semibold">
            <ShieldCheck className="w-4 h-4" />
            <span>100% Client-Side Privacy • No Files Uploaded to Any Server</span>
          </div>
        </div>
      ) : (
        <div className="fmf-panel p-5 sm:p-6 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 overflow-hidden">
              <div className="w-16 h-16 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                {uploadedFile.isPdf ? (
                  <File className="w-8 h-8 text-amber-400" />
                ) : (
                  <img src={uploadedFile.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                )}
              </div>

              <div className="overflow-hidden">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
                    {uploadedFile.isPdf ? 'PDF' : uploadedFile.type.replace('image/', '').toUpperCase()}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded">
                    Ready
                  </span>
                </div>
                <h4 className="font-bold text-white text-sm truncate max-w-xs sm:max-w-md mt-1">
                  {uploadedFile.name}
                </h4>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                  <span>
                    Size: <strong className="text-emerald-400 font-mono">{uploadedFile.originalSizeKB > 1024 ? `${(uploadedFile.originalSizeKB / 1024).toFixed(2)} MB` : `${uploadedFile.originalSizeKB} KB`}</strong>
                  </span>
                  {uploadedFile.width && uploadedFile.height && (
                    <span>
                      • <strong className="text-blue-300 font-mono">{uploadedFile.width} × {uploadedFile.height} px</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onClearFile();
                if (inputRef.current) inputRef.current.value = '';
              }}
              className="fmf-btn-secondary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Change</span>
            </button>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl text-rose-300 text-xs flex items-center gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {isCameraOpen && (
        <CameraCaptureModal
          isOpen={isCameraOpen}
          onClose={() => setIsCameraOpen(false)}
          onCapture={(file) => processSelectedFile(file)}
        />
      )}
    </div>
  );
};
