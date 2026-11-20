'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Clock } from 'lucide-react';

interface InteractiveTimerWidgetProps {
  onClose: () => void;
  onAlarm: () => void;
}

export function InteractiveTimerWidget({ onClose, onAlarm }: InteractiveTimerWidgetProps) {
  const [mode, setMode] = useState<'timer' | 'stopwatch'>('timer');
  const [secondsLeft, setSecondsLeft] = useState(300); // 5 min default
  const [totalSeconds, setTotalSeconds] = useState(300);
  const [isRunning, setIsRunning] = useState(false);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  const alarmPlayedRef = useRef(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        if (mode === 'timer') {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              if (!alarmPlayedRef.current) {
                alarmPlayedRef.current = true;
                onAlarm();
              }
              setIsRunning(false);
              return 0;
            }
            return prev - 1;
          });
        } else {
          setStopwatchSeconds((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, mode, onAlarm]);

  const reset = () => {
    setIsRunning(false);
    alarmPlayedRef.current = false;
    if (mode === 'timer') setSecondsLeft(totalSeconds);
    else setStopwatchSeconds(0);
  };

  const setTimerPreset = (secs: number) => {
    setIsRunning(false);
    alarmPlayedRef.current = false;
    setTotalSeconds(secs);
    setSecondsLeft(secs);
  };

  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = mode === 'timer' && totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 100;

  return (
    <div className="bg-[#111726]/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl p-4 w-72 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-purple-400" />
          <span className="font-bold text-xs text-white uppercase tracking-wider">Classroom Timer</span>
        </div>
        <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Mode Switcher */}
      <div className="grid grid-cols-2 gap-1 p-0.5 bg-slate-900 rounded-lg border border-white/5 text-[11px] font-semibold mb-3">
        <button
          onClick={() => { setMode('timer'); setIsRunning(false); }}
          className={`py-1 rounded transition-colors ${mode === 'timer' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
        >
          Countdown
        </button>
        <button
          onClick={() => { setMode('stopwatch'); setIsRunning(false); }}
          className={`py-1 rounded transition-colors ${mode === 'stopwatch' ? 'bg-purple-600 text-white' : 'text-slate-400'}`}
        >
          Stopwatch
        </button>
      </div>

      {/* Display */}
      <div className="text-center py-3 bg-slate-900/80 rounded-xl border border-white/10 relative overflow-hidden mb-3">
        <div
          className="absolute bottom-0 left-0 h-1 bg-purple-500 transition-all duration-1000"
          style={{ width: `${progress}%` }}
        />
        <div className="font-mono font-black text-4xl text-white tracking-widest">
          {formatTime(mode === 'timer' ? secondsLeft : stopwatchSeconds)}
        </div>
      </div>

      {/* Preset Buttons for timer */}
      {mode === 'timer' && (
        <div className="grid grid-cols-4 gap-1 mb-3 text-[10px] font-bold">
          {[60, 180, 300, 600].map((s) => (
            <button
              key={s}
              onClick={() => setTimerPreset(s)}
              className="py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5"
            >
              {s / 60}m
            </button>
          ))}
        </div>
      )}

      {/* Action Controls */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`flex-1 py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            isRunning ? 'bg-amber-600 hover:bg-amber-500 text-white' : 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
          }`}
        >
          {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isRunning ? 'Pause' : 'Start'}</span>
        </button>
        <button
          onClick={reset}
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 cursor-pointer"
          title="Reset"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
