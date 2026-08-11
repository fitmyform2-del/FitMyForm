'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Check, Move } from 'lucide-react';
import { CropRect, UploadedFile, DocumentRequirements } from '@/types/document';

interface InteractiveCropperProps {
  isOpen: boolean;
  uploadedFile: UploadedFile;
  requirements: DocumentRequirements;
  onClose: () => void;
  onApplyCrop: (rect: CropRect) => void;
}

export const InteractiveCropper: React.FC<InteractiveCropperProps> = ({
  isOpen,
  uploadedFile,
  requirements,
  onClose,
  onApplyCrop
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const targetW = requirements.width || 200;
  const targetH = requirements.height || 230;

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !uploadedFile.previewUrl) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = uploadedFile.previewUrl;
    img.onload = () => {
      // Set container dimensions
      const displayW = 400;
      const displayH = Math.round((displayW * targetH) / targetW);
      canvas.width = displayW;
      canvas.height = displayH;

      ctx.clearRect(0, 0, displayW, displayH);

      // Background color fill
      ctx.fillStyle = requirements.bgColor || '#FFFFFF';
      ctx.fillRect(0, 0, displayW, displayH);

      ctx.save();
      ctx.translate(displayW / 2 + offset.x, displayH / 2 + offset.y);
      if (rotation) {
        ctx.rotate((rotation * Math.PI) / 180);
      }

      const drawWidth = displayW * zoom;
      const drawHeight = (img.height / img.width) * drawWidth;

      ctx.drawImage(
        img,
        -drawWidth / 2,
        -drawHeight / 2,
        drawWidth,
        drawHeight
      );
      ctx.restore();

      // Draw requirement crop box overlay frame
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, displayW, displayH);

      // Draw subtle grid lines
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(displayW / 3, 0); ctx.lineTo(displayW / 3, displayH);
      ctx.moveTo((displayW * 2) / 3, 0); ctx.lineTo((displayW * 2) / 3, displayH);
      ctx.moveTo(0, displayH / 3); ctx.lineTo(displayW, displayH / 3);
      ctx.moveTo(0, (displayH * 2) / 3); ctx.lineTo(displayW, (displayH * 2) / 3);
      ctx.stroke();
    };
  }, [uploadedFile.previewUrl, targetW, targetH, zoom, rotation, offset, requirements.bgColor]);

  useEffect(() => {
    if (isOpen) {
      drawPreview();
    }
  }, [isOpen, drawPreview]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleSave = () => {
    const origW = uploadedFile.width || 800;
    const origH = uploadedFile.height || 600;

    // Convert display canvas offsets to source image crop coordinates
    const scaleFactor = origW / 400;
    const cropW = (targetW / 400) * origW * (1 / zoom);
    const cropH = (targetH / 400) * origH * (1 / zoom);
    const cropX = Math.max(0, (origW - cropW) / 2 - offset.x * scaleFactor);
    const cropY = Math.max(0, (origH - cropH) / 2 - offset.y * scaleFactor);

    onApplyCrop({
      x: cropX,
      y: cropY,
      width: cropW,
      height: cropH,
      zoom,
      rotation
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Move className="w-4 h-4 text-blue-400" />
              Visual Photo / Signature Cropper
            </h3>
            <p className="text-xs text-gray-400">
              Drag image inside box & adjust zoom to position face or signature.
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Interactive Canvas Workspace */}
        <div className="p-6 bg-gray-950/60 flex flex-col items-center justify-center select-none">
          <div
            className="relative border-2 border-blue-500 rounded-lg shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <canvas ref={canvasRef} className="block" />
          </div>
          <p className="text-[11px] text-gray-500 mt-2">
            Target Dimension: <strong className="text-blue-300 font-mono">{targetW} × {targetH} px</strong>
          </p>
        </div>

        {/* Controls */}
        <div className="p-4 bg-gray-900 border-t border-gray-800 space-y-4">
          <div className="flex items-center justify-between gap-4">
            {/* Zoom Slider */}
            <div className="flex items-center gap-2 flex-1">
              <ZoomOut className="w-4 h-4 text-gray-400" />
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1.5 bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <ZoomIn className="w-4 h-4 text-gray-400" />
            </div>

            {/* Rotation Button */}
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-semibold flex items-center gap-1 shrink-0"
            >
              <RotateCw className="w-4 h-4 text-emerald-400" />
              <span>Rotate</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-lg shadow-blue-600/20"
            >
              <Check className="w-4 h-4" />
              <span>Apply Exact Crop</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
