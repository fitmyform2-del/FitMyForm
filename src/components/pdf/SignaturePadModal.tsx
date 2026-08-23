'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Check, RotateCcw, PenTool, Type, Upload } from 'lucide-react';

interface SignaturePadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSignature: (dataUrl: string) => void;
}

export const SignaturePadModal: React.FC<SignaturePadModalProps> = ({
  isOpen,
  onClose,
  onSaveSignature
}) => {
  const [tab, setTab] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedName, setTypedName] = useState('');
  const [strokeColor, setStrokeColor] = useState('#000000');

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (tab === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [tab, strokeColor]);

  if (!isOpen) return null;

  const handleStartDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const handleMoveDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
  };

  const handleSave = () => {
    if (tab === 'draw' && canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL('image/png');
      onSaveSignature(dataUrl);
      onClose();
    } else if (tab === 'type' && typedName.trim()) {
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 120;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.fillStyle = strokeColor;
        ctx.font = 'italic 36px Georgia, serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(typedName, 200, 60);
        onSaveSignature(canvas.toDataURL('image/png'));
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-lg text-white flex items-center gap-2">
            <PenTool className="w-5 h-5 text-blue-400" /> Create Signature
          </h3>
          <button onClick={onClose} className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 bg-gray-950 p-1.5 rounded-xl border border-gray-800">
          {[
            { id: 'draw', label: 'Draw', icon: PenTool },
            { id: 'type', label: 'Type', icon: Type },
            { id: 'upload', label: 'Upload', icon: Upload }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id as any)}
                className={`flex-1 py-2.5 min-h-[44px] rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                  tab === item.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" /> {item.label}
              </button>
            );
          })}
        </div>

        {tab !== 'upload' && (
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Color:</span>
            <div className="flex items-center gap-3">
              {['#000000', '#1d4ed8', '#047857', '#b91c1c'].map((c) => (
                <button
                  key={c}
                  onClick={() => setStrokeColor(c)}
                  className={`w-8 h-8 min-h-[32px] rounded-full border-2 cursor-pointer ${
                    strokeColor === c ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}

        {tab === 'draw' && (
          <div className="space-y-3">
            <div className="bg-white rounded-2xl p-2 relative shadow-inner overflow-hidden">
              <canvas
                ref={canvasRef}
                width={440}
                height={160}
                onMouseDown={handleStartDraw}
                onMouseMove={handleMoveDraw}
                onMouseUp={() => { isDrawing.current = false; }}
                onMouseLeave={() => { isDrawing.current = false; }}
                onTouchStart={handleStartDraw}
                onTouchMove={handleMoveDraw}
                onTouchEnd={() => { isDrawing.current = false; }}
                className="w-full h-40 cursor-crosshair touch-none"
              />
            </div>
            <button
              onClick={() => {
                const canvas = canvasRef.current;
                if (canvas) canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
              }}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white min-h-[36px] cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear Canvas
            </button>
          </div>
        )}

        {tab === 'type' && (
          <div className="space-y-4">
            <input
              type="text"
              value={typedName}
              onChange={(e) => setTypedName(e.target.value)}
              placeholder="Type your name..."
              className="w-full min-h-[44px] bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <div className="bg-white p-6 rounded-2xl text-center text-3xl font-serif italic text-black min-h-[100px] flex items-center justify-center">
              {typedName || 'Your Signature'}
            </div>
          </div>
        )}

        {tab === 'upload' && (
          <div className="border-2 border-dashed border-gray-800 hover:border-blue-500 rounded-2xl p-8 text-center space-y-3">
            <Upload className="w-8 h-8 text-gray-400 mx-auto" />
            <p className="text-xs text-gray-300">Upload signature image (PNG, JPG)</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              id="sig-upload"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    if (typeof reader.result === 'string') {
                      onSaveSignature(reader.result);
                      onClose();
                    }
                  };
                  reader.readAsDataURL(file);
                }
              }}
            />
            <label
              htmlFor="sig-upload"
              className="inline-block px-4 py-2.5 min-h-[44px] bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              Choose Signature File
            </label>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2.5 min-h-[44px] rounded-xl text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={tab === 'type' && !typedName.trim()}
            className="px-6 py-2.5 min-h-[44px] rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold flex items-center gap-2 shadow-lg shadow-blue-600/30 cursor-pointer"
          >
            <Check className="w-4 h-4" /> Apply Signature
          </button>
        </div>
      </div>
    </div>
  );
};
