'use client';

import React from 'react';
import {
  Boxes,
  X,
  Clock,
  Dices,
  Sparkles,
  Calculator,
  Music,
  Volume2
} from 'lucide-react';

interface ClassroomWidgetsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeWidgets: {
    timer: boolean;
    dice: boolean;
    spinner: boolean;
    calculator: boolean;
    piano: boolean;
    soundboard: boolean;
  };
  onToggleWidget: (key: 'timer' | 'dice' | 'spinner' | 'calculator' | 'piano' | 'soundboard') => void;
}

const WIDGET_ITEMS: {
  id: 'timer' | 'dice' | 'spinner' | 'calculator' | 'piano' | 'soundboard';
  title: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  { id: 'timer', title: 'Timer & Stopwatch', desc: 'Countdown clock & lap timer with chime', icon: <Clock className="w-5 h-5 text-purple-400" /> },
  { id: 'dice', title: '3D Dice Roller', desc: 'Roll 1-3 dice for probability & games', icon: <Dices className="w-5 h-5 text-emerald-400" /> },
  { id: 'spinner', title: 'Picker Wheel', desc: 'Random name and option chooser with confetti', icon: <Sparkles className="w-5 h-5 text-amber-400" /> },
  { id: 'calculator', title: 'Pocket Calculator', desc: 'Working arithmetic & percent calculator', icon: <Calculator className="w-5 h-5 text-sky-400" /> },
  { id: 'piano', title: 'Musical Piano', desc: '12 playable keys with real synth notes', icon: <Music className="w-5 h-5 text-pink-400" /> },
  { id: 'soundboard', title: 'Classroom Sounds', desc: 'Bell, quiz buzzer, cheer & text-to-speech', icon: <Volume2 className="w-5 h-5 text-cyan-400" /> }
];

export function ClassroomWidgetsDrawer({
  isOpen,
  onClose,
  activeWidgets,
  onToggleWidget
}: ClassroomWidgetsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-[#111726] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Boxes className="w-5 h-5 text-purple-400" />
            <h3 className="font-bold text-base text-white">Interactive Widgets Hub</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400">
          Open interactive teaching and engagement tools that float directly over your whiteboard.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {WIDGET_ITEMS.map((w) => {
            const isActive = activeWidgets[w.id];
            return (
              <button
                key={w.id}
                onClick={() => onToggleWidget(w.id)}
                className={`p-3 rounded-xl border flex flex-col justify-between text-left transition-all cursor-pointer ${
                  isActive
                    ? 'bg-purple-600/20 border-purple-500/50 text-white shadow-md'
                    : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="p-1.5 rounded-lg bg-black/30">{w.icon}</div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isActive ? 'bg-purple-500 text-white' : 'bg-white/10 text-slate-400'
                  }`}>
                    {isActive ? 'Active' : 'Open'}
                  </span>
                </div>
                <div>
                  <div className="font-bold text-xs text-white">{w.title}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5 line-clamp-1">{w.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
