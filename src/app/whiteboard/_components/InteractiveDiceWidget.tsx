'use client';

import React, { useState } from 'react';
import { X, Dices } from 'lucide-react';

interface InteractiveDiceWidgetProps {
  onClose: () => void;
  onRollSound: () => void;
}

const DOT_PATTERNS: Record<number, number[][]> = {
  1: [[1, 1]],
  2: [[0, 0], [2, 2]],
  3: [[0, 0], [1, 1], [2, 2]],
  4: [[0, 0], [0, 2], [2, 0], [2, 2]],
  5: [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]],
  6: [[0, 0], [0, 1], [0, 2], [2, 0], [2, 1], [2, 2]]
};

export function InteractiveDiceWidget({ onClose, onRollSound }: InteractiveDiceWidgetProps) {
  const [diceCount, setDiceCount] = useState<1 | 2 | 3>(2);
  const [values, setValues] = useState<number[]>([3, 4]);
  const [isRolling, setIsRolling] = useState(false);

  const roll = () => {
    if (isRolling) return;
    setIsRolling(true);
    onRollSound();

    let cycles = 0;
    const interval = setInterval(() => {
      setValues(Array.from({ length: diceCount }, () => Math.floor(Math.random() * 6) + 1));
      cycles++;
      if (cycles > 10) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 60);
  };

  const handleSetCount = (count: 1 | 2 | 3) => {
    setDiceCount(count);
    setValues(Array.from({ length: count }, () => Math.floor(Math.random() * 6) + 1));
  };

  const total = values.reduce((a, b) => a + b, 0);

  return (
    <div className="bg-[#111726]/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl p-4 w-72 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <Dices className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-xs text-white uppercase tracking-wider">3D Dice Roller</span>
        </div>
        <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Number of Dice */}
      <div className="flex items-center justify-between gap-1 mb-3 bg-slate-900 p-1 rounded-xl border border-white/5 text-xs font-semibold">
        <span className="text-[11px] text-slate-400 pl-2">Dice:</span>
        <div className="flex gap-1">
          {([1, 2, 3] as const).map((cnt) => (
            <button
              key={cnt}
              onClick={() => handleSetCount(cnt)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                diceCount === cnt ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {cnt}
            </button>
          ))}
        </div>
      </div>

      {/* Dice Faces */}
      <div className="flex items-center justify-center gap-3 py-4 bg-slate-900/60 rounded-xl border border-white/5 mb-3">
        {values.map((val, idx) => (
          <div
            key={idx}
            className={`w-14 h-14 bg-white rounded-xl shadow-lg border border-slate-300 p-2 grid grid-cols-3 grid-rows-3 transition-transform duration-100 ${
              isRolling ? 'rotate-12 scale-95' : ''
            }`}
          >
            {Array.from({ length: 9 }).map((_, cellIdx) => {
              const row = Math.floor(cellIdx / 3);
              const col = cellIdx % 3;
              const hasDot = DOT_PATTERNS[val]?.some(([r, c]) => r === row && c === col);
              return (
                <div key={cellIdx} className="flex items-center justify-center">
                  {hasDot && <div className="w-2.5 h-2.5 rounded-full bg-slate-900" />}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Total & Roll Button */}
      <div className="flex items-center justify-between gap-2">
        <div className="px-3 py-2 bg-white/5 rounded-xl border border-white/10 text-xs">
          <span className="text-slate-400">Total: </span>
          <span className="text-emerald-400 font-bold font-mono text-base">{total}</span>
        </div>
        <button
          onClick={roll}
          disabled={isRolling}
          className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
        >
          {isRolling ? 'Rolling...' : 'Roll Dice'}
        </button>
      </div>
    </div>
  );
}
