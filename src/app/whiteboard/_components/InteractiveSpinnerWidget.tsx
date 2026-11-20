'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface InteractiveSpinnerWidgetProps {
  onClose: () => void;
  onWinSound: () => void;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

export function InteractiveSpinnerWidget({ onClose, onWinSound }: InteractiveSpinnerWidgetProps) {
  const [items, setItems] = useState<string[]>(['Alex', 'Brian', 'Chloe', 'David', 'Emma', 'Frank']);
  const [inputText, setInputText] = useState('Alex, Brian, Chloe, David, Emma, Frank');
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);

  const drawWheel = useCallback((angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const cx = size / 2;
    const cy = size / 2;
    const radius = size / 2 - 8;

    ctx.clearRect(0, 0, size, size);

    if (items.length === 0) return;
    const arc = (Math.PI * 2) / items.length;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    items.forEach((item, i) => {
      ctx.beginPath();
      ctx.fillStyle = COLORS[i % COLORS.length];
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, i * arc, (i + 1) * arc);
      ctx.lineTo(0, 0);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.save();
      ctx.rotate(i * arc + arc / 2);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px system-ui, sans-serif';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 4;
      ctx.fillText(item.length > 8 ? item.slice(0, 7) + '..' : item, radius - 14, 0);
      ctx.restore();
    });

    ctx.restore();

    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = '#ffffff';
    ctx.moveTo(size - 4, cy);
    ctx.lineTo(size - 18, cy - 8);
    ctx.lineTo(size - 18, cy + 8);
    ctx.closePath();
    ctx.fill();
  }, [items]);

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel]);

  const handleUpdateItems = () => {
    const parsed = inputText.split(',').map((s) => s.trim()).filter(Boolean);
    if (parsed.length >= 2) setItems(parsed);
  };

  const spin = () => {
    if (isSpinning || items.length < 2) return;
    setIsSpinning(true);
    setWinner(null);

    const extraSpins = 5 + Math.random() * 5;
    const targetRotation = rotationRef.current + extraSpins * Math.PI * 2;
    const startTime = Date.now();
    const duration = 3500;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentAngle = rotationRef.current + (targetRotation - rotationRef.current) * ease;

      drawWheel(currentAngle);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        rotationRef.current = currentAngle % (Math.PI * 2);
        setIsSpinning(false);
        // Calculate winner
        const normalized = (Math.PI * 2 - (rotationRef.current % (Math.PI * 2))) % (Math.PI * 2);
        const arc = (Math.PI * 2) / items.length;
        const winningIdx = Math.floor(normalized / arc) % items.length;
        const win = items[winningIdx];
        setWinner(win);
        onWinSound();
        try { confetti({ particleCount: 60, spread: 60 }); } catch {}
      }
    };
    requestAnimationFrame(animate);
  };

  return (
    <div className="bg-[#111726]/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl p-4 w-72 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="font-bold text-xs text-white uppercase tracking-wider">Random Picker Wheel</span>
        </div>
        <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex justify-center mb-3">
        <canvas ref={canvasRef} width={200} height={200} className="rounded-full shadow-lg" />
      </div>

      {winner && (
        <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-center mb-3 animate-in zoom-in-90">
          <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Winner</span>
          <span className="text-base font-black text-white">{winner}! 🎉</span>
        </div>
      )}

      <div className="space-y-2 mb-3">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onBlur={handleUpdateItems}
          placeholder="Comma-separated items"
          className="w-full bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1 text-xs text-white placeholder-slate-500 outline-none"
        />
      </div>

      <button
        onClick={spin}
        disabled={isSpinning}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-xs shadow-lg shadow-orange-600/30 transition-all cursor-pointer disabled:opacity-50"
      >
        {isSpinning ? 'Spinning...' : 'Spin Wheel!'}
      </button>
    </div>
  );
}
