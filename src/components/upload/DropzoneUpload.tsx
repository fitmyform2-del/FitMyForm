'use client';

import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, File, Image as ImageIcon, Camera, RefreshCw, AlertCircle } from 'lucide-react';
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
          className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all duration-200 group ${
            isDragging
              ? 'border-blue-500 bg-blue-950/30 scale-[1.01]'
              : 'border-gray-800 hover:border-blue-500/50 bg-gray-900/50'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-7 h-7 text-blue-400" />
          </div>

          <h3 className="text-base font-bold text-white mb-1">
            Drag & Drop your photo or document here
          </h3>
          <p className="text-xs text-gray-400 mb-5 max-w-sm mx-auto">
            Passport Photos, Signatures, Thumb Impressions, Certificates (JPG, PNG, WEBP, PDF).
          </p>

          {/* Action Buttons: File Picker & Camera Capture */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Choose File from Device</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCameraOpen(true)}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-600/20 flex items-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <Camera className="w-4 h-4" />
              <span>Take Photo with Camera</span>
            </button>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 text-[11px] text-gray-500">
            <span>Max file size: 25 MB</span>
            <span>•</span>
            <span>100% Client-Side Safe</span>
          </div>
        </div>
      ) : (
        /* Uploaded File Active Card */
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-14 h-14 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center overflow-hidden shrink-0">
                {uploadedFile.isPdf ? (
                  <File className="w-7 h-7 text-amber-400" />
                ) : (
                  <img
                    src={uploadedFile.previewUrl}
                    alt="Source Preview"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="overflow-hidden">
                <h4 className="font-bold text-white text-sm truncate max-w-xs sm:max-w-md">
                  {uploadedFile.name}
                </h4>
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-0.5">
                  <span className="bg-gray-800 text-gray-300 font-mono px-2 py-0.5 rounded text-[10px] uppercase">
                    {uploadedFile.isPdf ? 'PDF' : uploadedFile.type.replace('image/', '')}
                  </span>
                  <span>
                    Original Size: <strong className="text-emerald-400 font-mono">{uploadedFile.originalSizeKB > 1024 ? `${(uploadedFile.originalSizeKB / 1024).toFixed(2)} MB` : `${uploadedFile.originalSizeKB} KB`}</strong>
                  </span>
                  {uploadedFile.width && uploadedFile.height && (
                    <span>
                      • <strong className="text-blue-300 font-mono">{uploadedFile.width} × {uploadedFile.height} px</strong>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="px-2.5 py-1.5 bg-amber-950/80 border border-amber-800 text-amber-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1 transition-colors"
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
                className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Change</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-950/80 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
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
