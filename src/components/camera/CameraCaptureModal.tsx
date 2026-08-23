'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, RefreshCw, Check, SwitchCamera, AlertCircle } from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (capturedFile: File, capturedDataUrl: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [capturedUrl, setCapturedUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = useCallback(async () => {
    setIsLoading(true);
    setErrorMsg(null);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err: unknown) {
      const error = err as { name?: string };
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        setErrorMsg('Camera permission denied. Please allow camera access in your browser settings.');
      } else {
        setErrorMsg('Could not access camera device. Please check if camera is connected.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [facingMode]);

  useEffect(() => {
    let active = true;
    if (isOpen && !capturedUrl) {
      setTimeout(() => {
        if (active) startCamera();
      }, 0);
    }

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [isOpen, capturedUrl, startCamera]);

  const handleTakePhoto = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (facingMode === 'user') {
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
    setCapturedUrl(dataUrl);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const handleConfirmPhoto = () => {
    if (!capturedUrl) return;
    fetch(capturedUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `camera_photo_${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file, capturedUrl);
        onClose();
      });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
              <Camera className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Take Photo directly from Camera</h3>
              <p className="text-[11px] text-gray-400">Position face or signature inside the frame</p>
            </div>
          </div>
          <button
            onClick={() => {
              if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
              onClose();
            }}
            className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-gray-400 hover:text-white rounded-xl hover:bg-gray-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Stream Area */}
        <div className="relative aspect-[4/3] bg-black flex items-center justify-center overflow-hidden">
          {errorMsg ? (
            <div className="p-6 text-center text-red-300 space-y-3">
              <AlertCircle className="w-10 h-10 mx-auto text-red-400" />
              <p className="text-xs font-semibold">{errorMsg}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2.5 min-h-[44px] bg-gray-800 hover:bg-gray-700 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : capturedUrl ? (
            <img src={capturedUrl} alt="Captured Snapshot" className="w-full h-full object-cover" />
          ) : (
            <>
              <video
                ref={videoRef}
                playsInline
                muted
                className={`w-full h-full object-cover ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
              />
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-48 h-60 border-2 border-dashed border-blue-400/80 rounded-[50%] shadow-[0_0_0_9999px_rgba(0,0,0,0.4)] flex items-center justify-center">
                  <span className="text-[11px] font-semibold text-blue-200 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-500/40">
                    Center Face Here
                  </span>
                </div>
              </div>
            </>
          )}

          {isLoading && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-bold gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-400" />
              <span>Initializing Camera...</span>
            </div>
          )}
        </div>

        {/* Controls Footer */}
        <div className="p-4 bg-gray-950 border-t border-gray-800 flex items-center justify-between">
          {!capturedUrl ? (
            <>
              <button
                onClick={() => setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))}
                className="p-3 min-h-[44px] bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-2xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <SwitchCamera className="w-5 h-5 text-indigo-400" />
                <span className="hidden sm:inline">Flip Camera</span>
              </button>

              <button
                onClick={handleTakePhoto}
                disabled={isLoading || !!errorMsg}
                className="px-8 py-3.5 min-h-[48px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-2xl flex items-center gap-2 shadow-xl shadow-blue-600/30 cursor-pointer"
              >
                <Camera className="w-5 h-5 text-amber-300" />
                <span>Snap Photo</span>
              </button>

              <div className="w-10" />
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                onClick={() => { setCapturedUrl(null); startCamera(); }}
                className="px-4 py-2.5 min-h-[44px] bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RefreshCw className="w-4 h-4 text-amber-400" />
                <span>Retake Photo</span>
              </button>

              <button
                onClick={handleConfirmPhoto}
                className="px-6 py-2.5 min-h-[44px] bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Use Photo → Next Step</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
