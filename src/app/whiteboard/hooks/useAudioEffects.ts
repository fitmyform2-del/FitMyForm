'use client';

import { useCallback, useRef } from 'react';

// Standard 12-TET note frequencies (Hz)
const NOTE_FREQS: Record<string, number> = {
  C4: 261.63,
  'C#4': 277.18,
  D4: 293.66,
  'D#4': 311.13,
  E4: 329.63,
  F4: 349.23,
  'F#4': 369.99,
  G4: 392.0,
  'G#4': 415.3,
  A4: 440.0,
  'A#4': 466.16,
  B4: 493.88,
  C5: 523.25
};

export function useAudioEffects() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        audioCtxRef.current = new AudioContextClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  const playTone = useCallback((freq: number, type: OscillatorType = 'sine', duration = 0.5, gainLevel = 0.3) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(gainLevel, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  }, [getAudioContext]);

  const playPianoNote = useCallback((noteName: string) => {
    const freq = NOTE_FREQS[noteName] || 440;
    playTone(freq, 'triangle', 0.8, 0.4);
  }, [playTone]);

  const playTimerAlarm = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 arpeggio
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        playTone(freq, 'sine', 0.6, 0.35);
      }, idx * 140);
    });
  }, [getAudioContext, playTone]);

  const playBuzzer = useCallback(() => {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  }, [getAudioContext]);

  const playDing = useCallback(() => {
    playTone(880, 'sine', 0.8, 0.3); // A5 chime
  }, [playTone]);

  const playTada = useCallback(() => {
    const chords = [523.25, 659.25, 783.99]; // C Major
    chords.forEach((freq) => playTone(freq, 'triangle', 1.0, 0.25));
    setTimeout(() => {
      [659.25, 783.99, 1046.5].forEach((freq) => playTone(freq, 'triangle', 1.2, 0.3));
    }, 200);
  }, [playTone]);

  const speakText = useCallback((text: string, rate = 1) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    window.speechSynthesis.speak(utterance);
  }, []);

  return {
    playPianoNote,
    playTimerAlarm,
    playBuzzer,
    playDing,
    playTada,
    speakText
  };
}
