'use client';

import React, { useRef, useState } from 'react';
import { X, Eraser, Check } from 'lucide-react';

interface QuickSignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertSignature: (dataUrl: string) => void;
}

export const QuickSignModal: React.FC<QuickSignModalProps> = ({
  isOpen,
  onClose,
  onInsertSignature
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inkColor, setInkColor] = useState('#0f172a');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStrokes, setHasStrokes] = useState(false);

  if (!isOpen) return null;

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height
    };
  };

  const handleDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.strokeStyle = inkColor;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    setHasStrokes(true);
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const handleUp = () => setIsDrawing(false);

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    setHasStrokes(false);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasStrokes) return;
    onInsertSignature(canvas.toDataURL('image/png'));
    handleClear();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0f1525] border border-white/15 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-5 py-4 bg-[#0a0f1c] border-b border-white/10 flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-white">Draw Signature</h3>
            <p className="text-xs text-slate-400">Draw with mouse or finger — inserts as transparent PNG.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-2xl bg-white border-2 border-dashed border-slate-300 overflow-hidden">
            <canvas
              ref={canvasRef}
              width={560}
              height={220}
              onPointerDown={handleDown}
              onPointerMove={handleMove}
              onPointerUp={handleUp}
              onPointerCancel={handleUp}
              className="w-full h-48 block touch-none cursor-crosshair"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {['#0f172a', '#1d4ed8', '#dc2626'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setInkColor(c)}
                  className={`w-6 h-6 rounded-full border-2 cursor-pointer ${
                    inkColor === c ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
              <input
                type="range"
                min="2"
                max="7"
                value={strokeWidth}
                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                className="w-20 accent-blue-500 ml-2"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
              >
                <Eraser className="w-3.5 h-3.5" />
                Clear
              </button>
              <button
                type="button"
                disabled={!hasStrokes}
                onClick={handleSave}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                Insert Signature
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
