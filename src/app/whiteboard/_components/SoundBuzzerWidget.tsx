'use client';

import React, { useState } from 'react';
import { X, Volume2, Bell, AlertTriangle, Sparkles } from 'lucide-react';

interface SoundBuzzerWidgetProps {
  onClose: () => void;
  onDing: () => void;
  onBuzzer: () => void;
  onTada: () => void;
  onAlarm: () => void;
  onSpeak: (text: string) => void;
}

export function SoundBuzzerWidget({
  onClose,
  onDing,
  onBuzzer,
  onTada,
  onAlarm,
  onSpeak
}: SoundBuzzerWidgetProps) {
  const [speakInput, setSpeakInput] = useState('');

  const handleSpeakSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (speakInput.trim()) {
      onSpeak(speakInput.trim());
    }
  };

  return (
    <div className="bg-[#111726]/95 backdrop-blur-md border border-white/15 rounded-2xl shadow-2xl p-4 w-72 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-xs text-white uppercase tracking-wider">Classroom Sounds</span>
        </div>
        <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Instant Audio SFX Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <button
          onClick={onDing}
          className="p-3 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Bell className="w-5 h-5 text-emerald-400" />
          <span className="text-xs font-bold">Ding / Correct</span>
        </button>

        <button
          onClick={onBuzzer}
          className="p-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 text-rose-300 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
        >
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <span className="text-xs font-bold">Quiz Buzzer</span>
        </button>

        <button
          onClick={onTada}
          className="p-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span className="text-xs font-bold">Ta-Da / Cheer</span>
        </button>

        <button
          onClick={onAlarm}
          className="p-3 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 text-purple-300 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Volume2 className="w-5 h-5 text-purple-400" />
          <span className="text-xs font-bold">Bell Chime</span>
        </button>
      </div>

      {/* Offline Text-to-Speech Reader */}
      <form onSubmit={handleSpeakSubmit} className="space-y-2">
        <div className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Text-To-Speech Reader</div>
        <div className="flex gap-1.5">
          <input
            type="text"
            value={speakInput}
            onChange={(e) => setSpeakInput(e.target.value)}
            placeholder="Type text to speak aloud..."
            className="flex-1 bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-slate-500 outline-none"
          />
          <button
            type="submit"
            disabled={!speakInput.trim()}
            className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs"
          >
            Speak
          </button>
        </div>
      </form>
    </div>
  );
}
