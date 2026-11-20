'use client';

import React from 'react';
import { InteractiveTimerWidget } from './InteractiveTimerWidget';
import { InteractiveDiceWidget } from './InteractiveDiceWidget';
import { InteractiveSpinnerWidget } from './InteractiveSpinnerWidget';
import { InteractiveCalculatorWidget } from './InteractiveCalculatorWidget';
import { InteractivePianoWidget } from './InteractivePianoWidget';
import { SoundBuzzerWidget } from './SoundBuzzerWidget';

interface WidgetsOverlayProps {
  activeWidgets: {
    timer: boolean;
    dice: boolean;
    spinner: boolean;
    calculator: boolean;
    piano: boolean;
    soundboard: boolean;
  };
  onCloseWidget: (key: 'timer' | 'dice' | 'spinner' | 'calculator' | 'piano' | 'soundboard') => void;
  audioEffects: {
    playPianoNote: (note: string) => void;
    playTimerAlarm: () => void;
    playBuzzer: () => void;
    playDing: () => void;
    playTada: () => void;
    speakText: (text: string) => void;
  };
}

export function WidgetsOverlay({
  activeWidgets,
  onCloseWidget,
  audioEffects
}: WidgetsOverlayProps) {
  return (
    <div className="absolute top-14 right-4 z-30 pointer-events-none flex flex-col gap-3 items-end max-h-[calc(100vh-5rem)] overflow-y-auto no-scrollbar pb-6">
      {activeWidgets.timer && (
        <div className="pointer-events-auto shadow-2xl">
          <InteractiveTimerWidget
            onClose={() => onCloseWidget('timer')}
            onAlarm={audioEffects.playTimerAlarm}
          />
        </div>
      )}

      {activeWidgets.dice && (
        <div className="pointer-events-auto shadow-2xl">
          <InteractiveDiceWidget
            onClose={() => onCloseWidget('dice')}
            onRollSound={audioEffects.playDing}
          />
        </div>
      )}

      {activeWidgets.spinner && (
        <div className="pointer-events-auto shadow-2xl">
          <InteractiveSpinnerWidget
            onClose={() => onCloseWidget('spinner')}
            onWinSound={audioEffects.playTada}
          />
        </div>
      )}

      {activeWidgets.calculator && (
        <div className="pointer-events-auto shadow-2xl">
          <InteractiveCalculatorWidget
            onClose={() => onCloseWidget('calculator')}
          />
        </div>
      )}

      {activeWidgets.piano && (
        <div className="pointer-events-auto shadow-2xl">
          <InteractivePianoWidget
            onClose={() => onCloseWidget('piano')}
            onPlayNote={audioEffects.playPianoNote}
          />
        </div>
      )}

      {activeWidgets.soundboard && (
        <div className="pointer-events-auto shadow-2xl">
          <SoundBuzzerWidget
            onClose={() => onCloseWidget('soundboard')}
            onDing={audioEffects.playDing}
            onBuzzer={audioEffects.playBuzzer}
            onTada={audioEffects.playTada}
            onAlarm={audioEffects.playTimerAlarm}
            onSpeak={audioEffects.speakText}
          />
        </div>
      )}
    </div>
  );
}
