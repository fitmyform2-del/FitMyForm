'use client';

import React, { useState } from 'react';
import { X, Calculator } from 'lucide-react';

interface InteractiveCalculatorWidgetProps {
  onClose: () => void;
}

export function InteractiveCalculatorWidget({ onClose }: InteractiveCalculatorWidgetProps) {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const handleDigit = (digit: string) => {
    if (resetNext || display === '0') {
      setDisplay(digit);
      setResetNext(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleDot = () => {
    if (resetNext) {
      setDisplay('0.');
      setResetNext(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOperator = (op: string) => {
    const cur = parseFloat(display);
    if (prevVal === null) {
      setPrevVal(cur);
    } else if (operation) {
      const res = calculate(prevVal, cur, operation);
      setPrevVal(res);
      setDisplay(String(res));
    }
    setOperation(op);
    setResetNext(true);
  };

  const calculate = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEqual = () => {
    if (prevVal === null || !operation) return;
    const cur = parseFloat(display);
    const res = calculate(prevVal, cur, operation);
    setDisplay(String(Number(res.toFixed(8))));
    setPrevVal(null);
    setOperation(null);
    setResetNext(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
    setResetNext(false);
  };

  const handleSqrt = () => {
    const num = parseFloat(display);
    if (num >= 0) setDisplay(String(Number(Math.sqrt(num).toFixed(8))));
    setResetNext(true);
  };

  const handlePercent = () => {
    const num = parseFloat(display);
    setDisplay(String(Number((num / 100).toFixed(8))));
    setResetNext(true);
  };

  return (
    <div className="bg-[#111726]/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl p-4 w-64 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <Calculator className="w-4 h-4 text-sky-400" />
          <span className="font-bold text-xs text-white uppercase tracking-wider">Calculator</span>
        </div>
        <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Screen */}
      <div className="bg-slate-900 border border-white/10 rounded-xl p-3 mb-3 text-right">
        <div className="text-[10px] text-slate-500 font-mono h-4">
          {prevVal !== null ? `${prevVal} ${operation || ''}` : ''}
        </div>
        <div className="text-2xl font-mono font-bold text-white tracking-wider truncate">
          {display}
        </div>
      </div>

      {/* Buttons Keypad */}
      <div className="grid grid-cols-4 gap-1.5 text-xs font-bold">
        <button onClick={handleClear} className="p-2.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30">C</button>
        <button onClick={handleSqrt} className="p-2.5 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10">√</button>
        <button onClick={handlePercent} className="p-2.5 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10">%</button>
        <button onClick={() => handleOperator('÷')} className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500">÷</button>

        <button onClick={() => handleDigit('7')} className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/15">7</button>
        <button onClick={() => handleDigit('8')} className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/15">8</button>
        <button onClick={() => handleDigit('9')} className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/15">9</button>
        <button onClick={() => handleOperator('×')} className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500">×</button>

        <button onClick={() => handleDigit('4')} className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/15">4</button>
        <button onClick={() => handleDigit('5')} className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/15">5</button>
        <button onClick={() => handleDigit('6')} className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/15">6</button>
        <button onClick={() => handleOperator('-')} className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500">−</button>

        <button onClick={() => handleDigit('1')} className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/15">1</button>
        <button onClick={() => handleDigit('2')} className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/15">2</button>
        <button onClick={() => handleDigit('3')} className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/15">3</button>
        <button onClick={() => handleOperator('+')} className="p-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500">+</button>

        <button onClick={() => handleDigit('0')} className="p-2.5 rounded-lg bg-white/10 text-white col-span-2 hover:bg-white/15">0</button>
        <button onClick={handleDot} className="p-2.5 rounded-lg bg-white/10 text-white hover:bg-white/15">.</button>
        <button onClick={handleEqual} className="p-2.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 font-black">=</button>
      </div>
    </div>
  );
}
